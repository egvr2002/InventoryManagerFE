# InventoryManagerFE

This is a React TypeScript application for managing inventory products with a modern web interface and responsive design.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js 18+** or higher
- **npm 9.0+** (or use the included package manager)
- **Git** for cloning the repository

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/egvr2002/InventoryManagerFE
cd inventory-manager-fe
```

### Environment Setup

Copy the environment template and configure your API URL:

```bash
cp .env.template .env
```

Edit the `.env` file and set your backend API URL:

```bash
VITE_API_URL=http://localhost:9090/api
```

**Note**: Make sure your backend server is running on the specified URL before starting the frontend.

### Run the Application

You can run the project using npm:

#### Development Mode

```bash
npm install
npm run dev
```

#### Production Build

```bash
npm run build
npm start
```

The application will start on **port 8080** by default.

### Documentation

The application provides a modern web interface for inventory management:

- **Application**: http://localhost:8080
- **API Integration**: Connects to backend at http://localhost:9090/api

## Running Tests

You can run the tests using the following command:

```bash
npm run test
```

## Development

### Project Structure

```
src/
├── components/
│   ├── products/         # Product management components
│   ├── shared/          # Reusable UI components
│   └── ui/              # Base UI components (shadcn/ui)
├── store/
│   └── slices/
│       └── inventory/   # Redux state management
├── api/                 # API configuration and services
├── interfaces/          # TypeScript type definitions
├── lib/                 # Utility functions
└── config/              # Application configuration
```

### Technologies

- **React 19.1.0** with TypeScript
- **Vite 6.3.5** for build tooling
- **Redux Toolkit** for state management
- **TailwindCSS 4.1.10** for styling
- **Radix UI** for accessible components
- **Axios** for HTTP client
- **ESLint & Prettier** for code quality
