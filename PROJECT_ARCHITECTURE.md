# 🏗️ AuraWell: Digital Student Wellness & Counseling Platform - Full Architecture

## Project Overview
**Name:** AuraWell - Digital Student Wellness & Counseling Management Platform  
**Version:** 1.0.0  
**Deployment:** Render (Frontend + Backend)  
**Deployment Link:** https://digital-student-wellness-and-counseling-y104.onrender.com  

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLOUD INFRASTRUCTURE                          │
│                                                                         │
│  ┌────────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   React + Vite     │  │  Spring Boot 3.3 │  │  MongoDB Atlas   │   │
│  │  (Frontend Client) │  │  (Backend API)   │  │   (Database)     │   │
│  │                    │  │                  │  │                  │   │
│  │  - MUI Components  │  │  - Spring Data   │  │  - Collections:  │   │
│  │  - React Router    │  │  - Spring Sec    │  │    • users       │   │
│  │  - Axios (HTTP)    │  │  - JWT Auth      │  │    • students    │   │
│  │  - WebSocket       │  │  - REST APIs     │  │    • counselors  │   │
│  │  - GA4 Analytics   │  │  - Emails/SMS    │  │    • appointments│   │
│  │  - PWA Support     │  │  - Logging       │  │    • assessments │   │
│  └────────────────────┘  └──────────────────┘  └──────────────────┘   │
│           │                        │                    │              │
└───────────┼────────────────────────┼────────────────────┼──────────────┘
            │                        │                    │
            └────────────┬───────────┴────────────────────┘
                         │
                   HTTP/WebSocket
                   (REST APIs)
                         │
            ┌────────────┴──────────────┐
            │                           │
      ┌─────▼─────┐           ┌─────────▼──────┐
      │  Google   │           │  Google Search │
      │  Analytics 4          │   Console      │
      │  (GA4)    │           │                │
      └───────────┘           └────────────────┘
