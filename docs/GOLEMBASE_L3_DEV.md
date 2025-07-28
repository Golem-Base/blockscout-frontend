# Golem Base L3 Development Guide

This guide provides instructions for running the Blockscout frontend with the `golembase_l3_local` preset configuration.

## Overview

The `golembase_l3_local` preset configures the frontend to connect to local services for development purposes.

**Note**: There is also a `golembase` preset configuration available for connecting to the hosted Golem Base instance.

The local preset is designed to work with:

- **Frontend App**: `http://localhost:3000`
- **API Server**: `http://localhost:4000`

## Prerequisites

Before running the local development environment, ensure you have:

1. **Node.js 22.11.0+** and **npm 10.9.0+**

   ```bash
   node -v
   npm -v
   ```

2. **Yarn package manager**

   ```bash
   yarn --version
   ```

3. **Local blockchain services running** (for local development):
   - Blockscout API server on port 4000

4. **Golem Base Indexer Types**:
   
   Build the TypeScript types from protobuf definitions:
   
   ```bash
   yarn build:golem-types
   ```
   
   **Note**: This will automatically fetch the blockscout-rs-neti submodule if needed.

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Run the Development Server

Use the dedicated script for the golembase_l3_local preset:

```bash
yarn dev:golembase-l3-local
```

### 3. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## Additional Commands

### Docker Development

To run with Docker using this preset:

```bash
yarn start:docker:preset golembase_l3_local
```

## Customization

For detailed customization instructions and environment variable configuration, see [ENVS.md](./ENVS.md).

### Color Theme Configuration

The Golem Base L3 preset includes enhanced theming capabilities with configurable color schemes. You can customize the appearance by modifying these environment variables:

#### Light Theme

- `NEXT_PUBLIC_COLOR_THEME_LIGHT_HEX` - Background color for light theme (default: `#FFFFFF`)
- `NEXT_PUBLIC_COLOR_THEME_LIGHT_SAMPLE_BG` - Sample background gradient for light theme

#### Dark Theme

- `NEXT_PUBLIC_COLOR_THEME_DARK_HEX` - Background color for dark theme (default: `#101112`)
- `NEXT_PUBLIC_COLOR_THEME_DARK_SAMPLE_BG` - Sample background gradient for dark theme

#### Example Configuration

```bash
# Custom light theme
NEXT_PUBLIC_COLOR_THEME_LIGHT_HEX=#F8F9FA
NEXT_PUBLIC_COLOR_THEME_LIGHT_SAMPLE_BG=linear-gradient(154deg, #E9ECEF 50%, rgba(255, 255, 255, 0.00) 330.86%)

# Custom dark theme
NEXT_PUBLIC_COLOR_THEME_DARK_HEX=#1A1B1E
NEXT_PUBLIC_COLOR_THEME_DARK_SAMPLE_BG=linear-gradient(161deg, #000 9.37%, #2C2E33 92.52%)
```
