function createRandomProfilePic(ID, size){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const colorRange = ["#E74C3C", "#3498DB", "#1ABC9C", "#F1C40F"];
    const pictureTypes = ["random", "symmetrical"]
    const quality = 100;

    let picType = Math.floor(Math.random() * pictureTypes.length)

    canvas.width = quality * size;
    canvas.height = quality * size;

    ctx.beginPath();
    ctx.fillStyle = "#405DE6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.fillStyle = colorRange[Math.floor(Math.random() * colorRange.length)]

    if(picType == 0){
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(Math.floor(Math.random() * 2) == 0){
                    ctx.fillRect(i * quality, j * quality, quality, quality);
                    ctx.fill();
                }
            }
        }
    } else if(picType == 1){
        if(size % 2 == 0){
            for(let i = 0; i < size / 2; i++){
                for(let j = 0; j < size; j++){
                    if(Math.floor(Math.random() * 2) == 0){
                        ctx.fillRect(i * quality, j * quality, quality, quality);
                        ctx.fillRect((size - i - 1) * quality, j * quality, quality, quality);
                        ctx.fill();
                    }
                }
            }
        } else {
            for(let i = 0; i < Math.floor(size / 2); i++){
                for(let j = 0; j < size; j++){
                    if(Math.floor(Math.random() * 2) == 0){
                        ctx.fillRect(i * quality, j * quality, quality, quality);
                        ctx.fillRect((size - i - 1) * quality, j * quality, quality, quality);
                        ctx.fill();
                    }
                }
            }
            for(let i = 0; i < size; i++){
                if(Math.floor(Math.random() * 2) == 0){
                    ctx.fillRect(Math.floor(size / 2) * quality, i * quality, quality, quality);
                    ctx.fill();
                }
            }
        }
    }

    ctx.closePath();

    canvas.toBlob(function(blob) {
        var newImg = document.createElement('img'),
            url = URL.createObjectURL(blob);

        newImg.onload = function() {
            // no longer need to read the blob so it's revoked
            URL.revokeObjectURL(url);
        };

        newImg.src = url;
        document.getElementById(ID).appendChild(newImg);
    });
}