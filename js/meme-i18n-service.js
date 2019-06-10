'use strict';

let gCurrLang = loadFromStorage('currLang');
let gTrans = {
    // TODO TRANSLATE all words in the application (H1 h2 )
    title: {
        en: 'MeMe Creator!',
        he: 'מחולל הממים!'
    },
};

function doTranslate() {
    let els = document.querySelectorAll('[data-trans]');
    for (let i = 0; i < els.length; i++) {
        let el = els[i];
        let transKey = el.getAttribute('data-trans');
        let txt = getTrans(transKey);
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt);
        } else {
            el.innerText = txt;
        }
    }
    if (gCurrLang === 'he') {
        document.body.classList.add('rtl');
    } else document.body.classList.remove('rtl');

}

function getTrans(transKey) {
    let keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN';
    let txt = keyTrans[gCurrLang];
    if (!txt) txt = keyTrans['en'];
    return txt;
}

function setLang(chooseLang) {
    gCurrLang = chooseLang;
    saveToStorage('currLang', gCurrLang);
}