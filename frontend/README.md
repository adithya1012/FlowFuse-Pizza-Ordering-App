# Pizza Ordering App - Frontend

This is the frontend UI for the Pizza Ordering application built with React, Vite, and TypeScript.

## Features

- **Login Screen**: Email and password authentication UI
- **Sign Up Screen**: User registration UI with name, email, password, and confirm password fields
- **Home/Dashboard**: Browse available pizzas grouped by category (Veg, Non-Veg, Special)
- **Add to Cart**: Add pizzas to cart with quantity tracking
- **Cart Management**: View cart items, adjust quantities, and remove items
- **Checkout**: Calculate total and process checkout (console log only)
- **Form Validation**: Basic client-side validation (required fields, email format, password matching)
- **Routing**: Client-side navigation between Login, Sign Up, Home, and Cart pages

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.tsx          # Login component
│   │   ├── SignUp.tsx         # Sign Up component
│   │   ├── Home.tsx           # Home/Dashboard with pizza list
│   │   ├── Cart.tsx           # Shopping cart page
│   │   ├── Auth.css           # Shared styles for authentication
│   │   ├── Home.css           # Home page styles
│   │   └── Cart.css           # Cart page styles
│   ├── context/
│   │   └── CartContext.tsx    # Cart state management
│   ├── types/
│   │   ├── Pizza.ts           # Pizza type definition
│   │   └── CartItem.ts        # Cart item type definition
│   ├── data/
│   │   └── pizza.json         # Static pizza data
│   ├── App.tsx                # Main app with routing
│   ├── App.css                # App styles
│   ├── index.css              # Global styles
│   └── main.tsx               # Entry point
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

The application is currently UI-only with no backend integration. All form submissions and checkout are logged to the console.

### Features Overview

1. **Authentication UI (No Real Auth)**
   - Login and Sign Up forms with validation
   - Navigation between auth pages
   - Direct routing to Home after form submission

2. **Pizza Menu**
   - Loads pizza data from `src/data/pizza.json`
   - Displays only available pizzas
   - Grouped by category: Veg, Non-Veg, Special
   - Add to Cart functionality

3. **Shopping Cart**
   - Add multiple quantities of the same pizza
   - Remove items or decrease quantity
   - Real-time total calculation
   - Cart badge showing total items

4. **Checkout**
   - Console log output of total amount
   - No actual payment processing

### Backend Integration Points

The following areas are marked for future backend integration:

1. **Login Component** (`src/components/Login.tsx`):
   - Add API call for user authentication
   - TODO: Validate credentials against backend API
   - TODO: Store authentication token in localStorage/sessionStorage

2. **Sign Up Component** (`src/components/SignUp.tsx`):
   - Add API call to create new user
   - TODO: Send user data to backend API for registration
   - TODO: Handle API response and store authentication token

3. **Home Component** (`src/components/Home.tsx`):
   - TODO: Fetch pizza data from backend API instead of local JSON
   - TODO: Sync cart updates with server

4. **Cart Context** (`src/context/CartContext.tsx`):
   - TODO: Sync cart state with backend server
   - TODO: Persist cart across sessions

5. **Cart Component** (`src/components/Cart.tsx`):
   - TODO: Call checkout API endpoint
   - TODO: Process payment through payment gateway
   - TODO: Generate order confirmation

### Pizza Data Structure

The `pizza.json` file contains pizza objects with:
- `id`: Unique identifier
- `name`: Pizza name
- `cost`: Price in dollars
- `category`: "veg" | "non-veg" | "special"
- `available`: true | false (only true items are displayed)

### Form Validation

Basic validation is implemented:
- **Email**: Required, must be valid email format
- **Password**: Required (minimum 6 characters for sign up)
- **Name**: Required
- **Confirm Password**: Required, must match password

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Context API** - State management for cart
- **CSS3** - Styling

## Application Flow

1. User starts at Login page (`/`)
2. Can navigate to Sign Up page (`/signup`)
3. After login/signup, navigates to Home page (`/home`)
4. Browse pizzas and add to cart
5. Click cart button to view Cart page (`/cart`)
6. Adjust quantities or remove items
7. Click checkout to log total amount

## Notes

- Client-side routing only (React Router)
- Cart state managed with React Context API
- No API calls are made; all data is local
- No authentication/authorization logic is implemented
- No database or backend services are connected
- Cart is not persisted (resets on page reload)

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
