
//Reference

//dot plot inspiration
//http://bl.ocks.org/weiglemc/6185069

queue()
    .defer(d3.csv, "data/places_detail_clnd.csv")
    .await(function(error, placesData){


        var margin = {top: 20, right: 40, bottom: 150, left: 60};

        var width = 1160 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        //filtering non places data points
        function  filter_data()
        {
            placesData = placesData.filter(function(data){return (data.poi_type != "neighborhood")});
        }

        filter_data();

        // change string (from CSV) into number format
        placesData.forEach(function(d) {
            d.no_thefts = +d.no_thefts;
            d.year = +d.year;
        });

        //console.log(placesData);

        // setup x
        var xValue = function(d) { return d.poi_type;},
            xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.5,0),
            xMap = function(d) { return xScale(xValue(d)); },
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) { return d.no_thefts;},
            yScale = d3.scale.linear().range([height, 0]),
            yMap = function(d) { return yScale(yValue(d));},
            yAxis = d3.svg.axis().scale(yScale).orient("left");


        // add the graph canvas to the body of the webpage
        var svg = d3.select(".vis-places").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select(".vis-places").append("div")
            .attr("class", "dot-tooltip")
            .style("opacity", 0);

        xScale.domain(placesData.map(function(d) { return d.poi_type; }));
        yScale.domain([d3.min(placesData, yValue)-1, d3.max(placesData, yValue)+1]);

        // x-axis
        var pt_xaxis = svg.append("g")
            .attr("class", "x axis places")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        pt_xaxis.selectAll("text")
            .attr("class", "x-axis-label")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.8em")
            .attr("transform", "rotate(-90)" );


        pt_xaxis.append("text")
            .attr("class", "label")
            .attr("x", width+40)
            .attr("y", -9)
            .style("text-anchor", "end")
            .text("POI Type (Interactive)");


        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("# of Thefts");


        // draw dots
        svg.selectAll(".dot")
            .data(placesData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "#EC7873")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("background",'black');

                tooltip.html("<b>"+ yValue(d) +"</b> bikes stolen from near "+ d.place_name + " (" + xValue(d)  + ")"+ "<br/>" + "@ " + d.sder_city +','+ d.sder_state )
                    .style("left", (d3.mouse(d3.event.target)[0] + 5) + "px")
                    .style("top", (d3.mouse(d3.event.target)[1] - 20) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        //processing input zip
        var input = d3.select("#place-zip")
            .on("cut", function() { setTimeout(change, 10); })
            .on("paste", function() { setTimeout(change, 10); })
            .on("change", change)
            .on("keyup", change);

        d3.selectAll('.x-axis-label')
            .on('click',function(d)
            {
                update_bubble(this.__data__);
            });





        function change()
        {
            var zip = input.property("value");
            //console.log(zip);



            d3.select(".vis-places").selectAll(".dot").remove();

            // draw dots
            svg.selectAll(".dot")
                .data(placesData)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 2.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "#EC7873")
                .attr("strokewidth",3)
                .attr("stroke",function(d)
                {
                    var l = zip.length;
                    if (d.sder_postal_code.substr(0,l) == zip && l != 0)
                    {
                        return "cyan"
                    }
                    else
                    {
                        return null
                    }
                })
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9)
                        .style("background",'#BCC5F7');
                    tooltip.html("<b>"+ yValue(d) +"</b> bikes stolen from near "+ d.place_name + " (" + xValue(d)  + ")"+ "<br/>" + "@ " + d.sder_city +','+ d.sder_state )
                        .style("left", (d3.mouse(d3.event.target)[0] + 5) + "px")
                        .style("top", (d3.mouse(d3.event.target)[1] + 20) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            //updating bubble chart
            update_bubble(b_poi_type);
        }


        //using nest to rollup data by poi type
        var poiTypeCount = d3.nest()
            .key(function(d) { return d.poi_type; })
            .rollup(function(v) { return d3.sum(v,function(d) { return d.no_thefts; }); })
            .entries(placesData);

        //console.log(poiTypeCount);

        build_poi_bar(poiTypeCount);



    });