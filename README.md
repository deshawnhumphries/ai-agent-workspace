# AI Agent Workspace

AI Agent Workspace is a modern AI-native full-stack application that demonstrates how to build production-ready AI software using Next.js, TypeScript, Supabase, and the OpenAI API.

Version 0.1 establishes the core platform with secure authentication, real-time AI chat, streaming responses, and persistent conversation history.

## Features

* Secure authentication with Supabase
* Protected application routes
* Responsive dashboard
* Streaming AI chat powered by OpenAI
* Persistent conversation history
* Conversation management (create, load, search, rename, and delete)
* Modern, responsive UI

## Tech Stack

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase (Authentication & PostgreSQL)
* OpenAI API
* Vercel AI SDK
* Vercel

## Getting Started

### Prerequisites

* Node.js 20+
* npm
* Supabase project
* OpenAI API key

### Installation

```bash
git clone <repository-url>
cd ai-agent-workspace
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Roadmap

* **v0.2** — AI Agent System
* **v0.3** — Document Intelligence (RAG)
* **v0.4** — Memory & Personalization
* **v0.5** — Project Workspaces
* **v0.6** — Multi-Agent Workflows
* **v1.0** — AI Operating System

## License

This project is provided as a portfolio project. No license has been granted unless otherwise specified.
