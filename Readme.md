Gautam Kumar Ampolu Portfolio project


# 1. Navigate to the project directory
cd /home/z/my-project

# 2. Install dependencies
bun install

# 3. Run the development server
bun run dev

Tech Stack Used
Framework: Next.js 16 with App Router
Language: TypeScript 5
Styling: Tailwind CSS 4 + shadcn/ui
Theme: next-themes (light/dark mode)
Animations: Custom CSS animations
Database: Prisma ORM (SQLite)

my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main portfolio page
│   │   ├── layout.tsx        # Root layout with theme provider
│   │   └── globals.css       # Global styles & animations
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── hooks/
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── package.json



# Add any environment variables here
DATABASE_URL="file:./db/custom.db"