```

---

## 📁 Project Directory Structure

```
Student Wellness and Counseling/
│
├── client/                              # React Frontend (Vite)
│   ├── index.html                       # Entry HTML (GA4 hardcoded)
│   ├── package.json                     # Frontend dependencies
│   ├── vite.config.js                   # Vite + PWA config
│   ├── public/                          # Static assets
│   │   ├── manifest.json                # PWA manifest
│   │   ├── icon-192.png                 # PWA icon
│   │   ├── icon-512.png                 # PWA icon
│   │   ├── sitemap.xml                  # [TO CREATE]
│   │   └── robots.txt                   # [TO CREATE]
│   │
│   └── src/
│       ├── main.jsx                     # React entry point
│       ├── App.jsx                      # App wrapper with Providers
│       ├── index.css                    # Global styles
│       │
│       ├── api/
│       │   └── axiosConfig.js           # Axios HTTP client with interceptors
│       │
│       ├── components/
│       │   ├── common/                  # Reusable components
│       │   │   ├── AppointmentCard.jsx
│       │   │   ├── ChatBox.jsx
│       │   │   ├── EmptyState.jsx
│       │   │   ├── MetricCard.jsx
│       │   │   ├── PDFReportModal.jsx
│       │   │   ├── PWAUpdatePrompt.jsx
│       │   │   ├── RadarComparisonChart.jsx
│       │   │   ├── RiskBadge.jsx
│       │   │   ├── ScoreTrendChart.jsx
│       │   │   ├── SkeletonLoader.jsx
│       │   │   ├── WellnessScoreDial.jsx
│       │   │   └── SEO.jsx               # [TO CREATE]
│       │   └── ...
│       │
│       ├── context/                     # React Context Providers
│       │   ├── AuthContext.jsx          # Authentication state
│       │   ├── NotificationContext.jsx  # Notifications
│       │   ├── SocketContext.jsx        # WebSocket connection
│       │   └── ThemeContext.jsx         # Dark/Light theme
│       │
│       ├── layouts/
│       │   ├── DashboardLayout.jsx      # Main authenticated layout
│       │   ├── Navbar.jsx               # Top navigation
│       │   ├── NotificationMenu.jsx     # Notifications dropdown
│       │   ├── RoleSwitcher.jsx         # Role switcher (admin)
│       │   └── Sidebar.jsx              # Left sidebar navigation
│       │
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx            # Login page (PUBLIC)
│       │   │   ├── Register.jsx         # Registration (PUBLIC)
│       │   │   └── Unauthorized.jsx     # 403 error page
│       │   │
│       │   ├── student/                 # PROTECTED - Students only
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── AssessmentWizard.jsx
│       │   │   ├── AssessmentHistory.jsx
│       │   │   ├── StudentAppointments.jsx
│       │   │   ├── StudentRequests.jsx
│       │   │   ├── StudentChat.jsx
│       │   │   ├── StudentResources.jsx
│       │   │   └── StudentProfile.jsx
│       │   │
│       │   ├── counselor/               # PROTECTED - Counselors only
│       │   │   ├── CounselorDashboard.jsx
│       │   │   ├── AssignedStudents.jsx
│       │   │   ├── StudentWellnessProfile.jsx
│       │   │   ├── CounselorAppointments.jsx
│       │   │   ├── CounselorRequests.jsx
│       │   │   ├── CounselorChat.jsx
│       │   │   └── CounselorSessions.jsx
│       │   │
│       │   └── admin/                   # PROTECTED - Admins only
│       │       ├── AdminDashboard.jsx
│       │       ├── DepartmentAnalytics.jsx
│       │       ├── UserManagement.jsx
│       │       ├── QuestionManagement.jsx
│       │       ├── ResourceManagement.jsx
│       │       ├── Announcements.jsx
│       │       └── AuditLogs.jsx
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx            # React Router configuration
│       │
│       ├── theme/
│       │   └── theme.js                 # MUI theme configuration
│       │
│       └── utils/                       # Utility functions
│           └── analytics.js             # [TO CREATE] GA4 event tracking
│
├── server/                              # Spring Boot Backend (Java 21)
│   ├── pom.xml                          # Maven dependencies
│   ├── Dockerfile                       # Container config
│   ├── src/main/
│   │   ├── java/com/wellness/
│   │   │   ├── WellnessApplication.java # Spring Boot entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java      # CORS configuration
│   │   │   │   ├── SecurityConfig.java  # Spring Security & JWT
│   │   │   │   ├── JwtAuthFilter.java   # JWT validation filter
│   │   │   │   └── WebSocketConfig.java # Real-time messaging
│   │   │   │
│   │   │   ├── controller/              # REST API Endpoints
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── StudentController.java
│   │   │   │   ├── CounselorController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   ├── AssessmentController.java
│   │   │   │   ├── AppointmentController.java
│   │   │   │   ├── CounselingRequestController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── NotificationController.java
│   │   │   │   ├── DepartmentController.java
│   │   │   │   └── ResourceController.java
│   │   │   │
│   │   │   ├── service/                 # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── StudentService.java
│   │   │   │   ├── CounselorService.java
│   │   │   │   ├── AssessmentService.java
│   │   │   │   ├── AppointmentService.java
│   │   │   │   ├── CounselingRequestService.java
│   │   │   │   ├── CounselingSessionService.java
│   │   │   │   ├── ChatService.java
│   │   │   │   ├── NotificationService.java
│   │   │   │   ├── AuditLogService.java
│   │   │   │   ├── AdminAnalyticsService.java
│   │   │   │   ├── DepartmentService.java
│   │   │   │   └── WellnessResourceService.java
│   │   │   │
│   │   │   ├── model/                   # MongoDB Document Models
│   │   │   │   ├── User.java
│   │   │   │   ├── Student.java
│   │   │   │   ├── Counselor.java
│   │   │   │   ├── Department.java
│   │   │   │   ├── Role.java (enum)
│   │   │   │   ├── AssessmentQuestion.java
│   │   │   │   ├── AssessmentResponse.java
│   │   │   │   ├── Appointment.java
│   │   │   │   ├── AppointmentStatus.java (enum)
│   │   │   │   ├── AppointmentMode.java (enum)
│   │   │   │   ├── CounselingRequest.java
│   │   │   │   ├── CounselingSession.java
│   │   │   │   ├── CounselorNote.java
│   │   │   │   ├── Message.java
│   │   │   │   ├── Notification.java
│   │   │   │   ├── NotificationType.java (enum)
│   │   │   │   ├── Announcement.java
│   │   │   │   ├── AuditLog.java
│   │   │   │   ├── WellnessResource.java
│   │   │   │   ├── Bookmark.java
│   │   │   │   ├── CategoryScore.java
│   │   │   │   ├── QuestionOption.java
│   │   │   │   ├── QuestionType.java (enum)
│   │   │   │   ├── RiskLevel.java (enum)
│   │   │   │   ├── RequestStatus.java (enum)
│   │   │   │   └── UrgencyLevel.java (enum)
│   │   │   │
│   │   │   ├── repository/              # MongoDB Repository Interfaces
│   │   │   │   └── (Spring Data JPA)
│   │   │   │
│   │   │   ├── dto/                     # Data Transfer Objects
│   │   │   │
│   │   │   ├── exception/               # Custom Exceptions
│   │   │   │
│   │   │   ├── security/                # Security-related classes
│   │   │   │
│   │   │   ├── util/                    # Utility functions
│   │   │   │
│   │   │   └── websocket/               # WebSocket handlers
│   │   │
│   │   └── resources/
│   │       └── application.properties    # Configuration
│   │           - Server port: 8080
│   │           - MongoDB Atlas connection
│   │           - JWT secret & expiration
│   │           - Logging levels
│   │
│   └── target/                          # Compiled JAR & build artifacts
│       └── wellness-platform-backend-1.0.0.jar.original
│
├── ml_service/                          # ML Model Service (Python)
│   ├── dataset/
│   │   └── student_mental_health_dataset.csv
│   │
│   └── models/
│       ├── model_metadata.json
│       ├── wellness_risk_model.joblib   # Pre-trained ML model
│       └── wellness_scaler.joblib       # Feature scaling
│
├── tools/
│   └── apache-maven-3.9.6/              # Maven build tool
│
├── .env.example                         # [TO CREATE] Environment template
├── .git/                                # Git version control
├── .node-version                        # Node.js version spec
└── PROJECT_ARCHITECTURE.md              # [THIS FILE]
```

---

## 🔐 Authentication & Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
│                                                                 │
│  User Login/Register                                           │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────┐                                  │
│  │  AuthController (API)   │                                  │
│  │  - /api/auth/login      │                                  │
│  │  - /api/auth/register   │                                  │
│  │  - /api/auth/google     │                                  │
│  └─────────────────────────┘                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────┐                                  │
│  │   AuthService.java      │                                  │
│  │  - Validate credentials │                                  │
│  │  - Generate JWT token   │                                  │
│  │  - Google OAuth flow    │                                  │
│  └─────────────────────────┘                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────┐                                  │
│  │  MongoDB: Users Coll.   │                                  │
│  │  - id, email (unique)   │                                  │
│  │  - password (hashed)    │                                  │
│  │  - name, role, avatar   │                                  │
│  │  - active, createdAt    │                                  │
│  └─────────────────────────┘                                  │
│       │                                                         │
│       ▼ JWT Token (localStorage)                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Frontend: AuthContext.jsx                              │  │
│  │  - isAuthenticated, role, user                          │  │
│  │  - ProtectedRoute wrapper                               │  │
│  │  - RBAC: ROLE_STUDENT, ROLE_COUNSELOR, ROLE_ADMIN      │  │
│  └─────────────────────────────────────────────────────────┘  │
│       │                                                         │
│       ▼ Axios request with "Bearer {token}"                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Backend: JwtAuthFilter                                 │  │
│  │  - Extract & validate JWT from headers                  │  │
│  │  - Attach UserDetails to SecurityContext               │  │
│  │  - Reject invalid/expired tokens (401)                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────┐                                  │
│  │  Protected Endpoints    │                                  │
│  │  (RBAC enforced)        │                                  │
│  └─────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘

Roles (RBAC):
- ROLE_STUDENT: Access student portal
- ROLE_COUNSELOR: Access counselor portal
- ROLE_ADMIN: Access admin portal
```

