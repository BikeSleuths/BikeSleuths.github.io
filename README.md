# Biketheft Sleuths

Hosted online at  http://bikesleuths.github.io/

Repository online at https://github.com/BikeSleuths/BikeSleuths.github.io

Project Screencast: https://www.youtube.com/watch?v=5oTQSAxfL3s&feature=youtu.be

###Organization
1. All data used for visualizations is in the data folder.
2. All style sheets are in the css folder.
3. All JavaScript files are in the js folder.
4. All images are in the images folder.

###UI Libraries
1. For the index.html and index_detail.html pages we used:

*Scrolling Nav HTML Template (for smooth scrolling behavior/navigation) - http://startbootstrap.com

*Bootstrap/Bootswatch (darkly theme) for html components and styling- http://getbootstrap.com/, https://bootswatch.com/darkly/

###Chart Libraries
All visualizations were implemented with D3.js. 

###Website Sections

####Intro Section
Graphic: Summarized the scope of the problkem and provides context. 

####Where Section
Map: This is an interactive Map which plots on a map of US individual bicycle theft incidents.

1. The year slider below the map controls the period of thefts. The play button alongside the slider can be used to animate this.
2. Season Button : changes the dot color by Season, Day/Night Button : changes dot color by if theft happened day or night, Reset button takes it back to default state.
3. A bar chart serves as the legend and shows total count of thefts being plotted on the map
4. A text box "Enter Zip Code", highlights points as numbers are entered into it.
5. Each of the points can be clicked to generate details webpage.
6. Details Webpage

        * shows a google street view of the theft location based on lat long
        * a leaflet/openstreetmap of theft location with surrounding points of interest within 0.25 miles of theft location.
        * image of bike if data has it.
        * Other details of theft incident.




POI: This section includes a dot plot, bar and a bubble chart which gives the details around points of interest surrounding the various thefts locations.

1. Dot Plot - For each place type along x axis, plot individual locations along y axis. Locations with recurring thefts lie high up on the y axis.
    Entering a zip code into the text box highlights points on the dot plot which align with the zip code.
2. Bubble Chart - The bubble chart is linked to the dot plot. Click on any of the place type on the dot plot updates the bubble, basically giving all points from the dot plot.
3. Bar Chart - This chart below the dot plot shares its axis with dot plot, gives total number of thefts for each place type.

####Lock Section
Bar Chart: This is a static bar chart showing total thefts by lock type, 2005-2015. As the user clicks through each bar, the lock type information appears to the right. The original plan was to have this chart filter by year but we decided that there was just not enough data in each year to really answer the question so we took the sums of all lock thefts by type instead. 

Sunburst Chart: Interactive chart with concentric layers representing various dimensions. Inner most circle - US total thefts, +1 layer - state, + 1 layer - bicycle brand and final layer is lock type.

    * any section in the chart can be clicked to zoom into just that section.
    * As user interacts with chart, probability numbers for the selected combination is displayed on the screen.

####Trends Section
Map: A interactive choropleth map of the US where intensity of color indicates the number of theft.

Line Chart: A two Y axis line chart, red line fixed to show bicycle thefts for US and the blue line gives thefts for a state that was clicked upon on the map.

####When Section
Time table: This is a static visualization showing the total number of thefts for every hour of every day of the week from 1971-2015. This chart was straightforward to implement and most of the effort went into data wrangling and sorting. Also added tooltips so the user can more quickly browse different days/times on hover.

Area Chart + brushing area: Shows the total number of thefts by month, 2005-2015. A brusing sectionw as added to make it easier for the user to filter different time periods. This is particularly useful for visualizing seasonal trends like the spike in thefts around late August/September (back to school time). 

####Brands Section
Sankey: A sankey chart, which shows the interaction between top 10 stolen Bike Brands and Years. The bike brands are sorted in descending order of total number of thefts.

