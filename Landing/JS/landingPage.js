const MainNav = document.querySelector(".MainNav");
const NavMainLogo = document.querySelector(".NavMainLogo");
const CreateHeading = document.querySelector(".CreateHeading");
const MemorizeHeading = document.querySelector(".MemorizeHeading");
const SupportHeading = document.querySelector(".SupportHeading");
const SearchButton = document.querySelector("#SearchButton");
let showSearch = false;
SearchButton.addEventListener("click", async function() {
    if (showSearch !== true) {
        showSearch = true;
        NavMainLogo.classList.add("NavMainLogoShrinkAndFade");
        await HiddenElement("LogoShrinkAndFade");
        console.log("logo should have disappeared");
        MemorizeHeading.classList.add("TextShrinkAndFade");
        await HiddenElement("TextShrinkAndFade", 5000);
        CreateHeading.classList.add("TextShrinkAndFade");
        await HiddenElement("TextShrinkAndFade", 5000);
        SupportHeading.classList.add("TextShrinkAndFade");
        await HiddenElement("TextShrinkAndFade", 5000);
        SearchButton.classList.add("LogoShrinkAndFade");
        await HiddenElement("LogoShrinkAndFade", 5000);
    } else {
        showSearch = false;
    }
});

async function HiddenElement(elementClass, delayInMillis) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let HTMLElement = document.querySelector("." + elementClass);
            if (HTMLElement !== null) {
                HTMLElement.classList.add("HiddenElement");
            }
            resolve();
        }, delayInMillis)
    })
};

async function HiddenText(elementClass, delayInMillis) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let HTMLElement = document.querySelector("." + elementClass);
            if (HTMLElement !== null) {
                HTMLElement.classList.add("HiddenText");
            }
            resolve();
        }, delayInMillis)
    })
};

async function AddClass(currentRefClass, addClass, delayInMillis) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let appliedElement = document.querySelector(("." + currentRefClass).toStirng);
            if (appliedElement !== null) {
                appliedElement.classList.add(addClass);
                resolve();
            } else {
                reject();
            }
        }, delayInMillis);
    });
}
