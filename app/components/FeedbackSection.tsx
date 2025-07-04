'use client'

import { MessageCircle, Eye, CheckSquare } from 'lucide-react'
import styles from './FeedbackSection.module.css'

interface FeedbackSectionProps {
  overallFeedback: string
  observation: string
}

export default function FeedbackSection({ overallFeedback, observation }: FeedbackSectionProps) {
  const getRecommendedActions = (): string[] => {
    const actions: string[] = []
    
    if (overallFeedback.toLowerCase().includes('disclaimer')) {
      actions.push('Critical: Always seek permission before ending the call')
    }
    
    if (observation.toLowerCase().includes('tape disclosure')) {
      actions.push('Critical: Ensure tape disclosure is provided at the beginning of every call')
    }
    
    if (overallFeedback.toLowerCase().includes('urgency')) {
      actions.push('Improvement: Develop stronger cross-questioning techniques to create urgency')
    }
    
    if (actions.length === 0) {
      actions.push('Continue maintaining current performance standards')
    }
    
    return actions
  }

  const actions = getRecommendedActions()

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Feedback & Observations</h2>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <MessageCircle className={styles.feedbackIcon} size={20} />
          Overall Feedback
        </h3>
        <div className={styles.sectionContent}>
          <p className={styles.feedbackText}>
            {overallFeedback}
          </p>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Eye className={styles.observationIcon} size={20} />
          Observations
        </h3>
        <div className={styles.sectionContent}>
          <p className={styles.observationText}>
            {observation}
          </p>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <CheckSquare className={styles.feedbackIcon} size={20} />
          Recommended Actions
        </h3>
        <div className={styles.sectionContent}>
          <ul className={styles.recommendationList}>
            {actions.map((action, index) => (
              <li key={index} className={styles.recommendationItem}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}