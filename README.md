# AI Sales Reply Generator

A production-ready AI SaaS tool built to help sales teams instantly generate professional, context-aware email replies to customer inquiries using the Gemini 2.5 Flash AI model.

## Features

- **Instant AI Replies**: Generate polite, concise, and professional email replies under 120 words.
- **Tone Customization**: Select from multiple response tones (Professional, Friendly, Formal, Short).
- **Intent Recognition**: AI automatically parses and displays the core "Customer Intent" from the incoming message.
- **Direct Email Sending**: Built-in Nodemailer integration allows sending the generated reply directly to the customer's email address from the browser.
- **Copy to Clipboard**: One-click copying of the generated subject and body.
- **Modern UI**: Clean, responsive, glassmorphism interface built with shadcn/ui and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix Primitives)
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (`@google/genai`) - Gemini 2.5 Flash
- **Email Delivery**: Nodemailer (via Gmail SMTP)

## Project Structure

```
ai-sales-reply-generator/
├── app/
│   ├── api/
│   │   ├── generate-reply/
│   │   │   └── route.ts       # Handles Gemini AI prompt generation
│   │   └── send-email/
│   │       └── route.ts       # Handles Nodemailer SMTP dispatch
│   ├── globals.css            # Tailwind & shadcn UI Theme config (oklch)
│   ├── layout.tsx             # Root layout with Inter font & SEO metadata
│   └── page.tsx               # Main UI Dashboard
├── components/
│   ├── email-form.tsx         # User input form (Email, Message, Tone)
│   ├── reply-output.tsx       # AI result display (Intent, Subject, Reply, Send/Copy actions)
│   └── ui/                    # Reusable shadcn/ui components (Card, Button, Select, etc)
├── lib/
│   └── utils.ts               # Tailwind class merge utility
└── .env.local                 # Environment variables (API keys & SMTP credentials)
```

## Getting Started

### 1. Requirements
- Node.js (v18.17+ recommended)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- A Gmail account with an App Password for SMTP sending

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail SMTP Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

*Note on `EMAIL_PASS`: For Gmail, you must use an "App Password". Go to your Google Account > Security > 2-Step Verification > App Passwords to generate a 16-character code.*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Guide
1. **Enter Customer Details**: Type in the customer's email address and paste their message into the text area.
2. **Select Tone**: Choose how you want to sound (e.g., Professional or Friendly).
3. **Generate**: Click the "Generate Reply" button.
4. **Review**: The AI will output the detected customer intent, a subject line, and the email body.
5. **Action**: Click "Send to Customer" to dispatch the email immediately via SMTP, or "Copy Reply" to paste it into your own email client.
