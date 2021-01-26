var b1, inp, heading, greeting, storeInp, reset;
var gs = 0;
var plc = 0;
var link = 0;

var car1, car2;
var cars = [];

var winalert;

var db;
var pd;

var cimg1, cimg2, trackimg;

function preload() {
  cimg1 = loadImage("s/car1.png");
  cimg2 = loadImage("s/car2.png");
  trackimg = loadImage("s/track.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight-30);

  car1 = createSprite(600, 900, 30, 60);
  car1.addImage("car 1 image", cimg1);
  car2 = createSprite(1200, 900, 30, 60);
  car2.addImage("car 2 image", cimg2);
  cars = [car1, car2];

  b1 = createButton("Submit");
  b1.position(910, 570);

  reset = createButton("Reset");
  reset.position(910, 700)

  inp = createInput().attribute("placeholder", "Username");
  inp.position(850, 530);

  heading = createElement("h1");
  heading.html("Car Racing Game");
  heading.position(815, 60);

  b1.mousePressed(button);
  reset.mousePressed(resetButton);

  db = firebase.database();
  db.ref("gamestate").on("value", function(data) {
    gs = data.val();
  })

  db.ref("plCount").on("value", function(data) {
    plc = data.val();
  })

  console.log("working");
}

function draw() {
  background(74);

  stroke("black");
  //text(mouseX + ", " + mouseY, mouseX, mouseY);
  if(gs===1 && pd===undefined) {
    db.ref("players").on("value", function(data) {
      pd = data.val();
    })
  }
  if(plc === 2) {
    db.ref("/").update({gamestate:1});
  }
  if(gs === 1) {
    var initx = 660;
    var indexnumber = 0;
    imageMode(CENTER);
    image(trackimg, windowWidth/2, -windowHeight, windowWidth, 7848);
    drawSprites();
    for(var i in pd) {
      camera.position.y = cars[link-1].y
      stroke("White");
      fill("White");
      textAlign(CENTER);
      text(inp.value(), cars[link-1].x, cars[link-1].y+60);
      cars[indexnumber].x = initx;
      initx += 605;
      cars[indexnumber].y = pd[i].y;
      indexnumber++;
    }
    if(keyDown(UP_ARROW)) {
      cars[link-1].y -= 60;
      db.ref("players/player" + link).update({y:cars[link-1].y})
    }
    if(cars[link-1].y<-4740){
      winalert = alert("YOU WON!");
      gs=2;
      db.ref("/").update({gamestate:2});
    }
  }
  if(gs===2){
    winalert.hide();
  }
}

function button() {
  plc++;
  db.ref("/").update({plCount : plc});
  link = plc;
  
  storeInp = inp.value();

  greeting = createElement("h1");
  greeting.html("Welcome " + storeInp + "!");
  greeting.position(840, (windowHeight-30)/2);

  inp.hide();
  b1.hide();

  db.ref("players/player" + plc).set({y:2820});
}

function resetButton() {
  plc = 0;
  gs = 0;
  db.ref("/").update({plCount:plc, gamestate:gs});
  db.ref("players").remove();
  window.location.reload();
}