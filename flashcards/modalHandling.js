let sidebarContextMenu = false;
let mainContextMenu = false;

let pages = ["Recently Viewed", "Your Decks", "Favorited Decks"]

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
}

function toggleSizeSetting(value){
    const sizes = [0.75, 1, 1.25, 1.5];
    document.querySelector(".settings-size-active").classList.remove("settings-size-active");
    document.querySelectorAll(".desktop-size-settings-p")[value].classList.add("settings-size-active");
    document.querySelector(':root').style.setProperty('--size', sizes[value].toString());
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
    e.preventDefault();
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
    e.preventDefault();
    document.getElementById('desktop-main-container-context-menu').classList.add('inactive-modal');
    document.getElementById('desktop-sidebar-context-menu').classList.add('inactive-modal');
    mainContextMenu = false;
})

togglePageFlip(0)