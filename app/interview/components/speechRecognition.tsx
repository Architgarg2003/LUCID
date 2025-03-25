
import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface DictaphoneProps {
    onTranscriptUpdate: (transcript: string) => void;
    isListening: boolean;
}

const Dictaphone: React.FC<DictaphoneProps> = ({ onTranscriptUpdate, isListening }) => {
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (isListening) {
            SpeechRecognition.startListening({ continuous: true });
            resetTranscript();
        } else {
            SpeechRecognition.stopListening();
        }

        return () => {
            SpeechRecognition.stopListening();
        };
    }, [isListening]);

    useEffect(() => {
        onTranscriptUpdate(transcript);
    }, [transcript, onTranscriptUpdate]);

    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div>
            <p>Microphone: {isListening ? 'on' : 'off'}</p>
            <p>Current transcript: {transcript}</p>
        </div>
    );
};

export default Dictaphone;