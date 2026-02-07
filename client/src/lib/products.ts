// New realistic generated assets
import idiGoldBarCastImg from '@assets/generated_images/gold_bar_cast_realistic.png';
import idiGoldBarMintedImg from '@assets/generated_images/gold_bar_minted_realistic.png';
// New Premium Coin Image
import idiCoinImg from '@assets/generated_images/gold_coin_realistic.png';
// Using the new Light Advanced design for the "card" look
import idiCoinCardImg from '@assets/generated_images/luxury_light_idi_coin_packaging.png';
import idiBarImg from '@assets/generated_images/idi_10_tola_gold_bar.png';
import idiMintedBarImg from '@assets/generated_images/idi_minted_gold_bar_in_card.png';
import diamondRingImg from '@assets/generated_images/diamond_solitaire_ring.png';
import jewelrySetImg from '@assets/generated_images/luxury_gold_jewelry_set.png';
import silverCoinImg from '@assets/generated_images/silver_coin_1oz.png';
import silverBar10ozImg from '@assets/generated_images/silver_bar_10oz.png';
import silverBar1kgImg from '@assets/generated_images/silver_bar_1kg.png';
import goldCoin5gImg from '@assets/generated_images/gold_coin_5g.png';
import goldCoin10gImg from '@assets/generated_images/gold_coin_10g.png';
import goldBar50gImg from '@assets/generated_images/gold_bar_50g.png';
import goldBar100gImg from '@assets/generated_images/gold_bar_100g.png';
import diamondNecklaceImg from '@assets/generated_images/diamond_necklace_luxury.png';
import silverBar500gImg from '@assets/generated_images/silver_bar_500g.png';
import { MetalType } from './gold-price';

