#!/bin/bash

set -e

REPO_URL="git@github.com:Golem-Base/blockscout-rs-neti.git"
EXTERNAL_DIR="./external"
REPO_DIR="$EXTERNAL_DIR/blockscout-rs"
TYPES_DIR="$REPO_DIR/golem-base-indexer/types"
TARGET_DIR="./node_modules/@blockscout/golem-base-indexer-types"

echo "Building golem-base-indexer-types..."

mkdir -p "$EXTERNAL_DIR"

if [ ! -d "$REPO_DIR" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
else
  git -C "$REPO_DIR" pull origin main
fi

if [ ! -d "$TYPES_DIR" ]; then
  echo "Error: golem-base-indexer/types directory not found"
  exit 1
fi

(cd "$TYPES_DIR" && npm install && npm run compile:proto)

mkdir -p "$TARGET_DIR"
cp "$TYPES_DIR/package.json" "$TARGET_DIR/"
cp -r "$TYPES_DIR/dist" "$TARGET_DIR/"

cat > "$TARGET_DIR/index.d.ts" << 'EOF'
export * from './dist/golem-base-indexer-proto/proto/v1/golem-base-indexer';
EOF

echo "✅ golem-base-indexer-types built successfully!" 