var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var xmlDoc = document.implementation.createDocument(null, "root");

function saveScore(score) {
  var node = xmlDoc.createElement("score");
  var elements = xmlDoc.getElementsByTagName("root");
  elements[0].appendChild(node);
  var text = xmlDoc.createTextNode(score);
  node.appendChild(text);

  console.log("xmlDoc", xmlDoc.text);
}

function realoadGame() {
  isAlive = true;
  gap = 85;
  bX = 10;
  bY = 150;
  gravity = 1.5;
  score = 0;
  pipe = [];
  pipe[0] = {
    x: cvs.width,
    y: 0,
  };
  draw();
}

function save(filename, data) {
  var blob = new Blob(
    [new XMLSerializer().serializeToString(data.documentElement)],
    { type: "text/csv" }
  );
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function dialogScore(message) {
  $("<div></div>")
    .appendTo("body")
    .html("<div><h6>" + message + "?</h6></div>")
    .dialog({
      modal: true,
      title: "YOU LOSE!!!",
      zIndex: 10000,
      autoOpen: true,
      width: "auto",
      resizable: false,
      buttons: {
        "Try Again": function () {
          $(this).dialog("close");
          realoadGame();
        },
        Quit: function () {
          $(this).dialog("close");
          save("score.xml", xmlDoc);
          window.close();
        },
      },
      close: function (event, ui) {
        $(this).remove();
      },
    });
}

// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// some variables

var gap = 85;
var constant;

var bX = 10;
var bY = 150;

var gravity = 1.5;

var score = 0;

// audio files

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// on key down

document.addEventListener("keydown", moveUp);

function moveUp() {
  bY -= 25;
  fly.play();
}

// pipe coordinates

var pipe = [];

pipe[0] = {
  x: cvs.width,
  y: 0,
};

var isAlive = true;

// draw images

function draw() {
  ctx.drawImage(bg, 0, 0);

  for (var i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;
    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

    pipe[i].x--;

    if (pipe[i].x == 125) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
      });
    }

    // detect collision

    if (
      (bX + bird.width >= pipe[i].x &&
        bX <= pipe[i].x + pipeNorth.width &&
        (bY <= pipe[i].y + pipeNorth.height ||
          bY + bird.height >= pipe[i].y + constant)) ||
      bY + bird.height >= cvs.height - fg.height
    ) {
      //   location.reload(); // reload the page
      isAlive = false;
      saveScore(score);
      dialogScore("YOUR SCORE IS : " + score);
      break;
    }

    if (pipe[i].x == 5) {
      score++;
      scor.play();
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);

  ctx.drawImage(bird, bX, bY);

  bY += gravity;

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : " + score, 10, cvs.height - 20);
  if (isAlive) {
    requestAnimationFrame(draw);
  }
}

draw();
