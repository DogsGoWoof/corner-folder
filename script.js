const pages = []; // list of objects with URL(required) and img&name(optional) keys
// store URLs as list with separate object for customized display?
const textlist = [];
for (let i = 0; i < 100; i++) {
    textlist.push(i);
}


// add page form
const nameInput = document.getElementById('input-name');
const imgInput = document.getElementById('input-img');
const urlTextarea = document.getElementById('url');
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');

// page collection list
const pageCollection = document.getElementById('page-collection');
const pageListContainer = document.getElementById('page-lists-container');
const pageList = document.getElementById('page-list');


function storeToLocal() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
};
// add optional parameters for tab organization
function getFromLocal() {
    localStorage.getItem('tabs');
};

btn1.addEventListener('click', () => {
    // add check for duplicate url, name and image can be reused, though discouraged
    pages.push({
        name: nameInput.value,
        image: imgInput.value,
        url: urlTextarea.value,
    });
});

btn2.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs[0].url); // working in extension instance
        nameInput.value = tabs[0].title;
        imgInput.value = tabs[0].favIconUrl;
        urlTextarea.value = tabs[0].url; // enter data but don't submit
        // add separate button for autofill from active tab
        console.log(tabs); // check tabs data scheme
    })
});


function renderList(arr) {
    let stringList = '';
    for (const item of textlist) {
        stringList += `<li>${item}</li>`;
    }
    pageList.innerHTML = stringList;
};

renderList();

// Stretch
// add account func to use cloud server for back-up
// add download/display-to-copy view for service migration