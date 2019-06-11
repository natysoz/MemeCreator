'user strict';

let gGifImages = [];
let gRequest = 12;
let gKeywords;


function getAPI() {
    return 'N9UIhNLVw7DiqthgNVHpBJkUGxrwkuxl';
}

function searchGifImages(userSearch) {
    submitSearchItem(userSearch);
    gGifImages = [];
    saveToStorage('gifs', gGifImages);
    if (userSearch === '') return;
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${getAPI()}&q=${userSearch}&limit=${gRequest}`;
    fetch(url)
        .then((resp) => resp.json()
            .then(function (data) {
                for (let i = 0; i < gRequest; i++) {
                    gGifImages.push(data.data[i].images.fixed_height.url)
                }
                saveToStorage('gifs', gGifImages);
                renderGrid(gGifImages);
            })).catch(err => {
        onError(err);
    });
};

function getGifImages() {
    return loadFromStorage('gifs');
}

function createFakeKeywords() {
    return [
        createKeyword('trump', '11'),
        createKeyword('XMEN', '37'),
        createKeyword('Dragon ball', '500'),
        createKeyword('kim kardashian', '25'),
        createKeyword('POKEMON', '12'),
        createKeyword('South Park', '30'),
    ]
}

function createKeyword(name, popular) {
    return {
        name: name,
        popular: popular,
    }
}

function saveKeywords() {
    saveToStorage('keywords', gKeywords)
}

function submitSearchItem(searchTerm) {
    pushNewKeyword(searchTerm);
    renderPopularSearchItems()
}

function pushNewKeyword(searchTerm) {
    var search = gKeywords.find(keyword => {
        return keyword.name === searchTerm
    });
    if (search) {
        gKeywords.map(function (keyword) {
            if (keyword.name === searchTerm) {
                let keywordValue = keyword.popular;
                keyword.popular = +keywordValue + 1;
            }
        });
    } else {
        gKeywords.shift();
        gKeywords.push({name: searchTerm, popular: '5'});
    }
    saveKeywords()
}

function onLoadMoreGifs() {
    //TODO:  create andother function that will Not clear , but Append to the curr Array
}

function fileMove() {
    if (navigator.appName == "Microsoft Internet Explorer") {
        return; // Don't need to do this in IE.
    }
    var link = document.getElementById("fileLink");
    var form = document.getElementById("uploadForm");
    var x = pageX(link);
    var y = pageY(link);
    form.style.position = 'absolute';
    form.style.left = x + 'px';
    form.style.top = y + 'px';
}

function fileBrowse() {
    // This works in IE only. Doesn't do jack in FF. :(
    var browseField = document.getElementById("uploadForm").file;
    browseField.click();
}
