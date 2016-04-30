

//Reference
//bubble
//https://bl.ocks.org/mbostock/7607535

// --> CREATE SVG DRAWING AREA

var bubbleData;
var b_poi_type = "point_of_interest";

var input_bubble = d3.select("#place-zip")
    .on("cut", function() { setTimeout(update_bubble(b_poi_type), 10); })
    .on("paste", function() { setTimeout(update_bubble(b_poi_type), 10); })
    .on("change", function() {update_bubble(b_poi_type)})
    .on("keyup", function() {update_bubble(b_poi_type)});

// Use the Queue.js library to read two files

queue()
    .defer(d3.json, "data/places_bubble_wzip.json")
    .await(function(error, bubble_Data){

        //filter data
        bubbleData = bubble_Data;

        update_bubble(b_poi_type);

        //console.log(bubbleData)

        //processing input zip




    });

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size, classZip: node.zip});
    }

    recurse(null, root);
    return {children: classes};
}


//update bubble chart

function update_bubble(bubble_poi)
{

    var t = bubbleData["children"]

    //console.log(bubbleData);
    //console.log(t);

    for(var i= 0; i < t.length; i++)
    {
        if (t[i]["name"] == bubble_poi)
        {
            //console.log(i,t[i]["name"]);
            break;
        }
    }

    //console.log(t[i]);

    var f_bubbleData = t[i];

    //console.log(f_bubbleData);

    //bubbleData = bubble_Data;

    function comparator(a, b) {
        return b.value - a.value;
    }

    d3.select(".vis-bubble").selectAll(".bubble").remove();

    var diameter = 960,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter/2, diameter/2])
        .padding(1.5);

    var svg = d3.select(".vis-bubble").append("svg")
        .attr("width", diameter/2)
        .attr("height", diameter/2)
        .attr("class", "bubble");

    var node = svg.selectAll(".bubble-node")
        .data(bubble.nodes(classes(f_bubbleData))
            .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "bubble-node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    //node.append("title")
    //.text(function(d) { return d.className + ": " + format(d.value); });

    //adding tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return capitalizeFirstLetter(d.className) + " , Zip : " + d.classZip + " : " + format(d.value);
        });

    node.append("g").call(tip);


    var zip_bubble = input_bubble.property("value");

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("class","bubble_circle")
        //.style("fill", function(d) { return color(d.packageName); })
        .style("fill", function(d) { return "#EC7873" })
        .attr("strokewidth",2)
        .attr("stroke",function(d)
        {
            var l = zip_bubble.length;
            if (d.classZip.toString().substr(0,l) == zip_bubble && l != 0)
            {
                return "cyan"
            }
            else
            {
                return null
            }
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    node.append("text")
        .attr("class","bubble-text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    d3.select(self.frameElement).style("height", diameter + "px");

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    d3.select("#bubble-title").html("POI Type : " + capitalizeFirstLetter(bubble_poi));


}



