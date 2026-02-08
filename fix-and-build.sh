#!/bin/bash

# Fix EAS CLI and Build iOS

echo "🔧 Fixing EAS CLI installation..."
echo ""

# Fix npm permissions (no sudo needed)
echo "📦 Upgrading EAS CLI without sudo..."
npm install -g eas-cli --prefix ~/.npm-global

# Add to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.npm-global/bin:"* ]]; then
    echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bash_profile
    echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
    export PATH="$HOME/.npm-global/bin:$PATH"
fi

echo "✅ EAS CLI upgraded"
echo ""

# Now build
echo "🚀 Building iOS app..."
echo ""

~/.npm-global/bin/eas build --platform ios --profile production-ios

echo ""
echo "✅ Done!"
