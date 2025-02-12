# Mstry Message

Mstry Message is an anonymous feedback platform built using Next.js. It allows users to receive anonymous messages and provides AI-powered feedback recommendations.

## 🚀 Live Demo
[View Mstry Message](https://mstry-message-umber.vercel.app/)

## 🛠 Tech Stack
- **Frontend:** Next.js 15, React Hook Form, ShadCN, TailwindCSS, Debouncing
- **Backend:** Next.js API Routes, MongoDB
- **Authentication:** NextAuth/Auth.js (Custom Credentials Provider)
- **Email Verification:** Resend (OTP-based verification)
- **AI-powered Feedback:** OpenAI API, Vercel AI SDK (useCompletion & streaming text)
- **Database Operations:** MongoDB Aggregation Pipeline

## 📂 Project Structure
```
/mstry-message
├── public/            # Static assets
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── pages/        # API routes and meta pages
│   ├── styles/       # Global styles
│   ├── types/        # TypeScript types
│   ├── schemas/      # Zod validation schemas
│   ├── context/      # Context providers
├── next.config.js    # Next.js configuration
├── tailwind.config.js # TailwindCSS configuration
├── tsconfig.json     # TypeScript configuration
├── README.md         # Project documentation
```

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AC12arpitChauhan/mstry-message.git
cd mstry-message
```

### 2️⃣ Install Dependencies
```bash
pnpm install  # or npm install / yarn install
```

### 3️⃣ Setup Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:
```env
NEXTAUTH_SECRET=your-secret-key
RESEND_API_KEY=your-resend-api-key
MONGODB_URI=your-mongodb-connection-string
OPENAI_API_KEY=your-openai-api-key
```

### 4️⃣ Run the Development Server
```bash
pnpm dev  # or npm run dev / yarn dev
```
App will be available at `http://localhost:3000`

## 🚀 Deployment
### **Frontend:** Vercel
1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy 🚀

### **Backend:** Next.js API Routes (handled by Vercel)
- The backend is integrated into Next.js via API routes.
- No separate backend deployment needed.

## 🎯 Features
- 🔒 Secure authentication with NextAuth.js
- 📩 Anonymous messaging system
- 📧 OTP-based email verification (Resend)
- 🤖 AI-powered feedback suggestions (OpenAI)
- 🗄️ Optimized database queries with MongoDB Aggregation
- 🎨 Elegant UI with ShadCN & TailwindCSS
- ⚡ Fast API responses using Vercel AI SDK

## 🤝 Contributing
Feel free to open issues and pull requests to improve the platform.

