/**d3.csv("data/TheftsByMonthFull.csv", function(error, data) {
    if (error) throw error;
    var masterList = [];
    data.forEach(function (d) {
        d.date = new Date(d.date)
        d.thefts = 1;
        var dateInfo = new Date(d.stolen_localDate);
        masterList.push(timeObject);
    })
    var filteredData = [];
    var count = 0;
    for(var j = 0; j < masterList.length; j++){
        var temp = masterList[j];
        for (var i=0; i < masterList.length; i++) {
            if (temp.getMonth() == masterList[i].getMonth() && temp.getYear() == masterList[i].getYear()) {
                masterList[i].thefts++;
                count++;
                //filteredData.push(masterList[i]);
                //return myArray[i];
            }
        }
    }
    console.log(count);
    console.log(masterList);

})**/

var margin_timeScale = {top: 10, right: 10, bottom: 100, left: 40},
    margin2_timeScale = {top: 430, right: 10, bottom: 20, left: 40},
    width_timescale = 960 - margin_timeScale.left - margin_timeScale.right,
    height_timescale = 500 - margin_timeScale.top - margin_timeScale.bottom,
    height2 = 500 - margin2_timeScale.top - margin2_timeScale.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width_timescale]),
    x2 = d3.time.scale().range([0, width_timescale]),
    y = d3.scale.linear().range([height_timescale, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height_timescale)
    .y1(function(d) { return y(d.thefts); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.thefts); });

var svg = d3.select("#month-theft").append("svg")
    .attr("width", width_timescale + margin_timeScale.left + margin_timeScale.right)
    .attr("height", height_timescale + margin_timeScale.top + margin_timeScale.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .attr('fill', 'white')
    .append("rect")
    .attr("width", width_timescale)
    .attr("height", height_timescale);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin_timeScale.left + "," + margin_timeScale.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2_timeScale.left + "," + margin2_timeScale.top + ")");

d3.csv("data/theft_year_month_sum.csv", type, function(error, data) {

    /*data.forEach(function (d) {
        d.date = new Date(d.date);
        d.no_thefts = +d.no_thefts;
    })*/
    x.domain(d3.extent(data.map(function(d) { return d.date; })));
    y.domain([0, d3.max(data.map(function(d) { return d.thefts; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "x axis")
        .attr('fill', 'white')
        .attr("transform", "translate(0," + height_timescale + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .attr('fill', 'white')
        .call(yAxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "x axis")
        .attr('fill', 'white')
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
});

function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
}

function type(d) {
    d.date = parseDate(d.date);
    d.thefts = +d.thefts;
    return d;
}
