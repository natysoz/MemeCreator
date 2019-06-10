'use strict';

function saveToStorage(key, value) {
    let strValue = JSON.stringify(value);
    localStorage.setItem(key, strValue);
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function onError(err) {
    let elErr = document.querySelector('.results');
    elErr.classList.toggle('show-error');
    elErr.innerText = `Erorr on load ${err}`;
}

function getRandomID() {
    let length = 5;
    let txt = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
/*    //if ID exists! create other!
    var dbListOfIds = props.find(prop => {
        return prop.id === txt;
    });
    if (txt === dbListOfIds)
        getRandomID(props);*/
    return txt;
}