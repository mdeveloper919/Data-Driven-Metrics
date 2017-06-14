import * as d3 from 'd3';
import _ from 'lodash';

export default drawStackedBarChart;

function drawStackedBarChart() {
	// variables that need to be passed by caller.
	let data, period, allGroups, activeGroups, groupFilter;
	let dataForDisplay;
	let setPeriod;
	let columnLimit = 15, //show the entire month's data;
//		margin      = {top: 100, right: 100, bottom: 100, left: 100},
		margin      = {top: 25, right: 100, bottom: 50, left: 50},
		// width       = window.innerWidth - margin.left - margin.right,
		width = 1750 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		// height      = window.innerHeight - margin.top - margin.bottom,

		x           = d3.scaleBand()
						.range([0, width])
						.padding(0.4),
		y           = d3.scaleLinear().range([height, 0]),
	// per month drawing.
		xAxis       = d3.axisBottom().scale(x),
		yAxis       = d3.axisLeft().scale(y).ticks(4),
		space1      = 50,
		svg,
		viewBox;



		// add brush
	let brushWidth = width,
		multiplier = width/brushWidth,
		brushheight = 100,
		y2          = d3.scaleLinear().range([height + space1 + brushheight, height + space1]),
		brush = d3.brushX()
					.extent([[0, y2.range()[1]], [width, y2.range()[0]]])
					.on('end', brushended),
		totalTranslate = 0;
	let colorScale = d3.scaleOrdinal()
	.range(["#D9D9D9","#000000", "#666666","#FFFFFF", "#FFED00","#00C9FF","#64FF00"].reverse());


	let drawChart = (selection) => {
		// aggregate by week/month
		if (period === 'Monthly') {
			dataForDisplay = _.groupBy(data, (d) => d.Created_Date.getFullYear() + '/' + (d.Created_Date.getMonth()+1));
		} else if (period === 'Weekly') {
			dataForDisplay = _.groupBy(data, (d) => 'W' + d.week + ' ' + d.fy);
		} else {
			// w21 2015
			dataForDisplay = _.groupBy(data, (d) => d3.timeFormat('%b/%-d/%y')(d.Created_Date));
		}
		// group data according to week/month
		dataForDisplay = groupData(dataForDisplay, activeGroups);
		// convert to stacked bar data
		let layerData = d3.stack()
						.keys(activeGroups)
						.order(d3.stackOrderNone)
						.offset(d3.stackOffsetNone)(dataForDisplay);
		layerData = layerData.map((d, i) => (
					{
						data:     d.map((e, j) => ({x: dataForDisplay[j].date, y0: e[0], y: e[1]})),
						category: activeGroups[i]
					}
				));
		// console.log(layerData);
		x.domain(layerData[0].data.map((d) => d.x)).range([0, width]);
		y.domain([0, d3.max(layerData[layerData.length - 1].data, (d) => d.y)]).nice();
		svg = selection.append('svg')
			.attr('width', width + margin.left + margin.right)

		//	.attr('height', height * 3)
		.attr('height', height + margin.bottom)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)

				;
		// Add viewBox to the main chart area, but exclude y axis and legend;
		svg.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width)
			.attr('height', height + margin.top)

			;


		viewBox = svg.append('g')
							.attr('id', 'viewBox')
							.style('clip-path', 'url(#clip)');
		let layer = viewBox.selectAll('.layer')
						.data(layerData, d => d.category)
						.enter().append('g')
								.attr('class', 'layer')
								.style('fill', (d) => colorScale(d.category));
		layer.selectAll('rect')
			.data(d=>d.data)
			.enter().append('rect')
					.attr('x', (d) => x(d.x))
					.attr('y', (d) => y(d.y))
					.attr('height', (d) => y(d.y0) - y(d.y))
					.attr('width', x.bandwidth())
					.style('opacity', 1);
		if (period === 'Monthly'){
			xAxis.tickFormat(d3.timeFormat('%m/%y'));
		} else if (period === 'Weekly') {
			xAxis.tickFormat(null);
		} else {
			xAxis.tickFormat(d3.timeFormat('%m/%-d/%y'));
		}

		viewBox.append('g')
				.attr('class', 'xAxisContainer')
				.style("fill","white")
				.append('g')
					.attr('class', 'axis axis--x')
					.attr('transform', `translate(0, ${height})`)
					.call(xAxis)
					;


		// check if there are too many x ticks, rotate the labels
		let xTicks = viewBox.select('.axis--x').selectAll('text');
		if (xTicks.size() >= columnLimit) {
			xTicks.style('text-anchor', 'end')
            .attr('dx', '-.15em')
            .attr('dy', '.40em')
			.attr('transform', 'rotate(-15)' )
		//	.style("stroke","white")
			.style("fill","white")
			//.attr('transform', 'translate(0, 100 )');
		}

		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(yAxis)
			//.style("fill","white");
		if (layerData[0].data.length > columnLimit) {
			brush = d3.brushX()
						.extent([[0, y2.range()[1]], [width, y2.range()[0]]])
						.on('end', brushended)
						.on('brush', beingBrushed);

			// draw brush!!
			// legendY = legendY + brushheight + space2;
			// draw mini scaled chart.
			let context = svg.append('g')
							.attr('class', 'context');
			let contextLayer = context.selectAll('.contextLayer')
										.data(layerData, d => d.category)
										.enter().append('g')
												.attr('class', 'contextLayer')
												.style('fill', (d) => colorScale(d.category));
			y2.domain(y.domain());
			contextLayer.selectAll('rect')
					.data(d=>d.data)
					.enter().append('rect')
							.attr('x', (d) => x(d.x))
							.attr('width', x.bandwidth())
							.style('opacity', 0.8)
							.attr('y', (d) => y2(d.y))
							.attr('height', (d) => y2(d.y0) - y2(d.y))
							;

			svg.append('g')
				.attr('class', 'brush')
				.call(brush)
				.call(brush.move, [0, width]);
		}

		svg.selectAll('.layer').selectAll('rect').on('click', (d) => {
			if (period === 'Monthly') {
				setPeriod('Monthly' + ' ' + d.x.getMonth() + '/' + d.x.getFullYear());
			} else if (period === 'Weekly') {
				setPeriod('Weekly' + ' ' + d.x);
			} else {
				if (period.split(' ')[0] === 'Monthly') {
					setPeriod('Monthly');
				} else {
					setPeriod('Weekly');
				}
			}
		});
		mouseOverOrOut(activeGroups);
		svg.selectAll('.axis path').style('stroke-width', 2).style("stroke","white");
		svg.selectAll('.axis text').style('font-size', 14).style("fill","white");
	};
	drawChart.data = (newData) => {
		data = newData;
		return drawChart;
	};
	drawChart.period = (newPeriod) => {
		period = newPeriod;
		return drawChart;
	};
	drawChart.setAll = (newGroups) => {
		allGroups = newGroups;
		colorScale.domain(allGroups);
		return drawChart;
	};
	drawChart.setActive = (newActive) => {
		activeGroups = newActive;
		return drawChart;
	};
	drawChart.setPeriod = (newFunc) => {
		setPeriod = newFunc;
		return drawChart;
	};
	drawChart.setGroupFilter = (newGroupFilter) => {
		groupFilter = newGroupFilter;
		return drawChart;
	};
	let groupData = (data, keys) => {
		Object.keys(data).forEach((key) => {
			data[key] = _.groupBy(data[key], groupFilter);
			Object.keys(data[key]).forEach((subKey) => {
				data[key][subKey] = data[key][subKey].reduce(
						(prev, curr) => prev + curr.Count, 0);
			});
		//if there are items in keys nonexistant here, add 0 to avoid error
			for (let a in keys) {
				if (data[key][keys[a]] === void 0) {
					data[key][keys[a]] = 0;
				}
			}
			if (period === 'Monthly') {
				data[key].date = d3.timeParse('%Y/%m')(key);
			} else if (period === 'Weekly') {
				data[key].date = key;
			} else {
				data[key].date = d3.timeParse('%b/%-d/%y')(key);
			}
		});
		return _.values(data);
	};

	function brushended() {
		let s = d3.event.selection;
		if (s === null) {
			x.range([0, width]);
			// xAxis = d3.axisBottom(x);
			viewBox.selectAll('.layer').selectAll('rect')
										.attr('x', (d) => x(d.x))
										.attr('width', x.bandwidth());
			viewBox.select('.axis.axis--x').call(xAxis);
			totalTranslate = 0;
			viewBox.selectAll('.layer, .xAxisContainer').attr('transform', `translate(${totalTranslate}, 0)`);

			d3.select('.brush')
				.call(brush.move, [0, width]);
		}
	}

	function beingBrushed() {
		let s = d3.event.selection;
		if (s !== null) {
			if (s[0] !== s[1]) {
				multiplier = width / Math.abs(s[0] - s[1]);
				x.range([0, width * multiplier]);
				// xAxis = d3.axisBottom(x);
				viewBox.selectAll('.layer').selectAll('rect')
											.attr('x', (d) => x(d.x))
											.attr('width', x.bandwidth());
				viewBox.select('.axis.axis--x').call(xAxis);
				totalTranslate = -1 * s[0] * multiplier;
				viewBox.selectAll('.layer, .xAxisContainer').attr('transform', `translate(${totalTranslate}, 0)`);
			}
		}
	}

	let mouseOverOrOut = function (keys) {
		viewBox.selectAll('.layer')
			.selectAll('rect')
			.on('mouseover', function (d, i) {
				// console.log(this);
				let nthChild = i + 1;
				let selectedBar = svg.selectAll('.layer')
									.selectAll('rect:nth-child(' + nthChild + ')') //IE 8 and plus
									.style('opacity', 1);

				// show tooltip
				let rectLength = selectedBar.size(),
					upperRect = d3.select(selectedBar.nodes()[rectLength - 1]),
					tipContainerPadding = 8,
					yPos      = +upperRect.attr('y'), // Beware that the returned type is 'array'
					xPos      = +upperRect.attr('x') + (+upperRect.attr('width')/2);

				let tooltipCont = selectedBar.data().map((d, i) => ({data: d, key: keys[i]}));

				svg.append('g')
						.attr('id', 'tooltip');
				let tooltipContainer = d3.select('#tooltip')
										.append('rect')
											.style('opacity', 0.8)
											.style('fill',    '#F8F8F8')
											.style('stroke',  '#01a982')
											.style('stroke-width', 2);
				d3.select('#tooltip')
					.append('g')
					.attr('id', 'tipContent')
					.attr('transform', `translate(${tipContainerPadding}, ${tipContainerPadding})`);

				d3.select('#tipContent')
					.append('text')
					.attr('transform', 'translate(0, 14)')
					.text(`Total: ${selectedBar.data()[selectedBar.data().length - 1].y}`)
					.style('font-family', 'sans-serif')
					.style('font-size', '16px');

				let myTip = svg.select('#tipContent')
								.selectAll('g.tooltipContent')
								.data(tooltipCont)
								.enter().append('g')
										.attr('class', 'tooltipCont')
										.attr('transform', (d, i) => `translate(0,  ${(i + 1) * 24})`);
				myTip.append('rect')
						.attr('width', 12)
						.attr('height', 12)
						.attr('x', 0)
						.attr('y', -2)
						.style('fill', (d) => colorScale(d.key));
				myTip.append('text')
						.attr('x', 16)
						.attr('y', 10)
						.style('font-family', 'sans-serif')
						.style('font-size', '16px')
						.text((d) => d.key + ': ' + (d.data.y -d.data.y0).toString());

				let tooltipContentNode = d3.select('#tipContent').node().getBBox(),
					tooltipHeight = tooltipContentNode.height,
					tooltipWidth  = tooltipContentNode.width;

				tooltipContainer.attr('width', tooltipWidth + tipContainerPadding * 2)
							.attr('height', tooltipHeight+ tipContainerPadding * 2);

				//calculate the x and y position of the tooltip;
				tooltipHeight = d3.select('#tooltip').node().getBBox().height;
				tooltipWidth  = d3.select('#tooltip').node().getBBox().width;
				yPos = yPos - tooltipHeight > -20? (yPos - tooltipHeight) : -20;
				xPos = xPos + tooltipWidth > width + 80? (xPos - tooltipWidth) : xPos;
				svg.select('#tooltip')
					.attr('transform', `translate(${xPos + totalTranslate}, ${yPos})`);
			})
			.on('mouseout', (d, i) => {
				let nthChild = i + 1;
				let selectedBar = d3.selectAll('.layer').selectAll('rect:nth-child(' + nthChild + ')') //IE 8 and plus
				.style('opacity', 0.8);
				d3.select('#tooltip').remove();
			});
	};
	return drawChart;

}
