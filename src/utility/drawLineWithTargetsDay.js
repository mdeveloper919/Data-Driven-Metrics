import * as d3 from 'd3';


export default drawLineWithTargetsDay;

function drawLineWithTargetsDay() {
	let margin = {top: 50, right: 100, bottom: 100, left: 100},
		height = 400 - margin.top - margin.bottom,
		width = 1200 - margin.top - margin.bottom;
	let x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		xAxis = d3.axisBottom().scale(x),
		yAxis = d3.axisLeft().ticks(4);
	let data, actualCol, dateCol, targetVal;
	let svg;
	let tipMargin = 3;

	let drawChart = function (selection) {
		svg = selection.append('svg')
						.attr('width', 1200)
						.attr('height', 400)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		svg.selectAll('*').remove();
		svg.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('height', height)
			.attr('width', width)
			.attr('x', 0)
			.attr('y', 0);
		// set date value; use local time zone.
		data.forEach(d => {
			d[dateCol] = d3.timeParse("%Y-%m-%d")(d[dateCol]);
			d[dateCol] = new Date(d[dateCol].getFullYear(), d[dateCol].getMonth(), d[dateCol].getDate());
		});
		// Also need to add data points to days where no new tickets occur on that day.
		// But this has been taken care of at the server side.

		// generate a whole month range
		let year = data[0][dateCol].getFullYear(), month = data[0][dateCol].getMonth();
		x.domain([data[0][dateCol], new Date(year, month+1, 0)]);
		// you should get the max value of forecasting, actual and targets.
		y.domain([0, Math.max(d3.max(data, (d) => d[actualCol]), targetVal)]).nice();
		let actualLength = data.length;

		let totaldays = new Date(year, month + 1, 0).getDate();
		let forecastLine = (totaldays > actualLength && actualLength !== 1)? linearRegression(data.map((d) => y(d[actualCol])), data.map((d) => x(d[dateCol]))) : {};
		if (actualLength !== 1) {
			for (let i = actualLength; i < totaldays; i++) {
				let newDay = new Date(year, month, i+1);
					data.push({
								[dateCol]: newDay,
								[actualCol]: y.invert(forecastLine.slope * x(newDay) + forecastLine.intercept)
							});
			}
		}
		let chartKey = svg.append('g')
							.attr('class', 'chartKey')
							.selectAll('g')
							.data(['Actual', 'Targeted', 'Predicted'])
							.enter().append('g')
									.attr('transform', (d, i) => `translate(${100 * i}, -20)`);
		chartKey.append('line')
				.attr('x1', 0).attr('x2', 10).attr('y1', 5).attr('y2', 5)
				.style('stroke', d => {
					if (d === 'Actual') return '#FF8D6D';
					if (d === 'Predicted') return '#5F7A76';
					return '#999';
				})
				.style('stroke-width', 4);
		chartKey.append('text')
				.text(d => d)
				.style('fill', d => {
					if (d === 'Actual') return '#FF8D6D';
					if (d === 'Predicted') return '#5F7A76';
					return '#999';
				})
				.style('font-family', 'sans-serif')
				.attr('x', 10)
				.attr('dy', '.6em');

		svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis.scale(x).tickFormat(d3.timeFormat('%-d/%b')));
		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(yAxis.scale(y));

		// draw target
		let targetLine = svg.append('g')
							.attr('class', 'target');
		targetLine.append('line')
					.attr('x1', 0).attr('x2', width)
					.attr('y1', y(targetVal)).attr('y2', y(targetVal))
					.style('stroke', '#999')
					.style('stroke-width', 2);
		targetLine.append('text')
					.text(`Target ${targetVal}`)
					.attr('x', width)
					.attr('y', y(targetVal))
					.attr('dy', '-.3em')
					.style('text-anchor', 'middle')
					.style('font-weight', 'bold')
					.style('font-family', 'sans-serif')
					.style('font-size', '15px')
					.style('fill', '#999');



		let enterTransition = d3.transition().duration(1500).ease(d3.easeElasticOut);
		let lineActual = d3.line()
							// .define((d) => data.length > 1)
							.x((d) => x(d[dateCol]))
							.y((d) => y(d[actualCol]));
		let actual = svg.append('g')
						.attr('class', 'actual')
						// .attr('clip-path', 'url(#clip)')
						.datum(data.slice(0, actualLength));
		actual.append('path')
				.attr('d', lineActual.y(0))
				.style('stroke','#FF8D6D')
				.style('stroke-width', '2px')
				.style('fill', 'none')
				.transition(enterTransition)
				.attr('d', lineActual.y(d=>y(d[actualCol])));
		actual.selectAll('.dot')
				.data(data.slice(0, actualLength))
				.enter().append('circle')
						.attr('cx', lineActual.x())
						.attr('cy', 0)
						.attr('r', 2)
						.style('fill', '#FF8D6D')
						.transition(enterTransition)
						.attr('cy', lineActual.y());
		
		if (actualLength !== 1) {
			let target = svg.append('g')
								.attr('class', 'predic')
								.attr('clip-path', 'url(#clip)')
								.datum(data.slice(actualLength));

			target.append('path')
					.attr('d', lineActual.y(0))
					.style('stroke','#5F7A76')
					.style('stroke-width', '2px')
					.style('fill', 'none')
					.transition(enterTransition)
					.attr('d', lineActual.y(d=>y(d[actualCol])));

			target.selectAll('.doc')
					.data(data.slice(actualLength))
					.enter().append('circle')
							.attr('cx', lineActual.x())
							.attr('cy', 0)
							.attr('r', 2)
							.style('fill', '#5F7A76')
							.transition(enterTransition)
							.attr('cy', lineActual.y());
			// console.log(data.slice(0, actualLength), data.slice(actualLength));
		}

		let maker = svg.append('g')
						.call(drawMarker);

		let tooltip = maker.append('g')
							.call(drawTooltip).style('opacity', 1);

		svg.append('g')
			.append('rect')
			.attr('height', height)
			.attr('width', width)
			.style('fill', 'none')
			.style('pointer-events', 'all') // or u can remove this line but add fill = transparent
			.on('mouseover', () => maker.style('display', null))
			.on('mouseout', () => maker.style('display', 'none'))
			.on('mousemove', mousemove);

		svg.selectAll('.axis path').style('stroke-width', 2);
		svg.selectAll('.axis text').style('font-size', '14px');
		svg.selectAll('.axis--x text').style('font-weight', 'bold');

	};
	let drawMonthlyChart = () => {
		svg.selectAll('*').remove();

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
		if (data.length > 1) {
			i = bisectDate(data, x0, 1, data.length - 1);
			d0 = data[i - 1];
			d1 = data[i];
			nearestDatum = x0 - d0[dateCol] > d1[dateCol] - x0 ? d1 : d0;			
		} else {
			i = 0;
			d0 = d1 = nearestDatum = data[0];
		}

            // console.log(nearestDatum);
        t = d3.transition().duration(50);
        marker = svg.select('g.markerG');
        xPos = x(nearestDatum[dateCol]);
        yPos = y(nearestDatum[actualCol]);
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
				.text(Math.round(nearestDatum[actualCol]));
		marker.select('text.tipContent-date')
				.text(d3.timeFormat('%-d/%b')(nearestDatum[dateCol]));
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

	drawChart.data = function (newData) {
		data = newData;
		return drawChart;
	};
	drawChart.actualCol = function (newActualCol) {
		actualCol = newActualCol;
		return drawChart;
	};
	drawChart.dateCol = function (newDateCol) {
		dateCol = newDateCol;
		return drawChart;
	};
	drawChart.targetVal = function (newtargetvalue) {
		targetVal = newtargetvalue;
		return drawChart;
	};
	return drawChart;
}

//http://www.localwisdom.com/blog/2014/01/get-trend-line-javascript-graph-linear-regression/
function linearRegression(y,x){
	let lr = {};
	let n = y.length;
	let sum_x = 0;
	let sum_y = 0;
	let sum_xy = 0;
	let sum_xx = 0;
	let sum_yy = 0;

	for (let i = 0; i < y.length; i++) {
		sum_x += x[i];
		sum_y += y[i];
		sum_xy += (x[i]*y[i]);
		sum_xx += (x[i]*x[i]);
		sum_yy += (y[i]*y[i]);
	}

	lr.slope = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
	lr.intercept = (sum_y - lr.slope * sum_x)/n;
	lr.r2 = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

	return lr;
}