**Current Implementation:**
- ✅ JWT Token-based auth (localStorage)
- ✅ Google OAuth integration (@react-oauth/google)
- ✅ RBAC (Role-Based Access Control)
- ✅ Axios request interceptors for token management
- ✅ Unauthorized handling (redirect to login)

---

## 📱 Frontend Technology Stack

### Core Libraries
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI library |
| Vite | 5.3.1 | Build tool & dev server |
| React Router | 6.23.1 | Client-side routing |
| Material-UI (MUI) | 5.15.20 | Component library |
| Axios | 1.7.2 | HTTP client |
| Recharts | 2.12.7 | Data visualization |
| Framer Motion | 11.2.10 | Animations |
| date-fns | 3.6.0 | Date manipulation |
| jsPDF | 2.5.1 | PDF generation |
| JWT-Decode | 4.0.0 | JWT parsing |
| WebSocket | 1.6.1 | Real-time messaging |
| Workbox | 7.4.1 | PWA/Service Worker |

### Frontend Features
- ✅ **React Router**: Multi-page SPA with protected routes
- ✅ **PWA Support**: Offline capability, installable
- ✅ **Real-time Chat**: WebSocket integration (STOMP)
- ✅ **Dark/Light Theme**: Context-based theming
- ✅ **Google OAuth**: Single sign-on
- ✅ **Google Analytics 4**: Hardcoded in index.html (G-WQMFHF6T55)
- ✅ **Responsive Design**: Mobile, tablet, desktop
- ✅ **PDF Export**: Assessment reports
- ✅ **Service Worker**: Caching & offline support

