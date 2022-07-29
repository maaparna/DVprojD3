//var width = document.getElementById('vis')
//    .clientWidth;
//var height = document.getElementById('vis')
//    .clientHeight;

//first chart

var margin = {
    top: 100,
    bottom: 100,
    left: 200,
    right: 100
};


var width1 = 700 - margin.left - margin.right;
var height1 = 700 - margin.top - margin.bottom;

//second chart

var width2 = 700 - margin.left - margin.right;
var height2 = 1200 - margin.top - margin.bottom;

//first chart

var svg = d3.select("#area1")
    .append('svg')
    .attr('width', width1 + margin.left + margin.right)
    .attr('height', height1 + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append("text")
    .attr("x", width1 / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Rating/Year by Genre");

//first chart

var x_scale = d3.scaleLinear()
    .rangeRound([0, width1]);

var y_scale = d3.scaleBand()
    .range([0, height1])
    .padding(0.1);



//first chart

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height1 + ')');

svg.append("text")
    .attr("transform", "translate(" + (width1 / 2) + " ," + (height1 + 40) + ")")
    .style("text-anchor", "middle")
    .text("Rating");

svg.append('g')
    .attr('class', 'y axis');

svg.append("text")
    .attr("x", -20)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text("Genre");


//first chart

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);




var colour_scale = d3.scaleOrdinal()
    //.range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"]);

    .range(d3.schemeSet3);



var data, t, t1,rows;

