const musics = [
    ["City Night", "Abhiram Boddu"],
    ["Cool Breeze", "Abhiram Boddu"],
    ["Insomnia", "Abhiram Boddu"],
    ["Rainy Café", "Abhiram Boddu"],
    ["Road Vibes", "Abhiram Boddu"],
    ["Space Trip", "Abhiram Boddu"],
    ["Summer Strings", "Abhiram Boddu"],
    ["Timeless Inception", "Abhiram Boddu"],
]

function initializeMusic(){
    setupPlaylists()
}

function setupPlaylists(){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    // Code to Generate Random Liked Music Goes Here
    let randomMusic = musics[Math.floor(Math.random() * musics.length)];
    let randomImage = new Image();
    randomImage.onload = function(){
        let radioImage = new Image();
        radioImage.onload = function(){
            let radioImageSize = 250;

            ctx.beginPath();
            ctx.drawImage(randomImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(radioImage, (canvas.width - radioImageSize)/2, (canvas.height - radioImageSize)/2, radioImageSize, radioImageSize)
            ctx.closePath();

            canvas.toBlob(function(blob) {
                const newImg = document.createElement('img');
                const url = URL.createObjectURL(blob);

                newImg.onload = function() {
                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                };

                newImg.src = url;
                document.getElementById('playlist-list').appendChild(newImg)
            });
        }
        radioImage.src = "./icons/mixed_radio.png";
    }
    randomImage.src = "./music/covers/" + randomMusic[0].toLowerCase().replace(' ', '-') + ".png";
}