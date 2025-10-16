import { useState, useEffect, useRef } from 'react';

export const useWakeWord = (
  wakeWord: string,
  onWakeWordDetected: () => void
) => {
  const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      console.log('Wake word detection heard:', transcript);

      if (transcript.includes(wakeWord.toLowerCase())) {
        console.log('Wake word detected!');
        onWakeWordDetected();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Wake word recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        if (isListeningForWakeWord) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 1000);
        }
      }
    };

    recognition.onend = () => {
      console.log('Wake word recognition ended, restarting...');
      if (isListeningForWakeWord) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [wakeWord, onWakeWordDetected, isListeningForWakeWord]);

  const startListeningForWakeWord = () => {
    console.log('Starting wake word detection...');
    setIsListeningForWakeWord(true);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.log('Wake word recognition already started');
    }
  };

  const stopListeningForWakeWord = () => {
    console.log('Stopping wake word detection...');
    setIsListeningForWakeWord(false);
    recognitionRef.current?.stop();
  };

  return {
    isListeningForWakeWord,
    startListeningForWakeWord,
    stopListeningForWakeWord,
  };
};
