


//Initial x,y categories
var xselection = document.getElementById("xdropdown").value;
var yselection = ydropdown.value;
var zselection = zdropdown.value;

//Get relevant min and max field values
var minRelease = Number.MAX_SAFE_INTEGER;
var maxRelease = 0;
var maxAdjusted = 0;
var maxBudget = 0;
var SetMinMax = function(MovieJSON) {
    var R
    var A
    var B
    for (var i = 0; i < MovieJSON.length; i++) {
        R = Number(MovieJSON[i].RELEASE);
        if (R < minRelease) {
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
    };
}

SetMinMax(MovieJSON);


//get Release Date Range
ReleaseRange = maxRelease - minRelease;


//Min and Max for x domain (intialize to Release Year)
var Minx = minRelease - .05 * ReleaseRange;
var Maxx = maxRelease + .05 * ReleaseRange;

//Min and Max for y domain (intialize to Adjusted Sales)
var Miny = 0;
var Maxy = 1.05 * maxAdjusted

//Max for size doain (initialize to adjusted budget)
var Maxz = maxBudget;

//MAKE size scale legend
ThreeValues = [];
var setLegendValues = function() {
    var factor = .1;
    for (var i = 0; i < 3; i++) {
        ThreeValues[i] = factor * Maxz;
        factor = factor + .4;
    }
}



////Set hover titles corresonding to selection
var hoverx;
var hovery;
var hoverz;
var setHoverValues = function() {
    if (xselection == "Rotten_Tomatoes") {
        hoverx = "Rotten Tomatoes";
    } else if (xselection == "ADJBUDGET") {
        hoverx = "Budget";
    } else if (xselection == "RELEASE") {
        hoverx = "Release Year";
    } else if (xselection == "IMDB") {
        hoverx = "IMDB Score";
    } else {
        hoverx = "Revenue";
    }



    if (yselection == "Rotten_Tomatoes") {
        hovery = "Rotten Tomatoes";
    } else if (yselection == "ADJBUDGET") {
        hovery = "Budget";
    } else if (yselection == "IMDB") {
        hovery = "IMDB Score";
    } else {
        hovery = "Revenue";
    }



    if (zselection == "Rotten_Tomatoes") {
        hoverz = "Rotten Tomatoes";
    } else if (zselection == "ADJBUDGET") {
        hoverz = "Budget";
    } else if (zselection == "IMDB") {
        hoverz = "IMDB Score";
    } else if (zselection == "ADJUSTED") {
        hoverz = "Revenue";
    }

}




//create array of points to display
var LoadData = function(s1, s2, s3) {
    //empty MoviePoints array
    var MoviePoints = [];
    for (var i = 0; i < MovieJSON.length; i++) {
        var obj = MovieJSON[i];
        MoviePoints.push([obj.FILM, obj.RELEASE, obj.COMPANY, Number(obj[s1]), Number(obj[s2]), Number(obj[s3]), obj.Characters])
    }
    return MoviePoints;
}

//Determine which selected scales are unique (for hover display)
var unique = "";
var getunique = function(){
    var xunique = "x";
    var yunique = "y";
    var zunique = "z";
    if(xselection =="RELEASE"){xunique = "";}
    if(yselection == xselection){yunique ="";}
    if((zselection == xselection) | (zselection == yselection)|(zselection=="NONE")){zunique = "";}

    unique = xunique+yunique+zunique;

}






var EaseOptions = ["sine", "elastic", "linear", "quad", "cubic", "bounce"]

///Update Scatterplot after selection
var update = function(movies) {
    // Update scale domains
    xScale.domain([Minx, Maxx]);
    yScale.domain([Miny, Maxy]);

    // Update circles
    svg.selectAll("#point")
        .data(MoviePoints) // Update with new data
        .transition() // Transition from old to new
        .duration(1000) // Length of animation
        .each("start", function() { // Start animation
            d3.select(this) // 'this' means the current element
                .attr("fill", "red") // Change color
                .attr("r", function(d, i) {
                    return 10 * Math.random()
                }); // Change size
        })
        .delay(function(d, i) {
            return i / movies.length * 500; // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(
            "cubic") // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("cx", function(d) {
        if ((d[0] == "Constantine") & (xselection == "RELEASE") & (yselection == "ADJBUDGET"))  {
            return xScale(d[3]) - 3; // Circle's X
        } 
        else if ((d[0] == "League of Extraordinary Gentlemen") & ((xselection == "ADJBUDGET")|(xselection == "ADJUSTED")|(xselection == "RELEASE")) & ((yselection == "ADJBUDGET")|(yselection == "ADJUSTED")) & ((zselection == "ADJBUDGET")|(zselection == "ADJUSTED"))) {
            return xScale(d[3]) - 3; // Circle's X
        }
         else if ((d[0] == "Spider-Man 2") & ((xselection == "Rotten_Tomatoes")|(xselection == "IMDB")) & ((xselection == "Rotten_Tomatoes")|(xselection == "IMDB"))) {
            return xScale(d[3]) - 4; // Circle's X
        }
        else {
            return xScale(d[3]);
        }
    })
        .attr("cy", function(d) {
            return yScale(d[4]); // Circle's Y
        })
        .each("end", function() { // End animation
            d3.select(this) // 'this' means the current element
                .transition()
                .duration(500)
                //.attr("fill", "black")  // Change color
                .attr("r", function(d) {
                    if (zdropdown.value == "Rotten_Tomatoes") {
                        return 1.2 * Math.pow(d[5], .5);
                    } else if (zdropdown.value == "ADJBUDGET") {
                        return .0007 * Math.pow(d[5], .5);
                    } else if (zdropdown.value == "ADJUSTED") {
                        return .00033 * Math.pow(d[5], .5);
                    } else if (zdropdown.value == "IMDB") {
                        return 4 * Math.pow(d[5], .5);
                    } else if (zdropdown.value == "NONE") {
                        return 5;
                    }
                })

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
        })
}

