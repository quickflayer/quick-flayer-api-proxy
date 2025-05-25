# JWT Authentication Implementation Plan for Quick Flayer Monorepo

## Project Structure Analysis

### Current Architecture:
- **API** (`quick-flayer-api`): NestJS with TypeScript, PostgreSQL database
- **Web** (`quick-flayer-web`): Next.js with App Router, TypeScript
- **Mobile** (`quick-flayer-app`): Expo React Native with TypeScript
- **Database**: PostgreSQL with existing users table
- **State Management**: Redux RTK Query for web, React state for mobile
- **HTTP Client**: Axios with interceptors

### User Model Structure:
```typescript
interface User {
  id: string;
  username: string; // email format
  password: string; // hashed
  role: 'admin' | 'user';
  isPremiumUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication Flow Requirements

### Access Control Matrix:
| Platform | Admin Access | User Access | Registration |
|----------|-------------|-------------|--------------|
| Web      | ✅ Login    | ❌ No Access | ❌ No Registration |
| Mobile   | ✅ Login    | ✅ Login/Register | ✅ Registration Available |

### Session Management:
- **Token Duration**: 24 hours
- **Refresh Strategy**: Automatic refresh on API calls
- **Logout Behavior**: Clear tokens, redirect to login
- **Session Timeout**: Auto-logout after 24h inactivity

## API Implementation Plan (NestJS) - `quick-flayer-api`

### 1. Authentication Module Structure
```
quick-flayer-api/src/modules/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── auth-response.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── admin-only.guard.ts
├── strategies/
│   └── jwt.strategy.ts
└── decorators/
    ├── roles.decorator.ts
    └── current-user.decorator.ts
```

### 2. Update Existing Common Structure
```
quick-flayer-api/src/common/
├── decorators/
│   ├── roles.decorator.ts        # Move from auth module
│   └── current-user.decorator.ts # Move from auth module
├── dto/
│   └── pagination.dto.ts         # Existing
├── guards/
│   ├── jwt-auth.guard.ts         # Move from auth module
│   ├── roles.guard.ts            # Move from auth module
│   └── admin-only.guard.ts       # Move from auth module
└── interceptors/
    └── auth.interceptor.ts       # New auth interceptor
```

### 3. Authentication Endpoints
- **POST /auth/login**: Login with username/password
- **POST /auth/register**: Register new user (mobile only)
- **POST /auth/refresh**: Refresh JWT token
- **POST /auth/logout**: Invalidate token
- **GET /auth/profile**: Get current user profile
- **GET /auth/verify**: Verify token validity

### 4. JWT Configuration
- **Secret**: Environment variable with strong key
- **Expiration**: 24 hours
- **Payload**: `{ sub: userId, username, role, isPremiumUser }`
- **Algorithm**: HS256
- **Issuer**: quick-flayer-api

### 5. Security Features
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Login attempts (5 per minute per IP)
- **Token Blacklisting**: Store invalidated tokens in Redis
- **CORS**: Configure for web and mobile origins
- **Validation**: Strong password requirements, email validation

### 6. Database Updates
- **Users Table**: Add indexes for username, role
- **Sessions Table**: Track active sessions
- **Default Admin**: Seed admin user on startup
- **Audit Log**: Track login attempts and failures

## Web Implementation Plan (Next.js) - `quick-flayer-web`

### 1. Authentication Architecture
```
quick-flayer-web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── middleware.ts
├── lib/
│   ├── auth/
│   │   ├── auth-config.ts
│   │   ├── auth-utils.ts
│   │   └── token-manager.ts
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   │       └── auth-slice.ts
│   └── api/
│       └── auth-api.ts
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedRoute.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── loading.tsx
│   └── layout/
│       ├── header.tsx
│       └── sidebar.tsx
└── hooks/
    ├── useAuth.ts
    └── useAuthTimer.ts
