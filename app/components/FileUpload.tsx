'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'
import styles from './FileUpload.module.css'

interface AudioFile {
  file: File
  name: string
  size: string
  duration?: number
}

interface FileUploadProps {
  onFileSelect: (file: AudioFile) => void
  selectedFile: AudioFile | null
  onFileRemove: () => void
  disabled?: boolean
}

export default function FileUpload({ onFileSelect, selectedFile, onFileRemove, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFile = useCallback((file: File) => {
    if (file.type.includes('audio') || file.name.match(/\.(mp3|wav)$/i)) {
      const audioFile: AudioFile = {
        file,
        name: file.name,
        size: formatFileSize(file.size),
      }
      onFileSelect(audioFile)
    } else {
      alert('Please select a valid audio file (.mp3 or .wav)')
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile, disabled])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleClick = useCallback(() => {
    if (!disabled) {
      document.getElementById('file-input')?.click()
    }
  }, [disabled])

  return (
    <div className={styles.container}>
      <h2 className={styles.uploadText}>Upload Call Recording</h2>
      
      {!selectedFile ? (
        <div
          className={`${styles.card} ${isDragOver ? styles.dragOver : ''} ${disabled ? styles.disabled : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            Drop your audio file here or click to browse
          </p>
          <p className={styles.uploadSubtext}>
            Supports .mp3 and .wav files
          </p>
          <button className={styles.browseButton} disabled={disabled}>
            <Upload size={16} />
            Browse Files
          </button>
          <input
            id="file-input"
            type="file"
            accept=".mp3,.wav,audio/*"
            onChange={handleFileInputChange}
            className={styles.hiddenInput}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className={styles.fileInfo}>
          <div className={styles.fileDetails}>
            <FileAudio className={styles.fileIcon} />
            <div>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <p className={styles.fileSize}>{selectedFile.size}</p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className={styles.removeButton}
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}