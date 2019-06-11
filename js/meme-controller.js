'user strict';

//DOM GLOBAL
let canvas;
let image;
let ctx;

//Application Global Vars
let gIsDraggable = false;
let gSelectedItem;
let gSelectedFont;
let gSelectedColor;
let gSelectedSize;
let gIsEditing;

let updateField;
//transfer to Service
let appData = {
    props: [
        { line: 'What do u wanna say', id: getRandomID(), font: 'impact', size: 40, align: 'left', color: 'white', strokeColor: 'black', x: 200, y: 40 },
        { line: 'sentence number 2', id: getRandomID(), font: 'impact', size: 30, align: 'center', color: 'white', strokeColor: 'black', x: 200, y: 390, },
    ],
};

//SETUP
function onInit() {
    renderProps();
    canvasSetup();
    setEventListeners();
    renderCanvas();
    onColorChange();
    renderPopularSearchItems();
}

function canvasSetup() {
    canvas = document.querySelector('#canvas');
    image = document.querySelector('#background');
    ctx = canvas.getContext("2d");
    gSelectedItem = appData.props[0];
    gSelectedFont = 'Impact';
    gSelectedColor = 'white';
    gSelectedSize = '40';
    if (isMobileDevice()){canvas.width = 325;canvas.height = 325;}
    else {canvas.width = 400;canvas.height = 500;}
}

function setEventListeners() {
    setMouseListeners();
    setMobileListeners();
}

function renderCanvas() {
    window.requestAnimationFrame(() => {
        renderBackgroundImage(image, ctx);
        renderCanvasProps();
        renderOutlineText();
        renderOutline();
        renderCanvas();
    });
}

//RENDERS
function renderCanvasProps() {
    appData.props.forEach(item => {
        if (item.src) {
            renderProp(item.src, item.x, item.y, item.size, item.size);
        } else {
            renderText(item, item.x, item.y);
        }
    });
    if (gIsDraggable && !gSelectedItem.src) {
        renderOutline();
    }
    if (gIsDraggable && gSelectedItem.src) {
        renderOutlineText();
    }
}

function renderOutlineText() {
    if (!gSelectedItem || gSelectedItem.src) return;
    let y = gSelectedItem.y - gSelectedItem.size;
    let x = gSelectedItem.x - gSelectedItem.line.length * gSelectedItem.size / 4;
    let width = gSelectedItem.line.length * gSelectedItem.size / 2;
    let height = +gSelectedItem.size + 10;
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.setLineDash([12]);
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}

function renderOutline() {
    if (!gSelectedItem || !gSelectedItem.src) return;
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.setLineDash([12]);
    ctx.strokeRect(gSelectedItem.x, gSelectedItem.y, gSelectedItem.size, gSelectedItem.size);
    ctx.restore();
}

function renderProp(src, x, y, sizeX, sizeY) {
    ctx.drawImage(src, x, y, sizeX, sizeY);
}

function renderText(txt, x, y) {
    ctx.fillStyle = txt.color;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = txt.strokeColor;
    ctx.font = `${txt.size}px ${txt.font}`;
    ctx.textAlign = "center";
    ctx.fillText(txt.line, x, y);
    ctx.strokeText(txt.line, x, y);
}

function renderBackgroundImage(img, ctx) {
    let canvas = ctx.canvas;
    let hRatio = canvas.width / img.width;
    let vRatio = canvas.height / img.height;
    let ratio = Math.min(hRatio, vRatio);
    let centerAxisX = (canvas.width - img.width * ratio) / 2;
    let centerAxisY = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, centerAxisX, centerAxisY, img.width * ratio, img.height * ratio);
}


