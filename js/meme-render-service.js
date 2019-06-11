'user strict';

function renderGrid() {
    let gifImages = getGifImages();
    let elGrid = document.querySelector('.gallery-container');
    let gifHTML = gifImages.map(function (gif) {
        return `<div class="grid-item"><img onclick="onSelectImage(this.src)" src="${gif}"></div>`
    }).join('');
    elGrid.innerHTML = gifHTML;
}

function renderProps(){
    let elProps = document.querySelector('.emoji-container');
    let elPropsHTML =``;
    for (var i = 1;i<=18;i++){
        elPropsHTML += `<div class="prop-item" data-name="glass" onclick="onPropAdd(this)"><img src="source/props/${i}.png"></div>`;
    }
    elProps.innerHTML = elPropsHTML;
}

function renderPopularSearchItems() {
    let keywords = loadFromStorage('keywords');
    if (!keywords || !keywords.length) {
        keywords = createFakeKeywords();
        saveToStorage('keywords',keywords)
    }
    //Set gKeywords
    gKeywords = keywords;
    //Render =>
    let elKeywords = document.querySelector('.keywords');
    let keysHTML = keywords.map(function (keyword) {
        let fontSize = normalizeFontSize(keyword.popular);
        return `<div onclick="searchGifImages(this.textContent)" class="keyword" style="font-size:${fontSize}rem"">${keyword.name}</div>`
    }).join('');
    elKeywords.innerHTML = keysHTML;
}

function normalizeFontSize(popularity){
    if(popularity < 10){
        popularity =0.8
    }
    else if(popularity >= 10 && popularity < 30 ){
        popularity = 1.3
    }
    else if(popularity >= 30 && popularity < 60 ){
        popularity = 2.0
    }
    else if(popularity >= 60 ){
        popularity = 3.0
    }
    return +popularity;
}
