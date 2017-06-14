import * as d3 from 'd3';

export default drawLineChart;

function drawLineChart() {
	var data,
		margin    = {top: 50, right: 100, bottom: 100, left: 100},
		width     = window.innerWidth - margin.left - margin.right > 900 ? 900: window.innerWidth - margin.left - margin.right,
		height    = window.innerHeight - margin.top - margin.bottom > 300 ? 300: window.innerHeight - margin.top - margin.bottom,
		x         = d3.scaleTime().range([0, width]),
		y         = d3.scaleLinear().range([height, 0]),
		xAxis     = d3.axisBottom().scale(x),
		yAxis     = d3.axisLeft().scale(y),
		tickLimit = 10,
		line      = d3.line(),
		valName,
		tipMargin = 3,
		svg;
	let drawChart = function (selection) {
		// in case the user refresh the page.
		d3.selectAll('svg.lineChartSVG').remove();
		width     = window.innerWidth - margin.left - margin.right > 900 ? 900: window.innerWidth - margin.left - margin.right;
		height    = window.innerHeight - margin.top - margin.bottom > 300 ? 300: window.innerHeight - margin.top - margin.bottom;
		x         = d3.scaleTime().range([0, width]);
		y         = d3.scaleLinear().range([height, 0]);
		xAxis     = d3.axisBottom().scale(x);
		yAxis     = d3.axisLeft().scale(y);

		svg = selection.append('svg')
		//				.attr('height', window.innerHeight) - this adds too much blank space after chart
						.attr('height', 400)
						.attr('width', window.innerWidth)
						.attr('class', 'lineChartSVG')
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		//assume that the date is already arranged from early to late
		x.domain([data[0].Date, data[data.length - 1].Date]);
		y.domain([0, d3.max(data.map(d => d[valName]))]).nice();
		xAxis.tickFormat(d3.timeFormat('%b/%-d/%y')).ticks(data.length > tickLimit ? tickLimit : data.length);
		// yAxis.tickValues(d3.range(0, y.domain()[1], y.domain()[1]/5));
		// yAxis.tickValues(y.ticks(5).concat(y.domain()[1]));
		yAxis.ticks(4).tickSizeInner(-width).tickPadding(8).tickFormat(d3.format('d'));
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

		// draw y axis later; or the first y grid will cover the x axis.
		if (data.length >= tickLimit) {
			//rotate x ticks
			svg.selectAll('.axis--x .tick text')
				.attr('transform', function(d) {
					return `translate(${this.getBBox().height*-2}, 
					${this.getBBox().height+5}) rotate(-25)`;
					});
		}		



		let chartArea = svg.append('g')
							.attr('class', 'chartArea')
							.datum(data);

		// draw line
		line.x(d => x(d.Date))
			.y(d => y(d[valName]));

		chartArea.append('path')
					.attr('d', line)
					.style('stroke', '#5F7A76')
					.style('stroke-width', 2)
					.style('fill', 'none');					

		chartArea.selectAll('.dot')
					.data(d=>d)
					.enter().append('circle')
							.attr('class','dot')
							.attr('cx', d=>x(d.Date))
							.attr('cy', d=>y(d[valName]))
							.attr('r', 3)
							.style('fill', '#FF8D6D');

	// when joining data, you can only use data, not datum.		
	// 	svg.append('g').attr('class', 'test')
	// 					.selectAll('path')
	// 					.data([data])
	// 					.enter().append('path')...
					
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
		svg.selectAll('.axis text').style('font-size', '14px');
		svg.selectAll('.axis--x text').style('font-weight', 'bold');
		svg.selectAll('.axis path').style('stroke-width', 2);

	};
	drawChart.data = function(newData) {
		data = newData;
		let strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
		data.forEach((d) => {
			d.Date = strictIsoParse(d.Date);
		});
		return drawChart;
	};
	drawChart.setValName = function(newValName) {
		valName = newValName;
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
		bisectDate = d3.bisector(d => d.Date).left;
		x0 = x.invert(d3.mouse(this)[0]);
		if (data.length > 1) {
			i = bisectDate(data, x0, 1, data.length - 1);
			d0 = data[i - 1];
			d1 = data[i];
			nearestDatum = x0 - d0.Date > d1.Date - x0 ? d1 : d0;			
		} else {
			i = 0;
			d0 = d1 = nearestDatum = data[0];
		}

        t = d3.transition().duration(50);
        marker = svg.select('g.markerG');
        xPos = x(nearestDatum.Date);
        yPos = y(nearestDatum[valName]);
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
				.text(Math.round(nearestDatum[valName]));
		marker.select('text.tipContent-date')
				.text(d3.timeFormat('%b/%-d/%Y')(nearestDatum.Date));
		let tipWidth = marker.select('.tipContent').node().getBBox().width,
			tipHeight = marker.select('.tipContent').node().getBBox().height;

		marker.select('.tipContent')
				.attr('transform', `translate(${tipMargin}, ${tipMargin})`);
		marker.select('rect')
				.attr('width', tipMargin * 2 + tipWidth)
				.attr('height', tipMargin * 2 + tipHeight);
		tipHeight = marker.select('.tooltip').node().getBBox().height;

		marker.select('.tooltip')
				.attr('transform', `translate(${xPos + 3}, ${yPos - 3 - tipHeight})`)
				.style('opacity', 1);

	};
	return drawChart;
}