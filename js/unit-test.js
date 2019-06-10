'use strict';

let canvas;
let image;
let backgroundImage;
let ctx;
let isDraggable = false;
let isText = true;

//Application Global Vars
let gSelectedItem;
let gSelectedFont;
let gSelectedColor;
let gSelectedSize;
let appData = {
    props: [
        {line: 'What do u wanna say', id: getRandomID(), font: 'impact', size: 40, align: 'left', color: 'white', strokeColor: 'black', x: 200, y: 40},
        {line: 'sentence number 2', id: getRandomID(), font: 'impact', size: 30, align: 'center', color: 'white', strokeColor: 'black', x: 200, y: 485,},
    ],
};

//SETUP
function onInit() {
    canvasSetup();         // SETUP CANVAS
    setEventListeners();   // LISTEN!
    renderCanvasProps();   // Render Items
}

function canvasSetup() {
    canvas = document.querySelector('#canvas');
    image = document.querySelector('#background');
    backgroundImage = document.querySelector('#background');
    ctx = canvas.getContext("2d");
    gSelectedItem = appData.props[0];
    gSelectedFont = 'Impact';
    gSelectedColor = 'red';
    gSelectedSize = '40';
    gSelectedItem = appData.props[1];
}

function renderCanvasProps() {
    window.requestAnimationFrame(() => {
        resetCanvas();
        renderBackgroundImage(image, ctx);
        renderCanvas();
        renderCanvasProps();
    });
}

//RENDERS
function resetCanvas() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function renderCanvas() {
    appData.props.forEach(item => {
        if (item.src) {
            renderProp(item.src, item.x, item.y, item.size, item.size);
        } else {
            renderText(item, item.x, item.y);
        }
    });
    if (isDraggable && !isText) {
        renderOutline();
    }
}

function renderOutline() {
    ctx.strokeStyle = "white";
    //ctx.setLineDash([12]);
    ctx.strokeRect(gSelectedItem.x, gSelectedItem.y, gSelectedItem.size, gSelectedItem.size);
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

function renderBackgroundImage(image, ctx) {
    let canvas = ctx.canvas;
    let hRatio = canvas.width / image.width;
    let vRatio = canvas.height / image.height;
    let ratio = Math.min(hRatio, vRatio);
    let centerAxisX = (canvas.width - image.width * ratio) / 2;
    let centerAxisY = (canvas.height - image.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, image.width, image.height, centerAxisX, centerAxisY, image.width * ratio, image.height * ratio);
}

//CANVAS TOOLS
function onItemSelect(x, y) {
    let currItem = appData.props.find(prop => {
        if (prop.src) {
            isText = false;
            return (x >= prop.x && x <= prop.x + prop.size && y >= prop.y && y <= prop.y + prop.size)
        } else {
            isText = true;
            return (y < prop.y && y > (prop.y - prop.size)) &&
                (x > prop.x && x < (prop.x + prop.line.length * (prop.size)) ||
                    (x < prop.x && x > (prop.x - prop.line.length * prop.size)))
        }
    });
    if (!currItem) return;
    isDraggable = true;
    gSelectedItem = currItem;
    console.log('Selected is:', gSelectedItem)
}

function onSliderScale() {
    let sliderValue = document.querySelector(".slider");
    if (gSelectedItem.src) {
        gSelectedItem.size = sliderValue.value *2.67;
    } else gSelectedItem.size = sliderValue.value;
}

function onColorChange(clr) {
    if (gSelectedItem.src) return;
    gSelectedItem.color = clr;
}

function onTextChange(text) {
    if (gSelectedItem.src) return;
    gSelectedItem.line = text;
}

function onFontChange(font) {
    if (!gSelectedItem) return;
    if (gSelectedItem.src) return;
    gSelectedItem.line = font;
}

function onTextAdd(text) {
    if (!text) return;
    appData.props.push(
        {
            line: text,
            id: getRandomID(appData.props),
            font: gSelectedFont,
            size: gSelectedSize,
            align: 'center',
            color: gSelectedColor,
            strokeColor: 'black',
            x: 200,
            y: 200,
        }
    )
}

function onPropAdd(prop){
    propAdd('kiss',prop.firstChild);
}

function onPropDelete(){
    if(!gSelectedItem) return;
    var delPropID = appData.props.findIndex(prop=>{
        return gSelectedItem.id === prop.id;
    });
    appData.props.splice(delPropID,1);
    gSelectedItem = null;
}

//SERVICE
function propAdd(name, src) {
    appData.props.push(
        {
            name: name,
            id:getRandomID(appData.props),
            src: src,
            size: 128,
            x: 0,
            y: 0,
        }
    )
}

//LISTENERS
function setEventListeners() {
    setMouseListeners();
    setMobileListeners();
}
function setMobileListeners() {
    canvas.ontouchstart = e => {
        onItemSelect(e.offsetX, e.offsetY);
    };
    canvas.ontouchmove = e => {
        if (isDraggable) {
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
        isDraggable = false;
    };
    canvas.ontouchcancel = () => {
        isDraggable = false;
    };
}
function setMouseListeners() {
    canvas.onmousedown = e => {
        onItemSelect(e.offsetX, e.offsetY);
    };
    canvas.onmousemove = e => {
        if (isDraggable) {
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
        isDraggable = false;
    };
    canvas.onmouseout = () => {
        isDraggable = false;
    };
}