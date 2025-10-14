# True Feedback

True Feedback is an anonymous feedback platform built using Next.js. It allows users to receive anonymous messages and provides AI-powered question recommendations powered by Google Gemini.

## 🚀 Live Demo

[View True Feedback](https://true-feedback-umber.vercel.app/)

## 📸 Screenshots

<div align="center">
  <img src="/dashboard.png" alt="Dashboard" width="49%" />
  <img src="/send-message.png" alt="Send Message" width="49%" />
</div>

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React Hook Form, ShadCN UI, Aceternity UI, TailwindCSS, Framer Motion
- **Backend:** Next.js API Routes, MongoDB
- **Authentication:** NextAuth/Auth.js (Google OAuth Provider & Custom Credentials Provider)
- **Email Verification:** Resend (OTP-based verification)
- **AI-powered Suggestions:** Google Gemini API (gemini-2.5-flash), Vercel AI SDK v5 (streamText)
- **Database Operations:** MongoDB Aggregation Pipeline
- **Debouncing:** Custom debouncing for username availability checks

## ✨ Key Features

- 🔐 **Dual Authentication:** Google OAuth & custom credentials with email verification
- 💬 **Anonymous Messaging:** Send and receive messages anonymously
- 🤖 **AI-Powered Questions:** Get creative question suggestions from Google Gemini
- 📧 **Email Verification:** Secure OTP-based verification using Resend
- 🎨 **Modern UI:** Beautiful components from ShadCN UI and Aceternity UI
- ⚡ **Real-time Streaming:** AI responses streamed in real-time using Vercel AI SDK v5
- 🔍 **Username Validation:** Real-time username availability checking with debouncing
- 📊 **MongoDB Aggregation:** Optimized database queries using aggregation pipeline
- 🌓 **Responsive Design:** Fully responsive across all devices
- 🎭 **Motion Animations:** Smooth animations with Framer Motion

## 📂 Project Structure

```
/true-feedback
├── public/
│   └── screenshots/      # App screenshots
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (app)/        # App pages
│   │   └── u/            # Public user pages
│   ├── components/
│   │   ├── ui/           # ShadCN & Aceternity UI components
│   │   └── ...           # Custom components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── model/            # MongoDB models
│   ├── schemas/          # Zod validation schemas
│   ├── types/            # TypeScript types
│   └── helpers/          # Helper functions
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AC12arpitChauhan/true-feedback.git
cd true-feedback
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# MongoDB
MONGODB_URI=your-mongodb-connection-string

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-gemini-api-key
```

### 4️⃣ Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

App will be available at `http://localhost:3000`

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### **Vercel Deployment** (Recommended)

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy 🚀

The backend API routes are automatically handled by Vercel's serverless functions.

### **Environment Variables in Production**

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

## 🎯 How It Works

### Authentication Flow
1. User signs up with email/username or Google OAuth
2. Email users receive OTP verification code
3. After verification, user can access dashboard

### Messaging Flow
1. Users share their unique profile link (`/u/username`)
2. Anyone can send anonymous messages via that link
3. Messages appear in the user's dashboard
4. Users can toggle message acceptance on/off

### AI Suggestions
1. Click "Generate New" on the send message page
2. Google Gemini generates 3 creative questions
3. Questions are streamed in real-time
4. Click any question to use it as your message

## 🔑 Key Technologies Explained

### Vercel AI SDK v5
- Used for streaming AI responses from Google Gemini
- `streamText()` function handles text generation
- `toTextStreamResponse()` sends streaming response to frontend

### NextAuth.js
- Handles both Google OAuth and credentials-based authentication
- Custom pages for sign-in, sign-up, and verification
- Secure session management with JWT

### MongoDB Aggregation
- Optimized queries using aggregation pipeline
- Efficient data filtering and transformation
- Better performance for complex queries

### Debouncing
- Username availability checked with 300ms debounce
- Reduces unnecessary API calls
- Better user experience

## 📦 Dependencies

### Main Dependencies
- `next`: ^15.1.2
- `react`: ^19.0.0
- `@ai-sdk/google`: ^1.0.0
- `ai`: ^4.0.0
- `next-auth`: ^4.24.0
- `mongodb`: ^6.0.0
- `mongoose`: ^8.0.0
- `resend`: ^4.0.0
- `zod`: ^3.23.0
- `react-hook-form`: ^7.53.0
- `framer-motion`: ^11.0.0

### UI Libraries
- `@radix-ui/*`: Various UI primitives
- `tailwindcss`: ^3.4.0
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.0
- `tailwind-merge`: ^2.5.0

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Arpit Chauhan**

- GitHub: [@AC12arpitChauhan](https://github.com/AC12arpitChauhan)
- LinkedIn: [Arpit Chauhan](https://www.linkedin.com/in/arpit-chauhan)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [ShadCN UI](https://ui.shadcn.com/) - UI Components
- [Aceternity UI](https://ui.aceternity.com/) - Beautiful UI Components
- [Google Gemini](https://ai.google.dev/) - AI Model
- [MongoDB](https://www.mongodb.com/) - Database
- [Resend](https://resend.com/) - Email Service

## 📧 Contact

For any queries or suggestions, feel free to reach out at [your-email@example.com](mailto:your-email@example.com)

---

⭐ If you like this project, please give it a star on GitHub!
