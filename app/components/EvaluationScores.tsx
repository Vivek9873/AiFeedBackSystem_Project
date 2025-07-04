'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import styles from './EvaluationScores.module.css'

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

interface EvaluationScoresProps {
  scores: EvaluationScores
}

export default function EvaluationScores({ scores }: EvaluationScoresProps) {
  const calculateTotalScore = (): { total: number; max: number } => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const max = EVALUATION_PARAMETERS.reduce((sum, param) => sum + param.weight, 0)
    return { total, max }
  }

  const { total, max } = calculateTotalScore()
  const overallPercentage = (total / max) * 100

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Evaluation Scores</h2>
      
      <div className={styles.overallScore}>
        <div className={styles.overallScoreValue}>
          {total}/{max}
        </div>
        <div className={styles.overallScoreLabel}>
          Overall Score ({overallPercentage.toFixed(1)}%)
        </div>
      </div>
      
      <div className={styles.parameterGrid}>
        {EVALUATION_PARAMETERS.map((param) => {
          const score = scores[param.key as keyof EvaluationScores]
          
          return (
            <div key={param.key} className={styles.parameterItem}>
              <div className={styles.parameterHeader}>
                <h3 className={styles.parameterName}>{param.name}</h3>
                <span className={`${styles.parameterScore} ${param.inputType === 'PASS_FAIL' ? (score > 0 ? styles.pass : styles.fail) : styles.score}`}>
                  {param.inputType === 'PASS_FAIL' ? (score > 0 ? 'PASS' : 'FAIL') : `${score}/${param.weight}`}
                </span>
              </div>
              <p className={styles.parameterDescription}>{param.desc}</p>
              
              {param.inputType === 'PASS_FAIL' ? (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  {score > 0 ? (
                    <>
                      <CheckCircle size={16} style={{ color: '#10b981', marginRight: '6px' }} />
                      <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>PASS</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} style={{ color: '#ef4444', marginRight: '6px' }} />
                      <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>FAIL</span>
                    </>
                  )}
                </div>
              ) : (
                <div className={styles.progressBarContainer}>
                  <div
                    className={`${styles.progressBar} ${overallPercentage >= 80 ? styles.excellent : overallPercentage >= 60 ? styles.good : styles.poor}`}
                    style={{ width: `${(score / param.weight) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}