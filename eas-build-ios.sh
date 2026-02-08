#!/bin/bash

# EAS Build - iOS App Store (Cloud Build - No Simulator!)
# Perfect for MacBook Air 2015

echo "🚀 Impero Di Gold - EAS Cloud Build"
echo "===================================="
echo ""
echo "✅ No Xcode Simulator needed!"
echo "✅ No iPhone needed!"
echo "✅ Builds in the cloud!"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
    echo "✅ EAS CLI installed"
    echo ""
fi

# Check if logged in
echo "🔐 Checking Expo login..."
if ! eas whoami &> /dev/null; then
    echo "Please login to Expo:"
    eas login
fi

echo ""
echo "✅ Ready to build!"
echo ""
echo "📱 Building iOS app in the cloud..."
echo "   (This takes 15-30 minutes)"
echo "   (You can close your laptop!)"
echo ""

# Build iOS
eas build --platform ios --profile production-ios

echo ""
echo "✅ Build complete!"
echo ""
echo "📥 Download your .ipa file from the URL above"
echo ""
echo "📤 To submit to App Store, run:"
echo "   npm run eas:submit:ios"
echo ""