//Set initial hover titles
setHoverValues();


//Draw Legend
var drawlegend = function() {
    if (zselection == "NONE") {
        d3.selectAll("#LegCircle").remove();
        d3.select("#LegTitle").remove();
        d3.selectAll("#LegLabel").remove();
        return;
    }

    d3.selectAll("#LegCircle").remove();

    setLegendValues();

    d3.select("#Splot").selectAll("#LegCircle").data(ThreeValues)
    .enter()
    .append("circle")
    .attr("id", "LegCircle")
    .attr("cx", canvas_width - 1.8 * xpadding)
    .attr("cy", function(d, i) {
        var yloc = .59 * canvas_height;
        return yloc + i * 40;

    }).attr("r", function(d) {
        if (zdropdown.value == "Rotten_Tomatoes") {
            return 1.2 * Math.pow(d, .5);
        } else if (zdropdown.value == "ADJBUDGET") {
            return .0007 * Math.pow(d, .5);
        } else if (zdropdown.value == "ADJUSTED") {
            return .00033 * Math.pow(d, .5);
        } else if (zdropdown.value == "IMDB") {
            return 4 * Math.pow(d, .5);
        } else if (zdropdown.value == "NONE") {
            return 0;
        }
    }).transition().duration(800).delay(1700).attr("fill", "#800080").attr("opacity", .7);




    var legLabelLoc = .602 * canvas_height

    //Remove previous legend labels if they exist
    d3.selectAll("#LegLabel").remove();

    //Create new labels
    for (var j = 0; j < 3; j++) {

        d3.select("#Splot").append("text").attr("id", "LegLabel").attr("text-anchor", "left")
            .style("fill","#2c2b2b").attr("transform", "translate(" + (canvas_width - 1.65 * xpadding) + "," + legLabelLoc + ")") // centre below axis
            .text(function() {

                if ((zselection == "ADJUSTED") | (zselection == "ADJBUDGET")) {
                    return "$" + (1000000 * Math.round((ThreeValues[j]) / 1000000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return ThreeValues[j]
                }
            })

        legLabelLoc = legLabelLoc + 40;
    }

    d3.select("#LegTitle").remove();
    d3.select("#Splot").append("text").style("fill","#2c2b2b").attr("id", "LegTitle").attr("text-anchor", "left")
        .attr("transform", "translate(" + (canvas_width - 1.8 * xpadding) + "," + .54 * canvas_height + ")")
        .text(hoverz).attr("font-size", 20)

}




//change x axis selection and then reload data
var updatex = function(d) {
    numupdates++

    xselection = xdropdown.value
    if (xselection == "RELEASE") {
        Minx = minRelease - .05 * (ReleaseRange);
        Maxx = maxRelease + .05 * (ReleaseRange);
    }
    if (xselection == "ADJBUDGET") {
        Minx = 0;
        Maxx = 1.05 * maxBudget;
    } else if (xselection == "ADJUSTED") {
        Minx = 0;
        Maxx = 1.05 * maxAdjusted;
    } else if (xselection == "Rotten_Tomatoes") {
        Minx = 0;
        Maxx = 100;
    } else if (xselection == "IMDB") {
        Minx = 2;
        Maxx = 10;
    }

    for (var i = 0; i < MoviePoints.length; i++) {
        var obj = MovieJSON[i];
        MoviePoints[i][3] = obj[xselection]
    }

    update(MoviePoints);
    xlabupdate();
    titleupdate();
    setHoverValues();
    getunique()
    introupdate();
}

//when page is first loaded, intro message should be displayed
var numupdates = 0; //used to determine whether or not to use intro message in header

//change y axis selection and then reload data
var updatey = function(d) {
    numupdates++;

    yselection = ydropdown.value
    if (yselection == "ADJBUDGET") {
        Miny = 0;
        Maxy = 1.05 * maxBudget;
    } else if (yselection == "ADJUSTED") {
        Miny = 0;
        Maxy = 1.05 * maxAdjusted;
    } else if (yselection == "Rotten_Tomatoes") {
        Miny = 0;
        Maxy = 100;
    } else if (yselection == "IMDB") {
        Miny = 2;
        Maxy = 10;
    }

     for (var i = 0; i < MoviePoints.length; i++) {
        var obj = MovieJSON[i];
        MoviePoints[i][4] = obj[yselection]
    }

    update(MoviePoints);
    ylabupdate();
    titleupdate();
    setHoverValues();
    getunique();
    introupdate();
}


//change size scale selection
var Maxz = 0
var updatez = function() {
    numupdates++;
    zselection = zdropdown.value;
    if (zselection == "Rotten_Tomatoes") {
        Maxz = 100;
    } else if (zselection == "IMDB") {
        Maxz = 10;
    } else if (zselection == "ADJBUDGET") {
        Maxz = maxBudget;
    } else if (zselection == "ADJUSTED") {
        Maxz = maxAdjusted;
    }

 for (var i = 0; i < MoviePoints.length; i++) {
        var obj = MovieJSON[i];
        MoviePoints[i][5] = obj[zselection]
    }

    update(MoviePoints);
    titleupdate();
    setHoverValues();
    drawlegend();
    getunique();
    introupdate();
}


// Setup settings for graphic
var canvas_width = 1500;
var canvas_height = 700;
var xpadding = 250; // for chart edge
var ypadding = 80;


// Create initial x scale functions for RELEASE year
var xScale = d3.scale.linear() // xScale is width of graphic
    .domain([Minx, Maxx])
    .range([xpadding, canvas_width - xpadding * 2]); // output range

var yScale = d3.scale.linear() // yScale is height of graphic
    .domain([Miny, Maxy])
    .range([canvas_height - ypadding, ypadding]);

// Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(function(d) {
        if ((xselection == "ADJBUDGET") | (xselection == "ADJUSTED")) {
            return "$ " + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return d;
        }
    });

// Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(6)
    .tickFormat(function(d) {
        if ((yselection == "ADJUSTED") | (yselection == "ADJBUDGET")) {
            return "$ " + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return d;
        }
    });

// Create SVG element For Plot
var svg = d3.select("#Scatter") // This is where we put our vis
    .append("svg")
    .attr("id", "Splot")
    .attr("width", canvas_width)
    .attr("height", canvas_height)
    .style("display", "block");


//Add Axis Labels
var xlabupdate = function() {
    d3.select("#xlab").remove();
    svg.append("text").style("fill","#2c2b2b").attr("id", "xlab").attr("font-size", 20).transition().delay(800).duration(500).ease("cubic")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (3 * canvas_width / 7) + "," + (canvas_height - (.31* ypadding)) + ")") // centre below axis
        .text(function() {
            if (xselection == "Rotten_Tomatoes") {
                return "Rotten Tomatoes Score";
            } else if (xselection == "ADJBUDGET") {
                return "Budget";
            } else if (xselection == "RELEASE") {
                return "Release Year";
            } else if (xselection == "IMDB") {
                return "IMDB Score";
            } else if (xselection == "ADJUSTED") {
                return "Revenue";
            }
        });

}

var ylabupdate = function() {
    d3.select("#ylab").remove();
    svg.append("text")
    .style("fill","#2c2b2b")
    .attr("font-size",20)
    .attr("id", "ylab")
    .transition()
    .delay(1000)
    .duration(500)
    .ease("cubic")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", function(d) {
            if (yselection == "Rotten_Tomatoes") {
                return "translate(" + xpadding /1.18 + "," + (canvas_height / 2) + ") rotate(-90)";
            } else if (yselection == "IMDB") {
                return "translate(" + xpadding /1.14 + "," + (canvas_height / 2) + ") rotate(-90)";
            } else {
                return "translate(" + xpadding /1.75 + "," + (canvas_height / 2) + ") rotate(-90)";
            }
        })
        .text(function() {
            if (yselection == "Rotten_Tomatoes") {
                return "Rotten Tomatoes Score";
            } else if (yselection == "ADJBUDGET") {
                return "Budget";
            } else if (yselection == "IMDB") {

                return "IMDB Score";
            } else if (yselection == "ADJUSTED") {
                return "Revenue";
            }
        });

}


