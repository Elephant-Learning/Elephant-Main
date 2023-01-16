let carouselNum;
let carouselMax = 2;

function carouselManager(){
    if(carouselNum == carouselMax) carouselNum = 0;
    else carouselNum++;
    document.querySelectorAll(".active-carousel")[0].classList.remove('active-carousel');
    document.querySelectorAll(".carousel-elem")[carouselNum].classList.add("active-carousel");
}

function initializeCarousel(){
    carouselNum = 0;

    document.querySelectorAll(".carousel-elem")[carouselNum].classList.add("active-carousel");

    setInterval(carouselManager, 15000);
}

initializeCarousel();