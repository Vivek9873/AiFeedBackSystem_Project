# AI Call Feedback System

**Frontend Developer Intern Assignment - Pallav Technologies**

## Overview

This is a Next.js single-page application that provides AI-powered analysis of debt collection calls. The system transcribes audio files and evaluates call quality based on 10 specific parameters, providing detailed feedback and scores.

## Features

- **File Upload**: Drag-and-drop interface for .mp3 and .wav files
- **Audio Player**: Built-in player with play/pause, progress tracking, and volume control
- **AI Analysis**: Uses OpenAI Whisper for transcription and GPT-4o for evaluation
- **Scoring System**: Evaluates calls based on 10 parameters (Pass/Fail and Score types)
- **Feedback Display**: Shows overall scores, detailed feedback, and action recommendations
- **Fallback System**: Uses mock data when OpenAI quota is exceeded

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express.js, TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **File Handling**: Multer for multipart uploads
- **AI Services**: OpenAI API (Whisper + GPT-4o)
- **Form Handling**: React Hook Form with Zod validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

## API Endpoint

### POST /api/analyze-call

Accepts an audio file and returns structured analysis:

```json
{
  "scores": {
    "greeting": 5,
    "collectionUrgency": 12,
    "rebuttalCustomerHandling": 13,
    "callEtiquette": 14,
    "callDisclaimer": 0,
    "correctDisposition": 10,
    "callClosing": 5,
    "fatalIdentification": 5,
    "fatalTapeDiscloser": 10,
    "fatalToneLanguage": 15
  },
  "overallFeedback": "Detailed feedback about call quality...",
  "observation": "Specific observations about the call..."
}
```

## Evaluation Parameters

The system evaluates calls based on 10 parameters:

### Pass/Fail Parameters (0 or full weight):
- **Greeting** (5 points): Call opening within 5 seconds
- **Call Disclaimer** (5 points): Take permission before ending
- **Correct Disposition** (10 points): Use correct category with remark
- **Call Closing** (5 points): Thank the customer properly
- **Identification** (5 points): Missing agent/customer info
- **Tape Disclosure** (10 points): Inform customer about recording
- **Tone & Language** (15 points): No abusive or threatening speech

### Score Parameters (0 to weight value):
- **Collection Urgency** (15 points): Create urgency, cross-questioning
- **Rebuttal Handling** (15 points): Address penalties, objections
- **Call Etiquette** (15 points): Tone, empathy, clear speech

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and types
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── services/          # AI services (OpenAI + Mock)
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared schemas and types
└── uploads/               # Temporary file storage
```

## Key Components

- **FileUpload**: Drag-and-drop file upload with validation
- **AudioPlayer**: Custom audio player with full controls
- **EvaluationScores**: Visual display of scoring results
- **FeedbackSection**: Detailed feedback and recommendations

## Deployment

The application is ready for deployment on Vercel or similar platforms. Make sure to:

1. Set environment variables in your deployment platform
2. Configure build settings for full-stack deployment
3. Ensure proper file upload handling in production

## Environment Variables

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for transcription and analysis
- `NODE_ENV`: Set to 'production' for production builds

## Assignment Completion

✅ Next.js single-page application
✅ File upload with drag-and-drop
✅ Audio player with play/pause controls
✅ AI analysis pipeline with OpenAI integration
✅ Structured JSON response from /api/analyze-call
✅ All 10 evaluation parameters implemented
✅ Responsive design with clean UI
✅ TypeScript throughout
✅ Error handling and fallback system

---

**Developed for Pallav Technologies Frontend Developer Intern Assignment**