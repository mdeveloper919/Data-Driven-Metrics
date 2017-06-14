import * as d3 from 'd3';


export default drawHorizontalBarChart;

function drawHorizontalBarChart() {
	let data, colName, valName,
		margin = {top: 30, right: 100, bottom: 100, left: 100},
		width = 700,
		height = 300,
		svg,
		y = d3.scaleLinear().range([height, 0]),
		x = d3.scaleBand().range([0, width]).padding(0.4);
	let drawChart = function (selection) {
		svg = selection.append('svg')
						.attr('width', 1200)
						.attr('height', 200)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		y.domain([0, d3.max(data.map(d => d[valName]))]).nice();
		x.domain(data.map(d => d[colName]));
		let groups = svg.append('g')
							.attr('class', 'bars')
							.selectAll('g')
							.data(data)
							.enter().append('g');

		let t = d3.transition().duration(1200)
								.ease(d3.easeElasticOut)
								.on('end', () => {
									groups.append('text')
											.attr('y', d => y(d[valName]) - 10)
											.attr('x', d => x(d[colName]) + x.bandwidth()/2)
											.attr('dy', '.3em')
											.text(d => d[valName])
											.style('font-size', '18px')
											.style('font-family', 'sans-serif')
											.style('font-weight', 'bold')
											.style('text-anchor', 'middle')
											.style('fill', '#614767');
								});
		groups.append('rect')
				.attr('y', height)
				.attr('x', d => x(d[colName]))
				.attr('width', x.bandwidth())
				.attr('height', 0)
				.style('fill', ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"].reverse()[0])
				.transition(t)
				.delay((d, i) => i * 100)
				.attr('y', d=> y(d[valName]))
				.attr('height', d => y(0) - y(d[valName]));


		svg.append('g')
			.attr('class', 'axis x--axis')
			.call(d3.axisBottom().scale(x).tickSize(3).tickPadding(10))
			.attr('transform', `translate(0, ${height})`)
			.selectAll('text')
			.style('text-anchor', 'middle')
			.call(wrap, x.bandwidth() * 1.2);

		svg.append('g')
			.attr('class', 'axis y--axis')
			.call(d3.axisLeft().scale(y).ticks(5))
			.select('path').style('stroke-width', '2px');

		svg.select('.x--axis').selectAll('path').attr('display', 'none');
		svg.selectAll('.axis .tick text').style('font-size', '14px');
		svg.selectAll('.x--axis text').style('font-weight', 'bold');
	};
	drawChart.data = function(newData) {
		data = newData;
		return drawChart;
	};
	drawChart.colName = function(name) {
		colName = name;
		return drawChart;
	};
	drawChart.valName = function(name) {
		valName = name;
		return drawChart;
	};
	function wrap(text, width) {
		text.each(function() {
			let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			while (word == words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width){
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
