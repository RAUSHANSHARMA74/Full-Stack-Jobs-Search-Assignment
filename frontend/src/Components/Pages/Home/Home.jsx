import React, { useEffect, useRef } from 'react';
import "./Home.css"

export default function Home() {
    const videoRef = useRef(null);

    useEffect(() => {

        const videoElement = videoRef.current;

        const handleVideoEnd = () => {
            videoElement.currentTime = 0;
            videoElement.play();
        };

        if (videoElement) {
            videoElement.addEventListener('ended', handleVideoEnd);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, []);
    return (
        <div className="container">
            <header className="header">
                <h1>
                    Welcome to our website
                </h1>
            </header>

            <section className="video-section">
                <video
                    ref={videoRef}
                    src="/home_video.mp4"
                    autoPlay
                    muted
                    playsInline
                    className="video"
                    aria-hidden="true"
                >
                    Your browser does not support the video tag.
                </video>
            </section>


        </div>

    )
}
