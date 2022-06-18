let sidebarContextMenu = false;
let mainContextMenu

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
    mainContextMenu = false;
})