### Current State
```
Frontend Build: 
  npm run dev      → Development server (Vite)
  npm run build    → Production bundle (dev-dist/)
  npm run preview  → Preview production build
```

---

## 🖥️ Backend Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.3.2 | Application framework |
| Java | 21 | Programming language |
| Spring Security | Latest | Authentication & authorization |
| Spring Data MongoDB | Latest | Database ORM |
| MongoDB Atlas | Cloud | Database |
| JJWT | 0.12.5 | JWT token generation |
| Spring WebSocket | Latest | Real-time messaging |
| Maven | 3.9.6 | Build & dependency management |

### API Endpoints Structure
```
/api/auth/
  POST /login              → User login
  POST /register           → User registration
  POST /google             → Google OAuth verification
  GET  /me                 → Get current user

/api/student/
  GET  /dashboard          → Student dashboard data
  GET  /profile            → User profile
  PUT  /profile            → Update profile
  GET  /assessments        → Assessment history
  GET  /appointments       → Student appointments
  ... (and more)

/api/counselor/
  GET  /dashboard          → Counselor dashboard
  GET  /students           → Assigned students
  GET  /appointments       → Counselor appointments
  ... (and more)

/api/admin/
  GET  /dashboard          → Admin dashboard
  GET  /analytics          → Department analytics
  GET  /users              → User management
  GET  /questions          → Assessment questions
  ... (and more)

/api/appointment/
/api/assessment/
/api/counseling-request/
/api/message/
/api/notification/
/api/department/
/api/resource/
```

### Database: MongoDB Atlas

**Collections:**
1. **users** - Base user document (email, password, name, role)
2. **students** - Student-specific info (id, userId, department, major)
3. **counselors** - Counselor-specific info (id, userId, specialization)
4. **departments** - Departments (id, name, description)
5. **assessment_questions** - Wellness assessment questions
6. **assessment_responses** - Student assessment results
7. **appointments** - Counseling appointments
8. **counseling_requests** - Counseling session requests
9. **counseling_sessions** - Active counseling sessions
10. **messages** - Chat messages (student-counselor)
11. **notifications** - System notifications
12. **announcements** - Admin announcements
13. **audit_logs** - System audit trail
14. **wellness_resources** - Educational resources
15. **bookmarks** - Bookmarked resources

**Connection:**
```
MongoDB URI: mongodb+srv://[username]:[password]@student-counciling.vwzjw2m.mongodb.net/student_wellness_db
Database: student_wellness_db
```

---

## 🔄 Data Flow Architecture

### Assessment Flow
```
Student Visits Assessment Wizard
    ↓
React: AssessmentWizard.jsx
    ↓
POST /api/assessment/create
    ↓
Backend: AssessmentService.java
    ├─ Fetch questions from DB
    ├─ Validate responses
    ├─ Calculate wellness score
    ├─ Determine risk level
    └─ Save AssessmentResponse
    ↓
Frontend: Display Results
    └─ PDF Export option
```

### Appointment Booking Flow
```
Student Requests Appointment
    ↓
React: StudentAppointments.jsx
    ↓
POST /api/appointment/request
    ↓
Backend: AppointmentService.java
    ├─ Validate student & counselor
    ├─ Check availability
    └─ Create Appointment record
    ↓
WebSocket: Real-time notification to counselor
    ├─ Counselor receives notification
    └─ Counselor accepts/rejects
    ↓
Frontend: Update UI
    └─ Both parties see confirmation
```

### Chat/Real-time Messaging Flow
```
Student sends message
    ↓
WebSocket: STOMP protocol
    ├─ /app/chat/send
    └─ /topic/chat/{appointmentId}
    ↓
Backend: ChatService.java
    ├─ Validate message
    ├─ Save to MongoDB
    └─ Broadcast to recipient
    ↓
Frontend: SocketContext.jsx
    └─ Update ChatBox.jsx
```

---

## 🤖 ML Service Integration

**Location:** `ml_service/`

**Models:**
- `wellness_risk_model.joblib` - ML model for risk prediction
- `wellness_scaler.joblib` - Feature scaling

