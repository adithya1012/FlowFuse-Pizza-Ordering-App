# Pizza Ordering App - Frontend

This is the frontend UI for the Pizza Ordering application built with React, Vite, and TypeScript.

## Features

- **Login Screen**: Email and password authentication UI
- **Sign Up Screen**: User registration UI with name, email, password, and confirm password fields
- **Form Validation**: Basic client-side validation (required fields, email format, password matching)
- **Navigation**: Seamless switching between Login and Sign Up screens

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.tsx          # Login component
│   │   ├── SignUp.tsx         # Sign Up component
│   │   └── Auth.css           # Shared styles for authentication
│   ├── App.tsx                # Main app component with view routing
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

The application is currently UI-only with no backend integration. All form submissions are logged to the console.

### Backend Integration Points

The following areas are marked for future backend integration:

1. **Login Component** (`src/components/Login.tsx`):
   - Line ~67: Add API call for user authentication
   - TODO: Implement token storage and session management

2. **Sign Up Component** (`src/components/SignUp.tsx`):
   - Line ~96: Add API call to create new user
   - TODO: Implement user registration flow

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
- **CSS3** - Styling

## Notes

- No routing library is used; view switching is handled via state
- No API calls are made; all submissions log to console
- No authentication/authorization logic is implemented
- No database or backend services are connected

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
