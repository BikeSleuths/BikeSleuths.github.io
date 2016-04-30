



var bar_season_data = [];
var bar_day_data = [];
var temp_bar_season_data = [];
var temp_bar_day_data = [];
var legend_data;

var legend_bar_margin = {top: 20, right: 40, bottom: 30, left: 70},
    legend_bar_width = 300 - legend_bar_margin.left - legend_bar_margin.right,
    legend_bar_height = 300 - legend_bar_margin.top - legend_bar_margin.bottom;

var svg_legend_bar = d3.select(".vis-bar-legend").append("svg").attr("height", legend_bar_height + legend_bar_margin.top + legend_bar_margin.bottom + "px")
    .attr("width", legend_bar_width + legend_bar_margin.left + legend_bar_margin.right + "px");

function filter_legend_data(year)
{
    temp_bar_season_data = bar_season_data.filter(function(data){return (+data.year >= 2005)&&(+data.year <= year)});
    temp_bar_day_data = bar_day_data.filter(function(data){return (+data.year >= 2005)&&(+data.year <= year)});
}


queue()
    .defer(d3.csv, "data/theft_year_season_sum.csv")
    .defer(d3.csv, "data/theft_year_day_sum.csv")
    .await(function(error, bar_season_Data, bar_day_Data){
        bar_season_data = bar_season_Data;
        bar_day_data = bar_day_Data;


        filter_legend_data(2005);
        legend_bar();

        legend_circle();

    });

function legend_circle()
{
    var svg_legend_cir = d3.select(".vis-circle-legend").append("svg").attr("height", "50px").attr("width","50px");
    svg_legend_cir.selectAll("circle").data([1]).enter().append("circle")
        .attr("r",6.0)
        .attr("cx","7px")
        .attr("cy","25px")
        .attr("fill","#EC7873");
}


function legend_bar() {



    //using nest to rollup data
    var sum_data_season = d3.nest()
        .key(function(d) { return d.season; })
        .rollup(function(v) { return d3.sum(v,function(d) { return +d.thefts; }); })
        .entries(temp_bar_season_data);

    var sum_data_day = d3.nest()
        .key(function(d) { return d.day_night; })
        .rollup(function(v) { return d3.sum(v,function(d) { return +d.thefts; }); })
        .entries(temp_bar_day_data);

    var sum_data = d3.nest()
        .key(function(d) { return " " })
        .rollup(function(v) { return d3.sum(v,function(d) { return +d.thefts; }); })
        .entries(temp_bar_season_data);


    //console.log(sum_data)



    var data;
    if (click_track == "day_night")
    {
        data = sum_data_day;
    }
    else if (click_track == "season")
    {
        data = sum_data_season;
        click_track = "season"
    }
    else
    {
        click_track = "none";
        data = sum_data;
    }

    legend_data = data;


    //converting numbers from string to numeric
    for (var i = 0; i < data.length; i++) {
        data[i].thefts = +data[i].values;
    }



    sorting_data(data);

    //drawing bar



    d3.select(".vis-bar-legend").selectAll("rect").remove();
    d3.select(".vis-bar-legend").selectAll(".legend-label").remove();
    d3.select(".vis-bar-legend").selectAll(".legend-data-label").remove();

    var bar = svg_legend_bar.selectAll("rect")
        .data(data)
        .enter().append("g");

    var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.thefts; })])
        .range([0, legend_bar_width]);


    var set_day_night = function(d)
    {
        if(d.key == 'Night')
        {

            return "#5A807E"
        }
        else
        {
            return "#ff7f00"
        }
    };

    var set_season = function(d){
        if(d.key == 'Summer')
        {
            //yellow
            return "#ff7f00"
        }
        else if(d.key == "Winter")
        {
            //white
            return "#984ea3"
        }
        else if(d.key == "Spring")
        {
            //green
            return "#4daf4a"
        }
        else
        {
            //fall
            return "#377eb8"
        }
    };


    //building bar chart
    bar.append("rect")
        .attr("fill",function(d)
        {
            if (click_track == "day_night")
            {

                return set_day_night(d);
            }
            else if (click_track == "season")
            {

                return set_season(d);
            }
            else
            {
                return "#EC7873"
            }
        })
        .attr("width", function (d) {
            return scale(d.thefts)
        })
        .attr("height", "30px")
        .attr("x",legend_bar_margin.left)
        .attr("y",function(d,index)
        {
            return index * 30
        });

    //adding y axis label
    bar.append("text")
        .attr("class","legend-label")
        .attr("x",legend_bar_margin.left - 10)
        .attr("y",function(d,index)
        {
            return index * 30
        })
        .attr("dy","19px")
        .text(function(d){return d.key});

    //adding data label
    bar.append("text")
        .attr("class","legend-data-label")
        .attr("x",function(d)
        {
            return legend_bar_margin.left + scale(d.thefts) + 40;
        })
        .attr("y",function(d,index)
        {
            return index * 30
        })
        .text(function(d){return d.thefts})
        .attr("dy","19px");






}
    //function to sort data
    function sorting_data(data)
        {
            data.sort(function(a,b)
            {
                return b.thefts - a.thefts;
            });
        }
