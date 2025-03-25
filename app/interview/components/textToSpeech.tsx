import React, { useState, useEffect } from "react";

interface TextToSpeechProps {
    text: string;
    autoSpeak?: boolean;
    onSpeechEnd?: () => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, autoSpeak = false, onSpeechEnd }) => {
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(text);
        u.pitch = 1;
        u.rate = 1.1;
        u.volume = 1;

        u.onend = () => {
            if (onSpeechEnd) {
                onSpeechEnd();
            }
        };

        setUtterance(u);

        if (autoSpeak) {
            synth.speak(u);
        }

        return () => {
            synth.cancel();
        };
    }, [text, autoSpeak, onSpeechEnd]);

    const handleSpeak = () => {
        if (utterance) {
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <>
            {!autoSpeak && <button onClick={handleSpeak}>Speak</button>}
        </>
    );
};

export default TextToSpeech;