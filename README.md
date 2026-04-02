# OctoTrace

<div align="center">

![OctoTrace Logo](public/logo.svg)

**Enhanced GitHub Analytics for Developers**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Demo](https://octotrace.vercel.app) • [Documentation](docs/ARCHITECTURE.md) • [Report Bug](https://github.com/yourusername/octotrace/issues) • [Request Feature](https://github.com/yourusername/octotrace/issues)

</div>

---

## 🎯 What is OctoTrace?

OctoTrace is a modern, privacy-focused GitHub analytics platform that provides developers with deeper insights into their coding activity. While GitHub's native interface shows basic statistics, OctoTrace unlocks advanced analytics, beautiful visualizations, and actionable insights about your development journey.

### The Problem

GitHub's interface provides:

- Basic contribution squares
- Simple repository statistics
- Limited language breakdowns
- No historical trend analysis
- Minimal productivity insights

### The Solution

OctoTrace offers:

- **Advanced Statistics** - Detailed commit patterns, PR velocity, and code review metrics
- **Language Analytics** - Deep dive into your tech stack with evolution tracking
- **Activity Insights** - Understand your most productive days and coding habits
- **Repository Comparison** - Analyze stars, forks, and engagement across all projects
- **Beautiful Visualizations** - Interactive charts and graphs that tell your coding story
- **Privacy First** - All data fetched client-side, nothing stored on servers

---

## ✨ Features

### 📊 Comprehensive Dashboard

- Real-time statistics overview
- Key metrics at a glance (repositories, stars, followers, commits)
- Week-over-week change tracking
- Current streak monitoring

### 💻 Language Analysis

- Language distribution pie charts
- Detailed breakdown by bytes and repository count
- Category-based organization (Frontend, Backend, Systems, Mobile)
- Diversity score and polyglot insights
- Most versatile language tracking

### 📈 Activity Tracking

- 90-day commit history with trends
- Daily, weekly, and monthly patterns
- Most productive day analysis
- Streak tracking (current and longest)
- Recent activity feed with visual indicators

### 🗂️ Repository Management

- Searchable repository list
- Detailed metrics (stars, forks, watchers)
- Topic-based filtering
- Language identification
- Direct GitHub links

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- GitHub account for OAuth (optional for development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/octotrace.git
   cd octotrace
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# GitHub OAuth (Required for production)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** For development, the app uses mock data and doesn't require GitHub OAuth setup.

---

## 🏗️ Tech Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and enhanced developer experience
- **React 19** - Latest React features and improvements

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide Icons** - Clean, consistent icon set
- **next-themes** - Dark/light mode support

### Data & State

- **SWR** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Visualization

- **Recharts** - Composable charting library
- **D3 Scale** - Data transformation utilities

### Development

- **ESLint** - Code linting
- **Turbopack** - Fast build system
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
OctoTrace/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/            # Public landing page
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── dashboard/       # Overview page
│   │   │   ├── repos/           # Repositories page
│   │   │   ├── languages/       # Languages page
│   │   │   └── activity/        # Activity page
│   │   ├── auth/                # Authentication pages
│   │   └── api/                 # API routes (mock data)
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── blocks/             # Reusable block components
│   │   ├── charts/             # Data visualization components
│   │   ├── layout/             # Layout components
│   │   ├── shared/             # Shared utilities
│   │   ├── tables/             # Table components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── types/                   # TypeScript type definitions
│   └── styles/                  # Global styles
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── SECURITY.md             # Security policies
└── public/                      # Static assets
```

> See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

---

## 🔐 Security & Privacy

OctoTrace is built with privacy as a core principle:

- ✅ **Client-Side Processing** - All data fetched and processed in your browser
- ✅ **No Data Storage** - We don't store any of your GitHub data
- ✅ **Read-Only Access** - Only requests public repository read permissions
- ✅ **Revocable Access** - Disconnect anytime from GitHub settings
- ✅ **Open Source** - Fully transparent and auditable code

Read more in [SECURITY.md](docs/SECURITY.md)

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) guide to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Roadmap

### v1.0 (Current)

- [x] Landing page with feature showcase
- [x] Dashboard with key metrics
- [x] Repository analytics
- [x] Language breakdown
- [x] Activity tracking
- [x] Mock data for development

### v1.1 (Next)

- [ ] GitHub OAuth integration
- [ ] Real-time data fetching
- [ ] User profile page
- [ ] Settings and preferences
- [ ] Export data functionality

### v2.0 (Future)

- [ ] Organization analytics
- [ ] Team collaboration features
- [ ] Advanced filtering and search
- [ ] Custom dashboard layouts
- [ ] Email reports
- [ ] API for third-party integrations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing comprehensive developer data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful component primitives
- [Recharts](https://recharts.org/) for powerful visualization tools
- [Vercel](https://vercel.com) for seamless deployment platform
- The open-source community for inspiration and support

---

## 💬 Support

- 📧 Email: support@octotrace.dev
- 💬 Discord: [Join our community](https://discord.gg/octotrace)
- 🐦 Twitter: [@OctoTrace](https://twitter.com/octotrace)
- 📚 Docs: [docs.octotrace.dev](https://docs.octotrace.dev)

---

<div align="center">

**Built with ❤️ by developers, for developers**

⭐ Star us on GitHub if you find this project useful!

[Website](https://octotrace.dev) • [Documentation](docs/ARCHITECTURE.md) • [Blog](https://blog.octotrace.dev)

</div>
