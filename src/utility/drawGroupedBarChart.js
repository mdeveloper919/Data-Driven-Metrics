import * as d3 from 'd3';


export default drawGroupedBarChart;

function drawGroupedBarChart() {
	let data,
		margin = {top: 50, right: 100, bottom: 100, left: 100},
		width  = 1000,
		height = 300,
		x      = d3.scaleBand()
					.rangeRound([0, width])
					.padding(0.3),
		x2	   = d3.scaleBand()
					.padding(0.1),
		y      = d3.scaleLinear()
					.range([height, 0]),
		// z      = d3.scaleOrdinal(d3.schemeCategory10),
		z      = d3.scaleOrdinal(["#41b6c4","#225ea8","#c7e9b4","#ffffcc","#7fcdbb","#0c2c84","#1d91c0"].reverse()),
		svg,
		line,
		dateCol,
		xFormat,
		dateFormat,
		keys;
	let drawChart = function (selection) {
		// first, transform all date objects
		data.forEach(d => d[dateCol] = d3.timeParse(dateFormat)(d[dateCol]));

		svg = selection.append('svg')
						.attr('height', 400)
						.attr('width', 1200)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);
		// find the max value in data;
		let maxY = d3.max(data, (d) => d3.max(d3.values(d).filter((e) => typeof(e) === 'number')));
		// console.log(maxY);
		x.domain(data.map((d) => d[dateCol]));
		z.domain(keys);
		x2.domain(keys).range([0, x.bandwidth()]);
		y.domain([0, maxY]).nice();	
		// console.log(x.range(), x1.range());
		line = d3.line()
					.x(d => x(d.date) + x2.bandwidth()/2)
					.y(d => y(d.value))
					// .curve(d3.curveMonotoneX);
					.curve(d3.curveCardinal.tension(0.4));

		let groups = svg.append('g')
						.selectAll('.groups')
						.data(keys)
						.enter().append('g')
								.attr('transform', (d) => `translate(${x2(d)}, 0)`)
								.attr('class', 'groups')
								.style('fill', z);
		let t = d3.transition().duration(1200)
								.ease(d3.easeElasticOut)
								.on('end', () =>{
									groups.selectAll('rect')
											.on('mouseover', barMouseOver)
											.on('mouseout', barMouseOut);}
								);
		// register the mouse event only after the entering animation completes; or else there would be problems.
		groups.selectAll('.bar')
				.data((d) => data.map((e) => ({date: e[dateCol], value: e[d]})))
				.enter().append('rect')
						.attr('class', '.bar')
						.attr('x', d => x(d.date))
						.attr('y', d => height)
						.attr('width', x2.bandwidth())
						.attr('height', 0)
						.style('opacity', 0.8)
						.transition(t)
						.delay((d, i) => 40 * i)
						.attr('y', d => y(d.value))
						.attr('height', d => height - y(d.value));


		groups.append('path')
				.datum((d) => data.map((e) => ({date: e[dateCol], value: e[d]})))
						.attr('class', 'line')
						.attr('d', line)
						.style('stroke','#614767')
						.style('stroke-width', '2px')
						.style('fill', 'none')
						.style('opacity', 0);

		groups.selectAll('.symbol')
				.data((d) => data.map((e) => ({date: e[dateCol], value: e[d]})))
				.enter().append('path')
						.attr('class', 'symbol')
						.attr('d', d3.symbol().type(d3.symbolTriangle).size(20))
						.attr('transform', d => `translate(${x(d.date) + x2.bandwidth()/2}, ${y(d.value)})`)		
						.style('fill', '#614767')
						.style('stroke', 'white')
						.style('stroke-width', '0.5px')
						.style('opacity', 0);

		groups.selectAll('.label')
				.data((d) => data.map((e) => ({date: e[dateCol], value: e[d]})))
				.enter().append('text')
						.attr('x', d => x(d.date) + x2.bandwidth()/2)
						.attr('y', d => y(d.value) - 5)
						.text(d => d.value)
						.style('font-family', 'sans-serif')
						.style('font-weight', 'bold')
						.style('font-size', '18px')
						.style('text-anchor', 'middle')
						.style('opacity', 0);
		svg.append('g')
			.attr('transform', `translate(0, ${height})`)
			.attr('class', 'axis axis--x')
			.call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat(xFormat)))
			.select('path').remove();

		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(d3.axisLeft().scale(y).ticks(4).tickFormat(d3.format('d')))
			.select('path').style('stroke-width','2px');		

		// draw ledgend
		let legend = svg.append('g')
					.attr('class', 'legend')
					.selectAll('.legend-gs')
					.data(keys).enter().append('g')
										.attr('class', d => 'legend-gs ' + d.keys);
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
				.style('font-weight', 'bold')
				.style('font-size', '18x');
		// move the chartKeys
		let legendTranslation = [];
		legend.nodes().forEach(function(d, i) {
			legendTranslation.push(Math.floor(
				d.getBBox().width + (i === 0? 15 : legendTranslation[i - 1] + 15)));
		});
		legend.attr('transform', (d, i) => {
			if (i > 0) return `translate(${legendTranslation[i-1]}, 0)`;
		});		

		svg.select('g.legend')
					.attr('transform', `translate(0, -30)`);

		svg.selectAll('.axis text')
			.style('font-weight', 'bold')
			.style('font-size', '14px');



	};
	function barMouseOver() {
		let t = d3.transition().duration(250).delay(100);
		let parentNode = d3.select(this).node().parentNode;
		d3.select(parentNode).selectAll('path').transition(t).style('opacity', 1);
		d3.select(parentNode).selectAll('text').transition(t).style('opacity', 1);
		d3.select(parentNode).selectAll('rect').transition(t).style('opacity', 1);
		getSiblings(parentNode).forEach((d) => {
			d3.select(d).selectAll('rect').transition(t).style('opacity', 0.1);
		});
	}
	
	function barMouseOut() {
		let t = d3.transition().duration(250).delay(100);
		let parentNode = d3.select(this).node().parentNode;
		d3.select(parentNode).selectAll('path').transition(t).style('opacity', 0);
		svg.selectAll('rect').transition(t).style('opacity', 0.8);
		svg.selectAll('.groups').selectAll('text').transition(t).style('opacity', 0);
	}
	
// find all siblings, not only the ones following:
	function getChildren(n, skipMe){
		let r = [];
		for ( ; n; n = n.nextSibling )
			if ( n.nodeType == 1 && n != skipMe)
				r.push( n );
			return r;
	}

	function getSiblings(n) {
		return getChildren(n.parentNode.firstChild, n);
	}

	drawChart.data = function(newDataSet) {
		data = newDataSet;
		return drawChart;
	};
	
	drawChart.dateCol = function(newColName) {
		dateCol = newColName;
		return drawChart;
	};
	drawChart.xFormat = function(newXFormat) {
		xFormat = newXFormat;
		return drawChart;	
	};
	drawChart.dateFormat = function(newTimeFormat) {
		dateFormat = newTimeFormat;
		return drawChart;
	};
	drawChart.groups = function(newGroups) {
		keys = newGroups;
		return drawChart;
	};
	return drawChart;
}