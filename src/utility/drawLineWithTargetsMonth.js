import * as d3 from 'd3';

export default drawLineWithTargetsMonth;

function drawLineWithTargetsMonth() {
	let data,
		margin = {top: 50, right: 100, bottom: 100, left: 100},
		width  = 1200 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		svg,
		x         = d3.scaleTime().range([0, width]),
		y         = d3.scaleLinear().range([height, 0]),
		xAxis     = d3.axisBottom().scale(x),
		yAxis     = d3.axisLeft().scale(y).ticks(4),
		tickLimit = 10,
		line      = d3.line(),
		line2     = d3.line(),
		tipMargin = 3,
		dateFormat,
		dateCol,
		valCol,
		targetCol;
	let drawChart = function (selection) {
		svg = selection.append('svg')
						.attr('height', 400)
//						.attr('height', window.innerHeight)  // this adds too much blank space after chart
						.attr('width', window.innerWidth)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		// format date; set scales and axies.
		data.forEach(d => d[dateCol] = d3.timeParse(dateFormat)(d[dateCol]));
		x.domain([data[0][dateCol], data[data.length - 1][dateCol]]);
		y.domain([0, Math.max(d3.max(data, d => d[valCol]), 
			d3.max(data, d => d[targetCol]))]).nice();
		// console.log(x.domain(), y.domain());
		xAxis.tickFormat(d3.timeFormat('%b-%y')).ticks(data.length > tickLimit ? tickLimit : data.length);
		yAxis.ticks(5).tickSizeInner(-width).tickPadding(8);
		// draw axis
		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(yAxis);		
		// format grid lines
		svg.selectAll('.axis--y .tick line')
			// .filter((d, i) => d !== 0)
			.style('stroke','#ccc')
			.style('stroke-dasharray', 2);
		
		svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);
		// draw y axis first; or the first y grid will cover the x axis.
		if (data.length >= tickLimit) {
			//rotate x ticks
			svg.selectAll('.axis--x .tick text')
				.attr('transform', function(d) {
					return `translate(${this.getBBox().height*-2}, 
             		${this.getBBox().height + 3}) rotate(-45)`;
             });
		}		
		// draw line
		let chartArea = svg.append('g')
							.attr('class', 'chartArea')
							.datum(data);
		line.x(d => x(d[dateCol]))
			.y(d => y(d[valCol]));
		line2.x(d => x(d[dateCol]))
				.y(d => y(d[targetCol]))
				.defined(d => d[targetCol] !== null);

		chartArea.append('path')
					.attr('d', line2)
					.style('stroke', '#999')
					.style('stroke-width', 2)
					.style('fill', 'none');	
		chartArea.append('path')
					.attr('d', line)
					.style('stroke', '#5F7A76')
					.style('stroke-width', 2)
					.style('fill', 'none');		
	
		chartArea.append('g')
					.attr('class', 'targetLabel')
					.selectAll('text')
					.data(data)
					.enter().append('text')
							.text(d => d[targetCol])
							.attr('x', d => x(d[dateCol]))
							.attr('y', d => y(d[targetCol]))
							.attr('dy', d => d[targetCol] > d[valCol]? '-.5em' : '1em')
							.style('text-anchor', 'middle')
							.style('font-size', '12px')
							.style('font-family', 'sans-serif')
							.style('font-weight', 'bold')
							.style('fill', '#999');	

		chartArea.selectAll('.dot')
					.data(d=>d)
					.enter().append('circle')
							.attr('class','dot')
							.attr('cx', d=>x(d[dateCol]))
							.attr('cy', d=>y(d[valCol]))
							.attr('r', 3)
							.style('fill', '#FF8D6D');

		chartArea.append('text')
					.text('Actual')
					.attr('x', x(data[data.length - 1][dateCol]))
					.attr('y', y(data[data.length - 1][valCol]))
					.attr('dy', '1em')
					.style('font-family', 'sans-serif')
					.style('text-anchor', 'middle')
					.style('fill', '#5F7A76')
					.style('font-weight', 'bold')
					.style('font-size', '12px');
		chartArea.append('text')
					.text('Target')
					.attr('x', x(data[data.length - 1][dateCol]))
					.attr('y', y(data[data.length - 1][targetCol]))
					.attr('dy', data[data.length - 1][targetCol] > data[data.length - 1][valCol]? '1em': '-.5em')
					.style('font-family', 'sans-serif')
					.style('text-anchor', 'middle')
					.style('fill', '#999')
					.style('font-weight', 'bold')
					.style('font-size', '12px');

		let maker = svg.append('g')
						.call(drawMarker);

		let tooltip = maker.append('g')
							.call(drawTooltip);

		svg.append('g')
			.append('rect')
			.attr('height', height)
			.attr('width', width)
			.style('fill', 'none')
			.style('pointer-events', 'all') // or u can remove this line but add fill = transparent
			.on('mouseover', () => maker.style('display', null))
			.on('mouseout', () => maker.style('display', 'none'))
			.on('mousemove', mousemove);

		tooltip.style('opacity', 1);
		svg.selectAll('.axis text').style('font-size', '14px');
		svg.selectAll('.axis--x text').style('font-weight', 'bold');
		svg.selectAll('.axis path').style('stroke-width', 2);


	};
	drawChart.data = function(newData) {
		data = newData;
		return drawChart;
	};
	drawChart.dateFormat = function(newFormat) {
		dateFormat = newFormat;
		return drawChart;
	};
	drawChart.dateCol = function(newDateCol) {
		dateCol = newDateCol;
		return drawChart;
	};
	drawChart.valCol = function(newValCol) {
		valCol = newValCol;
		return drawChart;
	};
	drawChart.targetCol = function(newTargetCol) {
		targetCol = newTargetCol;
		return drawChart;
	};
	function drawMarker(markerG) {
		markerG.attr('class', 'markerG')
				.style('display', 'none')
				.append('line')
				.attr('class', 'horizonal')
				.attr('stroke', 'black')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', 0)
				.attr('y2', 0)
				.attr('stroke-width', '1px');
		markerG.append('line')
				.attr('class', 'vertical')
				.attr('stroke', 'black')
				.attr('stroke-width', '1px')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', 0)
				.attr('y2', 0);				
		markerG.append('circle')
				.attr('cx', 0)
				.attr('cy', height)
				.attr('r', 3.5)
					.style('fill', '#01a982')
					.style('stroke', 'white')
					.style('stroke-width', '1.5px');
			// return markerG;
	}
	
	function drawTooltip(tooltipG) {
		tooltipG.attr('class', 'tooltip')
				.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.style('opacity', 0.5)
				.style('fill', '#C6C9CA');
		let tipContent = tooltipG.append('g')
						.attr('class', 'tipContent')
						.style('fill', '#614767')
						.style('font-family', 'sans-serif')
						.style('font-size', '16px')
						.style('font-weight', 'bold');
		tipContent.append('text')
					.attr('x', 0)
					.attr('y', 16)
					.attr('class', 'tipContent-num');
		tipContent.append('text')
					.attr('x', 0)
					.attr('y', 32)
					.attr('class', 'tipContent-date');
	}
	
	let mousemove = function () {
		// find the closest data point;
		let bisectDate, x0, i, d0, d1, nearestDatum, t, marker, xPos, yPos;
		bisectDate = d3.bisector(d => d[dateCol]).left;
		x0 = x.invert(d3.mouse(this)[0]);
		if (data.length > 1){
			i = bisectDate(data, x0, 1, data.length - 1);
			d0 = data[i - 1];
			d1 = data[i];
			nearestDatum = x0 - d0[dateCol] > d1[dateCol] - x0 ? d1 : d0;
		}else{
			i = 0;
			d0 = d1 = nearestDatum = data[0];
		}

        t = d3.transition().duration(50);
        marker = svg.select('g.markerG');
        xPos = x(nearestDatum[dateCol]);
        yPos = y(nearestDatum[valCol]);
        marker.select('circle')
			.transition(t)
			.attr('cx', xPos)
			.attr('cy', yPos);   

		marker.select('line.horizonal')
		// .transition(t)
				.attr('x1', 0)
				.attr('y1', yPos)
				.attr('x2', xPos + 15)
				.attr('y2', yPos)
				.style('stroke-dasharray', '2,2');

        marker.select('line.vertical')
		// .transition(t)
				.attr('x1', xPos)
				.attr('y1', height)
				.attr('x2', xPos)
				.attr('y2', yPos - 15)
				.style('stroke-dasharray','2,2');
		// change tip property
		marker.select('text.tipContent-num')
				.text(Math.round(nearestDatum[valCol]));
		marker.select('text.tipContent-date')
				.text(d3.timeFormat('%-d/%b/%y')(nearestDatum[dateCol]));
		let tipWidth = marker.select('.tipContent').node().getBBox().width,
			tipHeight = marker.select('.tipContent').node().getBBox().height;

		marker.select('.tipContent')
				.attr('transform', `translate(${tipMargin}, ${tipMargin})`);
		marker.select('rect')
				.attr('width', tipMargin * 2 + tipWidth)
				.attr('height', tipMargin * 2 + tipHeight);
		tipHeight = marker.select('.tooltip').node().getBBox().height;

		marker.select('.tooltip')
				.attr('transform', `translate(${xPos + 3}, ${yPos - 3 - tipHeight})`);

	};
	return drawChart;
}
