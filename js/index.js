//* It does what you expect
window.onload = () => {
    document.querySelector(".wtfBro")
        .classList.add("uk-animation-scale-up");
};

var todos = 0;

//? Observing DOM changes for the note class
//? Handling each childList change
var domObserver = new MutationObserver(() => {
    let emptyText = document.getElementById("init");
    for (let i = 0; i < todos; i++) {
        let element = document.getElementById(`close${i}`);

        //! Some weird condition, but it makes it work
        if (element && element.parentElement) {
            element.addEventListener("click", () => {
                element.parentElement.remove();
                leftSideProcess();
                rightSideProcess();
            });
        }
    }

    //? Flexing on html
    if (document.getElementsByClassName("uk-animation-scale-up").length === 1) {
        emptyText.style.display = "flex";
    }
});

domObserver.observe(document.getElementsByClassName("note")[0], {childList: true});
//? DOM observing ends here

//! Some spaghetti code only I understand
document.getElementById("addBtn").addEventListener("click", () => {
    let emptyText = document.getElementById("init");
    let inn = document.getElementById("taskText");

    if (!inn.value) {
        return;
    }

    let newDiv = document.createElement("div");
    newDiv.classList.add("uk-animation-scale-up");
    newDiv.style.display = "flex";
    newDiv.style.justifyContent = "space-evenly";
    newDiv.innerHTML = `<p class="flex-start active">${inn.value}</p>\
        <button class=\"uk-close-large\" uk-close></button>\
        <span class="tick done1" uk-icon="icon: check; ratio: 2"></span>`;
    
    newDiv.children.item(1).id = `close${todos}`;
    newDiv.children.item(2).style.display = "none";
    
    //! True insanity, but still I'm not making it a separate function.
    //! Tottaly not worth it this time.
    newDiv.children.item(0).addEventListener("click", () => {
        if (!newDiv.children.item(0).classList.contains("done")) {
            newDiv.children.item(0).classList.add("done");
            newDiv.children.item(0).classList.remove("active");
            [newDiv.children.item(1).style.display, newDiv.children.item(2).style.display] =
                [newDiv.children.item(2).style.display, newDiv.children.item(1).style.display];
        } else {
            newDiv.children.item(0).classList.remove("done");
            newDiv.children.item(0).classList.add("active");
            [newDiv.children.item(1).style.display, newDiv.children.item(2).style.display] =
                [newDiv.children.item(2).style.display, newDiv.children.item(1).style.display];
        }
        leftSideProcess();
        rightSideProcess();
    });

    let toAppend = document.querySelector(".note");
    toAppend.appendChild(newDiv);
    todos++;
    
    if (todos > 0) {
        emptyText.style.display = "none";
    }
    leftSideProcess();
    rightSideProcess();
});
//! Too much spaghetti code, but it works, I don't care that much.
//! For the sake of our sanity, the spaghetti code ends here.

//? Utils for processing active and done tasks
const leftSideProcess = () => {
    let doneTasksSection =  document.querySelector(".right");
    //* On each update we need to clear the list
    //* In order to read only the done class inheritors
    while (doneTasksSection.childNodes.length > 2) {
        doneTasksSection.removeChild(doneTasksSection.lastChild);
    }
    
    let doneTasks = Array.from(document.getElementsByClassName("done"),
        (el) => el.innerHTML);

    //! Crazy lambda
    doneTasks.forEach((el) => {
        let pTag = document.createElement("p");
        pTag.innerHTML = el;
        document.querySelector(".right").appendChild(pTag);
    });
}

const rightSideProcess = () => {
    let activeTasksSection = document.querySelector(".left");
    //* On each update we need to clear the list
    //* In order to read only the active class inheritors
    while (activeTasksSection.childNodes.length > 2) {
        activeTasksSection.removeChild(activeTasksSection.lastChild);
    }
    
    let activeTasks = Array.from(document.getElementsByClassName("active"),
        (el) => el.innerHTML);

    //! Crazy lambda
    activeTasks.forEach((el) => {
        let pTag = document.createElement("p");
        pTag.innerHTML = el;
        document.querySelector(".left").appendChild(pTag);
    });
}
//? Utils section ends here

//* Animation utility variables
let time = {
    duration: 500,
    iterations: 1
};
let aniLeft = [{transform: "translateX(-10vw)", opacity: 0}, 
                {transform: "translateX(0vw)", opacity: 100}];

let noteLeft = [{transform: "translateX(-10vw)"}, 
                {transform: "translateX(0vw)"}];

let aniRight = [{transform: "translateX(10vw)", opacity: 0}, 
            {transform: "translateX(0vw)", opacity: 100}]

let noteRight = [{transform: "translateX(10vw)"}, 
            {transform: "translateX(0vw)"}];
//* Decl ends here

//? Left side animating
let leftBtn = document.querySelector('.left');
var toChangeLeft = "flex";
document.getElementById("leftBtn").addEventListener("click", () => {
    [leftBtn.style.display, toChangeLeft] 
        = [toChangeLeft, leftBtn.style.display];
    if (toChangeLeft !== "flex") {
        leftBtn.animate(aniLeft, time);
        document.querySelector(".note").animate(noteLeft, time);
    } else {
        document.querySelector(".note").animate(noteRight, time);
    }
});

//? Right side animating
let rightBtn = document.querySelector('.right');
var toChangeRight = "flex";
document.getElementById("rightBtn").addEventListener("click", () => {
    [rightBtn.style.display, toChangeRight]
        = [toChangeRight, rightBtn.style.display];
    if (toChangeRight !== "flex") {
        rightBtn.animate(aniRight, time);
        document.querySelector(".note").animate(noteRight, time);
    } else {
        document.querySelector(".note").animate(noteLeft, time);
    }
});