//Draws the world map on the canvas with the required hover and pop up
//properties
function drawWorldMap(){
    var map = new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator',
        fills: {
            defaultFill: 'rgba(0,0,0,0.4)'
        },
        geographyConfig: {
            highlightOnHover: true,
            hideHawaiiAndAlaska : true,
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
            'DC': {fillKey: 'DC'},
            'Marvel': {fillKey: 'Marvel'},
        }
    });
    return map;
}

function drawBubbles(movie1, movie2){

    map.bubbles([])
    var bubbleData = [];
    console.log(bubbleData);

    //Collection data for the movies that have been passed in
    for (var movie_name in movieRevenue){
        if(movie_name == movie1 || movie_name == movie2){
            if (movieRevenue.hasOwnProperty(movie_name)) {
                var movie_data = movieRevenue[movie_name];

                //From the data, checking if we have enough information
                //to plot the movie for every country
                for (var data in movie_data){
                    var country = data;
                    var total_revenue = movie_data["ADJUSTED"];
                    var franchise = movie_data["COMPANY"];

                    //If we have the corresponding latitude and
                    //longitude for the country, add it to the bubble data
                    if(countryData.hasOwnProperty(country)){
                        var revenue = movie_data[data];
                        var latitude = countryData[country]["latitude"];
                        var longitude = countryData[country]["longitude"];
                        var obj = {"country":country,
                                    "revenue":revenue,
                                    "latitude":latitude,
                                    "longitude":longitude,
                                    "company":franchise,
                                    "fillKey":franchise,
                                    "film":movie_name,
                                    radius: revenue * 100 * 5 / total_revenue};
                        bubbleData.push(obj);
                    }
                }
            }
        }
    }

    console.log(bubbleData);
    //Sorting so that small radius will be displayed over the bigger radius
    //bubble so that both can be hovered on
    bubbleData.sort(function(a, b) {
        return b.radius - a.radius;
    });
    console.log(bubbleData);

    //Draw bubbles for the data
    map.bubbles(bubbleData, {
                                popupTemplate: function (geo, data) {
                                       return ['<div class="hoverinfo">' + '',
                                       '<br/>Movie: ' +  data.film + '',
                                       '<br/>Country: ' +  data.country + '',
                                       '<br/>Franchise: ' +  data.company + '',
                                       '<br/>Revenue: ' +  '$' + data.revenue + '',
                                       '<br/>% Revenue: ' + data.revenue * 100 / total_revenue  + '%',
                                       '</div>'].join('');
                                }
    });
}

var data = ['country', 'revenue','latitude','longitude'];
var map = drawWorldMap();
