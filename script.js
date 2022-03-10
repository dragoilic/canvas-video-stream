const createLocalMedia = (stream) => {
    document.getElementById('localVideo').srcObject = stream;
}

const createImageContext = (nameOfImage, xPosition, yPosition) => {
    let image = document.createElement('img');

    image.src = `./assets/${nameOfImage}.png`;
    image.style.left = `${xPosition}px`;
    image.style.top = `${yPosition}px`;

    document.getElementById('image-content').appendChild(image);
}

$(function() {
    let canvas = document.getElementById('streamCanvas');
    const submitImage = document.getElementById('submit-image');
    const ctx = canvas.getContext('2d');
    const localVideo = document.getElementById('localVideo');
    
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
            .then(function (stream) {
                createLocalMedia(stream);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    localVideo.addEventListener('loadedmetadata', function() {
        canvas.width = localVideo.videoWidth;
        canvas.height = localVideo.videoHeight;
    });

    localVideo.addEventListener('play', function() {
        let $this = this; //cache
        (function loop() {
          if (!$this.paused && !$this.ended) {
            ctx.drawImage($this, 0, 0);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
        })();
      }, 0);

    $("#submit-image").click(() => {
        const widthOfVideo = canvas.offsetWidth;
        const widthOfHeight = canvas.offsetHeight;
        console.log(widthOfVideo, widthOfHeight)
        const nameOfImage = Math.floor(Math.random() * 5) + 1;
        const xPosition = Math.floor(Math.random() * (widthOfVideo - 200)) + 1;
        const yPosition = Math.floor(Math.random() * (widthOfHeight - 200)) + 1;

        let img = new Image();
        img.onload = function(){
            ctx.drawImage(img, xPosition, yPosition, 150, 150);
        };

        img.src = `./assets/${nameOfImage}.png`;
        
    })
});