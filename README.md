# 🎬 MovieLogin – Full Stack Movie Playlist Platform

A premium Netflix-inspired full-stack movie application that allows users to search movies, authenticate securely, and manage personal playlists stored in MongoDB Atlas.

Built with a modern 2026 stack and clean architecture principles.

---

# 🚀 Live Features

- 🔐 User Authentication (JWT Based)
- 🎥 Movie Search via OMDb API
- ❤️ Add Movies to Playlist
- ❌ Remove Movies from Playlist
- 📂 Multiple Playlists Support
- 🌌 Netflix-Style Premium Overlay UI
- ⚡ Real-time UI Updates (No Page Reload)
- 🔒 Secure Backend with Protected Routes
- ☁️ MongoDB Atlas Cloud Database

---

# 🧠 System Architecture

Frontend (Client)
↓
Express REST API (Server)
↓
MongoDB Atlas (Cloud Database)

The application follows a RESTful client-server architecture with secure token-based authentication.

---

# 🛠️ Technologies Used

## 🌐 Frontend
- HTML5
- CSS3 (Modern 2026 UI)
- Vanilla JavaScript (ES6+)
- Fetch API
- Netflix-inspired UI Design
- Responsive Grid Layout
- CSS Animations & Transitions

## 🖥️ Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- JSON Web Tokens (JWT)
- bcrypt (Password Hashing)
- dotenv (Environment Config)

## 🗄️ Database
- MongoDB Atlas (Cloud)
- Mongoose Schema Models
- Atomic Updates using `$pull`

## 🔐 Security
- JWT Authentication
- Password Hashing
- Protected Routes Middleware
- Environment Variables (.env)

---


---

# 📡 API Endpoints

## 🔐 Auth Routes

### Register User
POST `/api/auth/register`

### Login User
POST `/api/auth/login`

Returns JWT Token.

---

## 🎬 Playlist Routes

### Create Playlist
POST `/api/playlists`

### Get User Playlists
GET `/api/playlists/:userId`

### Add Movie
PUT `/api/playlists/:playlistId`

### Remove Movie
DELETE `/api/playlists/:playlistId/:imdbID`

Uses MongoDB `$pull` for atomic deletion.

---

# 🗄️ Database Models

## 👤 User Schema

- name
- email
- password (hashed)
- createdAt

## 🎥 Playlist Schema

- userId
- name
- movies: [
    - imdbID
    - title
    - poster
  ]

---

# 🎨 UI Highlights

- Full-screen overlay with blur effect
- Animated movie cards
- Hover scaling effect
- Smooth removal animations
- Netflix-style grid layout
- Premium red action buttons

---

# 🧠 Learning Outcomes

This project demonstrates mastery of:

- Full Stack Development
- REST API Design
- MongoDB Data Modeling
- Secure Authentication Systems
- JWT Token Flow
- CRUD Operations
- Async/Await Handling
- Error Handling Best Practices
- UI/UX Design Principles
- Atomic Database Operations
- Environment Configuration
- State Management without Frameworks
- Clean Architecture

---

# 💡 Key Engineering Decisions

### Why JWT?
Stateless authentication improves scalability and decouples client-server sessions.

### Why MongoDB?
Flexible schema allows dynamic playlist structures.

### Why Atomic `$pull`?
Ensures safe concurrent deletion without data corruption.

### Why Optimistic UI Updates?
Improves perceived performance and user experience.

---

# 🔥 Performance Considerations

- Minimal DOM re-renders
- No full page reloads
- Efficient database queries
- Disabled double-click prevention
- Error fallback handling

---

# 🔐 Security Measures

- Passwords hashed using bcrypt
- JWT expiration support
- Protected routes middleware
- Environment variable protection
- No sensitive data stored client-side

---

# 🌍 Future Improvements

- Role-based authorization
- Drag & drop playlist ordering
- Pagination & infinite scroll
- Redis caching
- Email verification
- Password reset system
- Docker containerization
- Unit & integration testing
- CI/CD pipeline

---

# 🎯 Showcase Value

This project is portfolio-ready and demonstrates:

- Production-level backend architecture
- Secure authentication implementation
- Real-world CRUD system
- Clean UI/UX execution
- Professional code organization
- MongoDB Atlas integration
- Modern JavaScript mastery

It is suitable for showcasing to:

- Employers
- Freelance clients
- Startup teams
- Internship recruiters

---

# 🧑‍💻 Author

Mpho James Matli  
Full Stack Developer  
Johannesburg, South Africa  

---

# 📜 License

MIT License

---

# ⭐ Final Note

This project represents a complete full-stack system with real-world architecture, scalable backend design, and premium frontend implementation.

Built with precision.
Engineered for growth.
Designed like Netflix.