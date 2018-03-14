/**
 * Created by 204071207 on 1/17/17.
 */


var urlGlobal;

function generateImageURL() {

    var width = getRandomInt(3400, 3300);
    var height = getRandomInt(3400, 3300);
    var foreground = getRandomInt(0, 0xFFFFFF).toString(16);
    var background = getRandomInt(0, 0xFFFFFF).toString(16);
    var textSize = getRandomInt(70, 65);
    var uuid = "";

    for(var ndx=0; ndx<100; ndx++) {
        uuid += guid();
    }

    var url =  "https://placeholdit.imgix.net/~text?txtsize=" + textSize + "&fm=png&bg=" + background + "&txtclr=" + foreground + "&w=" + width + "&h=" + height + "&txt=" + uuid+".jpg";
    urlGlobal = url;
    return url;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
