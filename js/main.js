/**
 * Created by nickwhalen on 3/20/16.
 */
<<<<<<< HEAD
    
=======

>>>>>>> master
var geoData;
var bikeData;

// Use Queue.js library to read two files
queue()
    .defer(d3.json, "data/convertcsv.geojson")
    .defer(d3.csv, "data/stolen_bikes.csv")
    .await(function(error, bikeMap, stolenBikeData){
        // assign global data variables
        geoData = bikeMap;
        bikeData = stolenBikeData;
        // print data to console
        logData(geoData, bikeData, error);
    });

function logData(geoData, bikeData, error){
    console.log("geoData: "+ geoData);
    console.log("bikeData: "+ bikeData);

}