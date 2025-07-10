'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Headphones, Waves, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioScene {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  sounds: {
    name: string;
    url: string;
    volume: number;
    loop: boolean;
    spatial?: { x: number; y: number; z: number };
  }[];
}

const audioScenes: AudioScene[] = [
  {
    id: 'coffee-shop',
    name: 'Busy Coffee Shop',
    description: 'The ambient sounds of a bustling coffee shop',
    icon: Music,
    sounds: [
      { name: 'espresso-machine', url: '/audio/espresso-machine.mp3', volume: 0.7, loop: true, spatial: { x: -2, y: 0, z: 1 } },
      { name: 'coffee-grinder', url: '/audio/coffee-grinder.mp3', volume: 0.5, loop: false, spatial: { x: 1, y: 0, z: 2 } },
      { name: 'ambient-chatter', url: '/audio/ambient-chatter.mp3', volume: 0.4, loop: true, spatial: { x: 0, y: 0, z: -1 } },
      { name: 'cup-clinks', url: '/audio/cup-clinks.mp3', volume: 0.3, loop: true, spatial: { x: 2, y: 0, z: 0 } }
    ]
  },
  {
    id: 'brewing-process',
    name: 'Coffee Brewing',
    description: 'The detailed sounds of coffee being brewed',
    icon: Waves,
    sounds: [
      { name: 'water-boiling', url: '/audio/water-boiling.mp3', volume: 0.8, loop: true },
      { name: 'pour-over', url: '/audio/pour-over.mp3', volume: 0.6, loop: false },
      { name: 'coffee-drip', url: '/audio/coffee-drip.mp3', volume: 0.5, loop: true },
      { name: 'steam-hiss', url: '/audio/steam-hiss.mp3', volume: 0.4, loop: true }
    ]
  },
  {
    id: 'morning-cafe',
    name: 'Morning Café',
    description: 'Peaceful morning atmosphere with gentle sounds',
    icon: Headphones,
    sounds: [
      { name: 'morning-birds', url: '/audio/morning-birds.mp3', volume: 0.3, loop: true },
      { name: 'gentle-brewing', url: '/audio/gentle-brewing.mp3', volume: 0.6, loop: true },
      { name: 'page-turning', url: '/audio/page-turning.mp3', volume: 0.2, loop: true },
      { name: 'soft-jazz', url: '/audio/soft-jazz.mp3', volume: 0.4, loop: true }
    ]
  }
];

