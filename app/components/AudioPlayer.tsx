'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import styles from './AudioPlayer.module.css'

interface AudioFile {
  file: File
  name: string
  size: string
  duration?: number
}

interface AudioPlayerProps {
  audioFile: AudioFile | null
  disabled?: boolean
}

export default function AudioPlayer({ audioFile, disabled }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioFile && audioRef.current) {
      const audio = audioRef.current
      audio.src = URL.createObjectURL(audioFile.file)
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        URL.revokeObjectURL(audio.src)
      }
    }
  }, [audioFile])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayPause = () => {
    if (!audioRef.current || !audioFile || disabled) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioFile || disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Audio Player</h2>
      
      <div className={styles.controls}>
        <button
          onClick={togglePlayPause}
          disabled={!audioFile || disabled}
          className={styles.playButton}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
        
        <div className={styles.progressContainer} onClick={handleProgressClick}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <span className={styles.timeDisplay}>{formatTime(duration)}</span>
        
        <div className={styles.volumeContainer}>
          <button className={styles.volumeButton}>
            <Volume2 size={16} />
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            disabled={disabled}
            className={styles.volumeSlider}
          />
        </div>
      </div>
      
      <audio ref={audioRef} preload="metadata" className={styles.hiddenAudio} />
    </div>
  )
}