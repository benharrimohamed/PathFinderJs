
var visitedSet = new Array();
var unvisitedSet = new Array();

async function dijkstra ()
{
	for(i=0;i<rows-1;i++)
		for (j=0;j<cols-1;j++)
			unvisitedSet.push (map[i][j]);


	var current = start;
	current.d = 0;

	while (unvisitedSet.length > 0)
	{


    if (current == end)
		{
			path = [];
      var tmp = current;
      path.push(tmp);
      while (tmp.previous) {
        path.push(tmp.previous);
        tmp = tmp.previous;
      }

      for (i = path.length - 1; i > 0; i--) {
        path[i].update("path");
        await sleep(pathSpeed);
      }

      
      return;
		}

     
		

		console.log(current);
		console.log(unvisitedSet.length);


		neighbors = current.nieghbors;
		var winnerSet = new Array();
		for (n=0 ; n < neighbors.length ; n++)
		{
			neighbor = neighbors[n];
			if (!visitedSet.includes(neighbor) && !neighbor.isWall)
			{

			
			    neighbor.update("checking");
				neighbor.d = current.d + heuristic(neighbor.returnElement(), end.returnElement());
				neighbor.previous = current;
				winnerSet.push(neighbor);
			} 

		}
        
        visitedSet.push (current);
        removeSpot(unvisitedSet, current);
        current.update("visited");
        console.log (minDistance(winnerSet))
		current = minDistance(winnerSet);


		await sleep(searchSpeed);

	}

}

function minDistance (arr)
{
   var min = arr[0];

   for (i=1;i<arr.length;i++)
   {
   	if (min.d > arr[i].d)
   		min = arr[i]
   }
   
   return min;
}