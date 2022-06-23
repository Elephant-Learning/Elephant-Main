let sidebarContextMenu = false;
let mainContextMenu = false;

let pages = ["Elephant Flashcards", "Elephant Task Manager", "Favorited Decks", "Skyline High School Chat Group"];
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???"]

function toggleSettingsModal(){
    if(document.getElementById('desktop-settings-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-settings-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-settings-modal').classList.add('inactive-modal');
    }
}

function togglePageFlip(index){
    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')
    document.querySelectorAll('.desktop-sidebar-category')[index].classList.add('active-sidebar-category')
    try {document.querySelector(".active-tab").classList.remove('active-tab')}
    catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [3]

    if(removeBottomBtns.includes(index)){
        document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
            item.classList.add('inactive-modal')
        })
    } else {
        try {
            document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
                item.classList.remove('inactive-modal')
            })
        } catch{}
    }
}

function toggleSizeSetting(value){
    const sizes = [0.75, 1, 1.25, 1.5];
    document.querySelector(".settings-size-active").classList.remove("settings-size-active");
    document.querySelectorAll(".desktop-size-settings-p")[value].classList.add("settings-size-active");
    document.querySelector(':root').style.setProperty('--size', sizes[value].toString());
    let element = document.getElementById('notifications-btn');
    document.getElementById('desktop-settings-modal').style.right = "calc(var(--size)" + (getRightBound(element) + 364 * sizes[value]) + "px)";
}

document.getElementById('desktop-sidebar').addEventListener('contextmenu', function(e){
    e.preventDefault();
    sidebarContextMenu = true;

    let refactoredClientX = e.clientX
    if(e.clientX > 128) refactoredClientX -= 128

    let refactoredClientY = e.clientY;
    if(e.clientY > window.innerHeight - 25) refactoredClientY -= 25;

    document.getElementById('desktop-sidebar-context-menu').style.left = refactoredClientX + "px";
    document.getElementById('desktop-sidebar-context-menu').style.top = refactoredClientY + "px";
    document.getElementById('desktop-sidebar-context-menu').classList.remove('inactive-modal');
    document.getElementById('desktop-main-container-context-menu').classList.add('inactive-modal');
})

document.getElementById('desktop-sidebar').addEventListener('click', function(e){
    document.getElementById('desktop-main-container-context-menu').classList.add('inactive-modal');
    document.getElementById('desktop-sidebar-context-menu').classList.add('inactive-modal');
    sidebarContextMenu = false;
})

document.getElementById('desktop-main-container').addEventListener('contextmenu', function(e){
    e.preventDefault();
    mainContextMenu = true;

    let refactoredClientX = e.clientX
    if(e.clientX > window.innerWidth - 128) refactoredClientX -= 128

    let refactoredClientY = e.clientY;
    if(e.clientY > window.innerHeight - 50) refactoredClientY -= 50;

    document.getElementById('desktop-main-container-context-menu').style.left = refactoredClientX + "px";
    document.getElementById('desktop-main-container-context-menu').style.top = refactoredClientY + "px";
    document.getElementById('desktop-main-container-context-menu').classList.remove('inactive-modal');
    document.getElementById('desktop-sidebar-context-menu').classList.add('inactive-modal');
})

document.getElementById('desktop-main-container').addEventListener('click', function(e){
    document.getElementById('desktop-main-container-context-menu').classList.add('inactive-modal');
    document.getElementById('desktop-sidebar-context-menu').classList.add('inactive-modal');
    mainContextMenu = false;
})

function closeNews(){
    document.getElementById('desktop-main-news').style.visibility = "hidden";
    document.querySelectorAll('.desktop-tab').forEach(function(item){
        item.style.top = "calc(var(--size) * 44px)";
        item.style.height = "calc(100vh - var(--size) * 92px)";
    })
    document.getElementById('desktop-main-container-tab').style.top = "0";
}

function initialize(){
    document.getElementById('desktop-loader-text').innerHTML = randomChatMessage[Math.floor(Math.random() * randomChatMessage.length)];
    if(document.getElementById('desktop-main-news').hasChildNodes()){
        document.getElementById('desktop-main-news').style.visibility = "visible";
        document.querySelectorAll('.desktop-tab').forEach(function(item){
            item.style.top = "calc(var(--size) * 68px)";
            item.style.height = "calc(100vh - var(--size) * 116px)";
        })

        let element = document.getElementById('notifications-btn');
        document.getElementById('desktop-settings-modal').style.right = "calc(var(--size)" + (getRightBound(element) + 334) + "px)";
        document.getElementById('desktop-main-container-tab').style.top = "calc(var(--size) * 24px)";
        console.log(document.getElementById('desktop-settings-modal').style.right)
    }
    togglePageFlip(0)
}

function getRightBound(element) {
    var xPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        element = element.offsetParent;
    }

    xPosition -= window.innerWidth

    return xPosition;
}

//toggle Loading Bar
window.onload = function(){
    document.getElementById('desktop-loader-container').classList.add('inactive-modal')
}

initialize();