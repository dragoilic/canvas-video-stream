import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import { APPID, TOKEN, ROLE } from '../data/constant';

const StreamContent = () => {
    const [count, setCount] = useState(1);

    const handleError = (err) => {
        console.log("Error: ", err);
    };

    const handleSubmit = () => {
        const videoContent = document.getElementById('me');
        const canvas = document.getElementById('injectStream');
        const ctx = canvas.getContext('2d');

        if (count === 1) {
            canvas.width = videoContent.offsetWidth;
            canvas.height = videoContent.offsetHeight;
        }
        
        const widthOfCanvas = canvas.offsetWidth;
        const heightOfCanvas = canvas.offsetHeight;

        const nameOfImage = Math.floor(Math.random() * 5) + 1;
        const xPosition = Math.floor(Math.random() * (widthOfCanvas - 100)) + 1;
        const yPosition = Math.floor(Math.random() * (heightOfCanvas - 100)) + 1;

        let img = new Image();

        img.src = `./assets/${nameOfImage}.png`;
        img.onload = function(){
            ctx.drawImage(img, xPosition, yPosition, 100, 100);
        };
        
        setCount(count + 1);
    }

    useEffect(() => {
        let client = AgoraRTC.createClient({
            mode: "live",
            codec: "vp8",
        });
        
        client.init(APPID, function() {
            console.log("client initialized");
        }, function(err) {
            console.log("client init failed ", err);
        });

        client.setClientRole(ROLE);

        client.join(TOKEN, "Tigran test", null, (uid)=>{
            let localStream = AgoraRTC.createStream({
                audio: true,
                video: true,
            });
            const canvas = document.getElementById('injectStream');
            // Initialize the local stream
            localStream.init(()=>{
                // Play the local stream
                localStream.play("me");
                let canvasStream = canvas.captureStream(25);
                let tracks = canvasStream.getVideoTracks();
                document.getElementById('mergedStream').srcObject = tracks[0];
                let mergedStream = localStream.addTrack(tracks[0]);
                
                // Publish the local stream
                client.publish(mergedStream, handleError);
            }, handleError);
        }, handleError);
    }, []);

    return (
        <div>
            <h1>
                Live Streaming
            </h1>
            <h4>Local video</h4>
            <button id="submitBtn" onClick={handleSubmit}>Submit Image</button>
            <div id="me">
                <canvas id='injectStream'></canvas>    
            </div>
            <h4>Remote video</h4>
            <div id="remote-container">
                <video id="mergedStream"></video>
            </div>
        </div>
    );
}

export default StreamContent;
