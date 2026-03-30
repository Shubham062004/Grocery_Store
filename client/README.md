# Grocery Store Management System

A complete grocery store management system with product management and customer ordering capabilities.


## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Design Choices](#design-choices)
- [Challenges and Solutions](#challenges-and-solutions)
- [Optional Tasks](#optional-tasks)
- [Future Improvements](#future-improvements)

## ✨ Features
- Browse products by category
- View detailed product information 
- Add products to cart from multiple pages
- Interactive shopping cart with quantity controls

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **shadcn/ui** components for consistent UI
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons

## 🚀 Setup Instructions

### Prerequisites
- npm or yarn

### Installation Steps

1. Clone the repository
```sh
git clone https://github.com/Shubham062004/Inventory-Managment-System.git
cd client
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 💡 Design Choices

### Architecture
- **Component-Based Design**: Organized code into reusable, modular components for maintainability
- **Context API**: Used React Context for state management (shopping cart, authentication)
- **Responsive First**: Designed for all screen sizes from mobile to desktop
- **Progressive Enhancement**: Core functionality works even if JavaScript is disabled

### UI/UX Design
- **Clean, Accessible Interface**: Focused on ease of use and accessibility
- **Modal Dialogs**: Used for product details to prevent unnecessary page navigation
- **Visual Feedback**: Animations for actions like adding to cart or form submissions
- **Consistent Styling**: Used Tailwind CSS and shadcn/ui for a cohesive look

### Data Management
- **Local Storage**: Used for persisting cart and user data between sessions
- **Mock Data**: Implemented detailed mock product data with all required attributes
- **Query Caching**: Used Tanstack Query for efficient data fetching and caching

## 🧩 Challenges and Solutions

### Challenge 1: Complex Product Detail Display
**Problem**: Needed to show detailed product information without navigating away from the current page.
**Solution**: Implemented a modal approach that overlays product details on the current page, maintaining context while providing all required information.

### Challenge 2: Cart State Management Across Pages
**Problem**: Cart updates from the home page weren't reflecting in the header and other pages.
**Solution**: Refactored the CartContext to use a more robust state management approach and ensured the addToCart function was consistently implemented across all product cards.

### Challenge 3: Form Validation and User Experience
**Problem**: Needed robust form validation for login/signup while maintaining a good user experience.
**Solution**: Implemented centered modal forms with animations and clear validation feedback, preserving context while ensuring data integrity.

### Challenge 4: Responsive Design for Various Device Sizes
**Problem**: Ensuring the application looks and works well on all device sizes.
**Solution**: Used Tailwind's responsive classes systematically and tested across multiple viewport sizes to ensure consistency.

## 🎯 Optional Tasks

### Completed Optional Tasks
- **Enhanced Product Detail View**: Added comprehensive product information including expiration dates, packaging integrity, nutritional information, and ingredient lists
- **Cart Animation**: Added subtle animations when products are added to cart
- **Cross-Page Cart Functionality**: Enabled adding products to cart from any page in the application
- **Improved Login/Signup Experience**: Centered modal forms with animations

## 🔮 Future Improvements

- Backend integration with authentication
- Order processing and payment gateway integration
- User profiles with order history
- Product reviews and ratings
- Wishlist functionality
- Mobile app using React Native


## Deployment

This application can be deployed to any static hosting service:
- [Vercel](https://grocery-store-client-rose.vercel.app/)


## License

[MIT](LICENSE)
