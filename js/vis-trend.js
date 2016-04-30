

// --> CREATE SVG DRAWING AREA

var usYearData;
var stateYearData;
var car_us;
var car_st;

function  filter_state_data(state)
{
    stateYearData = stateYearData.filter(function(data){return (data.sder_state==state)});
}


// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/us.json")
  .defer(d3.csv, "data/theft_year_sum.csv")
    .defer(d3.csv, "data/theft_state_year_sum.csv")
  .await(function(error, map, usYearData, stateYearData){
      //var baseData = yearData;


      usYearData.forEach(function(d) {
          // Convert string to 'date object'
          d.year = +d.year;

          // Convert numeric values to 'numbers'
          d.no_thefts = +d.no_thefts;
      });

      stateYearData.forEach(function(d) {
          // Convert string to 'date object'
          d.year = +d.year;

          // Convert numeric values to 'numbers'
          d.no_thefts = +d.no_thefts;
      });


      //filtering from 2005
      usYearData = usYearData.filter(function(data){return (+data.year >= 2005)&&(+data.year <= 2015)});
      stateYearData = stateYearData.filter(function(data){return (+data.year >= 2005)&&(+data.year <= 2015)});

      car_st = stateYearData;
      car_us = usYearData


      var state = "Oregon";
      // Update points map
      updateSateLine(state);
  });
    

function updateSateLine(state) {

    stateYearData = car_st;
    usYearData = car_us;




    filter_state_data(state);
    //console.log(stateYearData);


    var margin = {top: 90, right: 60, bottom: 30, left: 50},
        width = 550 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;



    var x = d3.scale.linear().range([0, width]);
    var y0 = d3.scale.linear().range([height, 0]);
    var y1 = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").tickFormat(d3.format("d"));

    var yAxisLeft = d3.svg.axis().scale(y0)
        .orient("left").ticks(5);

    var yAxisRight = d3.svg.axis().scale(y1)
        .orient("right").ticks(5);

    var valueline = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y0(d.no_thefts); });

    var valueline2 = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y1(d.no_thefts); });

    var svg = d3.select("#vis-trend")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var extentUsThefts = d3.extent(usYearData, function(obj){
        return obj['no_thefts'];
    });

    var extentStThefts = d3.extent(stateYearData, function(obj){
        return obj['no_thefts'];
    });

    // Scale the range of the data
    x.domain(d3.extent(usYearData, function(d) { return d.year; }));
    y0.domain(extentUsThefts);
    y1.domain(extentStThefts);



    svg.append("path")        // Add the us total data path.
        .style("stroke", "#EC7873")
        .style("fill","none")
        .style("stroke-width",3)
        .attr("d", valueline(usYearData));

    var path = svg.append("path")        // Add the valueline2 path.
        .style("stroke", "steelblue")
        .style("stroke-width",3)
        .style("fill","none")
        .style("opacity",0.5)
        .attr("class","state-line")
        .attr("d", valueline2(stateYearData));


    var h = height + 5;

    svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("fill", "#EC7873")
        .call(yAxisLeft)
        .attr("transform", "translate(-5,0)");

    var w = width + 20;

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + w + " ,0)")
        .style("fill", "steelblue")
        .call(yAxisRight);

    //animating path

    var totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    // remove later or merge with click from choropleth
    svg.on("click", function(){
        path
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("stroke-dashoffset", totalLength);
    })

    var padding = 20;

    // now add titles to the axes
    svg.append("text")
        .attr("class","y0-title")
        .style("fill", "#EC7873")
        .style("font-size",10)
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (padding/2) +","+(30)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("US Total Thefts");

    svg.append("text")
        .attr("class","y1-title")
        .style("fill", "steelblue")
        .style("font-size",10)
        .attr("text-anchor", "start")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (w-5) +","+(height-10)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(state + " Total Thefts");


    //tooltip circle at US Level
    var us_focus = svg.append("g")
        .attr("class", "us-focus")
        .style("display", "none");

    us_focus.append("circle")
        .attr("r", 4.5);

    us_focus.append("text")
        .attr("x", 9)
        .style("fill", "#EC7873")
        .style("font-weight","bold")
        .attr("dy", "-3em");



    svg.append("rect")
        .attr("class", "us-overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { us_focus.style("display", null); })
        .on("mouseout", function() { us_focus.style("display", "none"); })
        .on("mousemove", us_mousemove);

    var bisectDate = d3.bisector(function(d) { return d.year; }).left;

    function us_mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(usYearData, x0, 1),
            d0 = usYearData[i - 1],
            d1 = usYearData[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;

        us_focus.attr("transform", "translate(" + x(d.year) + "," + y0(d.no_thefts) + ")");
        us_focus.select("text").text("US : " + d.no_thefts);
    }

    //tooltip circle at State Level
    var st_focus = svg.append("g")
        .attr("class", "st-focus")
        .style("display", "none");

    st_focus.append("circle")
        .attr("r", 4.5);

    st_focus.append("text")
        .attr("x", 9)
        .style("fill", "steelblue")
        .style("font-weight","bold")
        .attr("dy", "-1em");

    svg.append("rect")
        .attr("class", "st-overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { us_focus.style("display", null); st_focus.style("display", null); })
        .on("mouseout", function() { us_focus.style("display", "none"); st_focus.style("display", "none"); })
        .on("mousemove", function (d) {
            st_mousemove.call(this,d);
            us_mousemove.call(this,d);
        });



    function st_mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(stateYearData, x0, 1),
            d0 = stateYearData[i - 1],
            d1 = stateYearData[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;


        st_focus.attr("transform", "translate(" + x(d.year) + "," + y1(d.no_thefts) + ")");
        st_focus.select("text").text(state + " : " + d.no_thefts);
    }

}