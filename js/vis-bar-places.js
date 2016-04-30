


function build_poi_bar(placesData) {

        var margin = {top: 0, right: 40, bottom: 50, left: 60};

        var width = 1160 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        // setup x
        var xValue = function(d) { return d.key;},
            xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1,0),
            xMap = function(d) { return xScale(xValue(d)); },
            xAxis = d3.svg.axis().scale(xScale).tickValues([]).orient("bottom");

        // setup y
        var yValue = function(d) { return d.values;},
            yScale = d3.scale.linear().range([0,height]),
            yMap = function(d) { return yScale(yValue(d));},
            yAxis = d3.svg.axis().scale(yScale).orient("left");


        // add the graph canvas to the body of the webpage
        var svg = d3.select(".vis-poi-bar").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //adding tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d.key +  " : " + d.values;
            });

        xScale.domain(placesData.map(function(d) { return d.key; }));
        yScale.domain([d3.min(placesData, yValue)-1, d3.max(placesData, yValue)+1]);

        // x-axis
        var pt_xaxis = svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.call(tip);

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("x", -height + margin.bottom + margin.top)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("# of Thefts");



        //draw bar

        svg.selectAll(".poi-bar")
        .data(placesData)
        .enter().append("rect")
        .attr("class", "poi-bar")
        .attr("x", xMap)
        //.attr("y", yMap)
        .attr("height", yMap)
        .attr("width", xScale.rangeBand())
            .on("mouseover", function() {
                d3.select(this)
                    .attr("fill", "#EC7873");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("fill", "#984ea3");
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);



        //processing input zip
        var input = d3.select("input")
            .on("cut", function() { setTimeout(change, 10); })
            .on("paste", function() { setTimeout(change, 10); })
            .on("change", change)
            .on("keyup", change);




        function change()
        {
            var zip = input.property("value");
            //console.log(zip);



        }






    };