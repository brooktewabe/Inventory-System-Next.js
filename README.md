# Inventory Management System - Next.js 15
A comprehensive inventory management system built with Next.js 15, TanStack Query, and TypeScript. This application provides a complete solution for managing inventory, sales, and customer data with role-based access control.

![Demo](public/Screenshot(38).png)
![Demo](public/Screenshot(39).png)
![Demo](public/Screenshot(36).png)

Backend url: https://github.com/brooktewabe/Inventory-API-Nest.js-v2
## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time analytics and overview with quick actions
- **Inventory Management**: Store and warehouse stock management
- **Sales Management**: Single and batch sales processing with persistence
- **Customer Management System (CMS)**: Customer data and purchase history
- **Stock Movement Tracking**: Complete audit trail of inventory changes
- **Stock Transfer**: Move inventory between warehouse and store
- **Notifications**: Real-time alerts for low stock and important events
- **Reporting**: Comprehensive sales and inventory reports with export
- **User Administration**: Role-based access control with permissions

### Technical Features
- **Next.js 15**: Latest Next.js with App Router and server components
- **TanStack Query**: Efficient data fetching, caching, and synchronization
- **TypeScript**: Type safety for critical components and data structures
- **Responsive Design**: Mobile-first approach with adaptive sidebar
- **Real-time Updates**: Optimistic updates and automatic cache invalidation
- **Persistent State**: Batch sale data persistence across sessions
- **Authentication**: JWT-based auth with automatic token refresh
- **File Uploads**: Image handling for products and receipts
- **Advanced Search**: Debounced search with real-time filtering

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **State Management**: TanStack Query, React Hooks, Context API
- **Styling**: Tailwind CSS with custom components
- **Authentication**: JWT with HTTP-only cookies
- **Forms**: Formik with Yup validation
- **Notifications**: React Toastify, SweetAlert2
- **Icons**: React Icons
- **File Handling**: Native File API with preview support

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Enhanced dashboard with widgets
│   ├── sales/            # Sales management
│   ├── batch-sale/       # Batch sales with persistence
│   ├── warehouse/        # Warehouse inventory
│   ├── customers-list/   # Customer management
│   ├── stock-movement/   # Stock movement tracking
│   ├── transfer-stock/   # Stock transfer between locations
│   ├── reports/          # Report generation and export
│   ├── settings/         # User and system settings
│   ├── login/            # Authentication
│   ├── forgot-password/  # Password recovery
│   ├── reset-password/   # Password reset
│   └── layout.tsx        # Root layout with providers
├── components/           # Reusable components
│   ├── Layout.tsx        # Main layout with dynamic sidebar
│   ├── Navbar.tsx        # Responsive navigation sidebar
│   ├── ProtectedRoute.tsx # Route protection with permissions
│   ├── DashboardStats.tsx # Dashboard statistics widgets
│   ├── StockAlert.tsx    # Low stock alert component
│   ├── QuickActions.tsx  # Dashboard quick action buttons
│   ├── RecentActivity.tsx # Recent activity feed
│   ├── InventoryChart.tsx # Inventory visualization
│   ├── SalesChart.tsx    # Sales trend visualization
│   ├── SearchCustomer.tsx # Customer search component
│   └── ...              # Other feature components
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state management
│   ├── useSidebar.ts    # Sidebar state with persistence
│   └── useBatchSale.ts  # Batch sale state with localStorage
├── lib/                # Utility libraries
│   ├── auth.ts         # Authentication utilities
│   └── axios.ts        # API client with interceptors
└── middleware.ts       # Next.js middleware for route protection
```

## 🔧 Installation & Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
npm start
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
The system implements a comprehensive permission system:

- **Dashboard**: `dashboard` permission - Access to main dashboard
- **Store Management**: `store` permission - Sales and store operations
- **Inventory Management**: `inventory` permission - Warehouse operations
- **Add Products**: `add` permission - Product creation and bulk upload
- **Customer Management**: `cms` permission - Customer data management
- **Settings**: `settings` permission - System and user settings
- **Notifications**: `notification` permission - Notification management

### User Roles
- **Admin**: Full system access with user management
- **Manager**: Limited administrative access without user management
- **Data Clerk**: Basic operational access for daily tasks

## 🚀 Performance Features

1. **Automatic Caching**: TanStack Query caches API responses intelligently
2. **Background Updates**: Data refreshes automatically in the background
3. **Optimistic Updates**: UI updates immediately for better perceived performance
4. **Debounced Search**: Reduces API calls during typing (400ms delay)
5. **Pagination**: Efficient data loading for large datasets
6. **Image Optimization**: Next.js automatic image optimization
7. **Code Splitting**: Automatic route-based code splitting
8. **Prefetching**: Next.js prefetches linked pages

## 🛡 Security Enhancements

1. **Middleware Protection**: Server-side route protection before rendering
2. **Token Management**: Secure JWT handling with HTTP-only cookies
3. **Permission Validation**: Component-level permission checks
4. **CSRF Protection**: Built-in Next.js CSRF protection
5. **XSS Prevention**: Automatic sanitization and validation
6. **API Interceptors**: Automatic token refresh and error handling

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices with touch-friendly interfaces
- **Adaptive Sidebar**: Automatically collapses on mobile, expandable on desktop
- **Dynamic Layout**: No white space when sidebar is hidden
- **Touch-friendly**: Large touch targets and swipe gestures
- **Flexible Grids**: Responsive grid systems that adapt to screen size
- **Breakpoint Management**: Consistent breakpoints across components

## 🔧 State Management Architecture

### Authentication State
```typescript
// useAuth hook manages authentication globally
const { user, loading, logout, login, isAuthenticated } = useAuth()
```

### Sidebar State
```typescript
// useSidebar hook manages sidebar state with persistence
const { isCollapsed, isMobile, toggle } = useSidebar()
```

### Batch Sale State
```typescript
// useBatchSale hook manages batch sale data with localStorage
const { batchData, updateBatchData, addItem, clearBatchData } = useBatchSale()
```

### Server State
```typescript
// TanStack Query manages all server state
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction
})
```

## 🎨 UI/UX Improvements

1. **Consistent Design Language**: Unified color scheme and typography
2. **Loading States**: Proper loading indicators throughout the app
3. **Error Handling**: User-friendly error messages and recovery
4. **Form Validation**: Real-time validation with clear error messages
5. **Micro-interactions**: Hover states and smooth transitions
6. **Accessibility**: Proper ARIA labels and keyboard navigation
7. **Visual Feedback**: Toast notifications and confirmation dialogs

## 🔄 Data Flow

1. **Authentication**: JWT tokens stored in HTTP-only cookies
2. **API Calls**: Axios interceptors handle token attachment and refresh
3. **Caching**: TanStack Query manages all server state caching
4. **Persistence**: Critical data (batch sales, sidebar state) stored in localStorage
5. **Real-time Updates**: Optimistic updates with automatic rollback on error

## 🚀 Performance Metrics

- **First Contentful Paint**: Improved with Next.js optimization
- **Time to Interactive**: Reduced with code splitting
- **Bundle Size**: Optimized with tree shaking
- **API Calls**: Reduced with intelligent caching
- **Memory Usage**: Optimized with proper cleanup

## 🤝 Contributing

1. Follow the established file structure and naming conventions
2. Use TypeScript for new components when beneficial
3. Implement proper error handling and loading states
4. Add comprehensive form validation
5. Follow the existing code style and patterns
6. Test authentication flows and permission checks
7. Ensure responsive design across all screen sizes

## 📄 License

This project is proprietary software for inventory management purposes.

---

## 🔍 Detailed Component Breakdown

### Core Components
- **Layout**: Dynamic margin calculation based on sidebar state
- **Navbar**: Responsive sidebar with proper state management
- **ProtectedRoute**: Permission-based route protection
- **Spinner**: Consistent loading indicator

### Dashboard Components
- **DashboardStats**: Key metrics and KPIs
- **StockAlert**: Low stock notifications
- **QuickActions**: Shortcut buttons for common tasks
- **RecentActivity**: Activity feed with real-time updates
- **InventoryChart**: Visual inventory breakdown
- **SalesChart**: Sales trend visualization

### Form Components
- **SearchCustomer**: Customer search with autocomplete
- **ItemSelector**: Product selection with search
- **Revenue**: Sales amount tracking with period selection
- **Total**: Total inventory value calculation

### Utility Hooks
- **useAuth**: Global authentication state management
- **useSidebar**: Sidebar state with responsive behavior
- **useBatchSale**: Persistent batch sale data management

This rewrite addresses all the issues you mentioned while maintaining the exact same UI and functionality, but with significantly improved architecture, performance, and user experience.