function updateTextFocus(){
    if(!gSelectedItem)return
    updateField = document.querySelector('#newText');
    updateField.focus();
}
//CANVAS TOOLS
function onItemSelect(x, y) {
    let sliderValue = document.querySelector(".slider");
    let currItem = appData.props.find(prop => {
        if (prop.src) {
            return (x >= prop.x && x <= prop.x + prop.size && y >= prop.y && y <= prop.y + prop.size)
        } else {
            return (y < prop.y && y > (prop.y - prop.size)) &&
                (x > prop.x && x < (prop.x + prop.line.length * (prop.size)) ||
                    (x < prop.x && x > (prop.x - prop.line.length * prop.size)))
        }
    });
    if (!currItem) {
        gSelectedItem = null;
        onInputFinish();
        return;
    }
    gIsDraggable = true;
    gSelectedItem = currItem;
    updateTextField(currItem.line);
    console.log('Selected is:', gSelectedItem);

    if (!gSelectedItem.src) {
        sliderValue.value = gSelectedItem.size;
    } else sliderValue.value = 60;
}

function onSliderScale() {
    let sliderValue = document.querySelector(".slider");
    if (!gSelectedItem) return;
    if (gSelectedItem.src) {
        gSelectedItem.size = sliderValue.value * 2.67;
    } else gSelectedItem.size = sliderValue.value;
}

function onColorChange() {
    //Text Color Custom pick
    let textClr = document.querySelector('#text-color');
    let textClrPicker = new Picker({
        parent: textClr,
        popup: 'top',
        color: 'violet',
        editorFormat: 'rgb',
        onDone: color => {
            if (!gSelectedItem || gSelectedItem.src) return;
            gSelectedItem.color = color.rgbaString;
            gSelectedColor = color.rgbaString;
            textClr.style.backgroundColor = color.rgbaString;
            updateTextField(gSelectedItem.line)
        }
    });
    textClrPicker.onChange = function (color) {
        if (!gSelectedItem || gSelectedItem.src) return;
        gSelectedItem.color = color.rgbaString;
        textClr.style.backgroundColor = color.rgbaString;
    };
}

function onFontChange(font) {
    if (!gSelectedItem) {onFontsMenu();return;}
    if (gSelectedItem.src) {onFontsMenu();return;}
    gSelectedItem.font = font.innerText;
    onFontsMenu()
}

function onTextAdd(text) {
    if (!text) return;
    if (gIsEditing) {
        gIsEditing = false;
        gSelectedItem = null;
        onInputFinish();
        checkEditToggle();
        return;
    }
    if (gSelectedItem) return;
    appData.props.push(
        {
            line: text, id: getRandomID(appData.props), font: gSelectedFont, size: gSelectedSize, align: 'center',
            color: gSelectedColor, strokeColor: 'black', x: 200, y: 200,
        }
    );
    gSelectedItem = appData.props[appData.props.length-1];
    checkEditToggle();
}

function onPropAdd(prop) {
    var name = prop.getAttribute('data-name');
    propAdd(name, prop.firstChild);
    onPropsMenu();
}

function onPropDelete() {
    if (!gSelectedItem) return;
    var delPropID = appData.props.findIndex(prop => {
        return gSelectedItem.id === prop.id;
    });
    appData.props.splice(delPropID, 1);
    gSelectedItem = null;
}

function propAdd(name, src) {
    appData.props.push(
        {
            name: name,
            id: getRandomID(appData.props),
            src: src,
            size: 128,
            x: 0,
            y: 0,
        }
    )
    gSelectedItem = appData.props[appData.props.length-1];

}

function updateTextField(txt) {
    if (gSelectedItem.src) return;
    var eInput = document.querySelector('.text-input');
    eInput.value = txt;
    eInput.style.color = gSelectedColor;
}

function onTextEditing(input) {
    if (!gSelectedItem || gSelectedItem.src) return;
    gIsEditing = true;
    checkEditToggle();
    gSelectedItem.line = input;
}

function onEnterKeyPress(e, textarea){
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
        onTextAdd(textarea);
    }
}

