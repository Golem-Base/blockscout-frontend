#!/bin/bash

set -e

SUBMODULE_DIR="./external/blockscout-rs-neti"
TYPES_DIR="$SUBMODULE_DIR/golem-base-indexer/types"
TARGET_DIR="./node_modules/@blockscout/golem-base-indexer-types"

echo "Building golem-base-indexer-types..."

# Update submodule to latest
git submodule update --init --remote external/blockscout-rs-neti

if [ ! -d "$TYPES_DIR" ]; then
  echo "Error: golem-base-indexer/types directory not found"
  exit 1
fi

(cd "$TYPES_DIR" && npm install && npm run compile:proto)

# Clean up npm artifacts to avoid git conflicts
rm -f "$TYPES_DIR/package-lock.json"

mkdir -p "$TARGET_DIR"
cp "$TYPES_DIR/package.json" "$TARGET_DIR/"
cp -r "$TYPES_DIR/dist" "$TARGET_DIR/"

cat > "$TARGET_DIR/index.d.ts" << 'EOF'
export * from './dist/golem-base-indexer-proto/proto/v1/golem-base-indexer';
EOF

echo "✅ golem-base-indexer-types built successfully!"
