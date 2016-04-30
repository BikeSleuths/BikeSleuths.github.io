
//Reference
//sunburst
//https://bl.ocks.org/mbostock/4348373

var sunData;



// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/theft_sunburst.json")
  .await(function(error, sun_Data){

      //filter data
      sunData = sun_Data;

      //console.log(sunData);

      var width = 760,
          height = 500,
          radius = (Math.min(width, height) / 2) - 10;


      var formatNumber = d3.format(",d");

      var x = d3.scale.linear()
          .range([0, 2 * Math.PI]);

      var y = d3.scale.sqrt()
          .range([0, radius]);

      var color = d3.scale.category20c();

      var partition = d3.layout.partition()
          .value(function(d) { return d.size; });

      var arc = d3.svg.arc()
          .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
          .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
          .innerRadius(function(d) { return Math.max(0, y(d.y)); })
          .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var svg = d3.select(".vis-sunburst").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition.nodes(sunData)
          .filter(function(d) {
              return (d.dx > 0.002); // 0.005 radians = 0.29 degrees
          });

      //adding tooltip
      var cc_tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
              return d.name +  " : " + formatNumber(d.value);
          });

      svg.call(cc_tip);


      svg.selectAll("path")
          .data(nodes)
          .enter().append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
          .on("click", click)
          .on("mouseover", mouseover)
          .on('mouseout', cc_tip.hide)
          .append("title")
          .text(function(d) { return d.name + "\n" + formatNumber(d.value); });

      d3.select(self.frameElement).style("height", height + "px");

      legend_concentric();

      function click(d) {
          svg.transition()
              .duration(750)
              .tween("scale", function() {
                  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                      yd = d3.interpolate(y.domain(), [d.y, 1]),
                      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                  return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
              })
              .selectAll("path")
              .attrTween("d", function(d) { return function() { return arc(d); }; });
      }

      // Fade all but the current sequence, and show it in the breadcrumb trail.
      function mouseover(d) {

          var totalSize = 5243;
          var percentage = (100 * d.value / totalSize).toPrecision(3);
          var percentageString = "% of bike stolen in the BikeIndex Dataset = " + percentage + "%";
          if (percentage < 0.1) {
              percentageString = "< 0.1%";
          }

          //console.log(percentageString);
          d3.select("#percentage")
              .text(percentageString);

          d3.select("#explanation")
              .style("visibility", "");

          cc_tip.show(d);

      }

      function legend_concentric()
      {
          var c_color = colorbrewer["Set2"]["4"];

          c_color = ["#31A354","#E6550D","#FD8D3C","#3182BD"];

          var svg_legend_cir = d3.select(".vis-concentric-legend").append("svg")
              .attr("width", 300)
              .attr("height", 500)
              .append("g")
              .attr("transform", "translate(" + 100 + "," + 150 + ")");


          var d_cir = svg_legend_cir.selectAll("circle").data([70,50,30,10]).enter();

          d_cir.append("circle")
              .attr("r",function(d){return d})
              .attr("cx","70px")
              .attr("cy","70px")
              .attr("fill",function(d,i){return c_color[i]})
              .attr("stroke","black")
              .attr("stroke-width",1);

          d_cir.append("text")
              .attr("x",function(d){return d-30})
              .attr("y",function(d,i){return 1*i + d})
              .text(function(d)
              {
                  if (d==70)
                  {
                      return "USA"
                  }
                  else if (d==50)
                  {
                      return "State"
                  }
                  else if (d==30)
                  {
                      return "Manufacturer"
                  }
                  else
                  {
                      return "Lock Type"
                  }
              })
              .attr("font-size","12px")
              .attr("fill","white")
              .attr("stroke","white")
              .attr("stroke-width",0.5)
      }




  });












    