export function ImmersiveAudioExperience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [masterVolume, setMasterVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [spatialEnabled, setSpatialEnabled] = useState(true);
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({});
  
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({});
  const gainNodesRef = useRef<{ [key: string]: GainNode }>({});
  const pannerNodesRef = useRef<{ [key: string]: PannerNode }>({});
  const sourceNodesRef = useRef<{ [key: string]: MediaElementAudioSourceNode }>({});

  // Initialize Web Audio API
  useEffect(() => {
    const initAudioContext = () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        // Initialize sound volumes
        const initialVolumes: { [key: string]: number } = {};
        audioScenes.forEach(scene => {
          scene.sounds.forEach(sound => {
            initialVolumes[sound.name] = sound.volume * 100;
          });
        });
        setSoundVolumes(initialVolumes);
      } catch (error) {
        console.error('Web Audio API not supported:', error);
      }
    };

    initAudioContext();
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Create audio elements and nodes
  useEffect(() => {
    if (!audioContext) return;

    const scene = audioScenes[currentScene];
    
    // Clean up previous audio elements
    Object.values(audioElementsRef.current).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    
    // Create new audio elements for current scene
    scene.sounds.forEach(sound => {
      // Create audio element (using data URLs for demo since we don't have actual audio files)
      const audio = new Audio();
      audio.loop = sound.loop;
      audio.volume = 0; // Will be controlled by gain node
      
      // Create a simple tone for demonstration
      audio.src = createToneDataURL(sound.name);
      
      audioElementsRef.current[sound.name] = audio;
      
      // Create Web Audio nodes
      const source = audioContext.createMediaElementSource(audio);
      const gainNode = audioContext.createGain();
      
      sourceNodesRef.current[sound.name] = source;
      gainNodesRef.current[sound.name] = gainNode;
      
      // Create spatial audio if enabled and position is specified
      if (spatialEnabled && sound.spatial) {
        const pannerNode = audioContext.createPanner();
        pannerNode.panningModel = 'HRTF';
        pannerNode.distanceModel = 'inverse';
        pannerNode.refDistance = 1;
        pannerNode.maxDistance = 10;
        pannerNode.rolloffFactor = 1;
        pannerNode.coneInnerAngle = 360;
        pannerNode.coneOuterAngle = 0;
        pannerNode.coneOuterGain = 0;
        
        pannerNode.positionX.setValueAtTime(sound.spatial.x, audioContext.currentTime);
        pannerNode.positionY.setValueAtTime(sound.spatial.y, audioContext.currentTime);
        pannerNode.positionZ.setValueAtTime(sound.spatial.z, audioContext.currentTime);
        
        pannerNodesRef.current[sound.name] = pannerNode;
        
        source.connect(gainNode);
        gainNode.connect(pannerNode);
        pannerNode.connect(audioContext.destination);
      } else {
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
      }
      
      // Set initial volume
      const volume = (soundVolumes[sound.name] || sound.volume * 100) / 100;
      gainNode.gain.setValueAtTime(volume * (masterVolume[0] / 100), audioContext.currentTime);
    });
  }, [currentScene, audioContext, spatialEnabled, soundVolumes, masterVolume]);

  // Create tone data URL for demonstration (since we don't have actual audio files)
  const createToneDataURL = (soundName: string): string => {
    // Create different tones for different sounds
    const frequencies: { [key: string]: number } = {
      'espresso-machine': 200,
      'coffee-grinder': 150,
      'ambient-chatter': 100,
      'cup-clinks': 800,
      'water-boiling': 300,
      'pour-over': 400,
      'coffee-drip': 600,
      'steam-hiss': 1000,
      'morning-birds': 2000,
      'gentle-brewing': 250,
      'page-turning': 500,
      'soft-jazz': 440
    };
    
    const frequency = frequencies[soundName] || 440;
    const duration = 2; // 2 seconds
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate tone
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const togglePlayPause = async () => {
    if (!audioContext) return;
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    const scene = audioScenes[currentScene];
    
    if (isPlaying) {
      // Pause all sounds
      scene.sounds.forEach(sound => {
        const audio = audioElementsRef.current[sound.name];
        if (audio) {
          audio.pause();
        }
      });
      setIsPlaying(false);
    } else {
      // Play all sounds
      scene.sounds.forEach(sound => {
        const audio = audioElementsRef.current[sound.name];
        if (audio) {
          audio.play().catch(console.error);
        }
      });
      setIsPlaying(true);
    }
  };

  const changeScene = (direction: 'next' | 'prev') => {
    setIsPlaying(false);
    
    if (direction === 'next') {
      setCurrentScene((prev) => (prev + 1) % audioScenes.length);
    } else {
      setCurrentScene((prev) => (prev - 1 + audioScenes.length) % audioScenes.length);
    }
  };

  const updateMasterVolume = (volume: number[]) => {
    setMasterVolume(volume);
    
    if (!audioContext) return;
    
    const scene = audioScenes[currentScene];
    scene.sounds.forEach(sound => {
      const gainNode = gainNodesRef.current[sound.name];
      if (gainNode) {
        const soundVolume = (soundVolumes[sound.name] || sound.volume * 100) / 100;
        gainNode.gain.setValueAtTime(
          soundVolume * (volume[0] / 100) * (isMuted ? 0 : 1),
          audioContext.currentTime
        );
      }
    });
  };

  const updateSoundVolume = (soundName: string, volume: number[]) => {
    setSoundVolumes(prev => ({ ...prev, [soundName]: volume[0] }));
    
    if (!audioContext) return;
    
    const gainNode = gainNodesRef.current[soundName];
    if (gainNode) {
      gainNode.gain.setValueAtTime(
        (volume[0] / 100) * (masterVolume[0] / 100) * (isMuted ? 0 : 1),
        audioContext.currentTime
      );
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (!audioContext) return;
    
    const scene = audioScenes[currentScene];
    scene.sounds.forEach(sound => {
      const gainNode = gainNodesRef.current[sound.name];
      if (gainNode) {
        const soundVolume = (soundVolumes[sound.name] || sound.volume * 100) / 100;
        gainNode.gain.setValueAtTime(
          soundVolume * (masterVolume[0] / 100) * (isMuted ? 1 : 0),
          audioContext.currentTime
        );
      }
    });
  };

  const currentSceneData = audioScenes[currentScene];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-coffee-brown mb-2 font-playfair">
          Immersive Audio Experience
        </h2>
        <p className="text-coffee-dark">
          3D spatial audio that brings the coffee shop experience to life
        </p>
      </div>

      {/* Main Player */}
      <div className="bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream p-8 rounded-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <currentSceneData.icon className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-2xl font-bold font-playfair">{currentSceneData.name}</h3>
              <p className="opacity-80">{currentSceneData.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="icon"
              className="text-cream hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
            
            <div className="w-32">
              <Slider
                value={masterVolume}
                onValueChange={updateMasterVolume}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <Button
            onClick={() => changeScene('prev')}
            variant="ghost"
            size="icon"
            className="text-cream hover:bg-white/20"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <motion.button
            onClick={togglePlayPause}
            className="bg-gold text-coffee-brown rounded-full p-4 hover:bg-gold-dark transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </motion.button>
          
          <Button
            onClick={() => changeScene('next')}
            variant="ghost"
            size="icon"
            className="text-cream hover:bg-white/20"
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        {/* Scene Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {audioScenes.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentScene ? 'bg-gold' : 'bg-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Individual Sound Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
            Sound Layers
          </h3>
          
          <div className="space-y-4">
            {currentSceneData.sounds.map((sound, index) => (
              <motion.div
                key={sound.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-coffee-brown/5 rounded-lg"
              >
                <div className="flex items-center">
                  <Waves className="h-5 w-5 text-coffee-brown mr-3" />
                  <div>
                    <div className="font-medium text-coffee-brown capitalize">
                      {sound.name.replace('-', ' ')}
                    </div>
                    {sound.spatial && (
                      <div className="text-xs text-coffee-dark/60">
                        3D Position: ({sound.spatial.x}, {sound.spatial.y}, {sound.spatial.z})
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-24">
                  <Slider
                    value={[soundVolumes[sound.name] || sound.volume * 100]}
                    onValueChange={(value) => updateSoundVolume(sound.name, value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
            Audio Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-coffee-brown">3D Spatial Audio</span>
              <Button
                onClick={() => setSpatialEnabled(!spatialEnabled)}
                variant={spatialEnabled ? "default" : "outline"}
                size="sm"
                className={spatialEnabled ? "bg-coffee-brown text-cream" : ""}
              >
                {spatialEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="p-3 bg-coffee-brown/5 rounded-lg">
              <div className="text-sm text-coffee-dark">
                <strong>Master Volume:</strong> {masterVolume[0]}%
              </div>
              <div className="text-sm text-coffee-dark">
                <strong>Status:</strong> {isPlaying ? 'Playing' : 'Paused'}
              </div>
              <div className="text-sm text-coffee-dark">
                <strong>Scene:</strong> {currentSceneData.name}
              </div>
            </div>
            
            <div className="text-xs text-coffee-dark/60">
              <p>• Use headphones for the best 3D audio experience</p>
              <p>• Spatial audio simulates realistic coffee shop acoustics</p>
              <p>• Each sound layer can be individually controlled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Selection */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
          Audio Scenes
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {audioScenes.map((scene, index) => (
            <motion.button
              key={scene.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentScene(index);
              }}
              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                currentScene === index
                  ? 'bg-coffee-brown text-cream'
                  : 'bg-coffee-brown/5 hover:bg-coffee-brown/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <scene.icon className={`h-6 w-6 mb-2 ${
                currentScene === index ? 'text-gold' : 'text-coffee-brown'
              }`} />
              <h4 className="font-semibold mb-1">{scene.name}</h4>
              <p className={`text-sm ${
                currentScene === index ? 'text-cream/80' : 'text-coffee-dark'
              }`}>
                {scene.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}