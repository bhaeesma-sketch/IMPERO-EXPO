# iOS App Store Build Guide - Impero Di Gold & Diamonds

## Prerequisites

1. **Mac Computer** with macOS (required for iOS builds)
2. **Xcode** installed (latest version from App Store)
3. **Apple Developer Account** ($99/year)
4. **Certificates & Provisioning Profiles** set up

## Step 1: Prepare the Build

```bash
# Navigate to project directory
cd /Users/bhaeesma/Desktop/IMPERO-GOLDS

# Install dependencies (if not done)
npm install

# Build the web assets
npm run build

# Sync with iOS
npx cap sync ios
```

## Step 2: Open Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios
```

## Step 3: Configure in Xcode

### A. Update Bundle Identifier
1. Select **restexpress** project in left sidebar
2. Select **restexpress** target
3. Go to **General** tab
4. Change **Bundle Identifier** to: `com.imperodigold.app`
5. Change **Display Name** to: `Impero Di Gold`

### B. Update Version & Build Number
- **Version**: `1.0.0`
- **Build**: `1`

### C. Set Team & Signing
1. Go to **Signing & Capabilities** tab
2. Check **Automatically manage signing**
3. Select your **Team** (Apple Developer Account)
4. Ensure **Provisioning Profile** is created

### D. Set Deployment Target
- Set **iOS Deployment Target** to `13.0` or higher

## Step 4: Archive the App

1. In Xcode menu: **Product** → **Destination** → **Any iOS Device (arm64)**
2. In Xcode menu: **Product** → **Archive**
3. Wait for archive to complete (5-10 minutes)

## Step 5: Export IPA

1. When archive completes, **Organizer** window opens
2. Select your archive
3. Click **Distribute App**
4. Choose **App Store Connect**
5. Click **Next**
6. Choose **Upload** (or **Export** to save .ipa locally)
7. Select signing options:
   - ✅ **Automatically manage signing**
   - ✅ **Upload your app's symbols**
8. Click **Next** → **Upload**

## Step 6: Export IPA File (Alternative)

If you want the `.ipa` file locally:

1. In Organizer, click **Distribute App**
2. Choose **Ad Hoc** or **Development**
3. Click **Next**
4. Choose **Export**
5. Select destination folder
6. Click **Export**

The `.ipa` file will be saved to your chosen location.

## Step 7: Upload to App Store Connect

### Via Xcode (Recommended)
- Follow Step 5 above with **Upload** option

### Via Transporter App
1. Download **Transporter** from Mac App Store
2. Open Transporter
3. Sign in with Apple ID
4. Drag and drop your `.ipa` file
5. Click **Deliver**

## Step 8: Submit for Review

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **App Store** tab
4. Click **+ Version** (if needed)
5. Fill in all required information:
   - App Name: **Impero Di Gold & Diamonds**
   - Subtitle: **Luxury Gold & Diamond Jewelry**
   - Description: (Your app description)
   - Keywords: `gold, jewelry, diamonds, luxury, investment`
   - Screenshots (required for all device sizes)
   - App Icon (1024x1024px)
6. Select the build you uploaded
7. Fill in **App Review Information**
8. Click **Submit for Review**

## Required Assets for App Store

### App Icon
- **Size**: 1024x1024px
- **Format**: PNG (no transparency)
- **Location**: Use `/attached_assets/impero_logo_transparent.png` (remove transparency)

### Screenshots Required
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 px
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 px
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 px

Minimum 3 screenshots per size.

## Troubleshooting

### Error: "No signing certificate"
- Go to Xcode → Preferences → Accounts
- Add your Apple ID
- Download certificates

### Error: "Bundle identifier already in use"
- Change bundle ID in Xcode to unique value
- Update `capacitor.config.ts` accordingly

### Error: "Missing compliance"
- In App Store Connect, answer encryption questions
- Most apps select "No" for encryption

## Quick Build Script

Run this after completing Xcode setup:

```bash
#!/bin/bash
cd /Users/bhaeesma/Desktop/IMPERO-GOLDS
npm run build
npx cap sync ios
echo "✅ Build ready! Now open Xcode and archive:"
echo "   npx cap open ios"
```

## App Store Metadata

**App Name**: Impero Di Gold & Diamonds

**Subtitle**: Investment-Grade Gold & Luxury Jewelry

**Description**:
```
Discover the finest collection of certified gold bullion, investment-grade coins, and exquisite diamond jewelry. Impero Di Gold & Diamonds brings you:

✨ FEATURES
• Live gold rates updated in real-time
• Virtual try-on with AR technology
• Certified 999.9 purity gold bars & coins
• Handcrafted luxury jewelry collections
• Bespoke jewelry design service
• EMI calculator for easy planning
• Secure wishlist and price alerts

💎 WHY IMPERO
• Swiss-certified gold bullion
• Conflict-free diamonds
• Lifetime warranty on all pieces
• Expert gemologist consultations
• Transparent pricing with live rates
• Secure buyback guarantee

🏆 COLLECTIONS
• 24K, 22K, 21K, 18K Gold Jewelry
• Investment Gold Bars & Coins
• Diamond Rings & Necklaces
• Bridal Jewelry Sets
• Silver Bullion

Located in Dubai's prestigious Gold Souq, we combine traditional craftsmanship with modern technology to deliver an unparalleled luxury experience.
```

**Keywords**: gold, jewelry, diamonds, luxury, investment, bullion, dubai, 24k gold, wedding jewelry, bridal sets

**Category**: Shopping

**Age Rating**: 4+

---

## Contact Support

For build issues, contact:
- **Email**: Admin@imperodigolduae.com
- **Phone**: +971 50 648 5898