var first;
var second;
var maketitle = function() {
    var first;

    if (yselection == "Rotten_Tomatoes") {
        first = "Rotten Tomatoes Score";
    } else if (yselection == "ADJBUDGET") {
        first = "Budget";
    } else if (yselection == "IMDB") {
        first = "IMDB Score";
    } else if (yselection == "ADJUSTED") {
        first = "Revenue";
    }
    var second

    if (xselection == "Rotten_Tomatoes") {
        second = "Rotten Tomatoes Score";
    } else if (xselection == "ADJBUDGET") {
        second = "Budget";
    } else if (xselection == "RELEASE") {
        second = "Release Year";
    } else if (xselection == "IMDB") {
        second = "IMDB Score";
    } else if (xselection == "ADJUSTED") {
        second = "Revenue";
    }

    trial = first + " vs " + second;
    return trial;
}




var titleupdate = function() {
    d3.select("#ScatterTitle").remove();
    svg.append("text").attr("id", "ScatterTitle")
        .attr("text-anchor", "middle")
        .style("fill", "#2c2b2b")
        .attr("transform", "translate(" + canvas_width / 2.4 + "," + ypadding / 2 + ")")
        .text(maketitle())
        .attr("font-size", "25");

}

var introupdate = function(){
    var message = "Try another view!";
    if (numupdates >1 ) {
    d3.select("#intro").remove();
    if((xselection =="RELEASE")&(yselection =="ADJUSTED")){
        message = "*Note that Marvel has made many more films in recent history.*";
    }
    else if((xselection =="ADJBUDGET")&(yselection =="Rotten_Tomatoes")){
        console.log("here");
        message = "*Note how Rotten Tomatoes favors films with budgets over $200 million.*";
    }
    else if((xselection =="ADJBUDGET")&(yselection =="IMDB")){
        message = "*Note how IMDB heavily favors films with budgets over $200 million.*";
    }
    else if(((xselection =="IMDB")&(yselection =="Rotten_Tomatoes"))|((xselection =="Rotten_Tomatoes")&(yselection =="IMDB"))){
        message = "*Note how Rotten Tomatoes uses more of its score range than IMDB.*";
    }
    else if((xselection =="RELEASE")&(yselection =="ADJBUDGET")){
        message = "*DC spent big money on Superman returns. It was a defining flop for the franchise.*";
    }
    else if((xselection =="RELEASE")&((yselection =="IMDB")|(yselection =="Rotten_Tomatoes"))){
        message = "*Not much to see here. The range of scores is consistent over time.*";
    }
    else if((xselection =="ADJUSTED")&((yselection =="Rotten_Tomatoes")|(yselection =="IMDB"))){
        message = "*Critics can appreciate films with low revenue, but high revenue guarantees a good score.*";
    }
    else if(((xselection =="Rotten_Tomatoes")|(xselection =="IMDB"))&(yselection =="ADJUSTED")){
        message = "*Critics can appreciate films with low revenue, but high revenue guarantees a good score.*";
    }
    else if(((xselection =="Rotten_Tomatoes")|(xselection =="IMDB"))&(yselection =="ADJUSTED")){
        message = "*Critics can appreciate films with low revenue, but high revenue guarantees a good score.*";
    }
    else if(xselection ==yselection){
        message = "*A straight line! What a surprise.*";
    }
    else if((xselection =="ADJBUDGET") & (yselection =="ADJUSTED")){
        message = "*Note that viewers really like big budget films.*";
    }

    d3.select("#s").selectAll("#intro").data([1]).enter().append("h2").attr("id", "intro").text(message);
}
}

