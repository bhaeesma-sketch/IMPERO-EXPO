import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const WHATSAPP_NUMBER = "971506485898";

const colors = {
  primary: "#C5A059",
  background: "#FAFAFA",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray900: "#111827",
  success: "#22C55E",
  warning: "#F59E0B",
  whatsapp: "#25D366",
};

function formatCurrency(amount) {
  return `AED ${amount.toFixed(2)}`;
}

function LiveRatesTicker({ rates }) {
  if (!rates) return null;

  const rateItems = ["24K", "22K", "21K", "18K"];

  return (
    <View style={styles.ticker}>
      <Text style={styles.tickerLabel}>Live Gold Rates (AED/g)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {rateItems.map((purity) => (
          <View key={purity} style={styles.tickerItem}>
            <Text style={styles.tickerPurity}>{purity}</Text>
            <Text style={styles.tickerPrice}>
              {formatCurrency(rates[purity] || 0)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Live</Text>
      </View>
    </View>
  );
}

function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPurity}>{product.purity}</Text>
          <Text style={styles.productWeight}>
            {product.displayWeight || `${product.baseWeight}g`}
          </Text>
        </View>
        <Text
          style={[
            styles.availabilityText,
            {
              color:
                product.availability === "In Stock"
                  ? colors.success
                  : colors.warning,
            },
          ]}
        >
          {product.availability}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ProductDetail({ product, onBack, rates }) {
  const handleWhatsApp = () => {
    const message = `Hello Impero Di Gold,

I am interested in the following product:

*${product.name}*
Product Code: ${product.productCode}
Purity: ${product.purity}
Weight: ${product.displayWeight || product.baseWeight + "g"}

Could you please provide:
- Current availability
- Price details
- Any ongoing offers

Thank you!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.detailImageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.detailImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailContent}>
          <Text style={styles.detailName}>{product.name}</Text>
          <Text style={styles.detailCode}>{product.productCode}</Text>

          <View style={styles.detailMeta}>
            <View style={styles.detailMetaItem}>
              <Text style={styles.detailMetaLabel}>Manufacturer</Text>
              <Text style={styles.detailMetaValue}>{product.manufacturer}</Text>
            </View>
            <View style={styles.detailMetaItem}>
              <Text style={styles.detailMetaLabel}>Availability</Text>
              <Text
                style={[
                  styles.detailMetaValue,
                  {
                    color:
                      product.availability === "In Stock"
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {product.availability}
              </Text>
            </View>
          </View>

          <View style={styles.specSection}>
            <Text style={styles.specTitle}>Metal Information</Text>
            <View style={styles.specTable}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Gold Purity</Text>
                <Text style={styles.specValue}>{product.purity}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Weight</Text>
                <Text style={styles.specValue}>
                  {product.displayWeight || `${product.baseWeight}g`}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Metal Color</Text>
                <Text style={styles.specValue}>Yellow Gold</Text>
              </View>
            </View>
          </View>

          <View style={styles.trustSection}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>✓</Text>
              <Text style={styles.trustText}>100% Certified Authenticity</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🚚</Text>
              <Text style={styles.trustText}>Secure Insured Shipping</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>↻</Text>
              <Text style={styles.trustText}>
                Lifetime Exchange at Market Rates
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={handleWhatsApp}
        >
          <Text style={styles.whatsappButtonText}>💬 Enquire via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    try {
      const [productsRes, ratesRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/gold-rates`),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (ratesRes.ok) {
        const ratesData = await ratesRes.json();
        setRates(ratesData);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/gold-rates`)
        .then((res) => res.json())
        .then((data) => setRates(data))
        .catch(() => { });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        rates={rates}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  const bullionProducts = products.filter((p) => p.type === "bullion");
  const jewelryProducts = products.filter((p) => p.type === "jewelry");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.logo}>Impero Di Gold</Text>
      </View>

      <LiveRatesTicker rates={rates} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {bullionProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gold Bullion</Text>
              <View style={styles.productGrid}>
                {bullionProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={setSelectedProduct}
                  />
                ))}
              </View>
            </View>
          )}

          {jewelryProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Jewelry</Text>
              <View style={styles.productGrid}>
                {jewelryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={setSelectedProduct}
                  />
                ))}
              </View>
            </View>
          )}

          {products.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Products Available</Text>
              <Text style={styles.emptyText}>Pull down to refresh</Text>
            </View>
          )}

          <View style={styles.footerBrand}>
            <Text style={styles.footerLogo}>Impero Di Gold</Text>
            <Text style={styles.footerTagline}>Premium Gold & Diamonds</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray900,
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  ticker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  tickerLabel: {
    fontSize: 10,
    color: colors.gray500,
    marginRight: 8,
  },
  tickerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  tickerPurity: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray900,
    marginRight: 4,
  },
  tickerPrice: {
    fontSize: 12,
    color: colors.gray600,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    color: colors.gray500,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray500,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: cardWidth,
    marginBottom: 16,
  },
  productImageContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    aspectRatio: 1,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray900,
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: "row",
    marginBottom: 4,
  },
  productPurity: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
    marginRight: 8,
  },
  productWeight: {
    fontSize: 11,
    color: colors.gray500,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray600,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
  },
  footerBrand: {
    alignItems: "center",
    padding: 32,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  footerTagline: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 4,
  },
  detailImageContainer: {
    backgroundColor: colors.white,
    padding: 24,
    aspectRatio: 1,
  },
  detailImage: {
    width: "100%",
    height: "100%",
  },
  detailContent: {
    padding: 20,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 4,
  },
  detailCode: {
    fontSize: 12,
    color: colors.gray400,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  detailMeta: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
    paddingVertical: 16,
    marginBottom: 20,
  },
  detailMetaItem: {
    flex: 1,
  },
  detailMetaLabel: {
    fontSize: 11,
    color: colors.gray500,
    marginBottom: 4,
  },
  detailMetaValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray900,
  },
  specSection: {
    marginBottom: 20,
  },
  specTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 12,
  },
  specTable: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  specLabel: {
    fontSize: 13,
    color: colors.gray500,
  },
  specValue: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray900,
  },
  trustSection: {
    marginTop: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  trustIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 28,
    textAlign: "center",
  },
  trustText: {
    fontSize: 14,
    color: colors.gray600,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  whatsappButton: {
    backgroundColor: colors.whatsapp,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  whatsappButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
