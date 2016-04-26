//Draws the world map on the canvas with the required hover and pop up
//properties
function drawWorldMap() {
    var contain = document.getElementById('container');
    while (contain.firstChild) {
        contain.removeChild(contain.firstChild);
    }

    var map = new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator',
        fills: {
            defaultFill: 'rgba(0,0,0,0.4)'
        },
        geographyConfig: {
            highlightOnHover: true,
            hideHawaiiAndAlaska: false,
            popupOnHover: true,
        },
        bubblesConfig: {
            borderWidth: 0,
        },
        fills: {
            'DC': '#0000FF',
            'Marvel': '#FF0000',
            defaultFill: 'rgba(0,0,0,0.4)'
        },
        data: {
            'DC': {
                fillKey: 'DC'
            },
            'Marvel': {
                fillKey: 'Marvel'
            },
        }
    });
    return map;
}

//Draws the bubble for the movies that have been passed in
function drawBubbles(movie1, movie2) {

    current_movie1 = movie1;
    current_movie2 = movie2;

    if (document.getElementById('worldMapCheck').checked) {
        console.log("Toggle checked to get relative revenue of DC and Marvel");
        drawRelativeRevenueComparisonBubbles(movie1, movie2);
    } else {
        console.log("Toggle unchecked to get absolute revenue of DC and Marvel");
        drawAbsoluteRevenueComparisonBubbles(movie1, movie2);
    }
}

function drawAbsoluteRevenueComparisonBubbles(movie1, movie2){
    var bubbleData = [];
    var map = drawWorldMap();

    //Collection data for the movies that have been passed in
    for (var movie_name in movieRevenue) {
        if (movie_name == movie1 || movie_name == movie2) {
            if (movieRevenue.hasOwnProperty(movie_name)) {
                var movie_data = movieRevenue[movie_name];

                //From the data, checking if we have enough information
                //to plot the movie for every country
                for (var data in movie_data) {
                    var country = data;
                    var total_revenue = movie_data["ADJUSTED"];
                    var franchise = movie_data["COMPANY"];
                    var revenue = movie_data[data];

                    //If we have the corresponding latitude and
                    //longitude for the country, add it to the bubble data
                    if (countryData.hasOwnProperty(country) && revenue != null && revenue != NaN && total_revenue != NaN && total_revenue != null && revenue != 0 && total_revenue != 0) {
                        var latitude = countryData[country]["latitude"];
                        var longitude = countryData[country]["longitude"];
                        var obj = {
                            "country": country,
                            "revenue": revenue,
                            "latitude": latitude,
                            "longitude": longitude,
                            "company": franchise,
                            "fillKey": franchise,
                            "film": movie_name,
                            radius: Math.sqrt(revenue * 100 / total_revenue) * 12
                        };
                        bubbleData.push(obj);
                    }
                }
            }
        }
    }

    //Sorting so that small radius will be displayed over the bigger radius
    //bubble so that both can be hovered on
    bubbleData.sort(function(a, b) {
        return b.radius - a.radius;
    });

    //Draw bubbles for the data
    map.bubbles(bubbleData, {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo">' + '',
                '<br/>Movie: ' + data.film + '',
                '<br/>Country: ' + data.country + '',
                '<br/>Franchise: ' + data.company + '',
                '<br/>Revenue: ' + '$' + data.revenue + '',
                '<br/>% Revenue: ' + Math.round(100 * data.revenue * 100 / total_revenue)/100 + '%',
                '</div>'
            ].join('');
        }
    });
}

function drawRelativeRevenueComparisonBubbles(movie1, movie2){
    var bubbleData = [];
    var map = drawWorldMap();

    //Collection data for the movies that have been passed in
    for (var movie_name in movieRevenue) {
        if (movie_name == movie1 || movie_name == movie2) {
            if (movieRevenue.hasOwnProperty(movie_name)) {
                var movie_data = movieRevenue[movie_name];

                //From the data, checking if we have enough information
                //to plot the movie for every country
                for (var data in movie_data) {
                    var country = data;
                    var total_revenue = movie_data["ADJUSTED"];
                    var franchise = movie_data["COMPANY"];
                    var revenue = movie_data[data];

                    //If we have the corresponding latitude and
                    //longitude for the country, add it to the bubble data
                    if (countryData.hasOwnProperty(country) && revenue != null && revenue != NaN && total_revenue != NaN && total_revenue != null && revenue != 0 && total_revenue != 0) {
                        var latitude = countryData[country]["latitude"];
                        var longitude = countryData[country]["longitude"];
                        var obj = {
                            "country": country,
                            "revenue": revenue,
                            "latitude": latitude,
                            "longitude": longitude,
                            "company": franchise,
                            "fillKey": franchise,
                            "film": movie_name,
                            radius: Math.sqrt(revenue * 100 / total_revenue) * 12
                        };
                        bubbleData.push(obj);
                    }
                }
            }
        }
    }

    //Sorting so that both items (if 2 exist) of the same country will be together
    bubbleData.sort(function(a, b) {
        if(a.country < b.country) return -1;
        if(a.country > b.country) return 1;
        return 0;
    });
    console.log(bubbleData);

    var i = 0;
    while(i < bubbleData.length-1){
        var item1 = bubbleData[i];
        var item2 = bubbleData[i+1];

        //If they have the same country, make it relative
        if(item1.country == item2.country){

            //The item with the bigger revenue, gets a radius of 10 and the
            //other one is relative to that
            if(item1.revenue > item2.revenue){
                item1.radius = 15;
                item2.radius = item2.revenue * 15 / item1.revenue;
            } else {
                item2.radius = 15;
                item1.radius = item1.revenue * 15 / item2.revenue;
            }

            console.log(item1.country + " " + item1.radius + " " + item1.revenue);
            console.log(item2.country + " " + item2.radius + " " + item2.revenue);

            i = i + 2;
        }
        //If they don't have the same country, make it constant
        else {
            console.log("Single Country found: " + item1.country + " " + item1.radius + " " + item1.revenue);
            item1.radius = 15;
            i++;
        }
    }

    //Sorting so that small radius will be displayed over the bigger radius
    //bubble so that both can be hovered on
    bubbleData.sort(function(a, b) {
        if(a.radius == NaN){
            console.log("Null radius for "+a.country);
        }
        return b.radius - a.radius;
    });

    //Draw bubbles for the data
    map.bubbles(bubbleData, {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo">' + '',
                '<br/>Movie: ' + data.film + '',
                '<br/>Country: ' + data.country + '',
                '<br/>Franchise: ' + data.company + '',
                '<br/>Revenue: ' + '$' + data.revenue + '',
                '<br/>% Revenue: ' + Math.round(100 * data.revenue * 100 / total_revenue)/100 + '%',
                '</div>'
            ].join('');
        }
    });
}

//Stores the last 2 movies that have been plotted on the world map
var current_movie1 = "Iron Man 3";
var current_movie2 = "The Dark Knight Rises";

//Event listener for the toggle button being switched between absolute and relative revenues
document.addEventListener("DOMContentLoaded", function (event) {
    var _selector = document.querySelector('input[name=revenueCompareMethod]');
    _selector.addEventListener('change', function (event) {
        console.log("Toggle button was switched");
        drawBubbles(current_movie1, current_movie2);
    });
});

//Default bubbles are for Iron Man 3 and The Dark Knight Rises
drawAbsoluteRevenueComparisonBubbles(current_movie1, current_movie2);
