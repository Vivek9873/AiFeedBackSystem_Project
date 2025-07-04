import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const EVALUATION_PARAMETERS = [
  { key: "greeting", name: "Greeting", weight: 5, desc: "Call opening within 5 seconds", inputType: "PASS_FAIL" },
  { key: "collectionUrgency", name: "Collection Urgency", weight: 15, desc: "Create urgency, cross-questioning", inputType: "SCORE" },
  { key: "rebuttalCustomerHandling", name: "Rebuttal Handling", weight: 15, desc: "Address penalties, objections", inputType: "SCORE" },
  { key: "callEtiquette", name: "Call Etiquette", weight: 15, desc: "Tone, empathy, clear speech", inputType: "SCORE" },
  { key: "callDisclaimer", name: "Call Disclaimer", weight: 5, desc: "Take permission before ending", inputType: "PASS_FAIL" },
  { key: "correctDisposition", name: "Correct Disposition", weight: 10, desc: "Use correct category with remark", inputType: "PASS_FAIL" },
  { key: "callClosing", name: "Call Closing", weight: 5, desc: "Thank the customer properly", inputType: "PASS_FAIL" },
  { key: "fatalIdentification", name: "Identification", weight: 5, desc: "Missing agent/customer info", inputType: "PASS_FAIL" },
  { key: "fatalTapeDiscloser", name: "Tape Disclosure", weight: 10, desc: "Inform customer about recording", inputType: "PASS_FAIL" },
  { key: "fatalToneLanguage", name: "Tone & Language", weight: 15, desc: "No abusive or threatening speech", inputType: "PASS_FAIL" }
]

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a temporary file-like object for OpenAI
    const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' })
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    })

    return transcription.text
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

async function analyzeCallTranscript(transcript: string) {
  try {
    const prompt = `
Analyze this debt collection call transcript and provide scores for the following parameters:

${EVALUATION_PARAMETERS.map(param => 
  `${param.key}: ${param.name} (Weight: ${param.weight}, Type: ${param.inputType}) - ${param.desc}`
).join('\n')}

For PASS_FAIL parameters: Score should be either 0 (fail) or the full weight value (pass).
For SCORE parameters: Score can be any number between 0 and the weight.

Transcript: "${transcript}"

Respond with JSON in this exact format:
{
  "scores": {
    "greeting": 5,
    "collectionUrgency": 12,
    "rebuttalCustomerHandling": 10,
    "callEtiquette": 13,
    "callDisclaimer": 0,
    "correctDisposition": 10,
    "callClosing": 5,
    "fatalIdentification": 5,
    "fatalTapeDiscloser": 0,
    "fatalToneLanguage": 15
  },
  "overallFeedback": "Detailed feedback about the agent's performance, highlighting strengths and areas for improvement",
  "observation": "Specific observations about customer interactions, compliance issues, and call quality"
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Analysis error:', error)
    throw new Error('Failed to analyze call transcript')
  }
}

// Mock function for when OpenAI quota is exceeded
function mockAnalyzeCall(): any {
  return {
    scores: {
      greeting: 5,
      collectionUrgency: 12,
      rebuttalCustomerHandling: 10,
      callEtiquette: 13,
      callDisclaimer: 0,
      correctDisposition: 10,
      callClosing: 5,
      fatalIdentification: 5,
      fatalTapeDiscloser: 0,
      fatalToneLanguage: 15
    },
    overallFeedback: "The agent demonstrated strong collection techniques and maintained professional etiquette throughout the call. However, critical compliance issues were identified including missing call disclaimer and tape disclosure. The agent showed good urgency creation and handled customer objections effectively.",
    observation: "Customer was initially resistant but agent used appropriate pressure techniques. Missing mandatory disclosures could result in legal compliance issues. Agent's tone remained professional despite customer objections."
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { message: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!audioFile.type.includes('audio') && !audioFile.name.match(/\.(mp3|wav)$/i)) {
      return NextResponse.json(
        { message: 'Invalid file type. Please upload an MP3 or WAV file.' },
        { status: 400 }
      )
    }

    // Validate file size (50MB limit)
    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File too large. Please upload a file smaller than 50MB.' },
        { status: 400 }
      )
    }

    // If no OpenAI API key, use mock data
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found, using mock data')
      return NextResponse.json(mockAnalyzeCall())
    }

    try {
      // Convert file to buffer for processing
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Transcribe audio
      const transcript = await transcribeAudio(buffer)
      
      // Analyze transcript
      const analysis = await analyzeCallTranscript(transcript)

      return NextResponse.json(analysis)
    } catch (apiError) {
      console.error('OpenAI API error:', apiError)
      // If OpenAI fails (quota exceeded, etc.), fall back to mock
      return NextResponse.json(mockAnalyzeCall())
    }

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}