let pages = localStorage.getItem('pages') ? localStorage.getItem('pages') : []; // list of objects with URL(required) and img&name(optional) keys
// store URLs as list with separate object for customized display?


// nav
const favouritesLink = document.getElementById('link-favourites');
const addLink = document.getElementById('link-add');
const pagesLink = document.getElementById('link-pages');

// favourites
const favouritesEl = document.getElementById('favourites');

// add page form
const addForm = document.getElementById('page-add');
const nameInput = document.getElementById('input-name');
const imgInput = document.getElementById('input-img');
const urlTextarea = document.getElementById('url');
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');

// page collection list
const pageCollection = document.getElementById('page-collection');
const pageListContainer = document.getElementById('page-lists-container');
const pageList = document.getElementById('page-list');

// lists
const formInputs = [
    nameInput,
    imgInput,
    urlTextarea,
];
const displayElements = [
    favouritesEl,
    addForm,
    pageCollection,
];
const navLinks = [
    favouritesLink,
    addLink,
    pagesLink,
];


function storeToLocal() {
    // functions don't work, maybe hoisting / timing issue
    // try using parameters
    localStorage.setItem('pages', JSON.stringify(pages));
};
// add optional parameters for tab organization
function getFromLocal() {
    localStorage.getItem('pages');
};

btn1.addEventListener('click', (e) => {
    e.preventDefault();
    // add check for duplicate url, name and image can be reused, though discouraged

    pages.push({
        name: nameInput.value,
        image: imgInput.value,
        url: urlTextarea.value,
    });
    for (const input of formInputs) {
        input.value = '';
    };
    localStorage.setItem('pages', JSON.stringify(pages));
    renderList();
});

btn2.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // console.log(tabs[0].url); // working in extension instance
        nameInput.value = tabs[0].title;
        imgInput.value = tabs[0].favIconUrl;
        urlTextarea.value = tabs[0].url; // enter data but don't submit
        // add separate button for autofill from active tab
        // console.log(tabs); // check tabs data scheme
    })
});


function toggleDisplays(el) {
    for (const element of displayElements) {
        // console.log(el.classList[0] === link.classList[0]);
        if (el.classList[0] === element.classList[0]) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        };
    };
};

function renderList() {
    let stringList = '';
    pages = JSON.parse(localStorage.getItem('pages'));
    console.log(pages);
    for (const page of pages) {
        stringList += `
        <a href='${page.url}' target='_blank' class='page-link' name=${page.name} >
            <li class='page-li' >
                <img class='page-image' src=${page.image} alt='${page.name} favicon' />
            </li>
        </a>`;
    }
    pageList.innerHTML = stringList;
};


for (const link of navLinks) {
    link.addEventListener('click', (e) => {
        toggleDisplays(e.target);
    });
};

// Stretch
// add account func to use cloud server for back-up
// add download/display-to-copy view for service migration