// Chart Sizing
var ChartWidth = 800;
var ChartHeight = 600;
var margin = { top: 20, right: 40, bottom: 80, left: 100 };
var width = ChartWidth - margin.left - margin.right;
var height = ChartHeight - margin.top - margin.bottom;

//Chart group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", ChartWidth)
    .attr("height", ChartHeight)

var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//Chart Functions

// X-Scale Function
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.75, d3.max(data, d => d[chosenXAxis]) * 1.25])
        .range([0, width]);
    return xLinearScale;
}

// Y-Scale Function
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.75, d3.max(data, d => d[chosenYAxis] * 1.25)])
        .range([height, 0])
    return yLinearScale
}

// X-Axis Update Function
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// Y-Axis Update Function
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}

// Circles Update Function
function renderCircles(circles, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circles.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))

    return circles;
}

//RUN CHART

//Retreive data from CSV and plot Function:
d3.csv('assets/data/data.csv').then(function (data, err) {
    if (err) throw err;

    //parse data
    data.forEach(function (d) {
        d.poverty = +d.poverty;
        d.income = +d.income;
        d.age = +d.age;
        d.healthcare = +d.healthcare
        d.healthcare = +d.healthcare;
        d.smokes = +d.smokes;
    });

    //X-scale & Y-scale
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // X-Axis & Y-Axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chart.append('g').attr('transform', `translate(0, ${height})`).call(bottomAxis);
    var yAxis = chart.append('g').call(leftAxis);

    //Circles
    var circles = chart.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', 10)
        .attr('fill', 'lightblue')
        .attr('opacity', '.8')

     // X-Axis Labels
    var xLabelsGroup = chart.append('g')
        .attr('transform', `translate(${width/2}, ${height + 20})`);
    
    var povertyLabel = xLabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty')
    .classed('active', true)
    .text('Poverty Rate (%)')

    var incomeLabel = xLabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'income')
    .classed('inactive', true)
    .text('Median Income')

    var ageLabel = xLabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'age')
    .classed('inactive', true)
    .text('Median Age')

    //Y-Axis Labels
    var yLabelsGroup = chart.append('g')

    var healthcareLabel = yLabelsGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 30)
    .attr("x", 0 - (height / 2))
    .attr('value', 'healthcare')
    .classed('active', true)
    .text('Healthcare Rate (% population)')

    var obesityLabel = yLabelsGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - (height / 2))
    .attr('value', 'obesity')
    .classed('inactive', true)
    .text('Obesity (% population)')

    var healthcareLabel = yLabelsGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 70)
    .attr("x", 0 - (height / 2))
    .attr('value', 'healthcare')
    .classed('inactive', true)
    .text('Healthcare Coverage (% population)')

    ////////////////////////////////////////////////////////////////
    // X-labels Event listener
    xLabelsGroup.selectAll('text')
    .on('click', function(){
        var value = d3.select(this).attr('value')
        if(value!== chosenXAxis){
            chosenXAxis = value;
            console.log(`New chosen X axis: ${value}`);

            xLinearScale =  xScale(data, chosenXAxis);
            xAxis = renderXAxis(xLinearScale, xAxis);
            circles = renderCircles(circles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            if(chosenXAxis === 'poverty'){
                povertyLabel.classed('inactive', false).classed('active', true);
                incomeLabel.classed('inactive', true).classed('active', false);
                ageLabel.classed('inactive', true).classed('active', false);
            } else if (chosenXAxis === 'income'){
                povertyLabel.classed('inactive', true).classed('active', false);
                incomeLabel.classed('inactive', false).classed('active', true);
                ageLabel.classed('inactive', true).classed('active', false);
            } else if (chosenXAxis === 'age'){
                povertyLabel.classed('inactive', true).classed('active', false);
                incomeLabel.classed('inactive', true).classed('active', false);
                ageLabel.classed('inactive', false).classed('active', true);
            }
        }

    })

    yLabelsGroup.selectAll('text')
    .on('click', function(){
        var value = d3.select(this).attr('value')
        if(value!== chosenXAxis){
            chosenYAxis = value;
            console.log(`New chosen Y axis: ${value}`);

            yLinearScale =  yScale(data, chosenYAxis);
            yAxis = renderYAxis(yLinearScale, yAxis);
            circles = renderCircles(circles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            if(chosenYAxis === 'healthcare'){
                healthcareLabel.classed('inactive', false).classed('active', true);
                obesityLabel.classed('inactive', true).classed('active', false);
                healthcareLabel.classed('inactive', true).classed('active', false);
            } else if (chosenYAxis === 'obesity'){
                healthcareLabel.classed('inactive', true).classed('active', false);
                obesityLabel.classed('inactive', false).classed('active', true);
                healthcareLabel.classed('inactive', true).classed('active', false);
            } else if (chosenYAxis === 'healthcare'){
                healthcareLabel.classed('inactive', true).classed('active', false);
                obesityLabel.classed('inactive', true).classed('active', false);
                healthcareLabel.classed('inactive', false).classed('active', true);
            }
        }

    })

})
