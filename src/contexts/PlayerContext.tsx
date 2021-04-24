import React, { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    handleEpisodeEnded: () => void;
    setPlayingState: (state: boolean) => void;
};

type PlayerProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export default function PlayerProvider({ children } : PlayerProviderProps)  {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    // episodeList está em ordem decrescente! index -> 0 é o mais recente
    const hasPrevious = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
    const hasNext = isShuffling || currentEpisodeIndex !== 0;

    function playNext() {
        setCurrentEpisodeIndex((prevState) => {
            if (isShuffling) {
                return playShuffle()
            } else if (prevState === 0) {
                 setIsPlaying(false);
                 return;
            }
            return prevState - 1;
        });
    }

    // index -> infinito é o mais antigo
    function playPrevious() {
        setCurrentEpisodeIndex((prevState) => {
            const previousEpisodeIndex = prevState + 1;
            if (isShuffling) {
                return playShuffle();
            } else if (previousEpisodeIndex >= episodeList.length) {
                setIsPlaying(false)
                return
            }
            return previousEpisodeIndex;
        });
    }

    function playShuffle() {
        const nextRandomEpisodeIndex = Math.round(Math.random() * (episodeList.length - 1));
        return nextRandomEpisodeIndex;
    }

    function togglePlay () {
        setIsPlaying((prevState) => (
            prevState ? !prevState : !prevState
        ))
    }

    function toggleLoop () {
        setIsLooping((prevState) => (
            prevState ? !prevState : !prevState
        ))
    }

    function toggleShuffle () {
        setIsShuffling((prevState) => (
            prevState ? !prevState : !prevState
        ))
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state); 
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            return playNext()
        }
        // setEpisodeList([]);
        // setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            isLooping,
            isShuffling,
            hasNext,
            hasPrevious,
            play, 
            playList,
            playNext,
            playPrevious,
            togglePlay, 
            toggleLoop, 
            toggleShuffle, 
            setPlayingState, 
            handleEpisodeEnded,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => (
    useContext(PlayerContext)
);