export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  purity: MetalType;
  baseWeight: number;
  displayWeight?: string;
  customWeights?: number[];
  makingCharge: number;
  type: 'bullion' | 'jewelry';
  category: 'coins' | 'bars' | 'silver' | 'jewelry';
  description: string;
  manufacturer: string;
  availability: 'In Stock' | 'Out of Stock' | 'Made to Order';
  productCode: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "IDi 1 Gram Gold Coin",
    image: idiCoinImg,
    images: [idiCoinImg, idiCoinCardImg],
    purity: "22K",
    baseWeight: 1,
    customWeights: [1],
    makingCharge: 25,
    type: "bullion",
    category: "coins",
    description: "Experience the timeless value of gold with our 1 Gram IDi Gold Coin. Minted with precision and stamped with the prestigious IDi hallmark, this coin represents both a secure investment and a token of enduring luxury. Perfect for gifting or starting your investment portfolio.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GC-1G-22K"
  },
  {
    id: "2",
    name: "IDi 2 Grams Gold Coin",
    image: idiCoinImg,
    images: [idiCoinImg, idiCoinCardImg],
    purity: "22K",
    baseWeight: 2,
    customWeights: [2],
    makingCharge: 25,
    type: "bullion",
    category: "coins",
    description: "A perfect balance of affordability and value, the 2 Gram IDi Gold Coin is crafted from 22K gold. Its exquisite finish and certified purity make it a preferred choice for investors and collectors alike.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GC-2G-22K"
  },
  {
    id: "3",
    name: "IDi 8 Grams Gold Coin",
    image: idiCoinCardImg,
    images: [idiCoinCardImg, idiCoinImg],
    purity: "22K",
    baseWeight: 8,
    customWeights: [8],
    makingCharge: 20,
    type: "bullion",
    category: "coins",
    description: "Our flagship 8 Gram Gold Coin, featuring the iconic IDi rose motif. This 22K gold coin is sealed in our new exclusive Matte Black & Gold security packaging to ensure authenticity and pristine condition. A classic choice for traditional savings and gifts.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GC-8G-22K"
  },
  {
    id: "4",
    name: "10 Tola IDi Gold Bar",
    image: idiGoldBarCastImg,
    images: [idiGoldBarCastImg, idiBarImg],
    purity: "24K",
    baseWeight: 116.64,
    displayWeight: "10 Tola",
    customWeights: [116.64],
    makingCharge: 10,
    type: "bullion",
    category: "bars",
    description: "The industry standard for serious investors. This 10 Tola (116.64g) Cast Bar from IDi Minting is 999.9 pure 24K gold. Each bar comes with a unique serial number and assay certificate, guaranteeing its weight and purity.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GB-10T-24K"
  },
  {
    id: "5",
    name: "1KG IDi Gold Bar",
    image: idiGoldBarCastImg,
    images: [idiGoldBarCastImg, idiBarImg],
    purity: "24K",
    baseWeight: 1000,
    displayWeight: "1 KG",
    customWeights: [1000],
    makingCharge: 5,
    type: "bullion",
    category: "bars",
    description: "The ultimate store of wealth. Our 1 Kilogram Cast Gold Bar is refined to 999.9 purity. Recognized globally, this bar is the cornerstone of any substantial precious metals portfolio.",
    manufacturer: "Impero Di Gold",
    availability: "Made to Order",
    productCode: "IDi-GB-1KG-24K"
  },
  {
    id: "6",
    name: "IDi Minting 8gm Eagle",
    image: idiGoldBarMintedImg,
    images: [idiGoldBarMintedImg, idiCoinCardImg],
    purity: "24K",
    baseWeight: 8,
    customWeights: [8],
    makingCharge: 35,
    type: "bullion",
    category: "bars",
    description: "Featuring a majestic Eagle design, this 8 gram minted bar combines artistic beauty with investment grade 24K purity. Sealed in our signature black CertiCard for maximum security.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-MB-8G-EAGLE"
  },
  {
    id: "7",
    name: "IDi Minting 10gm Round",
    image: idiGoldBarMintedImg,
    images: [idiGoldBarMintedImg, idiCoinCardImg],
    purity: "24K",
    baseWeight: 10,
    customWeights: [10],
    makingCharge: 30,
    type: "bullion",
    category: "bars",
    description: "A perfectly minted 10 gram round bar in 24K gold. Its mirror-like finish and precise edges showcase the exceptional minting quality of Impero Di Gold. An excellent entry point for new investors.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-MB-10G-RND"
  },
  {
    id: "8",
    name: "IDi Minting 5gm Bar",
    image: idiGoldBarMintedImg,
    images: [idiGoldBarMintedImg, idiCoinCardImg],
    purity: "24K",
    baseWeight: 5,
    customWeights: [5],
    makingCharge: 35,
    type: "bullion",
    category: "bars",
    description: "Compact and valuable, the 5 Gram IDi Minted Bar is 999.9 pure gold. The reverse features our repeating logo pattern, serving as a sophisticated security feature.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-MB-5G-RECT"
  },
  {
    id: "9",
    name: "Royal Solitaire Ring",
    image: diamondRingImg,
    images: [diamondRingImg],
    purity: "18K",
    baseWeight: 4,
    makingCharge: 150,
    type: "jewelry",
    category: "jewelry",
    description: "An epitome of grace, this Royal Solitaire Ring features a hand-selected center diamond set in 18K white gold. Designed to maximize brilliance, it is a timeless symbol of love and commitment.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-JWL-RNG-001"
  },
  {
    id: "10",
    name: "Emerald Cut Halo",
    image: diamondRingImg,
    images: [diamondRingImg],
    purity: "18K",
    baseWeight: 3.5,
    makingCharge: 180,
    type: "jewelry",
    category: "jewelry",
    description: "Vintage glamour meets modern precision. The Emerald Cut Halo ring features a stunning rectangular diamond surrounded by a halo of brilliant round stones, all set in polished 18K gold.",
    manufacturer: "Impero Di Gold",
    availability: "Made to Order",
    productCode: "IDi-JWL-RNG-002"
  },
  {
    id: "11",
    name: "Bridal Necklace Set",
    image: jewelrySetImg,
    images: [jewelrySetImg],
    purity: "21K",
    baseWeight: 45,
    makingCharge: 120,
    type: "jewelry",
    category: "jewelry",
    description: "A magnificent 21K gold necklace set designed for the modern bride. Intricate filigree work and diamond-cut accents create a shimmering effect that commands attention. Includes matching earrings.",
    manufacturer: "Impero Di Gold",
    availability: "Made to Order",
    productCode: "IDi-JWL-SET-001"
  },
  {
    id: "12",
    name: "Diamond Eternity Band",
    image: diamondRingImg,
    images: [diamondRingImg],
    purity: "18K",
    baseWeight: 5,
    makingCharge: 200,
    type: "jewelry",
    category: "jewelry",
    description: "An unbroken circle of diamonds, representing eternal love. This Eternity Band is set with perfectly matched round brilliant diamonds in 18K gold. Can be worn alone or stacked.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-JWL-BND-001"
  },
  // Silver Products
  {
    id: "13",
    name: "1 oz IDi Silver Coin",
    image: silverCoinImg,
    images: [silverCoinImg],
    purity: "Silver",
    baseWeight: 31.1,
    displayWeight: "1 Troy Oz",
    customWeights: [31.1],
    makingCharge: 1, // Reduced to 1 AED/g
    type: "bullion",
    category: "silver",
    description: "Premium 999.9 fine silver coin featuring the iconic IDi rose emblem. Each 1 troy ounce coin is individually minted to the highest standards and comes with a certificate of authenticity. Perfect for silver investors and collectors.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SC-1OZ-999"
  },
  {
    id: "14",
    name: "10 oz IDi Silver Bar",
    image: silverBar10ozImg,
    images: [silverBar10ozImg],
    purity: "Silver",
    baseWeight: 311,
    displayWeight: "10 Troy Oz",
    customWeights: [311],
    makingCharge: 0.5, // Reduced to 0.5 AED/g
    type: "bullion",
    category: "silver",
    description: "Investment-grade 10 troy ounce silver bar with mirror-like finish. Stamped with Impero Di Gold branding, weight, purity (999.9), and unique serial number. Comes with tamper-proof packaging and assay certificate.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SB-10OZ-999"
  },
  {
    id: "15",
    name: "100 oz IDi Silver Bar",
    image: silverBar10ozImg,
    images: [silverBar10ozImg],
    purity: "Silver",
    baseWeight: 3110,
    displayWeight: "100 Troy Oz",
    customWeights: [3110],
    makingCharge: 0.3, // Reduced to 0.3 AED/g
    type: "bullion",
    category: "silver",
    description: "Industry-standard 100 troy ounce silver bar for serious investors. This substantial bar is refined to 999.9 purity and recognized globally. Each bar features unique serial number and comes with full documentation.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SB-100OZ-999"
  },
  {
    id: "16",
    name: "1 KG IDi Silver Bar",
    image: silverBar1kgImg,
    images: [silverBar1kgImg],
    purity: "Silver",
    baseWeight: 1000,
    displayWeight: "1 KG",
    customWeights: [1000],
    makingCharge: 0.25, // Reduced to 0.25 AED/g
    type: "bullion",
    category: "silver",
    description: "Premium 1 kilogram cast silver bar refined to 999.9 purity. The ultimate choice for portfolio diversification. Each bar is individually numbered and comes with an official assay certificate guaranteeing weight and purity.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SB-1KG-999"
  },
  {
    id: "17",
    name: "5 oz IDi Silver Round",
    image: silverCoinImg,
    images: [silverCoinImg],
    purity: "Silver",
    baseWeight: 155.5,
    displayWeight: "5 Troy Oz",
    customWeights: [155.5],
    makingCharge: 0.8, // Reduced to 0.8 AED/g
    type: "bullion",
    category: "silver",
    description: "Beautifully minted 5 troy ounce silver round with intricate IDi design. This larger format coin combines artistic appeal with investment value. 999.9 fine silver with brilliant uncirculated finish.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SR-5OZ-999"
  },
  {
    id: "18",
    name: "250g IDi Silver Bar",
    image: silverBar10ozImg,
    images: [silverBar10ozImg],
    purity: "Silver",
    baseWeight: 250,
    displayWeight: "250g",
    customWeights: [250],
    makingCharge: 0.6, // Reduced to 0.6 AED/g
    type: "bullion",
    category: "silver",
    description: "Compact 250 gram silver bar ideal for flexible investment. Minted to 999.9 purity with precision edges and mirror finish. Features IDi branding and unique serial number for authenticity.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SB-250G-999"
  },
  // New Products - Gold Coins
  {
    id: "19",
    name: "IDi 5 Grams Gold Coin",
    image: goldCoin5gImg,
    images: [goldCoin5gImg],
    purity: "22K",
    baseWeight: 5,
    customWeights: [5],
    makingCharge: 22,
    type: "bullion",
    category: "coins",
    description: "Premium 5 gram 22K gold coin featuring the iconic IDi rose emblem. Presented in a luxury wooden box with certificate of authenticity. Perfect for special occasions and milestone gifts.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GC-5G-22K"
  },
  {
    id: "20",
    name: "IDi 10 Grams Gold Coin",
    image: goldCoin10gImg,
    images: [goldCoin10gImg],
    purity: "22K",
    baseWeight: 10,
    customWeights: [10],
    makingCharge: 20,
    type: "bullion",
    category: "coins",
    description: "Exquisite 10 gram 22K gold coin with IDi rose emblem, presented in a premium wooden display case. A substantial investment piece that combines beauty with value.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GC-10G-22K"
  },
  // New Products - Gold Bars
  {
    id: "21",
    name: "50 Gram IDi Gold Bar",
    image: goldBar50gImg,
    images: [goldBar50gImg],
    purity: "24K",
    baseWeight: 50,
    displayWeight: "50g",
    customWeights: [50],
    makingCharge: 15,
    type: "bullion",
    category: "bars",
    description: "Premium 50 gram 24K gold bar with mirror finish and IMPERO DI GOLD branding. Features unique serial number and comes with tamper-proof packaging. Perfect mid-range investment option.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GB-50G-24K"
  },
  {
    id: "22",
    name: "100 Gram IDi Gold Bar",
    image: goldBar100gImg,
    images: [goldBar100gImg],
    purity: "24K",
    baseWeight: 100,
    displayWeight: "100g",
    customWeights: [100],
    makingCharge: 12,
    type: "bullion",
    category: "bars",
    description: "Investment-grade 100 gram 24K gold bar refined to 999.9 purity. Features IMPERO DI GOLD branding, unique serial number, and comes with official assay certificate. Globally recognized and highly liquid.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-GB-100G-24K"
  },
  {
    id: "23",
    name: "500 Gram IDi Gold Bar",
    image: idiBarImg,
    images: [idiBarImg],
    purity: "24K",
    baseWeight: 500,
    displayWeight: "500g",
    customWeights: [500],
    makingCharge: 8,
    type: "bullion",
    category: "bars",
    description: "Substantial 500 gram 24K gold bar for serious investors. 999.9 pure gold with mirror finish, serial number, and full documentation. Excellent for portfolio diversification.",
    manufacturer: "Impero Di Gold",
    availability: "Made to Order",
    productCode: "IDi-GB-500G-24K"
  },
  // New Products - Silver
  {
    id: "24",
    name: "500g IDi Silver Bar",
    image: silverBar500gImg,
    images: [silverBar500gImg],
    purity: "Silver",
    baseWeight: 500,
    displayWeight: "500g",
    customWeights: [500],
    makingCharge: 0.4,
    type: "bullion",
    category: "silver",
    description: "Premium 500 gram silver bar refined to 999.9 purity. Features IDi branding, unique serial number, and mirror finish. Ideal for investors seeking substantial silver holdings.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SB-500G-999"
  },
  {
    id: "25",
    name: "2 oz IDi Silver Coin",
    image: silverCoinImg,
    images: [silverCoinImg],
    purity: "Silver",
    baseWeight: 62.2,
    displayWeight: "2 Troy Oz",
    customWeights: [62.2],
    makingCharge: 0.9,
    type: "bullion",
    category: "silver",
    description: "Beautiful 2 troy ounce 999.9 fine silver coin with IDi rose emblem. Larger format provides more value while maintaining collectible appeal. Comes with certificate of authenticity.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-SC-2OZ-999"
  },
  // New Products - Jewelry
  {
    id: "26",
    name: "Diamond Cascade Necklace",
    image: diamondNecklaceImg,
    images: [diamondNecklaceImg],
    purity: "18K",
    baseWeight: 25,
    makingCharge: 250,
    type: "jewelry",
    category: "jewelry",
    description: "Breathtaking diamond necklace in 18K white gold featuring an intricate cascade design with multiple brilliant-cut diamonds. A statement piece that embodies luxury and sophistication.",
    manufacturer: "Impero Di Gold",
    availability: "Made to Order",
    productCode: "IDi-JWL-NCK-001"
  },
  {
    id: "27",
    name: "Classic Gold Bangle Set",
    image: jewelrySetImg,
    images: [jewelrySetImg],
    purity: "21K",
    baseWeight: 35,
    makingCharge: 100,
    type: "jewelry",
    category: "jewelry",
    description: "Traditional 21K gold bangle set with modern finishing. Set of 4 bangles featuring intricate patterns and diamond-cut details. Perfect for everyday luxury or special occasions.",
    manufacturer: "Impero Di Gold",
    availability: "In Stock",
    productCode: "IDi-JWL-BNG-001"
  }
];
