// DOM elements
const addBookButton = document.getElementById("add-book-button");
const addBookModal = document.getElementById("add-book-modal");
const allBooksContainer = document.getElementById("all-books-container");
const hueChanger = document.getElementById("hue-changer");

const authorName = document.getElementById("author-name");
const titleName = document.getElementById("title-name");
const numberOfPages = document.getElementById("num-of-pages");
const readButton = document.getElementById("isRead");

// Other variables
const myLibrary = JSON.parse(localStorage.getItem('libraryData')) != null ? JSON.parse(localStorage.getItem('libraryData')) : [];
let bookColors = ["red", "blue", "green", "yellow"];

createTheBooksList();

// Dialog closing behavior
let dialog = document.getElementsByTagName('dialog')[0];
dialog.showModal();
dialog.addEventListener('click', function (event) {
    let rect = dialog.getBoundingClientRect();
    let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        dialog.close();
    }
});

// Functions
function Book(author, title, numOfPages, isRead, id, hueNumber) {
    this.author = author;
    this.title = title;
    this.numOfPages = numOfPages;
    this.isRead = isRead;
    this.id = id;
    this.bookColor = hueNumber;
}

function addBookToLibrary() {
    if (authorName.value != "" && titleName.value != "" && numberOfPages.value >= 1 && myLibrary.findIndex(x => x.id === `${authorName.value}-${titleName.value}`) < 0) {
        const author = authorName.value;
        const title = titleName.value;
        const numOfPages = numberOfPages.value;
        const isRead = readButton.checked;
        const id = `${authorName.value}-${titleName.value}`.replace(/\s+/g, '-').toLowerCase();
        const bookColor = hueChanger.value;

        const book = new Book(author, title, numOfPages, isRead, id, bookColor);
        myLibrary.push(book);

        localStorage.setItem('libraryData', JSON.stringify(myLibrary));

        createTheBooksList();
    }
}

function createTheBooksList() {
    let aBook;
    allBooksContainer.innerHTML = "";

    for (let i = 0; i < myLibrary.length; i++) {
        aBook = /* html*/`
        <div class="a-book">
            <img id="img-${myLibrary[i].id}" style="filter: hue-rotate(${myLibrary[i].bookColor}deg);" src="./media/images/standard-book.png" alt="">
            <div class="book-header-container">
                <h1 class="book-title" id="book-title">${myLibrary[i].title}</h2>
                <h2 class="book-author" id="book-author">by: ${myLibrary[i].author}</h2>
            </div>
            <h3 class="book-num-of-pages" id="book-num-of-pages">${myLibrary[i].numOfPages} Pages</h3>
            <h2 class="book-isRead ${myLibrary[i].isRead ? "read" : ""}" id="book-isRead" onclick="makeThisRead('${myLibrary[i].id}')">${myLibrary[i].isRead ? "Read" : "not Read"}</h2>

            <div class="edit-button-container">
                <button class="edit-button" onclick="showHueChanger('${myLibrary[i].id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#010409" fill-rule="evenodd" d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25a.75.75 0 0 1 0 1.5A9.25 9.25 0 1 0 21.25 12a.75.75 0 0 1 1.5 0c0 5.937-4.813 10.75-10.75 10.75S1.25 17.937 1.25 12Zm15.52-9.724a3.503 3.503 0 0 1 4.954 4.953l-6.648 6.649c-.371.37-.604.604-.863.806a5.34 5.34 0 0 1-.987.61c-.297.141-.61.245-1.107.411l-2.905.968a1.492 1.492 0 0 1-1.887-1.887l.968-2.905c.166-.498.27-.81.411-1.107c.167-.35.372-.68.61-.987c.202-.26.435-.492.806-.863l6.648-6.648Zm3.893 1.06a2.003 2.003 0 0 0-2.832 0l-.376.377c.022.096.054.21.098.338c.143.413.415.957.927 1.469a3.875 3.875 0 0 0 1.807 1.025l.376-.376a2.003 2.003 0 0 0 0-2.832Zm-1.558 4.391a5.397 5.397 0 0 1-1.686-1.146a5.395 5.395 0 0 1-1.146-1.686L11.217 9.95c-.416.417-.58.582-.718.76a3.84 3.84 0 0 0-.439.71c-.097.203-.171.423-.358.982l-.431 1.295l1.032 1.033l1.295-.432c.56-.187.779-.261.983-.358c.251-.12.49-.267.71-.439c.177-.139.342-.302.759-.718l5.055-5.056Z" clip-rule="evenodd"/></svg>
                </button >

                <div class="edit-menu-container hide" id="hue-changer-container-${myLibrary[i].id}">
                    <h3>Color: </h3>
                    <input class="hue-changer" id="hue-changer-${myLibrary[i].id}" style="--hue: ${myLibrary[i].bookColor}" type="range" min="0" max="360" value="${myLibrary[i].bookColor}" oninput="changeThisBookColor('${myLibrary[i].id}')">
                </div>
        </div>

        <button class="remove-button" onclick="removeThisBook('${myLibrary[i].id}')" >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="#010409"><path d="M12 2.75a2.25 2.25 0 0 0-2.122 1.5a.75.75 0 0 1-1.414-.5a3.751 3.751 0 0 1 7.072 0a.75.75 0 0 1-1.414.5A2.251 2.251 0 0 0 12 2.75ZM2.75 6a.75.75 0 0 1 .75-.75h17a.75.75 0 0 1 0 1.5h-17A.75.75 0 0 1 2.75 6Zm3.165 2.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104c.591.554 1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.814.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.303c-.14-.705-.204-1.643-.294-2.99l-.46-6.9Z"/><path d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821Zm5.821.821a.75.75 0 0 0-1.492-.15l-.5 5a.75.75 0 0 0 1.492.15l.5-5Z"/></g></svg>
            </button >
        </div >`

        allBooksContainer.innerHTML += aBook;
    }
}

