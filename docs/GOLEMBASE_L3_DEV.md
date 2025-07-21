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