**Dataset:**
- `student_mental_health_dataset.csv` - Training data

**Current Integration:** Likely used in backend for assessment scoring and risk level determination

---

## 🔌 External Integrations

### 1. Google OAuth
- **Client ID:** 484622016527-9a06emp9u0bn7k5t4mn3071460hjj6r9
- **Provider:** @react-oauth/google
- **Flow:** Token → Backend validation → JWT issuance

### 2. Google Analytics 4 (GA4)
- **Measurement ID:** G-WQMFHF6T55
- **Currently:** Hardcoded in index.html via gtag script
- **Tracking:** Page views, basic events (not configured for custom events)

### 3. Google Search Console
- **Status:** NOT YET INTEGRATED
- **To Do:** Add verification meta tag

### 4. Render Deployment
- **Frontend URL:** https://digital-student-wellness-and-counseling-y104.onrender.com
- **Backend:** Same render app
- **Database:** MongoDB Atlas (cloud)

---

## 📊 Current GA4 Implementation

```javascript
// index.html (hardcoded)
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WQMFHF6T55"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WQMFHF6T55');
</script>
```

**Current Tracking:**
- ✅ Page views (automatic)
- ❌ Custom events (not implemented)
- ❌ Conversion tracking
- ❌ User engagement metrics

---

## 🌐 Deployment Architecture

```
                      Render Platform
        ┌────────────────────────────────────┐
        │                                    │
        ├────────────────────────────────────┤
        │   Frontend (React + Vite)          │
        │   - Production build (dev-dist/)   │
        │   - Static assets served           │
        │   - GA4 integrated                 │
        │   URL: Main domain                 │
        ├────────────────────────────────────┤
        │   Backend (Spring Boot)            │
        │   - Java 21 + Maven build          │
        │   - REST APIs                      │
        │   - WebSocket server               │
        │   - Port: 8080                     │
        ├────────────────────────────────────┤
        │   Environment Variables            │
        │   - VITE_API_URL                   │
        │   - JWT_SECRET                     │
        │   - GOOGLE_CLIENT_ID               │
        └────────────────────────────────────┘
                        │
                        ▼
        ┌────────────────────────────────────┐
        │    MongoDB Atlas (Cloud)           │
        │    - Cluster: student-counciling   │
        │    - Database: student_wellness_db │
        │    - Collections: 15+              │
        └────────────────────────────────────┘
```

---

## 🔒 Security Model

| Layer | Implementation |
|-------|-----------------|
| **Authentication** | JWT + Google OAuth |
| **Authorization** | RBAC (Spring Security) |
| **Password** | Hashed (Spring Security) |
| **CORS** | Configured in CorsConfig.java |
| **HTTPS** | Render handles TLS |
| **Database Access** | MongoDB URI with credentials |
| **API Security** | Bearer token in Authorization header |
| **PII Protection** | NOT exposed in URLs/GA4 |

---

## 🎯 User Roles & Access Control

### 1. Student Portal
**Route:** `/student/*`  
**Access:** ROLE_STUDENT only

**Pages:**
- Dashboard (overview of wellness)
- Assessment Wizard (take new wellness assessment)
- Assessment History (view past results)
- Appointments (schedule & view appointments)
- Requests (submit counseling requests)
- Chat (message counselor)
- Resources (view wellness resources)
- Profile (personal information)

### 2. Counselor Portal
**Route:** `/counselor/*`  
**Access:** ROLE_COUNSELOR only

**Pages:**
- Dashboard (caseload overview)
- Assigned Students (student list)
- Student Wellness Profile (view student info)
- Appointments (manage schedules)
- Requests (handle counseling requests)
- Chat (communicate with students)
- Sessions (track counseling sessions)

### 3. Admin Portal
**Route:** `/admin/*`  
**Access:** ROLE_ADMIN only

**Pages:**
- Dashboard (system overview)
- Department Analytics (statistics)
- User Management (CRUD users)
- Question Management (assessment questions)
- Resource Management (manage resources)
- Announcements (create announcements)
- Audit Logs (track system activity)

### 4. Public Routes
**Routes:** `/login`, `/register`, `/unauthorized`  
**Access:** Anyone (unauthenticated)

---

## 📈 Key Features

### Student Features
1. ✅ Wellness Assessment (multi-question questionnaire)
2. ✅ Risk Level Evaluation (ML-based)
3. ✅ Counselor Matching (automated)
4. ✅ Appointment Booking
5. ✅ Real-time Chat with Counselor
6. ✅ Resource Library Access
7. ✅ PDF Report Generation
8. ✅ Progress Tracking

