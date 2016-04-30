
//Reference
//zip decode
//http://bl.ocks.org/mbostock/5180185


//chronitron slider
//https://github.com/arnicas/interactive-vis-course/tree/gh-pages/Week13



var click_track = "none";

// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/us.json")
  .defer(d3.csv, "data/stolen_bikes_clnd.csv")
  .await(function(error, us, theftData){

      function  filter_data(start_year,end_year)
      {
          theftData = theftData.filter(function(data){return (+data.year >= +start_year)&&(+data.year <= +end_year)});
      }

      var baseData = theftData;

    //hard coded date
      filter_data(2005,2015);
    
    // --> PROCESS DATA
      var width = 960,
          height = 600;

      var projection = d3.geo.albersUsa()
          .scale(1000)
          .translate([width / 2, height / 2]);

      var path = d3.geo.path()
          .projection(projection);

      var svg = d3.select(".vis-map").append("svg")
          .attr("width", width)
          .attr("height", height);

      svg.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height);
          //.on("click", clicked);

      var g = svg.append("g");


      g.append("g")
              .attr("id", "states")
              .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
              .enter().append("path")
              .attr("d", path);
              //.on("click", clicked);

      g.append("path")
              .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
              .attr("id", "state-borders")
              .attr("d", path);

      var locations = svg.append("g")
          .attr("class", "locations");

      var zip="";


      d3.select(".locations").selectAll("circle").remove();

      var map_reset_flag = false;

      var day_night_input = d3.select("#day-night-btn")
          .on("click", function()
          {
              click_track = "day_night";
              map_reset_flag = true;
              //console.log(click_track);
              change();
              legend_bar();
          });

      var season_input = d3.select("#season-btn")
          .on("click", function()
          {
              click_track = "season";
              map_reset_flag = true;
              //console.log(click_track);
              change();
              legend_bar();


          });

      var input = d3.select("input#point-zip")
          .on("cut", function() { setTimeout(bride_change, 10); })
          .on("paste", function() { setTimeout(bride_change, 10); })
          .on("input", bride_change)
          .on("change", bride_change)
          .on("keyup", bride_change);




      var reset_input = d3.select("#reset-btn")
          .on("click", function()
          {
              click_track = "none";
              map_reset_flag = true;
              //console.log(click_track);
              change();
              legend_bar();
          });



      function bride_change()
      {
          map_reset_flag = true;
          change();
      }


      function change()
      {
          var zip = input.property("value");
          //console.log(map_reset_flag);


          if (map_reset_flag == true)
          {
              d3.select(".locations").selectAll("circle").remove();
              map_reset_flag = false;
              //console.log("ajay")
          }

          //adding tooltip
          var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>Theft Location : </strong>" + d.sder_city + "," + d.sder_state + "<br>"
                      +      "<strong>        Season : </strong>" + d.season + "<br>"
                      +  "<strong>        Day or Night : </strong>" + d.day_night + "<br>"
                      +  "<br> Click Me"
              });






          var point_locations = d3.select(".locations").selectAll('circle')
              .data(theftData);


          point_locations.enter().append("circle")
              .attr("cy", function(d) { return projection([+d.longitude,+d.latitude])[1];})
              .attr("cx", function(d) { return projection([+d.longitude,+d.latitude])[0];})
              .attr("class","map-circle")
              .on("click",function(d)
              {

                  var url_x = "index_detail.html?target=_blank&id=" + d.id;
                  window.open(url_x,"_blank");
              })
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
              .attr("strokewidth",2)
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
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
              .attr("r", 3.0)
              .transition()
              .attr("r",6.0)
              .transition()
              .attr("r",3.0);


          point_locations.append("g").call(tip);

          point_locations.exit().remove();

          d3.select("#bar-legend-title").html("<strong># of Thefts : </strong>2005 to " + map_selectedYear);



      }

      var set_day_night = function(d)
      {
          if(d.day_night == 'Night')
          {

              return "#5A807E"
          }
          else
          {
              return "#ff7f00"
          }
      };

      var set_season = function(d){
          if(d.season == 'Summer')
          {
              //yellow
              return "#ff7f00"
          }
          else if(d.season == "Winter")
          {
              //white
              return "#984ea3"
          }
          else if(d.season == "Spring")
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


      var dateFormat = d3.time.format("%Y");
      var map_selectedYear;

      var slider = chroniton()
          .domain([dateFormat.parse("2005"),dateFormat.parse("2015")])
          .labelFormat(d3.time.format('%Y'))
          .width(500)
          .height(50)
          .playButton(true) // can also be set to loop
          .playbackRate(0.2)
          .on("change", function(d) {
              var filterValue = dateFormat(d3.time.year(d));
              //console.log("filterValue", filterValue);
              theftData = baseData;
              map_selectedYear = filterValue;
              filter_data(2005,filterValue);
              filter_legend_data(filterValue);
              legend_bar();
              change();


          });

      d3.select(".vis-map-slider")
          .call(slider);

      //d3.select(".vis-map-slider")
          //.append('button').text('play').on('click', function() { slider.play(); });


          // Update points map
    updatePointsMap();
  });
    

function updatePointsMap() {

  // --> map implementation

}