var promptclick = function(){

    if (numupdates<2){
        d3.select("#Splot")
        .append("text")
        .attr("id","clickprompt")
        .text("--Click a Circle to see Worldwide Revenue Map and Character information--")
        .attr("transform", "translate(301, 65)")
        .attr("fill", "gray")
        .style("font-family", "sans-serif")
        .style("font-size", 18);
}
}

var xvalue;
var yvalue;
var zvalue;
var formattedValues = function(point) {
    if (xselection == ("ADJBUDGET") | xselection == ("ADJUSTED")) {
        xvalue = "$" + point[3].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        xvalue = point[3];
    }

    if (yselection == ("ADJBUDGET") | yselection == ("ADJUSTED")) {
        yvalue = "$" + point[4].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        yvalue = point[4];
    }

    if (zselection == ("ADJBUDGET") | zselection == ("ADJUSTED")) {
        zvalue = "$" + point[5].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        zvalue = point[5];
    }



}




//Load Initial Data
MoviePoints = LoadData(xselection, yselection, zselection);

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

getunique();

promptclick();



//Creating a custom tip element for the hovering on the bubbles
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        formattedValues(d);
var cr = "#1F45FC";
if(d[2] == "Marvel"){cr = "#9F000F";}


        if(unique =="xyz"){
            console.log("hi");
            console.log(d[0]);
        return "<strong style='color:#aaaaaa'>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverx + ":</strong> <span style='color:"+cr+"''>" + xvalue + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hovery + ":</strong> <span style='color:"+cr+"''>" + yvalue + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverz + ":</strong> <span style='color:"+cr+"''>" + zvalue + " </span> <br/>";
        }
        else if (unique =="yz"){
            return "<strong style='color:#aaaaaa'>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hovery + ":</strong> <span style='color:"+cr+"''>" + yvalue + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverz + ":</strong> <span style='color:"+cr+"''>" + zvalue + " </span> <br/>";
        }
        else if (unique =="xz"){
             return "<strong style='color:#aaaaaa'>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverx + ":</strong> <span style='color:"+cr+"''>" + xvalue + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverz + ":</strong> <span style='color:"+cr+"''>" + zvalue + " </span> <br/>";
        }
         else if (unique =="xy"){
             return "<strong>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverx + ":</strong> <span style='color:"+cr+"''>" + xvalue + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hovery + ":</strong> <span style='color:"+cr+"''>" + yvalue + " </span> <br/>";
        }
         else if (unique =="x"){
             return "<strong>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hoverx + ":</strong> <span style='color:"+cr+"''>" + xvalue + " </span> <br/>"
        }
         else if (unique =="y"){
             return "<strong style='color:#aaaaaa'>Movie Name:</strong> <span style='color:"+cr+"''>" + d[0] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>Year:</strong> <span style='color:"+cr+"''>" + d[1] + " </span> <br/>" +
             "<strong style='color:#aaaaaa'>Universe:</strong> <span style='color:"+cr+"''>" + d[2] + " </span> <br/>" +
            "<strong style='color:#aaaaaa'>" + hovery + ":</strong> <span style='color:"+cr+"''>" + yvalue + " </span> <br/>"
        }
}

)
svg.call(tip);




