# Stock Image Platform Backend

A TypeScript-based Node.js backend with MongoDB, Express, JWT authentication, and bcrypt password hashing.

## 🚀 Features

- **TypeScript** for type safety
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with bcrypt password hashing
- **CORS** enabled for frontend integration
- **Hot reload** development server with ts-node-dev
- **Modular architecture** with proper error handling

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── middlewares/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── models/
│   │   └── User.ts              # User model with Mongoose schema
│   ├── routes/
│   │   └── auth.ts              # Authentication routes (register/login)
│   ├── server.ts                # Main server file
│   └── test-server.ts           # Test server without database
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/stock_image_platform

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (IMPORTANT: Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. MongoDB Setup

#### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - **Ubuntu/Debian:**
     ```bash
     sudo apt-get install mongodb
     sudo systemctl start mongodb
     sudo systemctl enable mongodb
     ```
   - **macOS (with Homebrew):**
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     brew services start mongodb/brew/mongodb-community
     ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh --eval "db.adminCommand('ismaster')"
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `DATABASE_URL` in `.env`

#### Option C: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Start Development Server

```bash
# Start with database connection
pnpm run dev

# Or start test server without database (for testing setup)
npx ts-node-dev src/test-server.ts
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |
| GET | `/` | API information |

## 🔧 Available Scripts

```bash
# Development server with hot reload
pnpm run dev

# Build TypeScript to JavaScript
pnpm run build

# Start production server
pnpm run start

# Run tests
pnpm test
```

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (with JWT token)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Mongoose schema validation
- **CORS Protection**: Configurable CORS origins
- **Environment Variables**: Sensitive data stored in .env files

## 🚨 Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running:**
   ```bash
   sudo systemctl status mongodb
   # or
   brew services list | grep mongodb
   ```

2. **Check connection string in .env file**

3. **Verify network connectivity (for Atlas)**

### TypeScript Compilation Issues

1. **Clean build directory:**
   ```bash
   rm -rf dist/
   pnpm run build
   ```

2. **Check tsconfig.json configuration**

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 🔄 Development Workflow

1. Make changes to TypeScript files in `src/`
2. Server automatically restarts with ts-node-dev
3. Test endpoints using curl, Postman, or your frontend
4. Build for production with `pnpm run build`
5. Deploy using `pnpm run start`

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT implementation
- **dotenv**: Environment variable loader
- **cors**: Cross-origin resource sharing

### Development Dependencies
- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **@types/***: TypeScript type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
