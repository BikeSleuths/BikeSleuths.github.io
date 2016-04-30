/**
 * Created by nickwhalen on 4/16/16.
 */

/**d3.csv("data/stolen_bikes_clnd.csv", function(error, data) {
    if (error) throw error;
    var masterList = [];
    data.forEach(function (d) {
        d.stolen_localDate = new Date(d.stolen_localDate);
        var dateInfo = new Date(d.stolen_localDate);
        var timeObject = {
            hour:  dateInfo.getHours(),
            day: dateInfo.getDay(),
            thefts: 1
        }
        masterList.push(timeObject);
    })
    var filteredData = [];
    var count = 0;
    for(var j = 0; j < masterList.length; j++){
        var temp = masterList[j];
        for (var i=0; i < masterList.length; i++) {
            if (temp.hour == masterList[i].hour && temp.day == masterList[i].day) {
                masterList[i].thefts++;
                count++;
                //filteredData.push(masterList[i]);
                //return myArray[i];
            }
        }
    }
    console.log(count);
    function CSV(array) {
        // Use first element to choose the keys and the order
        var keys = Object.keys(array[0]);

        // Build header
        var result = keys.join("\t") + "\n";

        // Add the rows
        array.forEach(function(obj){
            keys.forEach(function(k, ix){
                if (ix) result += "\t";
                result += obj[k];
            });
            result += "\n";
        });

        return result;
    }
    var csv = CSV(masterList);
    console.log(csv);
    //console.log("Filtered: "+filteredData);
    //console.log(masterList);
    //console.log(data);

})**/
function formatDay(day){
    if(day == 0){return 'Monday';}
    if(day == 1){return 'Tuesday';}
    if(day == 2){return 'Wednesday';}
    if(day == 3){return 'Thursday';}
    if(day == 4){return 'Friday';}
    if(day == 5){return 'Saturday';}
    if(day == 6){return 'Sunday';}
}

function formatHour(hour){
    if(hour == 0){return '1am';}
    if(hour == 1){return '2am';}
    if(hour == 2){return '3am';}
    if(hour == 3){return '4am';}
    if(hour == 4){return '5am';}
    if(hour == 5){return '6am';}
    if(hour == 6){return '7am';}
    if(hour == 7){return '8am';}
    if(hour == 8){return '9am';}
    if(hour == 9){return '10am';}
    if(hour == 10){return '11am';}
    if(hour == 11){return '12pm';}
    if(hour == 12){return '1pm';}
    if(hour == 13){return '2pm';}
    if(hour == 14){return '3pm';}
    if(hour == 15){return '4pm';}
    if(hour == 16){return '5pm';}
    if(hour == 17){return '6pm';}
    if(hour == 18){return '7pm';}
    if(hour == 19){return '8pm';}
    if(hour == 20){return '9pm';}
    if(hour == 21){return '10pm';}
    if(hour == 22){return '11pm';}
    if(hour == 23){return '12am';}
}
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Thefts:</strong> <span style='color:#28acac'>" + d.thefts + "</span>"+
            "<br><strong>Time:</strong> <span style='color:#28acac'>" + formatHour(d.hour) + "</span>"+
            "<br><strong>Day:</strong> <span style='color:#28acac'>" + formatDay(d.day) + "</span>";
    })

var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12a"];
//based on http://figurebelow.com/d3/wp-d3-and-day-hour-heatmap/
d3.csv("data/theft_times_clnd.csv",
    function(d) {
        return {
            day: +d.day,
            hour: +d.hour,
            thefts: +d.thefts
        };
    },
    function(error, data) {
        var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) { return d.thefts; })])
            .range(colors);

        var svg = d3.select("#time-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize -(30); })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", -35)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        var heatMap = svg.selectAll(".hour")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize+(35); })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        heatMap.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d.thefts); });

        heatMap.append("title").text(function(d) { return d.thefts; });

        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; })
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);

        heatMap.call(tip);


    });
