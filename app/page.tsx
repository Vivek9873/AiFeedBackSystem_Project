'use client'

import { useState } from 'react'
import { Headphones, Settings } from 'lucide-react'
import FileUpload from './components/FileUpload'
import AudioPlayer from './components/AudioPlayer'
import EvaluationScores from './components/EvaluationScores'
import FeedbackSection from './components/FeedbackSection'
import styles from './page.module.css'

interface AudioFile {
  file: File
  name: string
  size: string
  duration?: number
}

interface EvaluationScores {
  greeting: number
  collectionUrgency: number
  rebuttalCustomerHandling: number
  callEtiquette: number
  callDisclaimer: number
  correctDisposition: number
  callClosing: number
  fatalIdentification: number
  fatalTapeDiscloser: number
  fatalToneLanguage: number
}

interface CallAnalysisResponse {
  scores: EvaluationScores
  overallFeedback: string
  observation: string
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null)
  const [analysisResult, setAnalysisResult] = useState<CallAnalysisResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (file: AudioFile) => {
    setSelectedFile(file)
    setAnalysisResult(null)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
  }

  const handleProcess = async () => {
    if (!selectedFile) {
      alert('Please select an audio file before processing.')
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', selectedFile.file)

      const response = await fetch('/api/analyze-call', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Analysis failed: ${response.status}`)
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Headphones size={32} className={styles.icon} />
          AI Call Feedback System
        </h1>
        <p className={styles.subtitle}>
          Upload debt collection call recordings for AI-powered analysis and feedback
        </p>
      </div>

      <main className={styles.main}>
        <div className={styles.uploadSection}>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onFileRemove={handleFileRemove}
            disabled={isProcessing}
          />
        </div>

        <div className={styles.playerSection}>
          <AudioPlayer
            audioFile={selectedFile}
            disabled={isProcessing}
          />
        </div>

        <div className={styles.actionSection}>
          <button
            onClick={handleProcess}
            disabled={!selectedFile || isProcessing}
            className={styles.processButton}
          >
            {isProcessing ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Processing...
              </>
            ) : (
              <>
                <Settings size={20} />
                Process Audio
              </>
            )}
          </button>
          
          {isProcessing && (
            <div className={styles.processingMessage}>
              <div className={styles.loadingSpinner}></div>
              Analyzing your call recording...
            </div>
          )}
        </div>

        {analysisResult && (
          <div className={styles.resultsSection}>
            <EvaluationScores scores={analysisResult.scores} />
            <FeedbackSection
              overallFeedback={analysisResult.overallFeedback}
              observation={analysisResult.observation}
            />
          </div>
        )}
      </main>
    </div>
  )
}