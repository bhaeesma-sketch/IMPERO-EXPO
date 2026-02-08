#!/bin/bash

# Quick iOS Archive Script
# Run this after Xcode is configured with your Apple Developer account

echo "🚀 Building iOS Archive..."

# Navigate to iOS directory
cd ios

# Clean build folder
xcodebuild clean -workspace restexpress.xcworkspace -scheme restexpress 2>/dev/null || \
xcodebuild clean -project restexpress.xcodeproj -scheme restexpress

# Archive
xcodebuild archive \
  -project restexpress.xcodeproj \
  -scheme restexpress \
  -archivePath ./build/Impero.xcarchive \
  -configuration Release \
  CODE_SIGN_IDENTITY="Apple Distribution" \
  -allowProvisioningUpdates

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/Impero.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ../ExportOptions.plist \
  -allowProvisioningUpdates

echo "✅ IPA file created at: ios/build/Impero Di Gold.ipa"
