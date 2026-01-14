# SmartEyes Frontend

The web-based dashboard and monitoring interface for the SmartEyes intelligent camera management system. Built with Next.js 16 and React 19, this application provides real-time surveillance monitoring, person detection visualization, and security management for residential buildings.

## Overview

SmartEyes Frontend is a modern, responsive web application that enables security personnel and building managers to:
- Monitor multiple camera feeds in real-time with AI-powered detection overlays
- View live person detection with bounding boxes and confidence scores
- Manage cameras, residents, and security violations
- Receive real-time alerts and notifications
- Access comprehensive analytics and statistics
- Configure camera zones and detection settings

The application leverages WebSocket technology for real-time updates and provides an intuitive, mobile-responsive interface built with Shadcn UI components.

## Features

### Live Monitoring
- **Multi-Camera Grid View**: Display 1-16 cameras simultaneously with customizable layouts (1x1, 2x2, 3x3, 4x4)
- **Real-time Video Streaming**: WebSocket-based streaming with low latency
- **AI Detection Overlays**: Live bounding boxes, person IDs, and confidence scores
- **Camera Controls**: Start/stop streams, switch views, fullscreen mode
- **Real-time Events Panel**: Instant updates on detections and violations

### Dashboard & Analytics
- **Statistics Overview**: Real-time metrics on cameras, detections, and violations
- **Event Timeline**: Comprehensive event history with filtering and search
- **Detection Heatmaps**: Visual representation of activity patterns
- **Camera Status Monitoring**: Health checks and connection status
- **Performance Metrics**: System uptime and detection accuracy

### Map Visualization
- **Google Maps Integration**: Camera locations plotted on interactive maps
- **Zone Management**: Visual representation of camera coverage areas
- **Building Layout**: Floor plans and camera placement visualization

### Notifications & Alerts
- **Real-time Notifications**: Instant alerts for security violations
- **Severity Indicators**: Color-coded alerts (LOW, MEDIUM, HIGH, CRITICAL)
- **Notification Center**: Centralized alert management
- **Sound Alerts**: Audio notifications for critical events

### Authentication & Security
- **JWT-based Authentication**: Secure login with access/refresh tokens
- **Role-based Access Control**: ADMIN, SUPERVISOR, SECURITY, VIEWER roles
- **Protected Routes**: Automatic redirection and authorization
- **Session Management**: Token refresh and automatic logout

### Camera Management
- **CRUD Operations**: Create, read, update, delete cameras
- **Stream Configuration**: RTSP, HTTP, FILE, and WEBCAM support
- **Zone Assignment**: ENTRANCE, LOBBY, ELEVATOR, FLOOR, RESTRICTED areas
- **Status Monitoring**: ONLINE, OFFLINE, ERROR, MAINTENANCE states

## Technology Stack

### Core Framework
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.x** - Type safety and developer experience

### UI Components & Styling
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component system
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### State Management & Data Fetching
- **Zustand 5.0.8** - Lightweight state management
- **TanStack Query (React Query) 5.90.7** - Server state management
- **Axios 1.13.2** - HTTP client with interceptors

### Real-time Communication
- **Socket.IO Client 4.8.1** - WebSocket integration for live updates

### Forms & Validation
- **React Hook Form 7.66.0** - Form management
- **Zod 4.1.12** - Schema validation

### Maps & Visualization
- **@vis.gl/react-google-maps 1.7.1** - Google Maps integration

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18.x or higher** installed
- **Yarn** package manager (or npm/pnpm)
- **Backend API** running (see [backend/README.md](../backend/README.md))
- **AI Service** running (see [ai-service/README.md](../ai-service/README.md))
- **Google Maps API Key** (for map features)

## Installation

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd Smart-eyes/frontend
```

2. **Install dependencies**:
```bash
yarn install
# or
npm install
# or
pnpm install
```

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Google Maps (optional, for map features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Settings
NEXT_PUBLIC_APP_NAME=SmartEyes
NEXT_PUBLIC_DEFAULT_CAMERA_LAYOUT=2x2
```

### Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend REST API endpoint | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_WS_URL` | Backend WebSocket endpoint | `ws://localhost:8080` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for map features | - |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `SmartEyes` |
| `NEXT_PUBLIC_DEFAULT_CAMERA_LAYOUT` | Default camera grid layout | `2x2` |

## Running the Application

### Development Mode

Start the development server with hot-reloading:

```bash
yarn dev
# or
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build and run the optimized production version:

```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Linting & Code Quality

