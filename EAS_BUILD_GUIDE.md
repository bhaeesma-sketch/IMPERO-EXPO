# Build iOS App with EAS (Cloud Build - No Simulator Needed!)

## ✅ Perfect Solution for Your MacBook Air 2015!

EAS Build runs in the cloud - you don't need:
- ❌ Xcode Simulator
- ❌ Physical iPhone
- ❌ Powerful Mac

You only need:
- ✅ Your MacBook Air 2015
- ✅ Internet connection
- ✅ Apple Developer Account ($99/year)

---

## 🚀 Step-by-Step Setup

### Step 1: Install EAS CLI

```bash
cd /Users/bhaeesma/Desktop/IMPERO-GOLDS

# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo (create free account if needed)
eas login
```

### Step 2: Configure Your Project

```bash
# Initialize EAS in your project
eas build:configure
```

### Step 3: Update app.json

The file already exists, but let's verify it's correct:

```bash
cat app.json
```

### Step 4: Get Apple Credentials

You need these from Apple Developer:

1. **Apple ID**: Your Apple account email
2. **App-Specific Password**:
   - Go to: https://appleid.apple.com
   - Sign in
   - Security → App-Specific Passwords
   - Generate password
   - Save it!

3. **Team ID**:
   - Go to: https://developer.apple.com/account
   - Membership → Team ID
   - Copy it

### Step 5: Build iOS App (Cloud Build!)

```bash
# Build for iOS App Store
eas build --platform ios --profile production-ios

# EAS will ask you:
# - Apple ID: your-email@example.com
# - App-Specific Password: (paste the password you generated)
# - Would you like to create a new App Store app? YES
```

**This runs in the cloud! Your Mac just uploads code.**

Build takes 15-30 minutes. You can close your laptop!

### Step 6: Download IPA File

After build completes:

```bash
# EAS will show a URL like:
# https://expo.dev/accounts/yourname/projects/impero/builds/abc123

# Download the .ipa file from that URL
# Or use:
eas build:list
```

### Step 7: Submit to App Store (Automatic!)

```bash
# Submit directly to App Store Connect
eas submit --platform ios --latest

# EAS will ask:
# - Apple ID
# - App-Specific Password
# - ASC App ID (from App Store Connect)
```

---

## 🎯 Complete One-Command Process

```bash
cd /Users/bhaeesma/Desktop/IMPERO-GOLDS

# 1. Install EAS
npm install -g eas-cli

# 2. Login
eas login

# 3. Build iOS
eas build --platform ios --profile production-ios

# 4. Submit to App Store
eas submit --platform ios --latest
```

---

## 📱 Create App Store Connect Listing

While EAS builds (15-30 min), create your App Store listing:

### 1. Go to App Store Connect
https://appstoreconnect.apple.com

### 2. Create New App
- Click **My Apps** → **+** → **New App**
- Platform: **iOS**
- Name: **Impero Di Gold & Diamonds**
- Primary Language: **English**
- Bundle ID: **com.imperodigold.app** (create new)
- SKU: **IMPERO001**

### 3. Fill App Information

**Category**: Shopping

**Subtitle**: Luxury Gold & Diamond Jewelry

**Description**:
```
Discover the finest collection of certified gold bullion and luxury jewelry from Dubai's prestigious Gold Souq.

✨ FEATURES
• Live gold rates updated in real-time
• Virtual try-on with AR technology
• Certified 999.9 purity gold bars & coins
• Handcrafted luxury jewelry collections
• Bespoke jewelry design service
• EMI calculator for easy planning

💎 COLLECTIONS
• 24K, 22K, 21K, 18K Gold Jewelry
• Investment Gold Bars & Coins
• Diamond Rings & Necklaces
• Bridal Jewelry Sets
• Silver Bullion

🏆 WHY IMPERO
• Swiss-certified gold bullion
• Conflict-free diamonds
• Lifetime warranty
• Expert gemologist consultations
• Transparent pricing with live rates
• Secure buyback guarantee

Located in Dubai's Gold Souq, we combine traditional craftsmanship with modern technology.
```

**Keywords**: gold, jewelry, diamonds, luxury, investment, bullion, dubai, 24k gold, wedding jewelry, bridal

**Support URL**: https://imperodigolduae.com

**Privacy Policy URL**: https://imperodigolduae.com/privacy

### 4. Pricing
- Price: **Free**

### 5. App Privacy
- Click **Get Started**
- Answer data collection questions
- Most likely: "No, we don't collect data"

---

## 📸 Screenshots (Without iPhone!)

Use online screenshot generators:

### Option 1: Use Mockup Generator
1. Go to: https://mockuphone.com
2. Upload screenshots from your web app
3. Generate iPhone mockups
4. Download for all sizes

### Option 2: Use Your Web App
1. Open your deployed web app
2. Use browser dev tools (F12)
3. Set device to iPhone 14 Pro Max
4. Take screenshots (Cmd+Shift+4)
5. Resize to required dimensions

**Required Sizes:**
- 6.7" Display: 1290 x 2796 px (iPhone 14 Pro Max)
- 6.5" Display: 1242 x 2688 px (iPhone 11 Pro Max)
- 5.5" Display: 1242 x 2208 px (iPhone 8 Plus)

**Pages to Screenshot:**
1. Home page with hero
2. Product catalog
3. Product detail
4. Gold rates table
5. Virtual try-on (if possible)

---

## 🎨 App Icon

Use your existing logo:

```bash
# Your logo is at:
/Users/bhaeesma/Desktop/IMPERO-GOLDS/attached_assets/impero_logo_transparent.png

# Requirements:
# - 1024x1024 px
# - PNG format
# - NO transparency (add white background)
```

Use online tool to remove transparency:
- https://www.remove.bg (add white background)
- Or use Preview app on Mac

---

## ⚡ Quick Start Commands

```bash
# Complete process in 4 commands:

cd /Users/bhaeesma/Desktop/IMPERO-GOLDS

# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build iOS (cloud build - no simulator needed!)
eas build --platform ios --profile production-ios

# 4. Submit to App Store
eas submit --platform ios --latest
```

---

## 💰 Costs

- **EAS Build**: FREE (unlimited builds for open source)
- **Apple Developer**: $99/year (required)
- **Total**: $99/year

---

## ⏱️ Timeline

- **Day 1**: Setup EAS + Start build (30 min)
- **Day 1**: Build completes (15-30 min cloud build)
- **Day 1**: Submit to App Store (5 min)
- **Day 2-7**: Apple review
- **Day 8**: App goes LIVE! 🎉

---

## 🔧 Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Apple authentication failed"
- Use App-Specific Password (not your regular password)
- Generate at: https://appleid.apple.com

### "Bundle identifier not available"
- Change in `app.json`: `"bundleIdentifier": "com.yourname.imperodigold"`
- Change in `eas.json` too

### "Build failed"
```bash
# Check build logs
eas build:list
# Click on failed build to see logs
```

---

## 📞 Support

- EAS Docs: https://docs.expo.dev/build/introduction/
- Expo Discord: https://chat.expo.dev
- Email: Admin@imperodigolduae.com

---

## ✅ Advantages of EAS Build

1. ✅ No Xcode needed
2. ✅ No simulator needed
3. ✅ No iPhone needed
4. ✅ Works on old MacBook Air 2015
5. ✅ Builds in cloud (fast!)
6. ✅ Can close laptop during build
7. ✅ Automatic submission to App Store
8. ✅ FREE for open source projects

**Perfect for your situation!** 🎉
