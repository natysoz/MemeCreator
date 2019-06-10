'user strict';

let gGifImages = [];
let gRequest = 10;
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
                    gGifImages.push(data.data[i].images.downsized.url)
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

