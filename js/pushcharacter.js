function gethero(chararr) {
    d3.selectAll(".character").remove();
    height = 450;
    width = 370;
    padding = 20;
    for (m = 0; m < chararr.length; m++) {
        // film=moviearr[m]
        cha = chararr[m];
        // company=movie[film].COMPANY;

        for (var i = 0; i < cha.length; i++) {
            name = cha[i];
            appearance = character[name].APPEARANCES;
            image = character[name].pic;
            more = [];
            for (var j in MovieJSON) {
                // console.log(j);
                // console.log(movie[j]);
                // console.log(movie[j].Characters)

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
                .text("Appearances in comics: " + appearance + " times")
                .style("fill", "#BBBBBB");


            svg.append("text")
                .attr("x", 15)
                .attr("y", 195)
                .text("Appearances in movie: " + more.length + " times")
                .style("fill", "#BBBBBB");

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 175)
                .attr("width", comicscale(appearance))
                .attr("height",8)
                .style("fill","#990033")
                .style("opacity",0.6);

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 200)
                .attr("width", moviescale(more.length))
                .attr("height",8)
                .style("fill","#990033")
                .style("opacity",0.6);

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
                .style("fill","#ff4c4c")
                .style("opacity",0.6);




            }
        }
    }
}

gethero([["Batman"],["Iron Man"]]);