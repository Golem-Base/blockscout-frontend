#!/bin/bash

set -e

REPO_DIR="./blockscout-rs-neti"
TYPES_DIR="$REPO_DIR/golem-base-indexer/types"
OUT_DIR="./types/golem-base-indexer-types"

echo "Building golem-base-indexer-types..."

# Always fetch latest submodule
echo "Fetching blockscout-rs-neti submodule..."
git submodule update --init --remote

echo "Building from source..."

# Build in the submodule
(cd "$TYPES_DIR" && npm install && npm run compile:proto)

# Clean up build artifacts
rm -f "$TYPES_DIR/package-lock.json"
rm -rf "$TYPES_DIR/node_modules"

# Copy only the necessary files
mkdir -p "$OUT_DIR"
cp "$TYPES_DIR/package.json" "$OUT_DIR/"
cp -r "$TYPES_DIR/dist" "$OUT_DIR/"

cat > "$OUT_DIR/index.d.ts" << 'EOF'
export * from './dist/golem-base-indexer-proto/proto/v1/golem-base-indexer';
EOF

echo "✅ Built successfully!"