### Counselor Features
1. ✅ Student Caseload Management
2. ✅ Appointment Scheduling
3. ✅ Session Notes
4. ✅ Student Wellness Insights
5. ✅ Real-time Chat
6. ✅ Risk Alerts
7. ✅ Resource Recommendations

### Admin Features
1. ✅ User Management (create/edit/delete)
2. ✅ Assessments Configuration
3. ✅ Department Management
4. ✅ Analytics Dashboard
5. ✅ Announcements Broadcasting
6. ✅ Audit Logging
7. ✅ Role Assignment

---

## 🚀 Development Workflow

### Frontend Development
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# Access: http://localhost:5173

# Build for production
npm run build
# Output: dev-dist/

# Preview production build
npm run preview
```

### Backend Development
```bash
# Navigate to server directory
cd server

# Compile & build JAR
mvn clean package
# Output: target/wellness-platform-backend-1.0.0.jar.original

# Run tests
mvn test

# Run application
java -jar target/wellness-platform-backend-1.0.0.jar
# Access: http://localhost:8080
```

### Environment Setup
- **Node.js:** >= 18.0.0, < 23.0.0
- **Java:** 21
- **Maven:** 3.9.6
- **MongoDB:** Cloud (Atlas)

---

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
VITE_GA_MEASUREMENT_ID=G-WQMFHF6T55
VITE_PUBLIC_SITE_URL=https://YOUR_DOMAIN.com
VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=YOUR_VERIFICATION_CODE
```

### Backend (application.properties)
```
server.port=8080
spring.data.mongodb.uri=mongodb+srv://...
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.jwt.expiration-ms=86400000
```

---

## 🎨 Design System

