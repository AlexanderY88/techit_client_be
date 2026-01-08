# TechIt E-Commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features include user authentication, product management, shopping cart functionality, and admin controls.

## Features

- 🔐 **User Authentication** - Register, login with JWT tokens
- 🛍️ **Product Catalog** - Browse products with categories and details
- 🛒 **Shopping Cart** - Add/remove items, quantity controls, cart persistence
- 👨‍💼 **Admin Panel** - Add, edit, delete products (admin users only)
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Bootstrap-styled components with smooth interactions

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Formik + Yup for form validation
- Bootstrap 5 for styling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas)
- [Git](https://git-scm.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd techit_client_be
```

### 2. Install Dependencies

**Install server dependencies:**
```bash
cd techit_server
npm install
```

**Install client dependencies:**
```bash
cd ../techit_client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `techit_server` directory:

```env
NODE_ENV=development
PORT=8000
DB="mongodb://localhost:27017/techit-300125"
JWTKEY="your-secret-jwt-key"
```

**Environment Variables:**
- `NODE_ENV` - Set to "development" for development mode
- `PORT` - Server port (default: 8000)
- `DB` - MongoDB connection string
- `JWTKEY` - Secret key for JWT token signing

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections on first run.

**Default Admin User:**
After starting the application, you can create an admin user by registering and manually updating the user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" }, 
  { $set: { isAdmin: true } }
)
```

## Running the Application

### Start the Backend Server

```bash
cd techit_server
npm start
```

The server will start on `http://localhost:8000`

**Available API endpoints:**
- `GET /api/products` - Get all products
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/carts/add-product` - Add product to cart
- `PUT /api/carts/update-quantity` - Update cart quantity

### Start the Frontend Client

**In a new terminal:**
```bash
cd techit_client
npm start
```

The client will start on `http://localhost:3000` and automatically open in your browser.

### Running Both Simultaneously

You can run both server and client at the same time using separate terminal windows:

**Terminal 1 (Server):**
```bash
cd techit_server
npm start
```

**Terminal 2 (Client):**
```bash
cd techit_client
npm start
```

## Project Structure

```
techit_client_be/
├── techit_server/              # Backend Express server
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── routes/                 # API routes
│   │   ├── users.js
│   │   ├── products.js
│   │   └── carts.js
│   ├── middlewares/            # Custom middleware
│   │   └── auth.js
│   ├── server.js              # Express server entry point
│   ├── package.json
│   └── .env
│
├── techit_client/             # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Navbar.tsx
│   │   ├── services/          # API service functions
│   │   │   ├── productsService.ts
│   │   │   ├── usersService.ts
│   │   │   └── cartsService.ts
│   │   ├── interfaces/        # TypeScript interfaces
│   │   │   ├── Product.ts
│   │   │   ├── User.ts
│   │   │   └── Cart.ts
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

## Usage

### For Regular Users:
1. **Register/Login** - Create account or sign in
2. **Browse Products** - View products on Home or Products page
3. **Add to Cart** - Click "Add to Cart" to add items
4. **Manage Cart** - Use +/- buttons to adjust quantities
5. **View Cart** - Navigate to cart page to see all items

### For Admin Users:
1. **Product Management** - Add, edit, delete products
2. **Inventory Control** - Update product quantities and details
3. **Category Management** - Organize products by categories

## API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/carts` - Get user cart
- `POST /api/carts/add-product` - Add product to cart
- `PUT /api/carts/update-quantity` - Update product quantity
- `DELETE /api/carts/remove-product/:productId` - Remove product

## Troubleshooting

### Common Issues:

**Port Already in Use:**
```bash
# Kill processes on port 3000 (React)
npx kill-port 3000

# Kill processes on port 8000 (Server)
npx kill-port 8000
```

**MongoDB Connection Issues:**
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Ensure database permissions are correct

**CORS Errors:**
- Server has CORS enabled for all origins
- Make sure both server and client are running

**JWT Token Issues:**
- Clear browser localStorage/sessionStorage
- Check JWTKEY in environment variables

## Development

### Available Scripts:

**Server (techit_server):**
- `npm start` - Start server with node
- `npm run dev` - Start with nodemon (auto-reload)

**Client (techit_client):**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is for educational purposes as part of a web development course.

## Support

For support or questions, please contact the development team or create an issue in the repository.