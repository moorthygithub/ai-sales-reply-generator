# AI Sales Reply Generator

An AI-powered sales email assistant built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Connect your Gmail account to fetch real customer emails, then let Google Gemini AI craft professional sales replies in seconds.

---

## ✨ Features

- 📥 **Gmail Integration** — Authenticate with Google OAuth2 and fetch your latest 5 unread emails directly in the app
- 🤖 **Gemini AI Replies** — Powered by `gemini-2.5-flash` to generate Customer Intent, Subject Line, and Email Body
- 📨 **Send via Nodemailer** — Send the AI-generated reply directly to the customer from within the app
- 🎨 **3-Panel Layout** — Gmail Inbox | Input Form | AI Output — fully responsive
- 🔒 **Secure Auth** — OAuth2 tokens stored in HTTP-only cookies (never exposed to the client)
- 🎛️ **Tone Selector** — Choose between Professional, Friendly, Formal, or Short reply styles

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Card, Button, ScrollArea, Separator, Select, Textarea) |
| AI | Google Gemini (`@google/genai`) |
| Gmail | Google APIs Node.js client (`googleapis`) |
| Email Sending | Nodemailer + Gmail SMTP |
| Auth | Google OAuth2 (HTTP-only cookie session) |

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                          # Main 3-panel UI
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── generate-reply/route.ts       # Gemini AI reply generation
│       ├── send-email/route.ts           # Nodemailer email sender
│       ├── gmail/
│       │   └── messages/route.ts         # Fetch unread Gmail messages
│       └── auth/google/
│           ├── login/route.ts            # Redirect → Google OAuth consent
│           └── callback/route.ts         # Handle OAuth callback + set cookies
├── components/
│   ├── gmail-inbox.tsx                   # Left panel: Gmail inbox list
│   ├── email-form.tsx                    # Center panel: Input form
│   ├── reply-output.tsx                  # Right panel: AI reply output
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── google-auth.ts                    # OAuth2 client factory
│   └── utils.ts
└── .env.local                            # Environment variables
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/moorthygithub/ai-sales-reply-generator.git
cd ai-sales-reply-generator
npm install
```

### 2. Configure Environment Variables

Copy the template and fill in your values:

```bash
# .env.local

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Gmail SMTP (Nodemailer)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth2 — Gmail API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the **Gmail API**
3. Navigate to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized Redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy the **Client ID** and **Client Secret** into `.env.local`

### 4. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a free API key and add it as `GEMINI_API_KEY`

### 5. Set Up Gmail App Password (for Nodemailer)

1. Enable **2-Factor Authentication** on your Google account
2. Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a password for "Mail" and add it as `EMAIL_PASS`

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 User Flow

```
1. Click "Connect Gmail" → Google OAuth consent screen
2. Authorize → redirected back to the app
3. Gmail inbox loads (up to 5 unread emails)
4. Click any email → Customer Email + Message auto-fill
5. Choose a reply tone → click "Generate Reply"
6. AI generates: Customer Intent + Subject + Email Body
7. Click "Send to Customer" to send via Nodemailer
   — or —
   Click "Copy Reply" to copy to clipboard
```

---

## 🛣️ API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/google/login` | GET | Redirects to Google OAuth consent |
| `/api/auth/google/callback` | GET | Handles OAuth code, sets secure cookies |
| `/api/gmail/messages` | GET | Returns latest 5 unread Gmail messages |
| `/api/generate-reply` | POST | Generates AI reply via Gemini |
| `/api/send-email` | POST | Sends email via Nodemailer/Gmail SMTP |

---

## 🔒 Security

- OAuth2 access and refresh tokens are stored in **HTTP-only, SameSite=Lax cookies** — inaccessible to JavaScript
- Tokens are automatically refreshed when expired
- All API routes validate credentials before processing
- `.env.local` is git-ignored by default

---

## 🌿 Git Branches

| Branch | Purpose |
|---|---|
| `main` | Stable production branch |
| `ui-update` | UI improvements |
| `feature/gmail-oauth-integration` | Gmail OAuth2 integration (current) |

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@google/genai": "^1.45.0",
    "googleapis": "latest",
    "nodemailer": "^8.0.2",
    "next": "16.1.6",
    "react": "19.2.3",
    "@radix-ui/react-scroll-area": "latest",
    "lucide-react": "^0.577.0",
    "tailwind-merge": "^3.5.0",
    "class-variance-authority": "^0.7.1"
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify.

---

*Built with ❤️ using Next.js · Powered by Gemini AI · Gmail API*
