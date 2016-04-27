function gethero(chararr) {
    d3.selectAll(".character").remove();
    height = 450;
    width = 370;
    padding = 20;

    // tipchar=d3.tip()
    // .attr("class","d3-tip")
    // .offset([-10,0])
    // .html(function(d){
    //      "Movie:revenue:"})

    for (m = 0; m < chararr.length; m++) {
        // film=moviearr[m]
        cha = chararr[m];
        // company=movie[film].COMPANY;
        color=["blue","red"]

        for (var i = 0; i < cha.length; i++) {
            name = cha[i];
            appearance = character[name].APPEARANCES;
            image = character[name].pic;
            company=
            more = [];
            for (var j in MovieJSON) {
                if (MovieJSON[j].Characters.indexOf(name) != -1) {
                    film = MovieJSON[j].FILM
                    revenue = MovieJSON[j].ADJUSTED;
                    each = {
                        film: film,
                        revenue: revenue
                    };
                    more.push(each)
                }

            }
            var svg = d3.select("#photo" + m)
                .append("svg")
                .attr("class", "character")
                .attr("width", width)
                .attr("height", height);

            area = svg.selectAll("image").data([0]);

            area.enter()
                .append("svg:image")
                .attr("class", "image")
                .attr("x", 15)
                .attr("y", 10)
                .attr("width", 120)
                .attr("height", 120)
                .attr("xlink:href", image)
                .attr("opacity", 0.9);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 150)
                .text("Name: " + name)
                .style("fill", "#BBBBBB");

            lScale = d3.scale.linear().domain([0, 4050]).range([0, 350]);
            comicscale=d3.scale.linear().domain([0, 4043]).range([0, 350]);
            moviescale=d3.scale.linear().domain([0, 8]).range([0, 350]);
            salescale=d3.scale.linear().domain([0, 1575847963]).range([0, 350]);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 165)
                .text("Comic Book Popularity " + appearance + " times")
                .style("fill", "#BBBBBB");


            svg.append("text")
                .attr("x", 15)
                .attr("y", 195)
                .text("Movie Apperances: " + more.length + " times")
                .style("fill", "#BBBBBB");

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 175)
                .attr("width", comicscale(appearance))
                .attr("height",8)
                .style("fill",color[m])
                .style("opacity",0.5);

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 200)
                .attr("width", moviescale(more.length))
                .attr("height",8)
                .style("fill",color[m])
                .style("opacity",0.5);

            //max box
            svg.append("rect")
                .attr("x", 15)
                .attr("y", 175)
                .attr("width", 350)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.1)

             svg.append("rect")
                .attr("x", 15)
                .attr("y", 200)
                .attr("width", 350)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.1)

            for (k = 0; k < more.length; k++) {
                svg.append("text")
                    .attr("x", 15)
                    .attr("y", 225 + k * 25)
                    .text(more[k].film + ": $" + more[k].revenue)
                    .style("fill","#BBBBBB");

                svg.append("rect")
                .attr("x", 15)
                .attr("y", 230+k *25)
                .attr("width", salescale(more[k].revenue))
                .attr("height",8)
                .style("fill",color[m])
                .style("opacity",0.5)
                //.on('mouseover', tipchar.show)
                //.on('mouseout', tipchar.hide);

            // max box
            svg.append("rect")
                .attr("x", 15)
                .attr("y", 230+k *25)
                .attr("width", 350)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.1)


            }
        }
    }
}

gethero([["Batman"],["Iron Man"]]);
