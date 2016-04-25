//Initial x,y categories
var xselection = document.getElementById("xdropdown").value;
var yselection = ydropdown.value;
var zselection = zdropdown.value;

//Get relevant min and max field values
var minRelease = Number.MAX_SAFE_INTEGER;
var maxRelease = 0;
var maxAdjusted = 0;
var maxBudget = 0;
var SetMinMax = function(MovieJSON){
  var R
  var A
  var B
  for(var i = 0; i< MovieJSON.length;i++){
  R = Number(MovieJSON[i].RELEASE);
  if (R < minRelease){
      minRelease = R;
  }
  if (R > maxRelease) {
      maxRelease = R;
  }
  A = Number(MovieJSON[i].ADJUSTED);
  if (A > maxAdjusted) {
      maxAdjusted = A;
  }
  B = Number(MovieJSON[i].ADJBUDGET);
  if (B > maxBudget) {
      maxBudget = B;
  }
};}

SetMinMax(MovieJSON);


//get Release Date Range
ReleaseRange = maxRelease-minRelease;


//Min and Max for x domain (intialize to Release Year)
var Minx = minRelease - .05*ReleaseRange;
var Maxx = maxRelease + .05*ReleaseRange;

//Min and Max for y domain (intialize to Adjusted Sales)
var Miny = 0;
var Maxy = 1.05*maxAdjusted

//Max for size doain (initialize to adjusted budget)
var Maxz = maxBudget;

//MAKE size scale legend
ThreeValues = [];
var setLegendValues = function(){
  var factor = .1;
  for (var i = 0; i<3; i++){
      ThreeValues[i] = factor*Maxz;
      factor = factor + .4;
  }
}



////Set hover titles corresonding to selection
var hoverx;
var hovery;
var hoverz;
var setHoverValues = function()
{
if(xselection == "Rotten_Tomatoes"){
          hoverx = "Rotten Tomatoes Score";
          }
      else if(xselection == "ADJBUDGET"){
          hoverx = "Adjusted Budget";
          }
      else if(xselection == "RELEASE"){
          hoverx ="Release Year";
       }
   	else if(xselection == "IMDB"){
   		hoverx ="IMDB Score";
   	}
   	else{
   		hoverx = "Adjusted Revenue";}



   	if(yselection == "Rotten_Tomatoes"){
          hovery = "Rotten Tomatoes Score";
          }
      else if(yselection == "ADJBUDGET"){
          hovery = "Adjusted Budget";
          }
   	else if(yselection == "IMDB"){
   		hovery ="IMDB Score";
   	}
   	else{hovery = "Adjusted Revenue";}



   	if(zselection == "Rotten_Tomatoes"){
          hoverz = "Rotten Tomatoes Score";
          }
      else if(zselection == "ADJBUDGET"){
          hoverz = "Adjusted Budget";
          }
      else if(zselection == "IMDB"){
          hoverz ="IMDB Score";
       }
   	else if(zselection == "ADJUSTED"){
   		hoverz = "Adjusted Revenue";}

}





//create array of points to display
var LoadData = function(s1, s2, s3) {
  //empty MoviePoints array
  var MoviePoints = [];
  for (var i = 0; i<MovieJSON.length;i++){
      var obj = MovieJSON[i];
      MoviePoints.push([obj.FILM, obj.COMPANY, Number(obj[s1]), Number(obj[s2]), Number(obj[s3])])
  }
  return MoviePoints;
}

var EaseOptions = ["sine", "elastic", "linear", "quad", "cubic", "bounce"]

///Update Scatterplot after selection
var update = function(movies){
  // Update scale domains
  xScale.domain([Minx,Maxx]);
  yScale.domain([Miny, Maxy]);

  // Update circles
  svg.selectAll("#point")
      .data(MoviePoints)  // Update with new data
      .transition()  // Transition from old to new
      .duration(1000)  // Length of animation
      .each("start", function() {  // Start animation
          d3.select(this)  // 'this' means the current element
              .attr("fill", "red")  // Change color
              .attr("r", function(d,i){return 10*Math.random()});  // Change size
      })
      .delay(function(d, i) {
          return i / movies.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
      })
      .ease(
      "cubic")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
      .attr("cx", function(d) {
          return xScale(d[2]);  // Circle's X
      })
      .attr("cy", function(d) {
          return yScale(d[3]);  // Circle's Y
      })
      .each("end", function() {  // End animation
          d3.select(this)  // 'this' means the current element
              .transition()
              .duration(500)
              //.attr("fill", "black")  // Change color
              .attr("r", function(d){
          if(zdropdown.value =="Rotten_Tomatoes")
          {return 1.2*Math.pow(d[4],.5);}
      else if(zdropdown.value =="ADJBUDGET")
          {return .0007*Math.pow(d[4],.5);}
      else if(zdropdown.value =="ADJUSTED")
          {return .00033*Math.pow(d[4],.5);}
      else if(zdropdown.value =="IMDB")
          {return 4*Math.pow(d[4],.5);}
      else if(zdropdown.value == "NONE")
          {return 5;}})

      // Update X Axis
      svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxis);

      // Update Y Axis
      svg.select(".y.axis")
          .transition()
          .duration(1000)
          .call(yAxis);
}
)
}