function checkEditToggle() {
    let p = document.querySelector('.text-button').firstChild;
    if (gIsEditing) {
        p.classList.remove('fa-plus');
        p.classList.add('fa-check');
    }
    else {
        p.classList.remove('fa-check');
        p.classList.add('fa-plus');
    }
}

//LISTENERS
function setMobileListeners() {
    canvas.ontouchstart = e => {
        onItemSelect(e.offsetX, e.offsetY);
    };
    canvas.ontouchmove = e => {
        if (gIsDraggable) {
            if (gSelectedItem.src) {
                gSelectedItem.x = e.offsetX - gSelectedItem.size / 2;
                gSelectedItem.y = e.offsetY - gSelectedItem.size / 2;
            } else {
                gSelectedItem.x = e.offsetX - gSelectedItem.size;
                gSelectedItem.y = e.offsetY + (gSelectedItem.size / 2);
            }
        }
    };
    canvas.ontouchend = () => {
        gIsDraggable = false;
    };
    canvas.ontouchcancel = () => {
        gIsDraggable = false;
    };
}

function setMouseListeners() {
    canvas.onmousedown = e => {
        updateTextFocus();
        onItemSelect(e.offsetX, e.offsetY);
    };
    canvas.onmousemove = e => {
        if (gIsDraggable) {
            if (gSelectedItem.src) {
                gSelectedItem.x = e.offsetX - gSelectedItem.size / 2;
                gSelectedItem.y = e.offsetY - gSelectedItem.size / 2;
            } else {
                gSelectedItem.x = e.offsetX - gSelectedItem.size;
                gSelectedItem.y = e.offsetY + (gSelectedItem.size / 2);
            }
        }
    };
    canvas.onmouseup = () => {
        gIsDraggable = false;
    };
    canvas.onmouseout = () => {
        gIsDraggable = false;
    };
}

function onTextLeftClick() {
    gSelectedItem.x = gSelectedItem.x - 5;
}

function onTextRightClick() {
    gSelectedItem.x = gSelectedItem.x + 5;
}

function onTextUpClick() {
    gSelectedItem.y = gSelectedItem.y - 5;
}

function onTextDownClick() {
    gSelectedItem.y = gSelectedItem.y + 5;
}

function keyHandler(key) {
    if (!gSelectedItem) return;
    switch (key) {
        case "ArrowUp":
            onTextUpClick();
            break;

        case "ArrowDown":
            onTextDownClick();
            break;

        case "ArrowRight":
            onTextRightClick();
            break;

        case "ArrowLeft":
            onTextLeftClick();
            break;
    }
}

//Buttons Functions
function onSelectImage(elGifSelect) {
    image.src = elGifSelect;
    onToggleEditMode();
}

function onPropsMenu() {
    let propsMenu = document.querySelector('.props-menu');
    propsMenu.classList.toggle('hide-modal');
}

function onFontsMenu() {
    let symbolsMenu = document.querySelector('.fonts-menu');
    symbolsMenu.classList.toggle('hide-modal');
}

function onSearchSubmit(ev) {
    ev.preventDefault();
    let userSearch = document.querySelector('.input-box');
    searchGifImages(userSearch.value);
    renderPopularSearchItems();
    userSearch.value = '';
}

function onToggleEditMode() {
    let elEditCanvas = document.querySelector('#modal');
    elEditCanvas.classList.toggle('hide-modal');
    window.scrollTo(0, 0);
    document.querySelector('body').classList.toggle('edit-mode');
}

function onInputFinish() {
    document.querySelector('.text-input').value = '';
}

function downloadCanvas(elLink) {
    gSelectedItem = null;
    renderBackgroundImage(image, ctx);
    renderCanvasProps();

    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function uploadToCanvas(ev) {
    handleImageFromInput(ev, onImageUpload)
}

function handleImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    };
    reader.readAsDataURL(ev.target.files[0]);
}

function onImageUpload(img) {
image = img;
}

