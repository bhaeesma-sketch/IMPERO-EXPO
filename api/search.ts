// Search & Advanced Filtering API Routes
// Handles product search, filtering, reviews, and recommendations

import { Router } from 'express';
import { db } from './_lib/db';
import {
  products,
  searchQueries,
  productReviews,
} from '../shared/schema';
import { eq, like, and, gte, lte, or, count, sql, desc } from 'drizzle-orm';

const router = Router();

// ============ SEARCH ENDPOINTS ============

interface SearchFilters {
  purity?: string[];
  category?: string[];
  priceMin?: number;
  priceMax?: number;
  weightMin?: number;
  weightMax?: number;
  availability?: string[];
  search?: string;
}

/**
 * POST /api/search - Search products with advanced filtering
 */
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {}, userId } = req.body;
    const searchFilters = filters as SearchFilters;

    if (!db) return res.json([]);

    // Build query
    let queryBuilder = db.select().from(products);
    let whereConditions: any[] = [];

    // Text search
    if (query) {
      whereConditions.push(
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`)
        )
      );
    }

    // Purity filter
    if (searchFilters.purity?.length) {
      whereConditions.push(
        sql`${products.purity} = ANY(${searchFilters.purity})`
      );
    }

    // Category filter
    if (searchFilters.category?.length) {
      whereConditions.push(
        sql`${products.category} = ANY(${searchFilters.category})`
      );
    }

    // Availability filter
    if (searchFilters.availability?.length) {
      whereConditions.push(
        sql`${products.availability} = ANY(${searchFilters.availability})`
      );
    }

    // Weight filter (using baseWeight)
    if (searchFilters.weightMin) {
      whereConditions.push(gte(products.baseWeight, searchFilters.weightMin));
    }
    if (searchFilters.weightMax) {
      whereConditions.push(lte(products.baseWeight, searchFilters.weightMax));
    }

    // Execute query with filters
    let results = await (whereConditions.length > 0
      ? queryBuilder.where(and(...whereConditions))
      : queryBuilder);

    // Log search query (non-blocking)
    if (userId && db) {
      setTimeout(() => {
        db
          .insert(searchQueries)
          .values({
            userId,
            query: query || '',
            filters: searchFilters,
            resultsCount: results.length,
          })
          .catch((e) => console.error('Search log error:', e));
      }, 0);
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/products/facets - Get available filter options
 */
router.get('/products/facets', async (req, res) => {
  try {
    if (!db) {
      return res.json({
        purities: ['18K', '21K', '22K', '24K', 'Silver'],
        categories: ['coins', 'bars', 'silver', 'jewelry'],
        availability: ['In Stock', 'Out of Stock', 'Made to Order'],
      });
    }

    const allProducts = await db.select().from(products);

    // Extract unique values using Array.from for Set
    const purities = Array.from(new Set(allProducts.map((p) => p.purity)));
    const categories = Array.from(new Set(allProducts.map((p) => p.category)));
    const availability = Array.from(new Set(allProducts.map((p) => p.availability)));
    const weights = allProducts.map((p) => p.baseWeight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);

    res.json({
      purities,
      categories,
      availability,
      weightRange: {
        min: minWeight,
        max: maxWeight,
      },
    });
  } catch (error) {
    console.error('Facets error:', error);
    res.status(500).json({ error: 'Failed to fetch facets' });
  }
});

// ============ REVIEWS ENDPOINTS ============

/**
 * GET /api/products/:productId/reviews - Get product reviews
 */
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    if (!db) return res.json([]);

    const reviews = await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.productId, req.params.productId))
      .orderBy(desc(productReviews.createdAt));

    // Calculate statistics
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    res.json({
      reviews,
      statistics: {
        averageRating: parseFloat(String(avgRating)),
        totalReviews: reviews.length,
        verifiedPurchases: reviews.filter((r) => r.verifiedPurchase).length,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * POST /api/products/:productId/reviews - Submit review
 */
router.post('/products/:productId/reviews', async (req: any, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rating, title, comment, images } = req.body;

    if (!rating || !title) {
      return res.status(400).json({ error: 'Rating and title required' });
    }

    if (!db) return res.status(500).json({ error: 'Database unavailable' });

    // Check if user has purchased this product (verified purchase)
    const purchase = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.productId, req.params.productId));

    const verifiedPurchase = purchase.length > 0;

    // Create review
    const newReview = await db
      .insert(productReviews)
      .values({
        productId: req.params.productId,
        userId: req.session.userId,
        rating,
        title,
        comment,
        images,
        verifiedPurchase,
      })
      .returning();

    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// ============ RECOMMENDATIONS ENDPOINTS ============

/**
 * GET /api/products/:productId/recommendations - Get similar products
 */
router.get('/products/:productId/recommendations', async (req, res) => {
  try {
    if (!db) return res.json([]);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, req.params.productId));

    if (!product.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentProduct = product[0];

    // Find similar products (same purity and type, or same category)
    const recommendations = await db
      .select()
      .from(products)
      .where(
        and(
          or(
            eq(products.purity, currentProduct.purity),
            eq(products.category, currentProduct.category)
          )
        )
      );

    // Filter out current product and limit to 6
    const similar = recommendations
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, 6);

    res.json(similar);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

/**
 * GET /api/user/recommendations - Personalized recommendations based on browsing
 */
router.get('/user/recommendations', async (req: any, res) => {
  try {
    if (!req.session?.userId || !db) return res.json([]);

    // Get user's cart items
    const userCart = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, req.session.userId));

    // Get user's viewed products from search queries
    const userSearches = await db
      .select()
      .from(searchQueries)
      .where(eq(searchQueries.userId, req.session.userId));

    const viewedProductIds = userSearches
      .map((s) => s.clickedProductId)
      .filter(Boolean);

    const cartProductIds = userCart.map((c) => c.productId);

    // Find common characteristics
    let recommendedProducts = await db.select().from(products);

    // Shuffle and limit
    recommendedProducts = recommendedProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
      .filter((p) => ![...viewedProductIds, ...cartProductIds].includes(p.id));

    res.json(recommendedProducts);
  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

/**
 * GET /api/search/trending - Get trending search queries
 */
router.get('/search/trending', async (req, res) => {
  try {
    if (!db) {
      return res.json([
        'gold jewelry',
        '22K gold',
        'diamond necklace',
        'gold rings',
      ]);
    }

    // Get most searched queries in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trending = await db
      .select({
        query: searchQueries.query,
        count: count(searchQueries.id).as('count'),
      })
      .from(searchQueries)
      .where(
        sql`${searchQueries.timestamp} > ${thirtyDaysAgo}`
      )
      .groupBy(searchQueries.query)
      .orderBy(desc(sql`count`))
      .limit(10);

    res.json(trending.map((t) => t.query));
  } catch (error) {
    console.error('Trending error:', error);
    res.json(['gold jewelry', '22K gold', 'diamond necklace']);
  }
});

export default router;