//Set initial hover titles
setHoverValues();


//Draw Legend
var drawlegend = function(){
  if (zselection == "NONE"){
      d3.selectAll("#LegCircle").remove();
      d3.select("#LegTitle").remove();
      d3.selectAll("#LegLabel").remove();
      return;
  }

	d3.selectAll("#LegCircle").remove();

	setLegendValues();

	d3.select("svg").selectAll("#LegCircle").data(ThreeValues).enter().append("circle").attr("id", "LegCircle").attr("cx", canvas_width - 1.8*padding).attr("cy", function(d,i) {
	var yloc = .497*canvas_height;
	return yloc + i*40;

}).attr("r", function(d){
	console.log(d)
	if(zdropdown.value =="Rotten_Tomatoes")
          {return 1.2*Math.pow(d,.5);}
  else if(zdropdown.value =="ADJBUDGET")
          {return .0007*Math.pow(d,.5);}
  else if(zdropdown.value =="ADJUSTED")
          {
          console.log("hi")
          return .00033*Math.pow(d,.5);}
  else if(zdropdown.value =="IMDB")
          {return 4*Math.pow(d,.5);}
  else if(zdropdown.value == "NONE")
          {return 0;}
  }).attr("fill", "#800080").attr("opacity",.7);




	var legLabelLoc = .507*canvas_height

//Remove previous legend labels if they exist
d3.selectAll("#LegLabel").remove();

//Create new labels
	for (var j = 0; j< 3; j++){
		console.log(j)

console.log(legLabelLoc);

	d3.select("svg").append("text").attr("id", "LegLabel").attr("text-anchor", "left")
		.attr("transform", "translate("+  (canvas_width - 1.6*padding) +","+legLabelLoc+")")  // centre below axis
  .text( function(){

if((zselection == "ADJUSTED") | (zselection == "ADJBUDGET")){
         return "$"+(1000000*Math.round((ThreeValues[j])/1000000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else{return ThreeValues[j]}
  }
)

  legLabelLoc = legLabelLoc + 40;
}

d3.select("#LegTitle").remove();
d3.select("svg").append("text").attr("id","LegTitle").attr("text-anchor", "left")
.attr("transform", "translate("+ (canvas_width - 1.8*padding) + "," + .47*canvas_height+")").text(hoverz).attr("font-size", 22);


}









//change x axis selection and then reload data
var updatex = function(d){

  xselection = xdropdown.value
  if(xselection == "RELEASE"){
      Minx = minRelease - .05*(ReleaseRange);
      Maxx = maxRelease + .05*(ReleaseRange);
  }
  if(xselection == "ADJBUDGET"){
      Minx = 0;
      Maxx = 1.05*maxBudget;
  }
  else if (xselection == "ADJUSTED"){
      Minx = 0;
      Maxx = 1.05*maxAdjusted;}
  else if (xselection == "Rotten_Tomatoes")
  {
      Minx = 0;
      Maxx = 100;
  }
  else if (xselection == "IMDB"){
      Minx = 2;
      Maxx = 10;
  }
  MoviePoints = LoadData(xselection,yselection,zselection);
  update(MoviePoints);
  xlabupdate();
  titleupdate();
  setHoverValues();
}



//change y axis selection and then reload data
var updatey = function(d){

  yselection = ydropdown.value
  if(yselection == "ADJBUDGET"){
      Miny = 0;
      Maxy = 1.05*maxBudget;
  }
  else if (yselection == "ADJUSTED"){
      Miny = 0;
      Maxy = 1.05*maxAdjusted;}
  else if (yselection == "Rotten_Tomatoes")
  {
      Miny = 0;
      Maxy = 100;
  }
  else if (yselection == "IMDB"){
      Miny = 2;
      Maxy = 10;
  }
  MoviePoints = LoadData(xselection,yselection,zselection);
  update(MoviePoints);
  ylabupdate();
  titleupdate();
  setHoverValues();
}


//change size scale selection
var Maxz = 0
var updatez = function(){
  zselection = zdropdown.value;
 	if(zselection =="Rotten_Tomatoes"){
 		Maxz = 100;
 	}
 	else if(zselection == "IMDB"){
 		Maxz = 10;
 	}
 	else if(zselection == "ADJBUDGET"){
 		Maxz = maxBudget;
 	}
 	else if (zselection == "ADJUSTED"){
 		Maxz = maxAdjusted;
 	}
   MoviePoints = LoadData(xselection,yselection,zselection);
   update(MoviePoints);
   titleupdate();
   setHoverValues();
   drawlegend();
}


// Setup settings for graphic
var canvas_width = 1000;
var canvas_height = 700;
var padding = 150;  // for chart edges


// Create initial x scale functions for RELEASE year
var xScale = d3.scale.linear()  // xScale is width of graphic
  .domain([Minx,Maxx])
  .range([padding, canvas_width - padding * 2]); // output range

var yScale = d3.scale.linear()  // yScale is height of graphic
  .domain([Miny, Maxy])
  .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

// Define X axis
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(5)
  .tickFormat(function(d) {
      if((xselection == "ADJBUDGET") | (xselection == "ADJUSTED")){
          return "$"+d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else {return d;}});

// Define Y axis
var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(6)
  .tickFormat(function(d) {
      if((yselection == "ADJUSTED") | (yselection == "ADJBUDGET")){
          return "$"+d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else{return d;}
  });

// Create SVG element For Plot
var svg = d3.select("#Scatter")  // This is where we put our vis
  .append("svg")
  .attr("width", canvas_width)
  .attr("height", canvas_height)


//Add Axis Labels
var xlabupdate = function(){
  d3.select("#xlab").remove();
  svg.append("text").attr("id","xlab")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate("+ (3*canvas_width/7) +","+(canvas_height-(.7*padding))+")")  // centre below axis
  .text(function(){
  console.log(xselection);
      if(xselection == "Rotten_Tomatoes"){
          return "Rotten Tomatoes Score";
          }
      else if(xselection == "ADJBUDGET"){
          return "Adjusted Budget";
          }
      else if(xselection == "RELEASE"){
            return "Release Year";
       }
   	else if(xselection == "IMDB"){
   		 return "IMDB Score";
   	}
   	else if(xselection == "ADJUSTED"){
   		return "Adjusted Revenue";}});

}

var ylabupdate = function(){
  d3.select("#ylab").remove();
  svg.append("text").attr("id","ylab")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", function(d){
      if(yselection == "Rotten_Tomatoes"){
          return "translate("+padding/1.4+","+(canvas_height/2)+") rotate(-90)";
          }
      else if(yselection == "IMDB"){
          return "translate("+padding/1.3+","+(canvas_height/2)+") rotate(-90)";
          }
      else {return "translate("+padding/2.7+","+(canvas_height/2)+") rotate(-90)";}})
  .text(function(){
  console.log(yselection);
      if(yselection == "Rotten_Tomatoes"){
          return "Rotten Tomatoes Score";
          }
      else if(yselection == "ADJBUDGET"){
          return "Adjusted Budget";
          }
   	else if(yselection == "IMDB"){

   		 return "IMDB Score";
   	}
   	else if(yselection == "ADJUSTED"){
   		return "Adjusted Revenue";}});

}


var first
var second
var maketitle = function(){
console.log(yselection)
console.log(xselection)
var first

  	 if(yselection == "Rotten_Tomatoes"){
          first = "Rotten Tomatoes Score";
          }
      else if(yselection == "ADJBUDGET"){
          first = "Adjusted Budget";
          }
   	else if(yselection == "IMDB"){
   		 first = "IMDB Score";
   	}
   	else if(yselection == "ADJUSTED"){
   		first = "Adjusted Revenue";}
var second

		if(xselection == "Rotten_Tomatoes"){
          second = "Rotten Tomatoes Score";
          }
      else if(xselection == "ADJBUDGET"){
          second = "Adjusted Budget";
          }
      else if(xselection == "RELEASE"){
          second ="Release Year";
       }
   	else if(xselection == "IMDB"){
   		second ="IMDB Score";
   	}
   	else if(xselection == "ADJUSTED"){
   		second = "Adjusted Revenue";}

trial = first + " vs " + second;
   return trial;
}




var titleupdate = function(){
  d3.select("#ScatterTitle").remove();
  svg.append("text").attr("id","ScatterTitle")
  .attr("text-anchor", "middle")
  .attr("transform", "translate("+canvas_width/2.4+","+padding/2+")")
  .text(maketitle())
	.attr("font-size", "30")}






var xvalue;
var yvalue;
var zvalue;
var formattedValues = function(point){
	 if(xselection == ("ADJBUDGET") | xselection == ("ADJUSTED") ) {
          xvalue = "$"+point[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else {xvalue = point[2];}

	if(yselection == ("ADJBUDGET") | yselection == ("ADJUSTED") ) {
          yvalue = "$"+point[3].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else {yvalue = point[3];}

   if(zselection == ("ADJBUDGET") | zselection == ("ADJUSTED") ) {
          zvalue = "$"+point[4].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else {zvalue = point[4];}



}




//Load Initial Data
MoviePoints = LoadData(xselection,yselection,zselection);

//Set initial x axis label
xlabupdate();

//Set intial y labels
ylabupdate();

//Set Initial size scale and legend
updatez();
setLegendValues();
drawlegend()

//Set initial title
titleupdate();







//Creating a custom tip element for the hovering on the bubbles
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {formattedValues(d);
      return "<strong>Movie Name:</strong> <span style='color:red'>" + d[0] + " </span> <br/>"
          +  "<strong>Franchise:</strong> <span style='color:red'>" + d[1] + " </span> <br/>"
          +  "<strong>"+hoverx+":</strong> <span style='color:red'>" + xvalue + " </span> <br/>"
          +  "<strong>"+hovery+":</strong> <span style='color:red'>" + yvalue + " </span> <br/>"
           +  "<strong>"+hoverz+":</strong> <span style='color:red'>" + zvalue + " </span> <br/>";
    })
    svg.call(tip);





var selections = {"DC":null, "Marvel":null};

// Create Circles
d3.select("svg").selectAll("#point")
  .data(MoviePoints)
  .enter()
  .append("circle")  // Add circle svg
  .attr("id","point").attr("cx", function(d) {
      if ( (d[0] == "League of Extraordinary Gentlemen") & (xselection == "RELEASE") & (yselection =="ADJUSTED") &(zselection == "ADJBUDGET")){
      return xScale(d[2])-5;  // Circle's X
      }
      else { return xScale(d[2]);}
      })
  .attr("cy", function(d) {  // Circle's Y
      return yScale(d[3]);
      })
  .attr("r", function(d){
      if(zdropdown.value =="Rotten_Tomatoes")
          {return 1.2*Math.pow(d[4],.5);}
      else if(zdropdown.value =="ADJBUDGET")
          {return .0007*Math.pow(d[4],.5);}
      else if(zdropdown.value =="ADJUSTED")
          {return .00033*Math.pow(d[4],.5);}
      else if(zdropdown.value =="IMDB")
          {return 4*Math.pow(d[4],.5);}
      else if(zdropdown.value == "NONE")
          {return 5}})
  .style("fill", function(d){
      if (d[1] == "DC"){
          return "blue";}
          else {return "red";}})
  .style("opacity",.6)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)
  .on("click", function(d) {
      selections[d[1]] = d[0]
      console.log(selections);
      if(selections["DC"] != null && selections["Marvel"] != null){
          console.log("Populating world map with comparison data");
          drawBubbles(selections["DC"], selections["Marvel"]);
      } else if(selections["DC"] != null){
          console.log("Can populate DC data or you can select a marvel movie to compare");
          drawBubbles(selections["DC"], "");
      } else if(selections["Marvel"] != null){
          console.log("Can populate Marvel data or you can select a DC movie to compare");
          drawBubbles("", selections["Marvel"]);
      } else {
          console.log("Populating world map with comparison data");
      }
  });

 /* //Create Circle Scale Legend
  d3.select("svg").append("circle").attr("cx", canvas_width - padding/5).attr("cy", canvas_height/2).attr("r", if(zdropdown.value =="Rotten_Tomatoes")
          {return .1*10}
      else if(zdropdown.value =="BUDGET")
          {return .0007*Math.pow(10000000,.52)}
      else if(zdropdown)*/

// Add X axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (canvas_height - padding) +")")
  .call(xAxis);

// Add Y axis
svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + padding +",0)")
  .call(yAxis);