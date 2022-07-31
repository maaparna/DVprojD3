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


var colour_scale = d3.scaleOrdinal()
    //.range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"]);

    .range(d3.schemeSet3);



var data, t, t1,rows,movieyear;

d3.csv('https://raw.githubusercontent.com/maaparna/maaparna.github.io/main/IMDB-Movie-Data.csv').then(function (csv_data) {

    console.log(csv_data);


    update('2016');

    function update(year) {

        movieyear = year;
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
            .style("font-size", "18px")
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
            .style("font-size", "14px")
            .text("Rating");

        svg.append('g')
            .attr('class', 'y axis');

        svg.append("text")
            .attr("x", -20)
            .attr("y", -10)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Genre");

        //first chart

        var y_axis = d3.axisLeft(y_scale);
        var x_axis = d3.axisBottom(x_scale);

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

        const annotations = [
            {
                note: {
                    label: "From 2006-2016, Action movies have a 47.1% share of the total revenue at 33,403.82(in millions)",
                    title: "Action movies revenue",
                    wrap: 150,  // try something smaller to see text split in several lines
                    bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 }

                },
                data: { y: "Action", x: 100 },
                disable:["connector"],
                className: "show-bg",
                dy: 200,
                dx: 330        
            }]
        const makeAnnotations = d3.annotation()
            .annotations(annotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);

        svg.selectAll(".annotation-note text")
            .style("fill", "red");

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

        const f = d3.format(".1f");

        svg.selectAll("text.analysis-label")
            .data(mData)
            .enter()
            .append('text')
            .text(function (d) {
                return f(d[1]);
            })
            .attr("x", function (d) {
                return x_scale(d[1]) + 15;
            })
            .attr("y", function (d) {
                console.log(y_scale(d[0]));
                console.log(y_scale(d[0]) + y_scale.bandwidth() * (0.5 + 0.1));
                return y_scale(d[0]) + y_scale.bandwidth() * (0.5 + 0.1);

            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .classed("analysis-label", true);


       svg.select('.x.axis')
            .transition(t)
            .style("color","black")
            .call(x_axis);

        svg.select('.y.axis')
            .transition(t)
            .attr("color","black")
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
                .style("font-size", "18px")
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
                .style("font-size", "14px")
                .text("Rating");


            svg2.append('g')
                .attr('class', 'y axis');

            svg2.append("text")
                .attr("x", -20)
                .attr("y", -10)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .text("Movies");

            if (genre == 'Action' && movieyear == 2008) {

                const annotations = [
                    {
                        note: {
                            label: "Christopher Nolan's The Dark Knight movie is the most popular at 1791916 votes and 533.32 millions in revenue from 2006-2016 movies",
                            title: "The Dark Knight",
                            wrap: 150,  // try something smaller to see text split in several lines
                            bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 }

                        },
                        data: { y: "The Dark Knight", x: 9 },
                        disable: ["connector"],
                        className: "show-bg",
                        dy: 200,
                        dx: 330
                    }]
                const makeAnnotations = d3.annotation()
                    .annotations(annotations);

                svg2.append("g")
                    .attr("class", "annotation-group")
                    .call(makeAnnotations);

                svg2.selectAll(".annotation-note text")
                    .style("fill", "red");
            }
            if (genre == 'Action' && movieyear == 2010) {

                const annotations = [
                    {
                        note: {
                            label: "Christopher Nolan's Inception movie is the second most popular at 1583625 votes and 292.57.32 millions in revenue from 2006-2016 movies",
                            title: "Inception",
                            wrap: 150,  // try something smaller to see text split in several lines
                            bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 }

                        },
                        data: { y: "Inception", x: 8.8 },
                        disable: ["connector"],
                        className: "show-bg",
                        dy: 200,
                        dx: 330
                    }]
                const makeAnnotations = d3.annotation()
                    .annotations(annotations);

                svg2.append("g")
                    .attr("class", "annotation-group")
                    .call(makeAnnotations);

                svg2.selectAll(".annotation-note text")
                    .style("fill", "red");
            }
            
            if (genre == 'Action' && movieyear == 2012) {

                const annotations = [
                    {
                        note: {
                            label: "Christopher Nolan's The Dark Knight Rises movie is the third most popular at 1222645 votes and 448.13 millions in revenue from 2006-2016 movies",
                            title: "The Dark Knight Rises",
                            wrap: 150,  // try something smaller to see text split in several lines
                            bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 }

                        },
                        data: { y: "JThe Dark Knight Rises", x: 8.8 },
                        disable: ["connector"],
                        className: "show-bg",
                        dy: 200,
                        dx: 350
                    }]
                const makeAnnotations = d3.annotation()
                    .annotations(annotations);

                svg2.append("g")
                    .attr("class", "annotation-group")
                    .call(makeAnnotations);

                svg2.selectAll(".annotation-note text")
                    .style("fill", "red");
            }

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
                .style("color", "black")
                .call(x_axis2);

            svg2.select('.y.axis')
                .transition(t1)
                .style("color", "black")
                .call(y_axis2);

            function tabulate(movie) {
                t1 = d3.transition()
                    .duration(1500);

                var svg3 = d3.select("#area3")
                    .append('div')
                    .attr('width', width2 + margin.left + margin.right)
                    .attr('height', height2 + margin.top + margin.bottom);
                    //.attr('transform', 'translate(' + 200 + ',' + 0 + ')');

                //var mytooltip=svg3.append("foreignObject")
                //    .attr("width", width2 + margin.left + margin.right)
                //    .attr("height", height2 + margin.top + margin.bottom)
                //    .append("div");

                svg3.attr("class", "container1")
                    .style("opacity", "0")
                    .style("display", "none")
                    .style("background-color", "white")
                    .style("color","white");


                var movData = data.filter(function (d) { return d.Title === movie; });

                var pData = d3.zip(movData);

                //var moData = Array.from(movData);

                var moData = pData;

                console.log(moData[0][0].Actors);

                svg3.style("opacity", "1")
                    .style("display", "table-cell")  //The tooltip appears

                    .style("vertical-align", "top")
                    .html("<p></p><p> </p><p><b>Genre:</b> " + moData[0][0].Genre + "</p> <p> <b>Title:</b>" + moData[0][0].Title + "</p><p> <b>Description:</b>" + moData[0][0].Description +
                    "</p><p><b> Director:</b>" + moData[0][0].Director + "</p><p><b>Year:</b>" + moData[0][0].Year + "</p><p><b> Rating:</b>" + moData[0][0].Rating + "</p><p><b> Revenue(in millions):</b>" + moData[0][0].Revenue + "</p>");

           
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
        d3.select("#area1").html("");
        d3.select("#area2").html("");
        d3.select("#area3").html(""); 
        update(this.value);
    })

});