# Task Manager Web App

A modern, professional task management application built with React, TypeScript, and TailwindCSS. This app provides a comprehensive solution for managing projects, boards, and tasks with an intuitive drag-and-drop interface.

## 🚀 Features

### Authentication
- **Login/Register**: Secure authentication with form validation
- **Mock Authentication**: Frontend-only authentication for demo purposes
- **User Profile Management**: Update profile information and settings

### Dashboard
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Sidebar Navigation**: Easy access to boards and settings
- **Top Navigation**: Search functionality and user profile dropdown
- **Dark/Light Theme**: Toggle between themes with persistent preferences

### Board Management
- **Create Boards**: Add new project boards with custom colors and descriptions
- **Board Listing**: View all boards in a responsive grid layout
- **Edit/Delete**: Manage existing boards with full CRUD operations
- **Color Coding**: Visual organization with customizable board colors

### Task Management
- **Drag & Drop**: Intuitive task movement between columns (To Do, In Progress, Done)
- **Task Cards**: Rich task display with priority, tags, due dates, and assignments
- **Task Modal**: Detailed task view with full editing capabilities
- **Priority Levels**: High, Medium, Low priority with visual indicators
- **Tags System**: Flexible tagging for better organization
- **Due Dates**: Track deadlines with overdue indicators
- **User Assignment**: Assign tasks to team members

### Advanced Features
- **Real-time Updates**: Instant UI updates with Redux state management
- **Local Storage**: Persistent data storage across browser sessions
- **Form Validation**: Comprehensive validation with react-hook-form
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Accessibility**: Built with accessibility best practices using Radix UI

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router DOM** - Client-side routing
- **React Hook Form** - Performant forms with validation
- **Redux Toolkit** - Predictable state management
- **@dnd-kit** - Modern drag-and-drop library
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   └── task/            # Task-specific components
├── pages/               # Page components
│   ├── Auth/            # Authentication pages
│   └── Dashboard/       # Dashboard pages
├── store/               # Redux store and slices
│   └── slices/          # Redux slices (auth, boards, tasks)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── data/                # Seed data and mock data
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager/client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🎯 Usage

### Getting Started
1. **Register/Login**: Create an account or use existing credentials
2. **Create Boards**: Add your first project board
3. **Add Tasks**: Create tasks and organize them in columns
4. **Drag & Drop**: Move tasks between To Do, In Progress, and Done
5. **Customize**: Set priorities, due dates, tags, and assignments

### Demo Credentials
- **Email**: john@example.com
- **Password**: (any password)

## 🎨 Customization

### Themes
The app supports light and dark themes. Toggle the theme in the Settings page.

### Colors
Board colors can be customized from 8 predefined color options.

### Styling
The app uses TailwindCSS for styling. Customize the design by modifying the Tailwind configuration or adding custom CSS.

## 🔧 Configuration

### Environment Variables
Currently, the app uses mock data. For production, you would need to configure:
- API endpoints
- Authentication service
- Database connection

### State Management
The app uses Redux Toolkit for state management. All state is persisted in localStorage for demo purposes.

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full sidebar and multi-column layout
- **Tablet**: Collapsible sidebar with optimized spacing
- **Mobile**: Mobile-first design with touch-friendly interactions

## 🚀 Future Enhancements

- **Real Backend Integration**: Replace mock data with real API calls
- **Real-time Collaboration**: WebSocket integration for live updates
- **File Attachments**: Upload and manage task attachments
- **Advanced Filtering**: Filter tasks by priority, assignee, due date
- **Calendar View**: Calendar-based task visualization
- **Notifications**: Email and push notifications
- **Team Management**: Multi-user collaboration features
- **Export/Import**: Data export and import functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [@dnd-kit](https://dndkit.com/) for the drag-and-drop functionality