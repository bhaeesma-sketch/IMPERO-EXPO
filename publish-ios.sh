#!/bin/bash

# One-Command iOS Build for Mac Only
# No iPhone needed!

set -e

echo "🍎 Impero Di Gold - iOS Build (Mac Only)"
echo "=========================================="
echo ""

# Check if on Mac
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This script requires macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode not found!"
    echo "📥 Please install Xcode from App Store"
    echo "   https://apps.apple.com/app/xcode/id497799835"
    exit 1
fi

echo "✅ Xcode found"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "📥 Install from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
echo "✅ Dependencies installed"
echo ""

# Build web assets
echo "🏗️  Building web assets..."
npm run build
echo "✅ Web build complete"
echo ""

# Sync with iOS
echo "🔄 Syncing with iOS..."
npx cap sync ios
echo "✅ iOS sync complete"
echo ""

# Update Info.plist
INFO_PLIST="ios/restexpress/Info.plist"
if [ -f "$INFO_PLIST" ]; then
    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName 'Impero Di Gold'" "$INFO_PLIST" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string 'Impero Di Gold'" "$INFO_PLIST"
fi

echo ""
echo "✅ BUILD READY!"
echo ""
echo "📱 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Opening Xcode now..."
echo ""
echo "2️⃣  In Xcode, do this:"
echo "   • Top-left: Select 'iPhone 14 Pro' simulator"
echo "   • Click ▶️ Play button to test"
echo ""
echo "3️⃣  To publish to App Store:"
echo "   • Top-left: Change to 'Any iOS Device'"
echo "   • Menu: Product → Archive"
echo "   • Click 'Distribute App' → 'App Store Connect'"
echo ""
echo "📖 Full guide: MAC_ONLY_IOS_GUIDE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Open Xcode
sleep 2
npx cap open ios