```bash
# Run ESLint
yarn lint

# Fix linting issues
yarn lint --fix
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   └── login/                # Login page
│   │   ├── (main)/                   # Protected main application
│   │   │   ├── dashboard/            # Dashboard page
│   │   │   ├── live-monitoring/      # Live camera monitoring
│   │   │   ├── monitoring-center/    # Advanced monitoring
│   │   │   ├── notification/         # Notification center
│   │   │   └── simple-map/           # Map view
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   └── Providers.tsx             # Context providers
│   │
│   ├── components/                   # React components
│   │   ├── auth/                     # Authentication components
│   │   ├── camera/                   # Camera-related components
│   │   ├── dashboard/                # Dashboard widgets
│   │   ├── layout/                   # Layout components
│   │   ├── main/                     # Main app components
│   │   ├── shared/                   # Shared/reusable components
│   │   └── ui/                       # Shadcn UI primitives
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-camera-queries.ts     # Camera data fetching
│   │   ├── use-camera-stream.ts      # WebSocket streaming
│   │   └── use-mobile.ts             # Mobile detection
│   │
│   ├── lib/                          # Utilities and libraries
│   │   ├── api/                      # API client services
│   │   │   ├── auth-service.ts       # Authentication API
│   │   │   ├── camera-service.ts     # Camera API
│   │   │   ├── detection-service.ts  # Detection API
│   │   │   ├── http-client.ts        # Axios instance
│   │   │   └── websocket-client.ts   # Socket.IO client
│   │   ├── utils/                    # Utility functions
│   │   ├── constants.ts              # Application constants
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── store/                        # State management
│   │   ├── auth-store.ts             # Authentication state
│   │   └── index.ts                  # Store exports
│   │
│   └── types/                        # TypeScript type definitions
│       └── index.ts                  # Shared types
│
├── public/                           # Static assets
│   └── images/                       # Image assets
│
├── .env.local                        # Environment variables (create this)
├── components.json                   # Shadcn UI configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

## Key Components

### Camera Grid (`components/camera/camera-grid.tsx`)
Renders multiple camera feeds in a grid layout with real-time detection overlays.

### Camera View (`components/camera/camera-view.tsx`)
Individual camera view with bounding boxes, confidence scores, and control buttons.

### Control Panel (`components/camera/control-panel.tsx`)
Camera selection, layout switching, and stream controls.

### Events Table (`components/main/events-table.tsx`)
Real-time event log with filtering and pagination.

### Detection Image with Boxes (`components/main/DetectionImageWithBoxes.tsx`)
Canvas-based rendering of detection bounding boxes over video frames.

## API Integration

### REST API Endpoints

The frontend communicates with the backend API:

```typescript
// Authentication
POST   /api/v1/auth/login
GET    /api/v1/auth/profile
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

// Cameras
GET    /api/v1/cameras
GET    /api/v1/cameras/:id
POST   /api/v1/cameras
PUT    /api/v1/cameras/:id
DELETE /api/v1/cameras/:id
POST   /api/v1/cameras/:id/start-stream
POST   /api/v1/cameras/:id/stop-stream
GET    /api/v1/cameras/:id/stream-status

// Detections
GET    /api/v1/detections
GET    /api/v1/detections/:id
GET    /api/v1/detections/events
GET    /api/v1/detections/stats

// Statistics
GET    /api/v1/statistics/dashboard
GET    /api/v1/statistics/cameras
GET    /api/v1/statistics/detections

// Violations
GET    /api/v1/violations
GET    /api/v1/violations/:id
```

### WebSocket Events

Real-time updates via Socket.IO:

```typescript
// Subscribe to camera updates
socket.emit('subscribe_camera', { cameraId: 'camera-01' })

// Unsubscribe from camera
socket.emit('unsubscribe_camera', { cameraId: 'camera-01' })

// Receive frame updates
socket.on('frame_update', (data) => {
  // Handle detection data with bounding boxes
})

// Stream status changes
socket.on('stream_status_changed', (data) => {
  // Handle stream status updates
})
```

## Development Guide

### Adding a New Page

1. Create a new directory in `src/app/(main)/`:
```bash
mkdir -p src/app/(main)/my-page
```

2. Create `page.tsx`:
```tsx
export default function MyPage() {
  return <div>My New Page</div>
}
```

3. Add to navigation in `components/layout/sidebar.tsx`

### Creating a New Component

1. Create component file in appropriate directory:
```tsx
// src/components/my-component/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>
}
```

2. Export from index (if needed):
```tsx
// src/components/my-component/index.ts
export { MyComponent } from './my-component'
```

### Adding API Services

1. Create service file in `src/lib/api/`:
```typescript
// src/lib/api/my-service.ts
import { httpClient } from './http-client'

export const myService = {
  getData: async () => {
    const response = await httpClient.get('/my-endpoint')
    return response.data
  }
}
```

2. Use with React Query:
```typescript
const { data } = useQuery({
  queryKey: ['myData'],
  queryFn: myService.getData
})
```

## Troubleshooting

### Common Issues

**Issue**: WebSocket connection fails
```bash
# Solution: Check backend is running and NEXT_PUBLIC_WS_URL is correct
# Verify: curl http://localhost:8080/health
```

**Issue**: Authentication errors
```bash
# Solution: Clear browser storage and login again
# In browser console: localStorage.clear()
```

**Issue**: Camera streams not loading
```bash
# Solution: Verify AI service is running and cameras are configured
# Check backend logs for RTSP connection errors
```

**Issue**: Build errors with dependencies
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn dev
```

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Navigate to dashboard and verify statistics
- [ ] Start camera stream in live monitoring
- [ ] Verify detection bounding boxes appear
- [ ] Test real-time event updates
- [ ] Check responsive design on mobile
- [ ] Test dark mode toggle
- [ ] Verify logout functionality

## Performance Optimization

### Best Practices

1. **Lazy Loading**: Use dynamic imports for heavy components
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

2. **Image Optimization**: Use Next.js Image component
```tsx
import Image from 'next/image'
<Image src="/logo.png" width={200} height={100} alt="Logo" />
```

3. **React Query Caching**: Configure stale times appropriately
```tsx
queryClient.setDefaultOptions({
  queries: { staleTime: 60000 } // 1 minute
})
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t smarteyes-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  smarteyes-frontend
```

### Manual Deployment

```bash
# Build
yarn build

# Start with PM2
pm2 start yarn --name "smarteyes-frontend" -- start
```

## Security Considerations

- **JWT Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **CORS**: Configure allowed origins in backend
- **Environment Variables**: Never commit `.env.local` to version control
- **API Keys**: Use server-side API routes for sensitive operations
- **Input Validation**: All forms validated with Zod schemas

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Commit with descriptive messages: `git commit -m "feat: add new feature"`
4. Push and create a pull request

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check the [main project documentation](../README.md)

## License

Part of the SmartEyes project. See root LICENSE file for details.

---

**SmartEyes Frontend** - Smart Camera Management Dashboard  
Built with ❤️ using Next.js and React
