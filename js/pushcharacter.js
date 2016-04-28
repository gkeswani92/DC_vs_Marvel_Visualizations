function gethero(chararr) {
    d3.selectAll(".character").remove();
    var dc=document.getElementById('dcchar');
    var marvel=document.getElementById('marvelchar');
    if (chararr[0].length!=0 && chararr[1].length!=0){
        dc.innerText="DC Characters"
        marvel.innerText="Marvel Characters"
    }
    else if (chararr[0].length!=0 &&chararr[1].length==0){
        dc.innerText="DC Characters"
        marvel.innerText=""
    }
    else if (chararr[0].length==0 &&chararr[1].length!=0){
        dc.innerText=""
        marvel.innerText="Marvel Characters"
    }

    height = 470;
    width = 370;
    padding = 20;

    //hover things
    var tipchar=d3.tip()
    .attr("class","d3-tip")
    .offset([-10,0])
    .html(function(d){ 
         
         return "Revenue: $ "+d.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");})

     var tipmax=d3.tip()
    .attr("class","d3-tip")
    .offset([-10,0])
    .html(function(d){
          //console.log(d);
         return "Most Revenue: $ 1,575,847,963";})

    var tipcomicmax=d3.tip()
    .attr("class","d3-tip")
    .offset([-10,0])
    .html(function(d){
          //console.log(d);
         return "Most Comics Appearances: 4,043";})

    var tipmomax=d3.tip()
    .attr("class","d3-tip")
    .offset([-10,0])
    .html(function(d){
          //console.log(d);
         return "Most Movies Appearances: 8";})

    var tipmo=d3.tip()
    .attr("class","d3-tip")
    .offset([-10,0])
    .html(function(d){
          //console.log(d);
         return ;})

    for (m = 0; m < chararr.length; m++) {
        cha = chararr[m];
        color=["#000063","#CE0000"]

        for (var i = 0; i < cha.length; i++) {
            name = cha[i];
            appearance = character[name].APPEARANCES;
            image = character[name].pic;
            more = [];

            //get character all movies 
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
            console.log(more)
            var svg = d3.select("#photo" + m)
                .append("svg")
                .attr("class", "character")
                .attr("width", width)
                .attr("height", height);
           
            svg.call(tipmax);
            svg.call(tipchar);
            svg.call(tipcomicmax);
            svg.call(tipmomax);
            

            area = svg.selectAll("image").data([0]);

            area.enter()
                .append("svg:image")
                .attr("class", "image")
                .attr("x", 155)
                .attr("y", 10)
                .attr("width", 150)
                .attr("height", 150)
                .attr("xlink:href", image)
                .attr("opacity", 0.7);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 150)
                .style("fill", "#2c2b2b")
                .text(name.toUpperCase())
                .style("fill", color[m])
                .style("font-size", "18px")
                .style("font-family", "Action Comics Black")
                .style("opacity", ".7")
                .style("stroke", "#DEE7EF");

            lScale = d3.scale.linear().domain([0, 4050]).range([0, 300]);
            comicscale=d3.scale.linear().domain([0, 4043]).range([0, 300]);
            moviescale=d3.scale.linear().domain([0, 8]).range([0, 300]);
            salescale=d3.scale.linear().domain([0, 1575847963]).range([0, 300]);

            svg.append("text")
                .attr("x", 15)
                .attr("y", 170)
                .text("Comics Appearances: " + appearance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                .style("fill", "#2c2b2b");


            svg.append("text")
                .attr("x", 15)
                .attr("y", 200)
                .text("Movies Appearances: " + more.length)
                .style("fill", "#2c2b2b"); 

             //max box
            svg.append("rect")
                .attr("x", 15)
                .attr("y", 175)
                .attr("width", 300)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.4)
                .on('mouseover', tipcomicmax.show)
                .on('mouseout', tipcomicmax.hide);

             //max box
             svg.append("rect")
                .attr("x", 15)
                .attr("y", 205)
                .attr("width", 300)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.4)
                .on('mouseover', tipmomax.show)
                .on('mouseout', tipmomax.hide);

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 175)
                .attr("width", comicscale(appearance))
                .attr("height",8)
                .style("fill",color[m])
                .style("opacity",0.5)
             

            svg.append("rect")
                .attr("x", 15)
                .attr("y", 205)
                .attr("width", moviescale(more.length))
                .attr("height",8)
                .style("fill",color[m])
                .style("opacity",0.5);

        
            for (k = 0; k < more.length; k++) {

                svg.append("text")
                    .attr("x", 15)
                    .attr("y", 235 + k * 30)
                    .text(more[k].film)
                    .style("fill","#2c2b2b");

                // max box
                svg.append("rect")
                .attr("x", 15)
                .attr("y", 240+k *30)
                .attr("width", 300)
                .attr("height",8)
                .style("fill","white")
                .style("opacity",0.4)
                .on('mouseover', tipmax.show)
                .on('mouseout', tipmax.hide);
                
            }

            svg.selectAll(".character")
            .data(more)
            .enter()
            .append("rect")
            .attr("x", 15)
            .attr("y", function(d,i){return 240+i *30})
            .attr("width", function(d,i){
                return salescale(d.revenue)})
            .attr("height",8)
            .style("fill",color[m])
            .style("opacity",0.5)
            .on('mouseover', tipchar.show)
            .on('mouseout', tipchar.hide);


        }
    }
}

gethero([["Batman"],["Iron Man"]]);