import React, { useState, useEffect, useRef, useMemo } from "react";

const TypingEffect = ({
    text,
    speed = 40,
    className = "",
    showCursor = true,
    cursorChar = "|",
    cursorClassName = "",
    startDelay = 0,
    onComplete = null,
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const indexRef = useRef(0);
    const timeoutRef = useRef(null);
    const isInitialized = useRef(false);

    // Memoize text untuk menghindari re-render
    const memoizedText = useMemo(() => text || "", [text]);

    useEffect(() => {
        // Reset jika text kosong
        if (!memoizedText) {
            setDisplayedText("");
            setIsComplete(false);
            indexRef.current = 0;
            isInitialized.current = false;
            return;
        }

        // Clear timeout sebelumnya
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Fungsi typing
        const typeCharacter = () => {
            if (indexRef.current < memoizedText.length) {
                setDisplayedText(memoizedText.substring(0, indexRef.current + 1));
                indexRef.current += 1;
                timeoutRef.current = setTimeout(typeCharacter, speed);
            } else {
                setIsComplete(true);
                if (onComplete) {
                    onComplete();
                }
            }
        };

        // Mulai typing hanya sekali
        if (!isInitialized.current) {
            isInitialized.current = true;
            
            if (startDelay > 0) {
                timeoutRef.current = setTimeout(typeCharacter, startDelay);
            } else {
                // Langsung mulai tanpa delay
                requestAnimationFrame(typeCharacter);
            }
        }

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [memoizedText, speed, startDelay, onComplete]);

    return (
        <span className={`inline-flex items-center ${className}`}>
            <span dangerouslySetInnerHTML={{ __html: displayedText }} />
            {showCursor && !isComplete && (
                <span 
                    className={cursorClassName || "ml-0.5 font-bold animate-pulse"}
                    style={{
                        animation: cursorClassName ? undefined : 'blink 1s step-end infinite'
                    }}
                >
                    {cursorChar}
                </span>
            )}
            <style jsx>{`
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `}</style>
        </span>
    );
};

// Component dengan efek delete & loop
export const TypingEffectLoop = ({
    text,
    speed = 40,
    deleteSpeed = 30,
    pauseAfterComplete = 2000,
    className = "",
    showCursor = true,
    cursorChar = "|",
    cursorClassName = "",
    loop = true,
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const indexRef = useRef(0);
    const timeoutRef = useRef(null);

    const memoizedText = useMemo(() => text || "", [text]);

    useEffect(() => {
        if (!memoizedText) return;

        const type = () => {
            if (!isDeleting) {
                if (indexRef.current < memoizedText.length) {
                    setDisplayedText(
                        memoizedText.substring(0, indexRef.current + 1)
                    );
                    indexRef.current += 1;
                    timeoutRef.current = setTimeout(type, speed);
                } else if (loop) {
                    timeoutRef.current = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseAfterComplete);
                }
            } else {
                if (indexRef.current > 0) {
                    indexRef.current -= 1;
                    setDisplayedText(
                        memoizedText.substring(0, indexRef.current)
                    );
                    timeoutRef.current = setTimeout(type, deleteSpeed);
                } else {
                    setIsDeleting(false);
                }
            }
        };

        type();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [memoizedText, speed, deleteSpeed, isDeleting, loop, pauseAfterComplete]);

    return (
        <span className={`inline-flex items-center ${className}`}>
            <span dangerouslySetInnerHTML={{ __html: displayedText }} />
            {showCursor && (
                <span 
                    className={cursorClassName || "ml-0.5 font-bold"}
                    style={{
                        animation: 'blink 1s step-end infinite'
                    }}
                >
                    {cursorChar}
                </span>
            )}
            <style jsx>{`
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `}</style>
        </span>
    );
};

// Component untuk rotate multiple texts
export const TypingEffectRotate = ({
    texts = [],
    speed = 40,
    deleteSpeed = 30,
    pauseAfterComplete = 2000,
    className = "",
    showCursor = true,
    cursorChar = "|",
    cursorClassName = "",
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const charIndexRef = useRef(0);
    const timeoutRef = useRef(null);

    const currentText = useMemo(
        () => texts[currentIndex] || "",
        [texts, currentIndex]
    );

    useEffect(() => {
        if (!texts.length) return;

        const type = () => {
            if (!isDeleting) {
                if (charIndexRef.current < currentText.length) {
                    setDisplayedText(
                        currentText.substring(0, charIndexRef.current + 1)
                    );
                    charIndexRef.current += 1;
                    timeoutRef.current = setTimeout(type, speed);
                } else {
                    timeoutRef.current = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseAfterComplete);
                }
            } else {
                if (charIndexRef.current > 0) {
                    charIndexRef.current -= 1;
                    setDisplayedText(
                        currentText.substring(0, charIndexRef.current)
                    );
                    timeoutRef.current = setTimeout(type, deleteSpeed);
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        };

        type();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentText, isDeleting, speed, deleteSpeed, pauseAfterComplete, texts]);

    return (
        <span className={`inline-flex items-center ${className}`}>
            <span dangerouslySetInnerHTML={{ __html: displayedText }} />
            {showCursor && (
                <span 
                    className={cursorClassName || "ml-0.5 font-bold"}
                    style={{
                        animation: 'blink 1s step-end infinite'
                    }}
                >
                    {cursorChar}
                </span>
            )}
            <style jsx>{`
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `}</style>
        </span>
    );
};

export default TypingEffect;