```

### 2. Redux RTK Query Setup
- **Auth API Slice**: Login, logout, profile, refresh endpoints
- **Auth State Slice**: User data, loading states, error handling
- **Middleware**: Token refresh on 401 responses
- **Persistence**: Store tokens in httpOnly cookies (server-side)
- **Hydration**: Restore auth state on app load

### 3. Route Protection
- **Middleware**: Check authentication at route level
- **Protected Routes**: `/dashboard/*`, `/users/*`, `/admin/*`
- **Public Routes**: `/login`, `/`, `/about`
- **Redirect Logic**: Unauthenticated → login, authenticated → dashboard
- **Admin Check**: Verify admin role for protected areas

### 4. Session Management
- **Token Storage**: httpOnly cookies for security
- **Auto Refresh**: Refresh token before expiration
- **Logout Timer**: Auto-logout after 24h
- **Activity Tracking**: Reset timer on user interaction
- **Cross-tab Sync**: Sync auth state across browser tabs

### 5. UI Components
- **Login Form**: Email/password with validation
- **Loading States**: Skeleton loaders during auth checks
- **Error Handling**: Display auth errors to users
- **Navigation**: Show/hide menu items based on auth state
- **User Menu**: Profile, logout options

## Mobile Implementation Plan (Expo React Native) - `quick-flayer-app`

### 1. Authentication Architecture
```
quick-flayer-app/src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── AuthLoadingScreen.tsx
│   ├── main/
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── AdminScreen.tsx
│   └── onboarding/
│       └── WelcomeScreen.tsx
├── navigation/
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── RootNavigator.tsx
├── services/
│   ├── auth/
│   │   ├── authService.ts
│   │   ├── tokenStorage.ts
│   │   └── authTypes.ts
│   ├── api/
│   │   ├── apiClient.ts
│   │   └── authApi.ts
│   └── storage/
│       └── secureStorage.ts
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthButton.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   └── layout/
│       ├── Screen.tsx
│       └── Header.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useAuthTimer.ts
│   └── useSecureStorage.ts
├── utils/
│   ├── validation.ts
│   ├── constants.ts
│   └── helpers.ts
└── types/
    ├── auth.ts
    ├── navigation.ts
    └── user.ts
```

### 2. State Management
- **Auth Context**: Global auth state management
- **Local Storage**: Secure token storage with Expo SecureStore
- **State Persistence**: Maintain auth state across app restarts
- **Loading States**: Handle auth check on app launch
- **Error Handling**: Graceful error display and recovery

### 3. Navigation Flow
- **Auth Stack**: Login, Register screens
- **Main Stack**: Home, Profile, Admin screens
- **Conditional Navigation**: Switch based on auth state
- **Deep Linking**: Handle authenticated routes
- **Back Handler**: Prevent back navigation to auth screens

### 4. Authentication Features
- **Login Flow**: Email/password validation and submission
- **Registration Flow**: Full user registration with role assignment
- **Form Validation**: Real-time validation with error display
- **Loading Indicators**: Show progress during auth operations
- **Biometric**: Optional fingerprint/face ID for quick login

### 5. Session Management
- **Token Storage**: Expo SecureStore for token persistence
- **Auto Refresh**: Background token refresh
- **Session Timer**: 24-hour logout timer
- **App State**: Handle background/foreground token validation
- **Logout Flow**: Clear storage and reset navigation

## API Integration Strategy

### 1. Axios Configuration (All Platforms)
- **Base URL**: Environment-specific API endpoints
- **Request Interceptor**: Add Authorization header automatically
- **Response Interceptor**: Handle token refresh on 401
- **Error Handling**: Standardized error responses
- **Timeout**: Reasonable timeout values
- **Retry Logic**: Automatic retry for network failures

### 2. Token Management
- **Storage Strategy**:
  - Web: httpOnly cookies + Redux state
  - Mobile: Expo SecureStore + Context state
- **Refresh Logic**: Automatic refresh 5 minutes before expiration
- **Token Validation**: Verify token integrity on app launch
- **Logout Cleanup**: Clear all stored tokens and state

### 3. Error Handling
- **401 Unauthorized**: Trigger token refresh or logout
- **403 Forbidden**: Show access denied message
- **Network Errors**: Show offline/retry options
- **Validation Errors**: Display field-specific errors
- **Server Errors**: Generic error handling with logging

## Security Considerations

### 1. Token Security
- **Storage**: Secure storage mechanisms per platform
- **Transmission**: HTTPS only for token exchange
- **Expiration**: Short-lived tokens with refresh capability
- **Revocation**: Server-side token blacklisting
- **Validation**: Verify token signature and claims

### 2. Password Security
- **Hashing**: bcrypt with high salt rounds
- **Strength**: Enforce strong password requirements
- **Reset**: Secure password reset flow (future)
- **History**: Prevent password reuse (future)
- **Attempts**: Rate limiting on failed attempts

### 3. API Security
- **CORS**: Restrict origins to known domains
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Sanitize all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize output data

## Development Workflow

### 1. Implementation Order
1. **Database Setup**: Update schema and seed admin user
2. **API Authentication** (`quick-flayer-api`): Implement auth module and endpoints
3. **API Testing**: Test all endpoints with Postman/tests
4. **Web Integration** (`quick-flayer-web`): Implement Redux RTK Query and auth flow
5. **Mobile Integration** (`quick-flayer-app`): Implement context-based auth
6. **Cross-platform Testing**: Test auth flow across all platforms
7. **Security Testing**: Penetration testing and security audit

### 2. Testing Strategy
- **Unit Tests**: Test auth services and utilities
- **Integration Tests**: Test API endpoints and flows
- **E2E Tests**: Test complete auth flow across platforms
- **Security Tests**: Test for common vulnerabilities
- **Performance Tests**: Test under load conditions

### 3. Environment Configuration
- **Development**: Local database, debug tokens
- **Staging**: Production-like setup for testing
- **Production**: Secure configuration with monitoring
- **Secrets Management**: Environment variables for sensitive data
- **Monitoring**: Auth events logging and alerting

### 4. File Organization Tips
- **Shared Types**: Consider creating shared types in a common package for consistency
- **Constants**: Keep auth-related constants consistent across platforms
- **Error Messages**: Standardize error messages across web and mobile
- **API Contracts**: Ensure DTOs match between API and client applications

## User Experience Considerations

### 1. Loading States
- **Login Process**: Show progress during authentication
- **Route Navigation**: Skeleton loaders for protected routes
- **Token Refresh**: Silent refresh without user interruption
- **Offline Handling**: Graceful degradation when offline

### 2. Error Messages
- **User-Friendly**: Clear, actionable error messages
- **Localization**: Support for multiple languages (future)
- **Accessibility**: Screen reader compatible error announcements
- **Recovery**: Clear steps to resolve auth issues

### 3. Performance
- **Fast Login**: Optimize auth flow for speed
- **Background Refresh**: Non-blocking token refresh
- **Caching**: Cache user data to reduce API calls
- **Bundle Size**: Minimize auth-related bundle impact

## Quick Start Checklist

### API Setup (`quick-flayer-api`)
- [ ] Install required packages: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- [ ] Create auth module and move guards to common folder
- [ ] Update users module to work with auth
- [ ] Configure JWT strategy and guards
- [ ] Add environment variables for JWT secret

### Web Setup (`quick-flayer-web`)
- [ ] Install Redux Toolkit and RTK Query
- [ ] Set up auth slice and API slice
- [ ] Create auth components and protected routes
- [ ] Configure middleware for route protection
- [ ] Set up token management with cookies

### Mobile Setup (`quick-flayer-app`)
- [ ] Install Expo SecureStore for token storage
- [ ] Create auth context and navigation structure
- [ ] Build login/register screens
- [ ] Set up secure storage service
- [ ] Configure navigation conditional rendering

This comprehensive plan ensures secure, scalable authentication across all platforms while maintaining your existing monorepo structure and developer productivity.