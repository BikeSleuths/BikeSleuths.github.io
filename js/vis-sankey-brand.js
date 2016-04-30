
//Reference
//sankey
//http://bl.ocks.org/d3noob/c2637e28b79fb3bfea13

d3.json("data/brand_sankey_brand_year.json", function(error,graph) {

    var units = "Bikes Stolen";

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.category20();

// append the svg canvas to the page
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);


    //adding link tooltip
    var link_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.source.name + " → " +
                d.target.name + "<br>" + format(d.value);
        });

    svg.call(link_tip);

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke", function(d){
            var clor = color(d.source.name.replace(/ .*/, ""));
            return clor;
        })
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
    link.on('mouseover', link_tip.show)
        .on('mouseout', link_tip.hide);

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function() {
                this.parentNode.appendChild(this); })
            .on("drag", dragmove));


    //adding rect tooltip
    var rect_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
             return d.name + "<br>" + format(d.value);
        });

    node.call(rect_tip);

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
            if(d.id == "year")
            {
                return "#feb24c";
            }
            else
            {
                return d.color = color(d.name.replace(/ .*/, ""));
            }})

        .style("stroke", function(d) {
            return d3.rgb(d.color).darker(2); })
        .on('mouseover', rect_tip.show)
        .on('mouseout', rect_tip.hide);

    // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");


    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

});