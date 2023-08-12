const slider = document.querySelector("#slider-viewport");
const innerSlider = document.querySelector("#slider-inner");

slider.addEventListener("mousedown", function(e){
    pressed = true;
    startX = e.offsetX - innerSlider.offsetLeft;
    slider.style.cursor = "grabbing";
});

slider.addEventListener("mouseenter", function(){
    slider.style.cursor = "grab";
});

slider.addEventListener("mouseup", function(){
    slider.style.cursor = "grab";
});

slider.addEventListener("mousemove", function(e){
    if(!pressed) return;

    e.preventDefault();

    x = e.offsetX;

    innerSlider.style.left = `${x - startX}px`

    checkBoundary();
});

function checkBoundary(){
    let outer = slider.getBoundingClientRect();
    let inner = innerSlider.getBoundingClientRect();

    if(parseInt(innerSlider.style.left) > 0){
        innerSlider.style.left = "0px";
    } else if(inner.right < outer.right){
        innerSlider.style.left = `-${inner.width - outer.width}px`
    }
}