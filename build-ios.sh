#!/bin/bash

# Impero Di Gold - iOS Build Script
# This script prepares the project for iOS build

set -e

echo "🏗️  Starting iOS Build Process..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build web assets
echo -e "${BLUE}📦 Step 1: Building web assets...${NC}"
npm run build
echo -e "${GREEN}✅ Web build complete${NC}"
echo ""

# Step 2: Sync with Capacitor
echo -e "${BLUE}🔄 Step 2: Syncing with iOS...${NC}"
npx cap sync ios
echo -e "${GREEN}✅ iOS sync complete${NC}"
echo ""

# Step 3: Update Info.plist
echo -e "${BLUE}📝 Step 3: Updating app configuration...${NC}"
INFO_PLIST="ios/restexpress/Info.plist"

if [ -f "$INFO_PLIST" ]; then
    # Update display name
    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName 'Impero Di Gold'" "$INFO_PLIST" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string 'Impero Di Gold'" "$INFO_PLIST"
    
    echo -e "${GREEN}✅ Configuration updated${NC}"
else
    echo -e "${RED}⚠️  Info.plist not found${NC}"
fi
echo ""

# Step 4: Instructions
echo -e "${GREEN}✅ Build preparation complete!${NC}"
echo ""
echo -e "${BLUE}📱 Next Steps:${NC}"
echo "1. Open Xcode:"
echo "   ${GREEN}npx cap open ios${NC}"
echo ""
echo "2. In Xcode:"
echo "   • Select 'restexpress' project"
echo "   • Change Bundle ID to: com.imperodigold.app"
echo "   • Set your Team (Apple Developer Account)"
echo "   • Product → Destination → Any iOS Device"
echo "   • Product → Archive"
echo ""
echo "3. After Archive completes:"
echo "   • Click 'Distribute App'"
echo "   • Choose 'App Store Connect' or 'Ad Hoc'"
echo "   • Follow the wizard to export .ipa"
echo ""
echo -e "${BLUE}📖 Full guide: IOS_BUILD_GUIDE.md${NC}"
echo ""

# Ask if user wants to open Xcode
read -p "Open Xcode now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx cap open ios
fi
