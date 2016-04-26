function gethero(chararr) {
    d3.selectAll(".character").remove();
    height = 400;
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
                // .attr("class","character")
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
                .attr("width", 150)
                .attr("height", 150)
                .attr("xlink:href", image)
                .attr("opacity", 0.9);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 180)
                .text("Name: " + name)
                .style("fill", "#BBBBBB");

            lScale = d3.scale.linear().domain([0, 4050]).range([0, 150]);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 200)
                .text("Appearances in comics: " + appearance + " times")
                .style("fill", "#BBBBBB");

            svg.append("text")
                .attr("x", 15)
                .attr("y", 220)
                .text("Appearances in movie: " + more.length + " times")
                .style("fill", "#BBBBBB");

            for (k = 0; k < more.length; k++) {
                svg.append("text")
                    .attr("x", 15)
                    .attr("y", 240 + k * 20)
                    .text(more[k].film + ": $" + more[k].revenue)
                    .style("fill","#BBBBBB");
            }
        }
    }
}
