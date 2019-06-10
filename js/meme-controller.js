'user strict';

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
let gIsEditing;
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
    onColorChange();
    renderPopularSearchItems();
}

function canvasSetup() {
    canvas = document.querySelector('#canvas');
    image = document.querySelector('#background');
    backgroundImage = document.querySelector('#background');
    ctx = canvas.getContext("2d");
    gSelectedItem = appData.props[0];
    gSelectedFont = 'Impact';
    gSelectedColor = 'white';
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
    //TODO Render with ForEach
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
    if (isDraggable && !isText) {
        renderOutlineText();
    }
}

function renderOutlineText() {
    let y = gSelectedItem.y - gSelectedItem.size;
    let x = gSelectedItem.x - gSelectedItem.line.length * gSelectedItem.size / 4;
    let width = gSelectedItem.line.length * gSelectedItem.size / 2;
    let height = gSelectedItem.size + 10;
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.setLineDash([12]);
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
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
    if (!currItem) {gSelectedItem=null; return};
    isDraggable = true;
    gSelectedItem = currItem;
    updateTextField(currItem.line);
    console.log('Selected is:', gSelectedItem);

}

function onSliderScale() {
    let sliderValue = document.querySelector(".slider");
    if (!gSelectedItem)return;
    if (gSelectedItem.src) {
        gSelectedItem.size = sliderValue.value *2.67;
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
            if(!gSelectedItem || gSelectedItem.src) return;
            gSelectedItem.color = color.rgbaString;
            gSelectedColor =color.rgbaString;
            textClr.style.backgroundColor = color.rgbaString;
            updateTextField(gSelectedItem.line)
        }
    });
    textClrPicker.onChange = function (color) {
        if(!gSelectedItem || gSelectedItem.src) return;
        gSelectedItem.color = color.rgbaString;
        textClr.style.backgroundColor = color.rgbaString;
    };
}

function onFontChange(font) {
    if (!gSelectedItem) return;
    if (gSelectedItem.src) return;
    gSelectedItem.font = font.innerText;
    onFontsMenu()
}

function onTextAdd(text) {
    if (!text) return;
    if (gIsEditing){
        gIsEditing=false;
        gSelectedItem=null;
        cleanFields();
        checkEditToggle();
        return;
    }
    if(gSelectedItem)return;
    appData.props.push(
        {line: text, id: getRandomID(appData.props), font: gSelectedFont, size: gSelectedSize, align: 'center',
         color: gSelectedColor, strokeColor: 'black', x: 200, y: 200,}
    );
    checkEditToggle();
}

function onPropAdd(prop){
    var name = prop.getAttribute('data-name'); // fruitCount = '12'
    propAdd(name,prop.firstChild);
    onPropsMenu();
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

function updateTextField(txt){
    if (gSelectedItem.src) return;
    var eInput = document.querySelector('.text-input');
    eInput.value =txt ;
    eInput.style.color = gSelectedColor;


}

function onTextEditing(input){
    if(!gSelectedItem || gSelectedItem.src) return;
    gIsEditing=true;
    checkEditToggle();
    document.querySelector('.text-button').classList.toggle('btn');
    gSelectedItem.line =input;
}

function checkEditToggle(){
    console.log('checking')
    let p = document.querySelector('.text-button').firstChild;
    if (gIsEditing){
        p.classList.remove('fa-plus');
        p.classList.add('fa-check');
    }
    else{
        document.querySelector('.text-button').classList.toggle('btn');
        p.classList.remove('fa-check');
        p.classList.add('fa-plus');
    }
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

function onSearchSubmit(ev, searchTerm = '') {
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



// TODO MORE FEATURES
function cleanFields() {
    document.querySelector('.text-input').value = '';
}

function onLoadMoreGifs() {
    //TODO:  create andother function that will Not clear , but Append to the curr Array
}

function onLangSelect(elLangSelect) {
    // TODO: Let the user Select Language , then send to Service to save the Lang
}

// TODO functions to push into SERVICE >>

function downloadCanvas() {
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
}

function uploadToCanvas() {
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}