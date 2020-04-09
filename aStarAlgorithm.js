async function astar() {
  if (start == null) {
    createStats("alert-danger", "Start point is missing !");
    return;
  }

  if (end == null) {
    createStats("alert-danger", "End point is missing !");
    return;
  }

  while (openSet.length > 0) {
    var winner = 0;
    for (i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (current === end) {
      path = [];
      var tmp = current;
      path.push(tmp);
      while (tmp.previous) {
        path.push(tmp.previous);
        tmp = tmp.previous;
      }

      for (i = path.length - 1; i > 0; i--) {
        path[i].update("path");
        await sleep(250);
      }

      createStats("alert-success", "We found the target point ");
      return;
    }

    removeSpot(openSet, current);

    for (i = 0; i < openSet.length; i++) openSet[i].update("checking");
    closeSet.push(current);
    for (i = 0; i < closeSet.length; i++) closeSet[i].update("visited");

    var nieghbors = current.nieghbors;
    for (i = 0; i < nieghbors.length; i++) {
      var nieghbor = nieghbors[i];

      if (!closeSet.includes(nieghbor) && !nieghbor.isWall) {
        var tmpG = nieghbor.g + 1;

        if (openSet.includes(nieghbor)) {
          if (tmpG < nieghbor.g) {
            nieghbor.g = tmpG;
          }
        } else {
          nieghbor.g = tmpG;
          openSet.push(nieghbor);
        }

        nieghbor.h = heuristic(nieghbor.returnElement(), end.returnElement());
        nieghbor.f = nieghbor.g + nieghbor.h;
        nieghbor.previous = current;
      }
    }

    await sleep(searchSpeed);
  }

  createStats("alert-info", "We coudn't find you target point ");
}


const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};