d3.csv('https://raw.githubusercontent.com/maaparna/maaparna.github.io/main/IMDB-Movie-Data.csv').then(function (csv_data) {

    console.log(csv_data);


    update('2016');

    function update(year) {
        t = d3.transition()
            .duration(1500);
        console.log(year);
        var fData = csv_data.filter(function (d) { return d.Year === year; });
        data = fData;

        var iData = d3.rollup(fData, function (d) { return d3.sum(d, function (d) { return d.Rating; }); }, function (d) { return d.Genre; });

        console.log(iData);

        //var iData = d3.rollup(fData, function (d) { return d.length; }, function (d) { return d.Genre; });

        var mData = Array.from(iData);
        mData.sort(function (a, b) { return b[1] - a[1]; });

        var mTitle = mData.map(function (d) { return d[0]; });
        y_scale.domain(mTitle);

        var max_value = d3.max(mData, function (d) {
            return d[1];
        });
        x_scale.domain([0, max_value]);
        colour_scale.domain(data.map(function (d) { return d.Genre; }));


        var bars = svg.selectAll('.bar')
            .data(mData);

        //exit
        bars
            .exit()
            .remove();

        //enter
        var new_bars = bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('height', y_scale.bandwidth())
            .attr('width', 0)
            .attr('x', 0);
        //update

        new_bars.merge(bars)
            .transition(t)
            //.attr('x', function (d) {
            //    return x_scale(d.Revenue);
            //})
            .attr('y', function (d) {
                return y_scale(d[0]);
            })
            .attr('width', function (d) {
                return x_scale(d[1]);
            })
            .attr('fill', function (d) {
                console.log(colour_scale(d[0]));
                return colour_scale(d[0]);
            });

        svg.select('.x.axis')
            .transition(t)
            .call(x_axis);

        svg.select('.y.axis')
            .transition(t)
            .call(y_axis);

        function secondchart(genre) {

            //second chart

            var svg2 = d3.select("#area2")
                .append('svg')
                .attr('width', width2 + margin.left + margin.right)
                .attr('height', height2 + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + 200 + ',' + 100 + ')');

            svg2.append("text")
                .attr("x", width2 / 2)
                .attr("y", -5)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Movie Rating by Genre/Year");

            //second chart

            var x_scale2 = d3.scaleLinear()
                .rangeRound([0, width2]);

            var y_scale2 = d3.scaleBand()
                .range([0, height2])
                .padding(0.1);

            //second chart

            svg2.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height2 + ')');

            svg2.append("text")
                .attr("transform", "translate(" + (width2 / 2) + " ," + (height2 + 40) + ")")
                .style("text-anchor", "middle")
                .text("Rating");


            svg2.append('g')
                .attr('class', 'y axis');

            svg2.append("text")
                .attr("x", -20)
                .attr("y", -10)
                .style("text-anchor", "middle")
                .text("Movies");



            //second chart

            var y_axis2 = d3.axisLeft(y_scale2);
            var x_axis2 = d3.axisBottom(x_scale2);



            t1 = d3.transition()
                .duration(1500);
            console.log(genre);
            var gData = data.filter(function (d) { return d.Genre === genre; });

            //var iData = d3.rollup(fData, function (d) { return d3.sum(d, function (d) { return d.Rating; }); }, function (d) { return d.Genre; });

            //var iData = d3.rollup(fData, function (d) { return d.length; }, function (d) { return d.Genre; });

            var mData = gData;
            mData.sort(function (a, b) { return b.Rating - a.Rating; });

            console.log(mData);

            var mTitle = mData.map(function (d) { return d.Title; });
            y_scale2.domain(mTitle);

            var max_value = d3.max(mData, function (d) {
                return d.Rating;
            });
            x_scale2.domain([0, max_value]);
            colour_scale.domain(data.map(function (d) { return d.Genre; }));


            var bars = svg2.selectAll('.bar')
                .data(mData);

            //exit
            bars
                .exit()
                .remove();

            //enter
            var new_bars = bars
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('height', y_scale2.bandwidth())
                .attr('width', 0)
                .attr('x', 0);
            //update

            new_bars.merge(bars)
                .transition(t1)
                //.attr('x', function (d) {
                //    return x_scale(d.Revenue);
                //})
                .attr('y', function (d) {
                    return y_scale2(d.Title);
                })
                .attr('width', function (d) {
                    return x_scale2(d.Rating);
                })
                .attr('fill', function (d) {
                    return colour_scale(genre);
                });

            svg2.select('.x.axis')
                .transition(t1)
                .call(x_axis2);

            svg2.select('.y.axis')
                .transition(t1)
                .call(y_axis2);

            function tabulate(movie) {
                t1 = d3.transition()
                    .duration(1500);

                var svg3 = d3.select("#area3")
                    .append('div')
                    .attr('width', width2 + margin.left + margin.right)
                    .attr('height', height2 + margin.top + margin.bottom);
                    //.attr('transform', 'translate(' + 50 + ',' + 100 + ')');

                //var mytooltip=svg3.append("foreignObject")
                //    .attr("width", width2 + margin.left + margin.right)
                //    .attr("height", height2 + margin.top + margin.bottom)
                //    .append("div");

                svg3.attr("class", "container1")
                    .style("opacity", "0")
                    .style("display", "none")
                    .style("background-color", "#dcdcdc");


                var movData = data.filter(function (d) { return d.Title === movie; });

                var pData = d3.zip(movData);

                //var moData = Array.from(movData);

                var moData = pData;

                console.log(moData[0][0].Actors);

                svg3.style("opacity", "1")
                    .style("display", "table-cell")  //The tooltip appears

                    .style("vertical-align", "top")
                    .html("<p> </p><p> </p><p><b>Genre:</b> " + moData[0][0].Genre + "</p> <p> <b>Title:</b>" + moData[0][0].Title + "</p><p class=\"a\"> <b>Description:</b>" + moData[0][0].Description +
                    "</p><p><b> Director:</b>" + moData[0][0].Director + "</p><p> <b>Year:</b>" + moData[0][0].Year + "</p><p><b> Rating:</b>" + moData[0][0].Rating + "</p><p><b> Revenue(in millions):</b>" + moData[0][0].Revenue + "</p>");

           
            }

            new_bars.on("click", function (d) {
                //barsd3.select(this).attr("fill", "rgb(" + d + "," + d + "," + d + ")")

                d3.select("#area3").html("");
                tabulate(d.path[0].__data__.Title)

            })
        }

        new_bars.on("click", function (d) {
            //barsd3.select(this).attr("fill", "rgb(" + d + "," + d + "," + d + ")")

            d3.select("#area2").html("");
            d3.select("#area3").html(""); 
            secondchart(d.path[0].__data__[0])

        })
    }


    var select = d3.select('#year');
    select.on('change', function () {
        console.log(this.value);
        d3.select("#area2").html("");
        d3.select("#area3").html(""); 
        update(this.value);
    })

});