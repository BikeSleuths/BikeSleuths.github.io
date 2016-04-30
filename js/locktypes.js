/**
 * Created by nickwhalen on 4/11/16.
 */

var valueLabelWidth = 40; // space reserved for value labels (right)
var barHeight = 20; // height of one bar
var barLabelWidth = 210; // space reserved for bar labels
var barLabelPadding = 15; // padding between bar and bar labels (left)
var gridLabelHeight = 18; // space reserved for gridline labels
var gridChartOffset = 3; // space between start of grid and first bar
var maxBarWidth = 420; // width of the bar with the max value

// data
d3.csv("data/theft_lock_year_sum.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function (d) {
        d.no_thefts = +d.no_thefts;
    })
    var csv = data;

// data aggregation
    var aggregatedData = d3.nest()
        .key(function (d) {
            return d['locking_description'];
        })
        .rollup(function (d) {
            return {
                'value': d3.sum(d, function (e) {
                    return parseFloat(e['no_thefts']);
                })
            };
        })
        .entries(csv);

// accessor functions
    var barLabel = function (d) {
        return d.key;
    };
    var barValue = function (d) {
        return d.values.value;
    };

// sorting
    var sortedData = aggregatedData.sort(function (a, b) {
        return d3.descending(barValue(a), barValue(b));
    });

// scales
    var yScale = d3.scale.ordinal().domain(d3.range(0, sortedData.length)).rangeBands([0, sortedData.length * barHeight]);
    var y = function (d, i) {
        return yScale(i);
    };
    var yText = function (d, i) {
        return y(d, i) + yScale.rangeBand() / 2;
    };
    var x = d3.scale.linear().domain([0, d3.max(sortedData, barValue)]).range([0, maxBarWidth]);
// svg container element
    var chart = d3.select('#lock-barchart').append("svg")
        .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
        .attr('height', gridLabelHeight + gridChartOffset + sortedData.length * barHeight);
// grid line labels
    var gridContainer = chart.append('g')
        .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')');
    gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
        .attr("x", x)
        .attr("dy", -3)
        .attr('fill', 'white')
        .attr("text-anchor", "middle")
        .text(String);
// vertical grid lines
    gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr('fill', 'white')
        .attr("y1", 0)
        .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
        .style("stroke", "#ccc");
// bar labels
    var labelsContainer = chart.append('g')
        .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')');
    labelsContainer.selectAll('text').data(sortedData).enter().append('text')
        .attr('y', yText)
        .attr('stroke', 'none')
        .attr('fill', 'white')
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'end')
        .text(barLabel);
// bars
    var bars = chart.append('g')
        .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');
    bars.selectAll("rect").data(sortedData).enter().append("rect")
        .attr('y', y)
        .attr('height', yScale.rangeBand())
        .attr('width', function (d) {
            return x(barValue(d));
        })
        .attr('class','bar')
        .attr('stroke', 'white')
        .attr('load', function(){
            showLockDetail('Cable Lock');
        })
        .on("click", function(d){
            showLockDetail(d);
        });
// bar value labels
    bars.selectAll("text").data(sortedData).enter().append("text")
        .attr("x", function (d) {
            return x(barValue(d));
        })
        .attr("y", yText)
        .attr("dx", 3) // padding-left
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "start") // text-align: right
        .attr("fill", "white")
        .attr("stroke", "none")
        .text(function (d) {
            return d3.round(barValue(d), 2);
        });
// start line
    bars.append("line")
        .attr("y1", -gridChartOffset)
        .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
        .style("stroke", "#000");

});