- **Component Library:** Material-UI (MUI)
- **Theme Colors:** Teal/Green (#0d9488) primary
- **Typography:** Outfit, Plus Jakarta Sans, Inter
- **Responsive:** Mobile-first, tablet, desktop
- **Icons:** Material-UI Icons

---

## 🧪 Testing Strategy

**Current State:** Not fully documented

**Recommended:**
- Frontend: Jest + React Testing Library
- Backend: JUnit 5
- Integration Tests: Spring Boot Test

---

## 📚 Documentation

**Existing:**
- Inline code comments
- Component JSDoc

**Missing:**
- API documentation (Swagger/OpenAPI)
- Architecture decision records (ADRs)
- Deployment runbooks
- Troubleshooting guides

---

## 🎯 Ready for SEO & Google Search Console Integration

✅ **Existing Foundation:**
- GA4 already integrated
- React Router for SPA navigation
- Responsive design
- Public/protected route separation

❌ **Missing (To Implement):**
- Google Search Console verification meta tag
- Dynamic SEO metadata component
- Sitemap.xml
- robots.txt
- Configurable environment variables for SEO
- Analytics utility for custom GA4 events
- Public-facing pages (About, Wellness Resources, etc.)

---

## � Google Search Console & SEO Architecture

### Overview
AuraWell implements a comprehensive SEO architecture designed for Google Search Console readiness, privacy-conscious analytics, and professional search visibility.

```
                    Google Search
                         │
                         ▼
              Google Search Console
                         │
           ┌─────────────┴─────────────┐
           │                           │
      Impressions                   Clicks
      Queries                       CTR
      Position                  Indexing
           │                        │
           └─────────────┬──────────┘
                         │
                         ▼
                    AuraWell
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
   React + Vite              Spring Boot + MongoDB
        │                                 │
        ├── SEO Metadata                  │
        ├── Sitemap.xml                   │
        ├── robots.txt                    │
        ├── Canonical URLs                │
        ├── Open Graph Tags               │
        └── GA4 Events                    │
              │                           │
              └─────────────┬─────────────┘
                            │
                    ┌───────▼────────┐
                    │   Google       │
                    │  Analytics 4   │
                    │                │
                    ├─ Page Views    │
                    ├─ Sessions      │
                    ├─ Engagement    │
                    ├─ Events        │
                    └─ Conversions   │
```

### Key Components

#### 1. SEO Component (`components/common/SEO.jsx`)
Reusable React component for managing page-level SEO metadata.

**Features:**
- Dynamic title updates
- Meta description management
- Canonical URL generation
- Open Graph metadata
- Twitter Card tags
- Robots directives

**Usage:**
```jsx
<SEO
  title="Page Title"
  description="Page description"
  canonical="/page"
  robots="index, follow"
  ogTitle="OG Title"
  ogDescription="OG Description"
  ogUrl="/page"
  ogType="website"
  ogImage="https://domain.com/image.png"
/>
```

#### 2. SEO Manager (`components/common/SEOManager.jsx`)
Global route-based SEO metadata handler. Automatically updates SEO tags on route changes.

**Features:**
- Automatic route-based SEO updates
- GA4 page view tracking for SPA
- Scroll-to-top on navigation
- No dependencies required

#### 3. Route SEO Configuration (`config/routeSEO.js`)
Centralized mapping of routes to SEO metadata.

**Structure:**
```javascript
export const routeSEOConfig = {
  '/': { title, description, canonical, robots, ... },
  '/login': { robots: 'noindex, nofollow', ... },
  '/student/dashboard': { robots: 'noindex, nofollow', ... },
  // ... more routes
};
```

#### 4. Sitemap (`public/sitemap.xml`)
XML sitemap listing all indexable public URLs.

**Current URLs:**
- `/` (homepage)
- `/login`
- `/register`

**Excluded:**
- All `/student/*` (protected)
- All `/counselor/*` (protected)
- All `/admin/*` (protected)
- `/unauthorized`

**URL:** `https://digital-student-wellness-and-counseling-y104.onrender.com/sitemap.xml`

#### 5. Robots.txt (`public/robots.txt`)
Crawler directives for search engines.

**Configuration:**
- Allows general crawling of public pages
- Disallows crawling of `/login`, `/register`, `/unauthorized`
- Disallows all `/student/*`, `/counselor/*`, `/admin/*`
- Points to sitemap location

**URL:** `https://digital-student-wellness-and-counseling-y104.onrender.com/robots.txt`

#### 6. Analytics Utility (`utils/analytics.js`)
Privacy-conscious GA4 event tracking.

**Safe Event Categories:**
- Assessment events (started, completed)
- Counseling events (requested)
- Appointment events (booked, completed, cancelled)
- Resource events (viewed, downloaded)
- Engagement events (feedback, chat)
- Authentication events (sign up, sign in, sign out)

**Forbidden Data:**
- Student names
- Email addresses
- Phone numbers
- Student IDs
- Assessment answers
- Counseling notes
- Mental health diagnoses
- Risk levels
- Any PII or sensitive information

#### 7. Search Console Verification (`index.html`)
Environment-based Google Search Console verification tag.

**Configuration:**
```
VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=YOUR_CODE
```

**Usage:**
- Get verification code from Google Search Console
- Set environment variable
- Redeploy frontend
- Verify in Search Console

### Public vs Protected Routes

#### Public Routes (Indexable)
- `/` (redirects to login if unauthenticated)
- `/login` (noindex, but public)
- `/register` (noindex, but public)

**Future public routes:**
- `/about`
- `/wellness-resources`
- `/stress-management`
- `/counseling`
- `/faq`
- `/contact`

#### Protected Routes (Non-indexable)
All protected routes receive `robots="noindex, nofollow"`:
- `/student/*` (student portal)
- `/counselor/*` (counselor portal)
- `/admin/*` (admin portal)

### Privacy & Security

**Never Tracked:**
- Student names
- Email addresses
- Phone numbers
- Student IDs or user IDs
- Counseling notes or content
- Assessment answers
- Mental health diagnoses
- Risk information
- Personal profile information
- Chat messages
- Appointment details with student names
- JWT tokens or authentication data

**Protected by:**
- Route-level `noindex` meta tags
- `robots.txt` disallow directives
- Excluded from sitemap
- Removed from GA4 event parameters
- No URL-based personal data

### GA4 Integration

**Measurement ID:** `G-WQMFHF6T55`

**Tracking:**
- Automatic page views via SEOManager
- Custom events via analytics utility
- User properties (role only, anonymized)
- Event parameters (no PII)

**Custom Events:**
- `page_view` (automatic)
- `assessment_started`, `assessment_completed`
- `counseling_request_submitted`
- `appointment_booked`, `appointment_completed`, `appointment_cancelled`
- `wellness_resource_view`, `resource_downloaded`
- `feedback_submitted`, `chat_message_sent`
- `sign_up`, `login`, `logout`

**Configuration:**
```
VITE_GA_MEASUREMENT_ID=G-WQMFHF6T55
```

### Environment Configuration

**Required Variables:**
```
VITE_API_URL=http://localhost:8080
VITE_PUBLIC_SITE_URL=https://digital-student-wellness-and-counseling-y104.onrender.com
VITE_GA_MEASUREMENT_ID=G-WQMFHF6T55
VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=
```

**File:** `client/.env.example`

### Render Deployment

**Production URL:**
```
https://digital-student-wellness-and-counseling-y104.onrender.com
```

**Deployment Requirements:**
1. Static files served from `dist/` after build
2. `sitemap.xml` accessible at root
3. `robots.txt` accessible at root
4. Environment variables configured in Render dashboard

**Verification:**
```
✓ https://domain/sitemap.xml → HTTP 200
✓ https://domain/robots.txt → HTTP 200
✓ Homepage has SEO metadata
✓ Protected routes have noindex
✓ GA4 tracking works
✓ Search Console verification tag present
```

### Search Console Setup Steps

1. **Create Property**
   - Go to Google Search Console
   - Create URL-prefix property for production URL
   
2. **Verify Ownership**
   - Select HTML tag verification
   - Copy verification code
   - Set `VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=CODE`
   - Deploy frontend
   - Complete verification in Search Console

3. **Submit Sitemap**
   - Navigate to Sitemaps section
   - Add sitemap: `/sitemap.xml`
   - Submit

4. **Monitor Indexing**
   - Check Coverage report
   - Verify public pages are indexed
   - Confirm protected pages show "noindex"
   - Monitor Core Web Vitals

### URL Inspection in Search Console

For any public URL:
1. Open Search Console
2. Use URL Inspection tool
3. Paste URL (e.g., `https://domain/login`)
4. Check:
   - Indexability (should show why if noindex)
   - Mobile friendliness
   - Core Web Vitals
   - Structured data

### Canonical URL Strategy

All canonical URLs are auto-generated using:
```javascript
const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
const canonical = `${siteUrl}${path}`;
```

**Prevents:**
- Duplicate content issues
- Subdomain canonicalization problems
- Protocol mismatches (http vs https)
- Trailing slash inconsistencies

### Structured Data

Currently not implemented. Can be added using JSON-LD for:
- WebSite schema
- Organization schema
- Article schema
- FAQPage schema

Recommendation: Only add structured data for publicly visible content that matches schema.org requirements.

### Performance Considerations

- SEO metadata updates don't add rendering overhead
- No additional dependencies for meta tag management
- GA4 already loaded via gtag script
- Route-based SEO uses React hooks (efficient)
- Sitemap and robots.txt are static files

### Testing Checklist

- ✅ `npm run build` succeeds
- ✅ `sitemap.xml` returns HTTP 200
- ✅ `robots.txt` returns HTTP 200
- ✅ Homepage has correct title, description, canonical, og tags
- ✅ Protected routes show noindex
- ✅ Auth pages show noindex
- ✅ GA4 initialization only once
- ✅ Page view tracking works
- ✅ Custom events track without PII
- ✅ Search Console verification tag present (when configured)
- ✅ Mobile responsiveness preserved
- ✅ Existing routing still works
- ✅ PWA still works
- ✅ WebSocket still works

---

## 📋 Summary Table

| Aspect | Status | Technology |
|--------|--------|-----------|
| Frontend | ✅ Deployed | React 18 + Vite |
| Backend | ✅ Deployed | Spring Boot 3.3 + Java 21 |
| Database | ✅ Deployed | MongoDB Atlas |
| Authentication | ✅ Implemented | JWT + Google OAuth |
| Authorization | ✅ Implemented | RBAC (3 roles) |
| Real-time | ✅ Implemented | WebSocket (STOMP) |
| PWA | ✅ Implemented | Workbox v7.4.1 |
| Analytics | ✅ GA4 (Enhanced) | Custom events implemented |
| SEO | ✅ Implemented | Meta tags, sitemap, robots |
| Search Console | ✅ Ready | Verification-based |
| Sitemap | ✅ Implemented | Static XML file |
| robots.txt | ✅ Implemented | Crawler directives |
| Canonical URLs | ✅ Implemented | Dynamic generation |
| Protected Route Noindex | ✅ Implemented | Meta tags |
| robots.txt | ❌ Missing | To be created |

---

## 🔗 Useful Links

- **Deployment:** https://digital-student-wellness-and-counseling-y104.onrender.com
- **GitHub:** (repository link if available)
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Google Cloud Console:** https://console.cloud.google.com/
- **Render Dashboard:** https://dashboard.render.com/

---

**Document Version:** 1.0  
**Last Updated:** 2025-08-20  
**Author:** Architecture Analysis
