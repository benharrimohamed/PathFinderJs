const cols = 20;
const rows = 20;
var map = new Array(cols);
var openSet = [];
var closeSet = [];
var path = [];
var start = null;
var end = null;
var useDiagonals = false;
var withWalls = false;
var searchSpeed = 1000;

function createStats(color, message) {
  const stat = document.getElementById("stats");
  stat.innerHTML = "";
  const msg = document.createElement("h6");
  msg.classList.add("alert");
  msg.role = "alert";
  msg.classList.add(color);
  msg.innerHTML = "<strong>" + message + "<strong>";

  stat.appendChild(msg);
}

$("#searchSpeed").on("change", function() {
  searchSpeed = this.value;
});

$("#withWalls").on("change", function() {
  if ($(this).is(":checked")) {
    withWalls = $(this).is(":checked");
  } else {
    withWalls = $(this).is(":checked");
  }
});

function removeSpot(arr, element) {
  for (i = arr.length - 1; i >= 0; i--)
    if (arr[i] === element) arr.splice(i, 1);
}

function getPositionAtCenter(element) {
  const { top, left, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2
  };
}

function heuristic(a, b) {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.d = 0;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.nieghbors = [];
  this.previous = undefined;
  this.isWall = false;
  this.isStart = false;
  this.isTarget = false;

  this.createPoint = function() {
    if (end != null && start != null) {
      console.log(this.id);
      var id = this.id.split("_");
      const wall = map[id[0]][id[1]];
      wall.update("wall");
      wall.isWall = true;
    }

    if (start == null) {
      if (!this.isWall) {
        start = map[i][j];
        start.update("start");
        openSet.push(start);
        if (this.isTarget) {
          end = null;
          this.isTarget = false;
        }
        this.isStart = true;
      }
    } else {
      if (this.isStart) {
        start.update("unvisited");
        openSet = new Array();
        start = null;
        this.isStart = false;
      } else {
        if (end == null && !this.start) {
          end = map[i][j];
          end.update("target");
          this.isTarget = true;
        } else if (this.isTarget) {
          end.update("unvisited");
          end = null;
          this.isTarget = false;
        }
      }
    }
  };

  this.show = function(element, color, isWall) {
    var spot = document.createElement("div");
    spot.id = i + "_" + j;
    spot.onclick = this.createPoint;
    spot.classList.add(color);
    element.appendChild(spot);
    this.isWall = isWall;
  };

  this.addNeighbors = function(map, diagonal) {
    var i = this.i;
    var j = this.j;

    if (j < cols - 1) this.nieghbors.push(map[i][j + 1]);
    if (i < rows - 1) this.nieghbors.push(map[i + 1][j]);
    if (j > 0) this.nieghbors.push(map[i][j - 1]);
    if (i > 0) this.nieghbors.push(map[i - 1][j]);

    if (useDiagonals) {
      if (i > 0 && j > 0) this.nieghbors.push(map[i - 1][j - 1]);
      if (i < rows - 1 && j < cols - 1) this.nieghbors.push(map[i + 1][j + 1]);
      if (i > 0 && j < cols - 1) this.nieghbors.push(map[i - 1][j + 1]);
      if (i < rows - 1 && j > 0) this.nieghbors.push(map[i + 1][j - 1]);
    }
  };

  this.update = function(color) {
    var spot = document.getElementById(this.i + "_" + this.j);
    spot.className = "";
    spot.classList.add(color);
  };

  this.returnElement = function() {
    var element = document.getElementById(this.i + "_" + j);
    return element;
  };
}

for (i = 0; i < rows; i++) map[i] = new Array(rows);

for (i = 0; i < rows; i++)
  for (j = 0; j < cols; j++) map[i][j] = new Spot(i, j);

for (i = 0; i < rows; i++)
  for (j = 0; j < cols; j++) map[i][j].addNeighbors(map, false);

$("#diagonalSwitch").on("change", function() {
  if ($(this).is(":checked")) {
    useDiagonals = $(this).is(":checked");
    for (i = 0; i < rows; i++)
      for (j = 0; j < cols; j++) {
        map[i][j].nieghbors = new Array();
        map[i][j].addNeighbors(map, useDiagonals);
      }
  } else {
    useDiagonals = $(this).is(":checked");
    for (i = 0; i < rows; i++)
      for (j = 0; j < cols; j++) {
        map[i][j].nieghbors = new Array();
        map[i][j].addNeighbors(map, useDiagonals);
      }
  }
});

async function makeMap() {
  end = null;
  start = null;
  var parent = document.getElementById("board");
  parent.innerHTML = "";
  for (i = 0; i < rows; i++) {
    var element = document.createElement("div");
    element.classList.add("row");
    parent.appendChild(element);
    for (j = 0; j < cols; j++) {
      withWalls && Math.floor(Math.random() * 7) == 5
        ? map[i][j].show(element, "wall", true)
        : map[i][j].show(element, "unvisited", false);
    }
  }
}




