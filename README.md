# LumiAI - AI-Powered Image Generation Platform

![LumiAI Logo](https://img.shields.io/badge/LumiAI-v2.0.0-00E5A0?style=for-the-badge&logo=react)

LumiAI is a modern, full-stack web application that leverages artificial intelligence to generate stunning images from text prompts. Built with React and Spring Boot, it offers a seamless user experience with authentication, credit-based usage, and a beautiful mint-themed interface.

## 🌟 Features

### Core Functionality
- **AI Image Generation**: Transform text prompts into high-quality images
- **User Authentication**: Secure login/signup with email and Google OAuth
- **Credit System**: Fair usage system with credit-based image generation
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Live feedback and progress indicators

### User Experience
- **Modern UI/UX**: Clean, mint-themed interface with smooth animations
- **Performance Optimized**: Fast loading times and efficient rendering
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Cross-browser Support**: Works on Chrome, Firefox, Safari, and Edge

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks
- **Vite 6.3.5** - Fast build tool and dev server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **React Router 7.8.2** - Client-side routing
- **Zustand 5.0.2** - Lightweight state management
- **Axios 1.11.0** - HTTP client for API calls
- **React Hot Toast 2.4.1** - Beautiful notifications

### Backend
- **Spring Boot 3.x** - Java-based backend framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Maven** - Dependency management

### Development Tools
- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **Git** - Version control

## 📁 Project Structure

```
LumiAI/
├── Frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Button, Input, etc.)
│   │   │   └── ...         # Feature-specific components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── store/          # Zustand state stores
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   ├── tests/          # Test files
│   │   └── styles/         # Global styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── API/                     # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Java source code
│   │       └── resources/  # Configuration files
│   ├── pom.xml            # Maven dependencies
│   └── target/            # Compiled classes
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
└── README.md            # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Java** (v17 or higher)
- **MySQL** (v8.0 or higher)
- **Maven** (v3.6 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/LumiAI.git
cd LumiAI
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE lumiai_db;

-- Create user (optional)
CREATE USER 'lumiai_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON lumiai_db.* TO 'lumiai_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup
```bash
cd API

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_URL=jdbc:mysql://localhost:3306/lumiai_db
# DB_USERNAME=lumiai_user
# DB_PASSWORD=your_password
# JWT_SECRET=your_jwt_secret_key

# Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# VITE_API_BASE_URL=http://localhost:8080/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

#### Backend (.env in API folder)
```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/lumiai_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=86400000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Service Configuration
AI_API_KEY=your_ai_service_api_key
AI_API_URL=https://api.your-ai-service.com
```

#### Frontend (.env in Frontend folder)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
VITE_APP_NAME=LumiAI
VITE_APP_VERSION=2.0.0
```

## 🚀 Usage

### For Users

1. **Sign Up/Login**
   - Create an account with email and password
   - Or use Google OAuth for quick access
   - New users receive 15 free credits

2. **Generate Images**
   - Navigate to the Create page
   - Enter a descriptive text prompt
   - Click "Generate" to create your image
   - Each generation costs 1 credit

3. **Manage Account**
   - View your profile and remaining credits
   - Purchase additional credits as needed
   - Browse your generation history

### For Developers

#### Running Tests
```bash
# Frontend tests
cd Frontend
npm run test

# Backend tests
cd API
./mvnw test
```

#### Building for Production
```bash
# Build frontend
cd Frontend
npm run build

# Build backend
cd API
./mvnw clean package
```

#### Code Quality
```bash
# Lint frontend code
cd Frontend
npm run lint

# Format code
npm run format
```

## 🎨 Design System

### Color Palette
- **Primary**: `#00E5A0` (Mint Green)
- **Secondary**: `#00C4CC` (Teal)
- **Dark**: `#0D1B2A` (Navy Blue)
- **Light**: `#F8FAFC` (Off White)

### Typography
- **Headings**: Inter, system fonts
- **Body**: Inter, system fonts
- **Monospace**: Fira Code, monospace

### Components
All UI components follow a consistent design system with:
- Rounded corners (8px, 12px, 16px)
- Consistent spacing (4px grid)
- Smooth animations (200-300ms)
- Accessible color contrasts

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: BCrypt encryption
- **CORS Protection**: Configured for production
- **Input Validation**: Server-side validation
- **Rate Limiting**: API endpoint protection
- **SQL Injection Prevention**: Parameterized queries

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
POST /api/auth/google     # Google OAuth login
POST /api/auth/refresh    # Refresh JWT token
```

### User Endpoints
```
GET  /api/user/profile    # Get user profile
PUT  /api/user/profile    # Update user profile
GET  /api/user/credits    # Get user credits
POST /api/user/credits    # Purchase credits
```

### Image Generation Endpoints
```
POST /api/generate/image  # Generate image from prompt
GET  /api/generate/history # Get generation history
GET  /api/generate/{id}   # Get specific generation
```

## 🧪 Testing

The project includes comprehensive testing:

### Frontend Tests
- **Unit Tests**: Component logic testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Render performance monitoring

### Backend Tests
- **Unit Tests**: Service layer testing
- **Integration Tests**: Database integration
- **Security Tests**: Authentication testing
- **API Tests**: Endpoint testing

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd Frontend
npm run build
# Deploy dist/ folder
```

### Backend Deployment (Heroku/AWS)
```bash
cd API
./mvnw clean package
# Deploy target/lumiai-api.jar
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Spring Boot** - For the robust backend framework
- **Framer Motion** - For smooth animations
- **Lucide Icons** - For beautiful icons

## 📞 Support

For support, email support@lumiai.com or join our Discord community.

## 🗺️ Roadmap

- [ ] Advanced image editing tools
- [ ] Batch image generation
- [ ] API for developers
- [ ] Mobile app (React Native)
- [ ] Advanced AI models
- [ ] Team collaboration features

---

**Made with ❤️ by the LumiAI Team**

![GitHub stars](https://img.shields.io/github/stars/yourusername/LumiAI?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/LumiAI?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/LumiAI)
![GitHub license](https://img.shields.io/github/license/yourusername/LumiAI)