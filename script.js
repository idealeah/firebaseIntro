let db;

let titleInput, poemInput;
let submitPoem;

let getButton;
let getVal;

let users;
let drawingArray = [];

function setup() {
    createCanvas(800, 800);
    colorMode(HSB);
    background(random(360), 20, 100);
    textSize(20);

    db = firebase.database();

    text("poem title", 20, 50);
    titleInput = createInput();
    titleInput.position(20, 65);

    text("poem text", 20, 110);
    poemInput = createInput();
    poemInput.size(700);
    poemInput.position(20, 130);

    submitPoem = createButton('submit poem');
    submitPoem.position(20, 180);
    submitPoem.mousePressed(sendPoem);

    getButton = createButton('get a poem');
    getButton.position(20, 250);
    getButton.mousePressed(getPoem);
}

function draw() {}

function sendPoem() {
    title = titleInput.value();
    poemText = poemInput.value();
    poemInput.value(" ");
    titleInput.value(" ");

    if (title != "" && poemText != "") {

        db.ref('poems/' + title).set({
            text: poemText,
        }, function (error) {
            if (error) {
                // The write failed...
                console.log("error");
            } else {
                // Data saved successfully!
                console.log("saved!");
            }
        });
    }
}

function getPoem() {
    background(random(360), 20, 100);
    //set our path
    let ref = db.ref('poems');
    ref.on("value", gotAll);
    // The data comes back as an object
    function gotAll(data) {
        let poems = data.val();
        // Grab all the keys to iterate over the object
        let keys = Object.keys(poems);

        let num = floor(random(keys.length));

        let title = keys[num];
        console.log(title);

        textStyle(ITALIC);
        text(title, 20, 320);
        textStyle(NORMAL);

        let poemRef = db.ref('poems/' + title + "/text");
        poemRef.once("value").then(function (snapshot) {
            let poem = snapshot.val();

            let newStrings = splitWords(poem, 8);

            for (i = 0; i < newStrings.length; i++) {
                text(newStrings[i], 20, 350 + i * 30);
            }
        });
    }
}

function splitWords(txt, num) {
    let result = [];
    result = txt.split(" ");
    let newLines = [];
    for (let j = 0; j < result.length; j += num) {
        let newLine = [];
        for (let i = 0; i < num; i++) {
            newLine.push(result[i + j]);
        }
        let str = newLine.join(" ");
        newLines.push(str);
    }
    return newLines;
}