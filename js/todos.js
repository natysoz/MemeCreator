
// TODO
//  Images list/Gallery	Render images as Gallery for image selection........TODO DONE
// Core	Draw image to canvas................................................TODO DONE
// Core	Support single text line (but prepare for more).....................TODO DONE
// Core	Support going back to Gallery.......................................TODO DONE
// Editor	Increase / decrease font size...................................TODO DONE
// Editor	Text color......................................................TODO DONE
// Editor	Type and Change Text............................................TODO DONE
// Core	Download button.....................................................TODO DONE
// Core	Navigation (Desktop/Mobile).........................................TODO DONE
// Images list	Filter images list by search box............................TODO DONE
// Editor	Support adding multiple lines ("add line" button)...............TODO DONE
// Images list	Filter images list by popular-keyword.......................TODO DONE
// Editor	Align left, right, center.......................................TODO DONE
// Editor	Select font.....................................................TODO DONE
// Editor	Move lines up/down/left/right with buttons......................TODO DONE
// Editor	Delete line.....................................................TODO DONE
// Home	About us............................................................WIP Naty?
//

// TODO BONUS
// 	Animations: When switching between list and editor, slide right /.......TODO DONE
// 	Dragging lines..........................................................TODO DONE ,ido please use it in controller
// 	When submitting the contact-us - open the gmail complete link...........WIP NATY
//TODO
//Should be on Controller
function onSendMail(){
    let mail = document.querySelector('.');
    let sub = document.querySelector('.');
    let msg = document.querySelector('.');
    sendMail(mail,sub,msg);
}
//Should be on Service
function sendMail(mail,sub,msg) {
    let url = createEmailUrl(mail.value,sub.value,msg.value)
    redirectTo(url);
}
//Should Go to Utils
function createEmailUrl(mail,subject,body){
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${mail}&su=${subject}&body=${body}&bcc=someone.else@example.com`
}
//Should Go to Utils
function redirectTo(url){
    window.location.href = url;
}

// 	Animations: while filtering the list....................................TODO DONE
// 	Upload from device / camera.............................................TODO DONE
// 	Hexagons................................................................TODO UGLY NO!
// 	Share on Facebook.......................................................NATY IDO
// 	Allow switching the UI to hebrew........................................NATY WIP
// 	Animations: When hovering an image zoom-in..............................TODO DONE
// controller/MVC TODO
// **brush  TODO

