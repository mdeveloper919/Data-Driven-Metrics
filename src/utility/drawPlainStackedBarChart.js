import * as d3 from 'd3';
import _ from 'lodash';


export default drawPlainStackedBarChart;

function drawPlainStackedBarChart() {
	let data,
		margin = {top: 50, right: 100, bottom: 500, left: 100},
		width  = 2000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		keys,
		xAxisName,
		yAxisName,
		catName,
		svg,
		x     = d3.scaleBand().range([0, width]).padding(0.4),
		y     = d3.scaleLinear().range([height, 0]),
		xAxis = d3.axisBottom().scale(x),
		yAxis = d3.axisLeft().scale(y).ticks(4),
		// z  = d3.scaleOrdinal(d3.schemeCategory20),
		z     = d3.scaleOrdinal(["#D9D9D9","#000000","#666666","#FFED00","#00C9FF","#64FF00"].reverse()),
		stack = d3.stack().order(d3.stackOrderNone).offset(d3.stackOffsetNone);
	let drawChart = function (selection) {
		svg = selection.append('svg')
						.attr('width', 1000)
						.attr('height', 400)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		// generate unique keys;
		keys = findKey(data, catName);
		// console.log(keys);
		z.domain(keys);
		let groupObj = _.groupBy(data, d => d[xAxisName]);
		x.domain(Object.keys(groupObj));
		let stackInput = [];
		Object.keys(groupObj).forEach(k => {
			let newObj = {};
			newObj[xAxisName] = k;
			groupObj[k].forEach(d => {
				newObj[d[catName]] = d[yAxisName];
			});
			// make sure each group has all the keys;
			keys.forEach(d => newObj[d] = newObj[d] || 0);
			stackInput.push(newObj);
		});
		let stackOutput = stack.keys(keys)(stackInput);
		y.domain([0, d3.max(stackOutput[stackOutput.length - 1].map(d => d[1]))]).nice();
		let xG = svg.append('g')
				.attr('class', 'axis axis--x')
				.attr('transform', `translate(0, ${height})`)
				.call(xAxis.tickSize(3).tickPadding(5));
		xG.select('path').remove();
		xG.selectAll('text')
			.style('text-anchor', 'middle')
			.style('font-size', '14px')
			.style('font-weight', 'bold')
			// .attr('transform', 'rotate(-25)');
			.call(wrap, x.bandwidth() * 1.5);

		svg.append('g')
				.attr('class', 'axis axis--y')
				.call(yAxis).select('path').style('stroke-width', '2px');
		let t = d3.transition().duration(1200)
								.ease(d3.easeElasticOut);
		let bars = svg.append('g')
						.attr('class', 'bars')
						.selectAll('g')
						.data(stackOutput)
						.enter().append('g')
								.style('fill', d => z(d.key))
								.selectAll('rect')
								.data(d => d)
								.enter().append('rect')
										.attr('x', d => x(d.data[xAxisName]))
										.attr('y', height)
										.attr('width', d => x.bandwidth())
										.attr('height', 0)
										.transition(t)
										.delay((d, i) => i * 100)
										.attr('y', d => y(d[1]))
										.attr('height', d => y(d[0]) - y(d[1]))
										.style('opacity', 0.8);

		// draw legends
		let legend = svg.append('g')
					.attr('class', 'legend')
					.selectAll('.legend-gs')
					.data(keys).enter().append('g');
		legend.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', 15)
				.attr('height', 15)
				.style('fill', d => z(d));
		legend.append('text')
				.attr('x', 20)
				.attr('y', 12)
				.attr('text-anchor', 'start')
				.text(d => d)
				.style('font-family', 'sans-serif')
				// .style('font-weight', 'bold')
				.style('font-size', '16px');
		svg.select('g.legend')
					.attr('transform', `translate(0, -30)`);
		// move the chartKeys
		let legendTranslation = [];
		legend.nodes().forEach(function(d, i) {
			legendTranslation.push(Math.floor(
				d.getBBox().width + (i === 0? 15 : legendTranslation[i - 1] + 15)));
		});
		legend.attr('transform', (d, i) => {
			if (i > 0) return `translate(${legendTranslation[i-1]}, 0)`;
		});

		svg.selectAll('g.bars').selectAll('rect').on('mouseover', function(d){
			let selectedBars        = 	svg.selectAll('g.bars')
											.selectAll('rect')
											.filter(f => f.data[xAxisName] === d.data[xAxisName])
											.style('opacity', 1);
			let tipContainerPadding = 8;
			let content             = groupObj[d.data[xAxisName]].map(f => ({key: f[catName], value: f[yAxisName]}));
			let upperRect           = d3.select(selectedBars.nodes()[selectedBars.size() - 1]);
			let yPos                = +upperRect.attr('y');
			let xPos                = +upperRect.attr('x') + x.bandwidth()/2;
			let tooltip             = svg.append('g').attr('class', 'tooltip');
			let tooltipContainer    = tooltip.append('rect')
											.style('opacity', 0.8)
											.style('fill',    '#F8F8F8')
											.style('stroke',  '#01a982')
											.style('stroke-width', 2);
			let tooltipContent = tooltip.append('g')
										.attr('class', 'tooltipContent')
										.attr('transform', `translate(${tipContainerPadding}, ${tipContainerPadding})`);
			tooltipContent.append('text')
							.attr('transform', 'translate(0, 14)')
							.text(`Total: ${selectedBars.data()[selectedBars.data().length - 1][1]}`)
							.style('font-family', 'sans-serif')
							.style('font-size', '16px');
			let myTip = tooltipContent.selectAll('g.tooltipContent')
										.data(content)
										.enter().append('g')
										.attr('transform', (d, i) => `translate(0,  ${(i + 1) * 24})`);


			myTip.append('rect')
					.attr('width', 12)
					.attr('height', 12)
					.attr('x', 0)
					.attr('y', -2)
					.style('fill', (d) => z(d.key));
			myTip.append('text')
					.attr('x', 16)
					.attr('y', 10)
					.style('font-family', 'sans-serif')
					.style('font-size', '16px')
					.text((d, i) => `${d.key}: ${d.value}`);
			let tooltipContentNode = tooltip.select('g.tooltipContent').node().getBBox(),
			tooltipHeight          = tooltipContentNode.height,
			tooltipWidth           = tooltipContentNode.width;

			tooltipContainer.attr('width', tooltipWidth + tipContainerPadding * 2)
							.attr('height', tooltipHeight + tipContainerPadding * 2);
			// calculate x and y position of the tooltip;
			tooltipHeight = tooltip.node().getBBox().height;
			tooltipWidth  = tooltip.node().getBBox().width;
			yPos          = yPos - tooltipHeight > -20? (yPos - tooltipHeight) : -20;
			xPos          = xPos + tooltipWidth > width + 80? (xPos - tooltipWidth) : xPos;
			tooltip.attr('transform', `translate(${xPos}, ${yPos})`).style('opacity', 1);

		}).on('mouseout', function(d) {
			svg.select('g.tooltip').remove();
			svg.selectAll('g.bars')
				.selectAll('rect')
				.filter(f => f.data[xAxisName] === d.data[xAxisName])
				.style('opacity', 0.8);
		});

		svg.selectAll('.axis text').style('font-size', '14px');

	};
	drawChart.data = function (newData) {
		data = newData;
		return drawChart;
	};
	drawChart.xAxisName = function (newNameX) {
		xAxisName = newNameX;
		return drawChart;
	};
	drawChart.yAxisName = function (newNameY) {
		yAxisName = newNameY;
		return drawChart;
	};
	drawChart.catName = function (newNameCnt) {
		catName = newNameCnt;
		return drawChart;
	};
	function findKey (objArr, colName) {
		let keysArray = objArr.map(d => d[colName])
								.filter((value, index, self) => self.indexOf(value) === index);
		return keysArray;
	}

	// https://bl.ocks.org/mbostock/7555321
	function wrap(text, width) {
		text.each(function() {
			let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			while (word == words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}
	return drawChart;
}
