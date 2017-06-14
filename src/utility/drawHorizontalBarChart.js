import * as d3 from 'd3';


export default drawHorizontalBarChart;

function drawHorizontalBarChart() {
	let data, colName, valName,
		margin = {top: 40, right: 100, bottom: 100, left: 100},
		width = 700,
		height = 350,
		svg,
		x = d3.scaleLinear().range([0, width]),
		y = d3.scaleBand().range([0, height]).padding(0.4);
	let drawChart = function (selection) {
		svg = selection.append('svg')
						.attr('width', 1200)
						.attr('height', 400)
						.append('g')
						.attr('transform', `translate(${margin.left * 4}, ${margin.top})`);	
		x.domain([0, d3.max(data.map(d => d[valName]))]).nice();
		y.domain(data.map(d => d[colName]));		
		let groups = svg.append('g')
							.attr('class', 'bars')
							.selectAll('g')
							.data(data)
							.enter().append('g');

		let t = d3.transition().duration(1200)
								.ease(d3.easeElasticOut)
								.on('end', () => {
									groups.append('text')
											.attr('x', d => x(d[valName]) + 5)
											.attr('y', d => y(d[colName]) + y.bandwidth()/2)
											.attr('dy', '.3em')
											.text(d => d[valName])
											.style('font-size', '18px')
											.style('font-family', 'sans-serif')
											.style('font-weight', 'bold')
											.style('fill', '#614767');
								});
		groups.append('rect')
				.attr('x', 0)
				.attr('y', d => y(d[colName]))
				.attr('width', 0)
				.attr('height', y.bandwidth())
				.style('fill', ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"].reverse()[0])
				.transition(t)
				.delay((d, i) => i * 40)
				.attr('width', d => x(d[valName]));


		svg.append('g')
			.attr('class', 'axis x--axis')
			.call(d3.axisTop().scale(x).tickSizeInner(-4));
		svg.append('g')
			.attr('class', 'axis y--axis')
			.call(d3.axisLeft().scale(y));
		svg.select('.x--axis').selectAll('path').attr('display', 'none');
		svg.selectAll('.axis .tick text').style('font-size', '14px').style('font-weight', 'bold');
		svg.select('.y--axis').selectAll('line, path').attr('display', 'none');
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
	return drawChart;
}
