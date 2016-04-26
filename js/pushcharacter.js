function gethero(chararr){
        d3.selectAll(".character").remove();
        height=300;
        width=300;
        padding=20;
        for (m=0;m<chararr.length;m++){
        // film=moviearr[m]
        cha=chararr[m];
        // company=movie[film].COMPANY;

        for (var i = 0; i< cha.length;i++){
            name=cha[i];
            appearance=character[name].APPEARANCES;
            image=character[name].pic;
            more=[];
        for (var j in MovieJSON){
            // console.log(j);
            // console.log(movie[j]);
            // console.log(movie[j].Characters)

            if(MovieJSON[j].Characters.indexOf(name) != -1) {
                
                revenue= MovieJSON[j].ADJUSTED;
                each={film:j,revenue:revenue};
                more.push(each)
            }
        
        }
            var svg=d3.select("#photo"+m)
            // .attr("class","character")
            .append("svg")
            .attr("class","character")
            .attr("width",width)
            .attr("height",height);

            area = svg.selectAll("image").data([0]);
        
            area.enter()
            .append("svg:image")
            .attr("class","image")
            .attr("x",35)
            .attr("y",20)
            .attr("width",150)
            .attr("height",150)
            .attr("xlink:href",image)
            .attr("opacity",0.9);
 
            svg.append("text")
            .attr("x",35)
            .attr("y",200)
            .text("Name: "+name);

            lScale=d3.scale.linear().domain([0,4050]).range([0,150]);

            svg.append("text")
            .attr("x",35)
            .attr("y",220)
            .text("Appearances in comic: "+appearance+" times");

            svg.append("text")
            .attr("x",35)
            .attr("y",240)
            .text("Appearances in movie: "+more.length+" times");

            for (k=0;k<more.length;k++){
                svg.append("text")
            .attr("x",35)
            .attr("y",260+k*20)
            .text(more[k].film+": $"+more[k].revenue);


            }
            }
            


            // svg.append("rect")
            // .attr("x", 35)
            // .attr("y", 240)
            // .attr("width", lScale(appearance))
            // .attr("height",20)
            // .style("fill",function(){if(company=="DC"){return "blue";} else{ return "red"}})
            // .style("opacity",0.6)
        





          
     }
         
         }
         
