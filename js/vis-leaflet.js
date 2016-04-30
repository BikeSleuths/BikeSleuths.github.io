

// --> CREATE SVG DRAWING AREA

var myParam = location.search.split('id=')[1];

//console.log(myParam);


var theftData;
var placesData;

var id = myParam;


//filter theft data for clicked id
function  filter_theft_data(id)
{
    theftData = theftData.filter(function(data){return (data.id==id)});
}

//filter place data for clicked id
function  filter_place_data(id)
{
    var id_v = id + ".0";
    //console.log(id_v);
    placesData = placesData.filter(function(data){return (data.id==id_v)});
}


// Use the Queue.js library to read two files

queue()
    .defer(d3.csv, "data/stolen_bikes_clnd_detail.csv")
    .defer(d3.csv, "data/places_detail.csv")
    .await(function(error, theft_Data, places_Data){


        theftData = theft_Data;
        placesData = places_Data;

        //console.log(theftData);

        //calling filter functions
        filter_theft_data(id);
        filter_place_data(id);

        //console.log(placesData);
        //console.log(theftData);


        var lat_long = [+theftData[0].latitude,+theftData[0].longitude];
        //console.log(lat_long);

        var map = L.map('theft-map').setView(lat_long, 15);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18
            }).addTo(map);

        /* Initialize the SVG layer */
        map._initPathRoot();

        /* We simply pick up the SVG from the map object */
        var svg = d3.select("#theft-map").select("svg"),
            g = svg.append("g");

        theftData.forEach(function(d) {
            d.LatLng = new L.LatLng(+d.latitude,
                +d.longitude)
            d.place_img = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + d.latitude + "," + d.longitude + "&fov=180&heading=235&pitch=10&key=AIzaSyA8YoIbqgv7rQDk5middMCI6f4_5Hxpkg8";
        });

        //console.log(theftData);

        //adding tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong><span style='color:red;'>Theft Location</span></strong>";
            });

        g.call(tip);




        var feature = g.selectAll("circle")
            .data(theftData)
            .attr("class","theft-circle")
            .enter().append("circle")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", .6)
            .style("fill", "red")
            .attr("r", 5)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

            ;


        map.on("viewreset", update);
        update();

        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        map.latLngToLayerPoint(d.LatLng).x + "," +
                        map.latLngToLayerPoint(d.LatLng).y + ")";
                })
        }


        //drawing circles for POI
        placesData.forEach(function(d) {
            d.LatLng = new L.LatLng(+d.poi_lat,
                +d.poi_long);
        });

        //console.log(theftData);

        //adding tooltip
        var place_tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Place Type :</strong> <span style='color:red'>" + d.poi_type + "</span>" + "<br>" + "<strong>Place Name :</strong> <span style='color:red'>" + d.place_name + "</span>";
            });

        g.call(place_tip);




        var place_feature = g.selectAll("circle")
            .data(placesData)
            .enter().append("circle")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", .6)
            .style("fill", "blue")
            .attr("r", 5)
            .on('mouseover', place_tip.show)
            .on('mouseout', place_tip.hide)

            ;


        map.on("viewreset", update_place);
        update_place();


        function update_place() {
            place_feature.attr("transform",
                function (d) {
                    return "translate(" +
                        map.latLngToLayerPoint(d.LatLng).x + "," +
                        map.latLngToLayerPoint(d.LatLng).y + ")";
                })
        }

        //loading place image
        $("#place-img").attr('src',theftData[0].place_img);


        //loading bike image
        if(theftData[0].large_img.length)
        {
            $("#bike-img").attr('src',theftData[0].large_img);
        }
        else
        {
            $("#bike-img").attr('src',"images/No_Image_Available.png");
        };

        //loading title
        $("#detail-title").append(theftData[0].title);

        //manufacturer
        $("#manufacturer").append(theftData[0].manufacturer_name);

        //location
        $("#location").append(theftData[0].sder_city +", " + theftData[0].sder_state +", " +  +theftData[0].sder_postal_code);

        //stolen date
        $("#theft-date").append(theftData[0].stolen_localDate);

        //theft desc
        $("#theft-desc").append(theftData[0].theft_description);

        //lock
        $("#lock").append(theftData[0].locking_description);

        //lock defeat
        $("#lock-defeat").append(theftData[0].lock_defeat_description);





    });



