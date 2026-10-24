import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  MurottalSurah,
  MurottalQari,
  PrayerMurottalConfig,
  MUROTTAL_SURAHS,
  MUROTTAL_QARI_LIST,
  DEFAULT_PRAYER_MUROTTAL_CONFIG
} from '../data/murottalData';

interface ActivePrayerNotification {
  prayerName: string;
  surahName: string;
  latinName: string;
  timestamp: number;
}

interface MurottalContextType {
  currentSurah: MurottalSurah;
  currentQari: MurottalQari;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isLooping: boolean;
  autoNext: boolean;
  config: PrayerMurottalConfig;
  isStudioModalOpen: boolean;
  audioError: string | null;
  activePrayerNotification: ActivePrayerNotification | null;
  playSurah: (surah: MurottalSurah, qariId?: string, prayerName?: string) => void;
  togglePlay: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  toggleAutoNext: () => void;
  setQari: (qariId: string) => void;
  updateConfig: (patch: Partial<PrayerMurottalConfig>) => void;
  triggerPrayerAutoPlay: (prayerName: string) => void;
  setIsStudioModalOpen: (open: boolean) => void;
  playNextSurah: () => void;
  playPrevSurah: () => void;
  dismissPrayerNotification: () => void;
}

const MurottalContext = createContext<MurottalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'abdi_murottal_prayer_config_v1';

export const MurottalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load config from localStorage if present
  const [config, setConfig] = useState<PrayerMurottalConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...DEFAULT_PRAYER_MUROTTAL_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not read murottal config from localStorage', e);
    }
    return DEFAULT_PRAYER_MUROTTAL_CONFIG;
  });

  const [currentSurah, setCurrentSurah] = useState<MurottalSurah>(MUROTTAL_SURAHS[0]);
  const [currentQari, setCurrentQari] = useState<MurottalQari>(() => {
    return MUROTTAL_QARI_LIST.find((q) => q.id === config.selectedQariId) || MUROTTAL_QARI_LIST[0];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(config.volume || 0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [activePrayerNotification, setActivePrayerNotification] = useState<ActivePrayerNotification | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save murottal config to localStorage', e);
    }
  }, [config]);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setAudioError(null);
    };
    const onTimeUpdate = () => {
      if (audio.currentTime) {
        setCurrentTime(audio.currentTime);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError('Koneksi audio murottal dialihkan ke server cadangan.');
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update volume & rate on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isMuted, playbackRate, isLooping]);

  // Play a specific surah
  const playSurah = useCallback((surah: MurottalSurah, qariId?: string, prayerName?: string) => {
    setCurrentSurah(surah);
    setAudioError(null);

    let selectedQ = currentQari;
    if (qariId && qariId !== currentQari.id) {
      const found = MUROTTAL_QARI_LIST.find((q) => q.id === qariId);
      if (found) {
        selectedQ = found;
        setCurrentQari(found);
      }
    }

    if (prayerName) {
      setActivePrayerNotification({
        prayerName,
        surahName: surah.nameArabic,
        latinName: surah.latinName,
        timestamp: Date.now()
      });
    }

    const audioUrl = selectedQ.audioUrlBuilder(surah.number);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.warn('Autoplay may have been blocked or interrupted:', err);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  }, [currentQari]);

  // Next surah in playlist
  const playNextSurah = useCallback(() => {
    const currentIndex = MUROTTAL_SURAHS.findIndex((s) => s.number === currentSurah.number);
    const nextIndex = (currentIndex + 1) % MUROTTAL_SURAHS.length;
    playSurah(MUROTTAL_SURAHS[nextIndex]);
  }, [currentSurah, playSurah]);

  // Prev surah in playlist
  const playPrevSurah = useCallback(() => {
    const currentIndex = MUROTTAL_SURAHS.findIndex((s) => s.number === currentSurah.number);
    const prevIndex = (currentIndex - 1 + MUROTTAL_SURAHS.length) % MUROTTAL_SURAHS.length;
    playSurah(MUROTTAL_SURAHS[prevIndex]);
  }, [currentSurah, playSurah]);

  // Audio 'ended' listener for AutoNext & Looping
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (autoNext) {
        playNextSurah();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [isLooping, autoNext, playNextSurah]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        playSurah(currentSurah);
      } else {
        audioRef.current.play().catch((e) => {
          console.warn('Play error:', e);
          playSurah(currentSurah);
        });
      }
    }
  }, [isPlaying, currentSurah, playSurah]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setConfig((prev) => ({ ...prev, volume: clamped }));
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const toggleAutoNext = useCallback(() => {
    setAutoNext((prev) => !prev);
  }, []);

  const setQari = useCallback((qariId: string) => {
    const found = MUROTTAL_QARI_LIST.find((q) => q.id === qariId);
    if (found) {
      setCurrentQari(found);
      setConfig((prev) => ({ ...prev, selectedQariId: qariId }));
      // If currently playing, smoothly transition to new Qari stream
      if (isPlaying && audioRef.current) {
        const savedTime = audioRef.current.currentTime;
        const newUrl = found.audioUrlBuilder(currentSurah.number);
        audioRef.current.src = newUrl;
        audioRef.current.currentTime = savedTime;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSurah, isPlaying]);

  const updateConfig = useCallback((patch: Partial<PrayerMurottalConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  // Integrated Prayer Auto-Play Trigger
  const triggerPrayerAutoPlay = useCallback((prayerName: string) => {
    // Check if autoplay is globally enabled and enabled for this specific prayer
    const isGlobalActive = config.autoPlayEnabled;
    const isPrayerActive = (config.prayerToggles as any)[prayerName] !== false;

    if (!isGlobalActive || !isPrayerActive) {
      console.log(`Auto-play disabled for ${prayerName}`);
      return;
    }

    // Lookup mapped surah
    const surahNum = (config.prayerMapping as any)[prayerName] || 1;
    const targetSurah = MUROTTAL_SURAHS.find((s) => s.number === surahNum) || MUROTTAL_SURAHS[0];

    playSurah(targetSurah, config.selectedQariId, prayerName);
  }, [config, playSurah]);

  const dismissPrayerNotification = useCallback(() => {
    setActivePrayerNotification(null);
  }, []);

  return (
    <MurottalContext.Provider
      value={{
        currentSurah,
        currentQari,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        isLooping,
        autoNext,
        config,
        isStudioModalOpen,
        audioError,
        activePrayerNotification,
        playSurah,
        togglePlay,
        pauseAudio,
        resumeAudio,
        seek,
        setVolume,
        toggleMute,
        setPlaybackRate,
        toggleLoop,
        toggleAutoNext,
        setQari,
        updateConfig,
        triggerPrayerAutoPlay,
        setIsStudioModalOpen,
        playNextSurah,
        playPrevSurah,
        dismissPrayerNotification
      }}
    >
      {children}
    </MurottalContext.Provider>
  );
};

export const useMurottal = (): MurottalContextType => {
  const context = useContext(MurottalContext);
  if (!context) {
    throw new Error('useMurottal must be used within a MurottalProvider');
  }
  return context;
};
