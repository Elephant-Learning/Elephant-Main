function togglePageFlip(index, sidebar, link){

    const pages = ["Deck Carousel", "Deck Memorize", "Deck Review", "Deck Statistics"];

    if(link){
        window.location.href = link;
        return;
    }

    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    if(!(sidebar === undefined)){
        if(sidebar >= document.querySelectorAll('.desktop-sidebar-category').length){
            document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].classList.add('active-sidebar-category')
        } else {
            document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')
        }
    }

    try{document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')} catch{}
    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [1, 2, 3, 4, 5, 6, 7]

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

    history.push([index, sidebar]);
}