function showLockDetail(d){
    var detailsDiv = $('#lock-details');
    detailsDiv.empty();
    var imgSrc = '';
    var lockInfo = '';
    //on page load:
    if(d == 'Cable Lock'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/cablelock.jpg'//'images/cablelock.jpg;'//'http://i1.adis.ws/i/washford/534067?$pd_main_v2$';//'images/cablelock.jpg;';
        var source = "<br>"+'Source: '+"<a href='https://www.rei.com/learn/expert-advice/bike-lock.html'>REI Website</a>";
        lockInfo = 'These are versatile and adaptable but generally offer less theft deterrence than U-locks. Bolt cutters are able to cut through most cable locks. On their own, they may be suitable for low-crime areas. Elsewhere, they are a good choice to use in combination with a U-lock to secure easily removed parts (e.g., seat). Many have integral combination or key locks; others require a separate padlock. Some feature sliding sizing or an armored coating. A few newer models feature stylish designs.' + source;

        $(detailsDiv).attr("class","lockSummary well");

        detailsDiv.append(
            "<table>"
            +"<tr><h5><strong>"+d+"</strong></h5></tr>"
            +"<tr>"
            +"<td><img src="+imgSrc+" class='bikeLockImg'> </td>"
            +"<td>&nbsp;</td>"
            +"<td>"+lockInfo+"</td>"
            + "</tr>"
            +"</table>"
        );
        return;
    }
    //get image source for lock type
    if(d.key == 'U-lock'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/ulock.jpeg'//'images/ulock.jpeg;'//'http://www-scf.usc.edu/~cocchi/itp104/dm_hidden_lab/images/bike_u-lock.jpg';//'images/ulock.jpeg;';
        var source = "<br>"+'Source: '+"<a href='https://www.rei.com/learn/expert-advice/bike-lock.html'>REI Website</a>";
        lockInfo = 'This widely used bike lock style is an excellent deterrent. The bulky locking mechanism resists hammers, chisels and the like. Its horseshoe shape can limit leveraging—provided its not way oversized for the bike. The goal is to reduce the amount of space in which a thief can insert a crowbar and leverage enough oomph to pop it apart.U-locks come in various sizes. Your goal is to size the lock so that it goes around the things you’re locking with as little gap left as possible. Small to medium models lock one wheel and your frame to a fixed object. Large models lock both wheels and your frame to a fixed object.'+source;
    }
    if(d.key == 'U-lock + cable'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/ulockcable.jpg'//'/images/ulockcable.jpg;';//'http://www.citygrounds.com/prodimages/1625-DEFAULT-l.jpg';//'images/ulockcable.jpg;';
        lockInfo = 'The combination of U-lock and a cable can be an effective deterrent against theft. Nick will add more text when he has time.';
    }
    if(d.key == 'Not Locked'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/unlocked.jpg'//'http://media.tumblr.com/tumblr_m9fqcwuzl11r1p25e.jpg';//'images/notlocked.jpg;';
        lockInfo = 'Never leave your bike unlocked, even at home. Ever.';
    }
    if(d.key == 'Other'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/other.jpg'//'http://static.comicvine.com/uploads/original/12/128686/3186920-other.gif';//'images/other.jpg;';
        lockInfo = '';
    }
    if(d.key == 'Chain + padlock'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/chainpadlock.jpg'//'http://www.kryptonitelock.com/content/dam/kryt-us/en/product-images/001669_608.jpg.thumb.400.400.png';//'images/chainpadlock.jpg;';
        var source = "<br>"+'Source: '+"<a href='https://www.rei.com/learn/expert-advice/bike-lock.html'>REI Website</a>";
        lockInfo = 'Tough enough for high-crime areas, these bike locks use a specially designed chain link that resists hacksaws or chisels and makes the chain tough to leverage. Be sure to invest in a padlock thats just as sturdy—thieves can easily cut through thin locks, no matter how sturdy the chain. The downside? Chains are heavy and bulky, so they are best for stationary uses.'+source;
    }
    if(d.key == 'Heavy Security Chain'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/heavybikechain.jpg' //'http://ecx.images-amazon.com/images/I/71reHvKKbjL._SX466_.jpg';//'images/heavybikechain.jpg;';
        lockInfo = 'While these locks can keep thieves at bay for a while, these types of chains can be cut up with enough time.';
    }
    if(d.key == 'Two U-locks'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/2ulocks.jpg'//'http://www.ortre.com/uploads/6/2/4/5/6245725/s255423054912589629_p3_i7_w850.jpeg';//'images/2ulocks.jpg;';
        var source = "<br>"+'Source: '+"<a href='http://www.kryptonitelock.com/en/proper-lock-up/bicycle-lock-up.html'>Kryptonite lock website</a>";
        lockInfo = 'As these data suggests, this method is highly effective and uses two, typically primary locks. One of the locks secures the rear wheel and the frame to the immovable object, while the other lock secures the front wheel to the frame.'+ source;

    }
    if(d.key == 'Cable Lock'){
        imgSrc = 'https://s3.amazonaws.com/biketheftsleuths/cablelock.jpg';//'http://i1.adis.ws/i/washford/534067?$pd_main_v2$';//'images/cablelock.jpg;';
        var source = "<br>"+'Source: '+"<a href='https://www.rei.com/learn/expert-advice/bike-lock.html'>REI Website</a>";
        lockInfo = 'These are versatile and adaptable but generally offer less theft deterrence than U-locks. Bolt cutters are able to cut through most cable locks. On their own, they may be suitable for low-crime areas. Elsewhere, they are a good choice to use in combination with a U-lock to secure easily removed parts (e.g., seat). Many have integral combination or key locks; others require a separate padlock. Some feature sliding sizing or an armored coating. A few newer models feature stylish designs.' + source;
    }

    $(detailsDiv).attr("class","lockSummary well");

    detailsDiv.append(
        "<table>"
            +"<tr><h5><strong>"+d.key+"</strong></h5></tr>"
        +"<tr>"
        +"<td><img src="+imgSrc+" class='bikeLockImg'> </td>"
            +"<td>&nbsp;</td>"
        +"<td>"+lockInfo+"</td>"
        + "</tr>"
        +"</table>"
    );

}

