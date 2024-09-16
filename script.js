let pages = [];
let categories = [];
async function initialize() {
    const storedPages = await chrome.storage.local.get('savedPages') ? await chrome.storage.local.get('savedPages') : null;
    const storedCategories = await chrome.storage.local.get('categories') ? await chrome.storage.local.get('categories') : null;
    if (storedPages.savedPages) pages = [...storedPages.savedPages];
    if (storedCategories.categories) categories = [...storedCategories.categories];
    if (pages.length) {
        renderFolders();
    };

    let categoryOptions = ``;
    for (const category of categories) {
        categoryOptions += `<option value=${category}>${category[0].toUpperCase() + category.slice(1)}</option>`;
    }
    categorySelect.innerHTML += categoryOptions;
};

// nav
const favouritesLink = document.getElementById('link-favourites');
const addLink = document.getElementById('link-add');
const pagesLink = document.getElementById('link-pages');
const searchInput = document.getElementById('input-search');
const searchContainer = document.getElementById('search-container');

// favourites
const favouritesEl = document.getElementById('favourites');
const favouritesContainer = document.getElementById('favourites-container');
const favouritesList = document.getElementById('favourites-list');

// add page form // chage form to allow editing existing form
// use list with buttons for removal / search
const addForm = document.getElementById('page-add');
const nameInput = document.getElementById('input-name');
const imgInput = document.getElementById('input-img');
const imgInputPreview = document.getElementById('input-img-preview');
const categoryInput = document.getElementById('input-category');
const categorySelect = document.getElementById('select-category');
const favouriteCheck = document.getElementById('check-favourite');
const urlTextarea = document.getElementById('url');
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');

// page collection list
const pageCollection = document.getElementById('page-collection');
const pageListContainer = document.getElementById('page-lists-container');
const pageList = document.getElementById('page-list');
const pageLinks = document.getElementsByClassName('page-link');
const pageLinkImgs = document.getElementsByClassName('page-image');

const messageContainer = document.getElementById('message-container');
const messageEl = document.getElementById('message');

const favouriteLinkName = document.getElementById('link-name-favourite');
const pageLinkName = document.getElementById('link-name-page');

// lists
const formInputs = [
    nameInput,
    imgInput,
    urlTextarea,
    categoryInput,
    categorySelect,
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


// functions
async function writePage(action, object) {
    if (!object.url) {
        displayMessage('Please enter a URL address');
        return;
    };
    let pageExists = false;
    for (const page of pages) {
        if (page.url === object.url) {
            pageExists = true;
            if (action === 'delete') {
                alterList(action, 'Page Deleted', object);
            } else if (action === 'edit') {
                autofillForm(object);
                addForm.style.display = 'block';
                btn1.textContent = 'Edit';
                pageCollection.style.display = 'none';
                favouritesEl.style.display = 'none';
            };
        };
    };
    if (action === 'add') {
        if (pageExists) {
            displayMessage('Link already exists');
            return;
        }
        pages.push(object);
        clearForm();
        await chrome.storage.local.set({ savedPages: pages });
        displayMessage('Page Saved');
    };
    renderFolders();
};

async function alterList(action, message, object = {}) {
    const pageIndex = pages.findIndex(p => p.url === object.url);
    if (action === 'edit') {
        pages.splice(pageIndex, 1, object);
    } else if (action === 'delete') {
        console.log(pages);
        pages.splice(pageIndex, 1);
        console.log(pages);
    };
    await chrome.storage.local.set({ savedPages: pages });
    displayMessage(message);
};

function autofillForm(object) {
    nameInput.value = object.name;
    imgInput.value = object.image;
    imgInputPreview.src = object.image;
    categoryInput.value = object.category;
    categorySelect.value = object.category;
    favouriteCheck.checked = object.isFavourite;
    urlTextarea.value = object.url;
};

function clearForm() {
    for (const input of formInputs) {
        input.value = '';
    };
    favouriteCheck.checked = false;
    imgInputPreview.src = './public/bookmark-logo.png';
};

function addLinkListener() {
    pages.map((page, i) => {
            // issue when searching pages marked as faovurite due to duplicate elements
                // add check with url
        const editBtn = document.getElementById(`edit-${page.url}`);
        const deleteBtn = document.getElementById(`delete-${page.url}`);
        const pageLi = document.getElementById(`li-${page.url}`);
        editBtn.addEventListener('click', () => {
            editBtnFunc(page);
        });
        deleteBtn.addEventListener('click', () => {
            deleteBtnFunc(page);
        });
        pageLi.addEventListener('pointerover', () => {
            pageLinkName.textContent = page.name ? page.name : page.url;
            favouriteLinkName.textContent = page.name ? page.name : page.url;
        });
    });
}

function toggleDisplays(el) {
    for (const element of displayElements) {
        if (el.classList[0] === element.classList[0]) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        };
    };
};

