
//reference used - http://bl.ocks.org/KoGor/5685876
// --> CREATE SVG DRAWING AREA


var mapTopJson = [];
var theftDataCsv = [];
var st_map = [];



// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/us.json")
  .defer(d3.csv, "data/theft_state_year_sum.csv")
    .defer(d3.tsv, "data/us-state-names.tsv")
  .await(function(error, map, theft_data, tsv){


    // --> PROCESS DATA


      theft_data.forEach(function(d) {
          // Convert string to 'date object'
          //d.year = +d.year;

          // Convert numeric values to 'numbers'
          d.no_thefts = +d.no_thefts;
      });


      //filtering from 2005
      theft_data = theft_data.filter(function(data){return (+data.year >= 2005)&&(+data.year <= 2015)});

      //using nest to rollup data by state
      theft_data = d3.nest()
          .key(function(d) { return d.sder_state; })
          .rollup(function(v) { return d3.sum(v,function(d) { return d.no_thefts; }); })
          .entries(theft_data);






      mapTopJson = map;
      theftDataCsv = theft_data;
      st_map = tsv;



    // Update choropleth
    updateChoropleth();
  });

//called on change of drop down
function updateChart()
{
    updateChoropleth();
}
    

function updateChoropleth() {


    var width = 620,
        height = 500;

    var div = d3.select("#vis-choro").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select("#vis-choro").append("svg")
        .attr("width", width)
        .attr("height", height);


    var projection = d3.geo.albersUsa()
        .scale(700)
        .translate([width / 2, height / 2]);


    var path = d3.geo.path()
        .projection(projection);

  // --> Choropleth implementation

    var comma_format = d3.format(",");

    var selectedValue_Type = "values";

    //sorting data so that one can easily find min and max
    theftDataCsv.sort(function(a,b)
    {
        return a[selectedValue_Type] - b[selectedValue_Type]
    });


    var min = theftDataCsv[0]["values"];
    var max = theftDataCsv[theftDataCsv.length - 1]["values"];

    var step = (max - min)/9;
    step = Math.round(step);



    var legend_labels = [];

    //var color_domain = [];
    var ext_color_domain = [0];
    var temp = 0;

    for(var i=0;i<8;i++)
    {
        //temp = Math.pow(10,i);
        temp = temp + step;
        ext_color_domain.push(temp);
    }


    var txt = '';

    var color_domain = ext_color_domain.splice(0,9);

    for(var x=0;x<color_domain.length;x++)
    {
        txt = '>= ' + comma_format(color_domain[x]);
        legend_labels.push(txt);
    };




    var col_brew = ["#fff"];

    var brew_act = colorbrewer["Reds"][9];

    for(var y=0;y<9;y++)
    {
        col_brew.push(brew_act[y]);
    }

    col_brew.push(colorbrewer["Reds"][9]);



    var color = d3.scale.threshold()
        .domain(color_domain)
        .range(col_brew);



    var us = topojson.feature(mapTopJson, mapTopJson.objects.states).features;

    var measureById = {};
    var stateById = {};
    var codeById = {};
    //var t_CountryById = {};

    theftDataCsv.forEach(function(d)
    {
        measureById[d.key] = d.values;
        //CountryById[d.Code] = d.Country;
    });


    st_map.forEach(function(d)
    {
        stateById[d.id] = d.name;
    });

    st_map.forEach(function(d)
    {
        codeById[d.id] = d.code;
    });





    var us_map = svg.selectAll("path")
        .data(us);

    //enter
    us_map.enter().append("path")
        .attr("class","states")
        .attr("d", path)
        .attr("fill","#fff");



    //update
    us_map.style("fill", function(d) {
        return color(measureById[stateById[d.id]]);

        })
        .style("opacity", 0.8)
        .on("click", function(d){
            //d3.selectAll(".state-line").remove();
            d3.select("#vis-trend").selectAll("svg").remove();
            var state = stateById[d.id];
            updateSateLine(state)
        })
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 1);
            d3.select(this).style("stroke","steelblue");
            d3.select(this).style("stroke-width",3);

            div.transition().duration(300)
                .style("opacity", 1);

            div.html(stateById[d.id] + "<br/>" + measureById[stateById[d.id]] )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
            d3.select(this).style("stroke","#e1e1e1");
            d3.select(this).style("stroke-width",2);
            div.transition().duration(300)
                .style("opacity", 0);
        });


    // add state names
    svg.append("g")
        .attr("class", "states-names")
        .selectAll("text")
        .data(us)
        .enter()
        .append("svg:text")
        .text(function(d){
            return codeById[d.id];
        })
        .attr("x", function(d){
            if (isNaN(path.centroid(d)[0]))
            {
                return null
            }
            else
            {
                return path.centroid(d)[0];
            }

        })
        .attr("y", function(d){
            if (isNaN(path.centroid(d)[1]))
            {
                return null
            }
            else
            {
                return path.centroid(d)[1];
            }

        })
        .attr("text-anchor","middle")
        .style("font-size",8)
        .attr('fill', 'black');


//exit
    us_map.exit().remove();

    var legend_st = svg.selectAll("g.legend")
        .data(color_domain);

    legend_st.enter().append("g")
        .attr("class", "legend");

    var ls_w = 15;
    var ls_h = 15;

    legend_st.append("rect")
        .attr("x",-5)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h - 70;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);



    legend_st.exit().remove();

    svg.selectAll("g.legend_txt").remove();

    var legend_txt = svg.selectAll("g.legend_txt")
        .data(color_domain);

    legend_txt.enter().append("g")
        .attr("class", "legend_txt");

    legend_txt.append("text")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4 - 70;})
        .text(function(d, i){ return legend_labels[i]; });

    legend_txt.exit().remove();

}