function toggleAddBookModal() {
    addBookModal.showModal();
    addBookModal.style.animation = "open-modal-animation 100ms ease-in-out";
}

function removeThisBook(id) {
    myLibrary.splice(myLibrary.findIndex(x => x.id === id), 1);
    localStorage.setItem('libraryData', JSON.stringify(myLibrary));
    createTheBooksList();
}

function getRandomValue(arr) {
    return Math.floor(Math.random() * arr.length);
}

function makeThisRead(id) {
    if (myLibrary[myLibrary.findIndex(x => x.id === id)].isRead) {
        myLibrary[myLibrary.findIndex(x => x.id === id)].isRead = false;
    } else {
        myLibrary[myLibrary.findIndex(x => x.id === id)].isRead = true;
    }

    localStorage.setItem('libraryData', JSON.stringify(myLibrary));
    createTheBooksList();
}

function showHueChanger(id) {
    const hueChangerContainer = document.getElementById(`hue-changer-container-${myLibrary[myLibrary.findIndex(x => x.id === id)].id}`);

    if (!hueChangerContainer.classList.contains("hide")) {
        hueChangerContainer.classList.add("hide");
    } else {
        hueChangerContainer.classList.remove("hide");
    }
}

function changeThisBookColor(id) {
    const editHueChanger = document.getElementById(`hue-changer-${myLibrary[myLibrary.findIndex(x => x.id === id)].id}`);

    const image = document.getElementById(`img-${myLibrary[myLibrary.findIndex(x => x.id === id)].id}`);

    hueValue = Number(editHueChanger.value);
    editHueChanger.style = `--hue: ${hueValue}`;

    myLibrary[myLibrary.findIndex(x => x.id === id)].bookColor = hueValue;

    image.style.filter = `hue-rotate(${hueValue}deg)`;

    localStorage.setItem('libraryData', JSON.stringify(myLibrary));
}

function modalColorSelector() {
    hueValue = Number(hueChanger.value);
    hueChanger.style = `--hue: ${hueValue}`;
}