function editBtnFunc(page) {
    writePage('edit', page);
};

function deleteBtnFunc(page) {
    writePage('delete', page);
};

async function renderList(element, filterBy = null, value = null) {
    let stringList = '';
    let displayPages = [];
    if (filterBy) {
        if (typeof value === 'boolean') {
            displayPages = pages.filter(page => page[filterBy] === value)
        } else if (typeof value === 'string') {
            displayPages = pages.filter(page => page[filterBy.toLowerCase()].toLowerCase().includes(value.toLowerCase()));
        };
    } else {
        displayPages = pages;
    }
    displayPages.map(page => {
        stringList += `
        <div class='page-link-container'>
            <a href='${page.url}' target='_blank' class='page-link'>
                <li class='page-li' id='li-${page.url}'>
                    <img class='page-image ${page.isFavourite ? 'favourite-page' : ''}' src=${page.image} alt='${page.name}' />
                </li>
            </a>
            <div class='action-btns'>
                <button class='edit' id='edit-${page.url}'></button>
                <button class='delete' id='delete-${page.url}'></button>
            </div>
        </div>
        `;
    });
    element.innerHTML = stringList;
    addLinkListener();
    // add styling to repeat images to differentiate
    // hue-rotate increasing amount of degrees?
};

function renderFolders() {
    renderList(pageList, 'isFavourite', false);
    renderList(favouritesList, 'isFavourite', true);
};

function displayMessage(message) {
    messageEl.textContent = message;
    messageContainer.style.display = 'flex';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 1000);
};


// event listeners
btn1.addEventListener('click', async (e) => {
    e.preventDefault();
    const page = {
        name: nameInput.value,
        image: imgInput.value ? imgInput.value : './public/bookmark-logo.png',
        category: categorySelect.value ? categorySelect.value : categoryInput.value,
        isFavourite: favouriteCheck.checked,
        url: urlTextarea.value,
    };
    if (!categories.includes(page.category) && page.category) {
        categories.push(page.category)
        await chrome.storage.local.set({ categories: categories });
    };
    if (btn1.textContent === 'Save') {
        writePage('add', page);
    } else if (btn1.textContent === 'Edit') {
        alterList('edit', 'Page Updated', page);
        btn1.textContent = 'Save';
        clearForm();
    };
    renderFolders();
});


btn2.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const object = {
            name: tabs[0].title,
            image: tabs[0].favIconUrl ? tabs[0].favIconUrl : './public/bookmark-logo.png',
            image: tabs[0].favIconUrl ? tabs[0].favIconUrl : './public/bookmark-logo.png',
            category: '',
            url: tabs[0].url,

        };
        autofillForm(object)
    });
});

imgInput.addEventListener('change', (e) => {
    imgInputPreview.src = e.target.value ? e.target.value : './public/bookmark-logo.png';
});

favouriteCheck.addEventListener('click', e => {
    imgInputPreview.style.background = e.target.checked ? 'linear-gradient(-135deg, gold 10%, black 10%, black 12%, white 12%)' : 'none';
});

messageContainer.addEventListener('click', () => {
    messageContainer.style.display = 'none';
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === 'Backspace') {
        if (e.target.value && e.target.value.length > 1) {
            if (e.target.value.includes(':')) {
                const searchParams = e.target.value.split(':');
                console.log(e.target.value, searchParams, searchParams[0], searchParams[1]);
                renderList(pageList, searchParams[0], searchParams[1]);
            } else {
                renderList(pageList, 'name', e.target.value)
            }
            return;
        }
        renderList(pageList, 'isFavourite', false);
    };
});

for (const link of navLinks) {
    // used to hide/show element based on clicked nav link
    link.addEventListener('click', (e) => {
        toggleDisplays(e.target);
        if (link.id === 'link-add') {
            clearForm();
            btn1.textContent = 'Save';
        }
    });
};


initialize();


// TBA  
// add account func to use cloud server for back-up
// add download/display-to-copy view for service migration
// add chrome.storage.local.clear() to delete all data
// fix event listener assignment for saerch results that include favourited pages
// add settings page for customization
// implement check for valid URL (bare minimum check with restrictions on characters that break edit/delete button func by id assignment)
// add counter key to pages to track how many times they've been clicked, can use to get most visited
// have search bar collapse when not being used
// add quick filter tabs (bottom left) by user preference ( i.e. by a chosen category/base url/name)


// chrome.storage.local.clear();