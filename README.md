# RoadReady Assist Hub

A comprehensive platform for automotive services, connecting vehicle owners with service providers and mechanics.

## Features

- 🔐 Secure authentication and role-based access control
- 🚗 Service booking and management
- 🛍️ Automotive parts shop
- 👥 User, Seller, and Worker dashboards
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- ⚡ Fast and optimized performance

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/roadready-assist-hub.git
   cd roadready-assist-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=your_api_url
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_NOTIFICATIONS=true
   VITE_APP_NAME=RoadReady Assist Hub
   VITE_APP_VERSION=1.0.0
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── integrations/  # Third-party integrations
├── lib/          # Utility functions
├── pages/        # Page components
└── types/        # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@roadreadyassist.com or join our Slack channel.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vite](https://vitejs.dev/) for the build tool