var selections = {
    "DC": null,
    "Marvel": null
};
var char = {
    "DC": null,
    "Marvel": null
};

// Create Circles
d3.select("#Splot").selectAll("#point")
    .data(MoviePoints)
    .enter()
    .append("circle") // Add circle svg
    .attr("id", "point").attr("cx", function(d) {
        if ((d[0] == "League of Extraordinary Gentlemen") & (xselection == "RELEASE") & (yselection == "ADJUSTED") & (zselection == "ADJBUDGET")) {
            return xScale(d[3]) - 3; // Circle's X
        } else {
            return xScale(d[3]);
        }
    })
    .attr("cy", function(d) { // Circle's Y
        return yScale(d[4]);
    })
    .attr("r", function(d) {
        if (zdropdown.value == "Rotten_Tomatoes") {
            return 1.2 * Math.pow(d[5], .5);
        } else if (zdropdown.value == "ADJBUDGET") {
            return .0007 * Math.pow(d[5], .5);
        } else if (zdropdown.value == "ADJUSTED") {
            return .00033 * Math.pow(d[5], .5);
        } else if (zdropdown.value == "IMDB") {
            return 4 * Math.pow(d[5], .5);
        } else if (zdropdown.value == "NONE") {
            return 5
        }
    })
    .style("fill", function(d) {
        if (d[2] == "DC") {
            return "#0020C2";
        } else {
            return "#D60E0E";
        }
    })
    .style("opacity", .6)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on("click", function(d) {
        d3.select("#clickprompt").remove();
        selections[d[2]] = d[0]
        char[d[2]] = d[6] //****************Not sure whats happening here

        if (selections["DC"] != null && selections["Marvel"] != null) {
            console.log("Populating world map with comparison data");
            drawBubbles(selections["DC"], selections["Marvel"]);
            gethero([char["DC"], char["Marvel"]]);
        } else if (selections["DC"] != null) {
            console.log("Can populate DC data or you can select a marvel movie to compare");
            drawBubbles(selections["DC"], "");
            gethero([char["DC"],[]]);
        } else if (selections["Marvel"] != null) {
            console.log("Can populate Marvel data or you can select a DC movie to compare");
            drawBubbles("",selections["Marvel"]);
            gethero([[],char["Marvel"]]);
        } else {
            console.log("Populating world map with comparison data");
        }
        $.scrollTo("#worldtitle", 1000);
    });

// Add X axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (canvas_height - ypadding) + ")")
    .call(xAxis);

// Add Y axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + xpadding + ",0)")
    .call(yAxis);
