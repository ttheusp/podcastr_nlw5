import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    isLooping, 
    isShuffling, 
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    handleEpisodeEnded
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) return

    isPlaying 
    ? audioRef.current.play() 
    : audioRef.current.pause()
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex] 

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    
    audioRef.current.addEventListener('timeupdate', e => {
      setProgress(Math.floor(audioRef?.current?.currentTime))
    })
  }

  function handleSeek(amount: number){
    setProgress(amount);
    audioRef.current.currentTime = amount;
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
          <div className={styles.currentEpisode}>
              <Image
                width={592}
                height={592}
                src={episode.thumbnail}
                objectFit="cover"
              />
              <strong>{episode.title}</strong>
              <span>{episode.members}</span>
            </div>
      ) : (
          <div className={styles.emptyPlayer}>
              <strong>Selecione um podcast para ouvir</strong>
            </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{episode ? convertDurationToTimeString(progress) : convertDurationToTimeString(0)}</span>
          <div className={styles.slider}>
            {episode
              ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{ backgroundColor: ' #84d361 ' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#84d361', borderWidth: 4 }}
                />
              )
              : (
                <div className={styles.emptySlider} />
              )
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio 
            src={episode.url} 
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode} 
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar pr??xima" />
          </button>

          <button 
            type="button" 
            disabled={!episode} 
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}