import * as d3 from 'd3';

export default drawPieChart;

function drawPieChart() {
	let data,
		margin      = {top: 100, right: 100, bottom: 50, left: 100},
		width       = 700,
		height      = 300,
		svg,
		pie,
		outerRadius = 140,
		innerRadius = 80,
		// z           = d3.scaleOrdinal(d3.schemeCategory20),
		z           = d3.scaleOrdinal(["#41b6c4","#225ea8","#c7e9b4","#0c2c84","#1d91c0","#ffffcc","#7fcdbb"].reverse()),
		arc         = d3.arc().padRadius(outerRadius)
								.innerRadius(innerRadius)
								// .outerRadius(outerRadius)
			// if you define the outerRadius here, you cannot change it in the animation
								.padAngle(.02),
		labelArc    = d3.arc().innerRadius(outerRadius - 20)
								.outerRadius(outerRadius - 20),
		// t           = d3.transition().duration(400),
		chart,
		centerX     = (width - margin.left)/2,
		centerY     = (height - margin.top) /2,
		type,
		val,
		legend;

	let drawChart = function (selection) {
		svg = selection.append('svg')
//						.attr('height', 700 + margin.top +margin.bottom)
						.attr('height', 400 + margin.bottom)
						.attr('width', 400 + margin.left + margin.right)
						.append('g')
						.attr('transform', `translate(${margin.left}, ${margin.top})`);	
		pie = d3.pie().value((d) => d[val]).sort(null).sortValues(null);
		data = pie(data);
		chart = svg.append('g')
					.attr('transform', `translate(${centerX},${centerY})`);

		let t = d3.transition().duration(1000).ease(d3.easeBounceOut).on('end', () => {
			chart.selectAll('.label').style('display', null);
			chart.selectAll('path').on('mouseover', pieMouseover(outerRadius + 20)).on('mouseout', pieMouseout(outerRadius));
		});
		
		// register the function only after the transition completes;
		chart.selectAll("path").data(data).enter().append("path").each(function(d){
			d.outerRadius = outerRadius; 
		})
		.style('fill', (d) => z(d.data[type].replace(' ', '_')))
		.style('opacity', 0.8)
		.style('stroke', 'black')
		.transition(t)
		.attrTween('d', tweenPie);
		
		chart.selectAll('.label')
			.data(data)
			.enter().append('text')
			.attr('class', d => 'label ' + d.data[type].replace(' ', '_'))
			.attr('x', d => labelArc.centroid(d)[0])
			.attr('y', d => labelArc.centroid(d)[1])
			.text(d => d.data[val])
			.style('font-family', 'sans-serif')
			.style('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('fill', '#614767')
			.style('font-weight', 'bold')
			.style('display', 'none');

		legend = svg.append('g')
					.attr('class', 'legend')
					.selectAll('.legend-gs')
					.data(data).enter().append('g')
										.attr('class', d => 'legend-gs ' + d.data[type].replace(' ', '_'));
		legend.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', 15)
				.attr('height', 15)
				.style('fill', d => z(d.data[type].replace(' ', '_')));
				
		legend.append('text')
				.attr('x', 20)
				.attr('y', 12)
				.attr('text-anchor', 'start')
				.text(d => d.data[type].replace(' ', '_'))
				.style('font-family', 'sans-serif')
				.style('font-weight', 'bold')
				.style('font-size', '14px');
		// move the chartKeys
		let legendTranslation = [];
		legend.nodes().forEach(function(d, i) {
			legendTranslation.push(Math.floor(
				d.getBBox().width + (i === 0? 15 : legendTranslation[i - 1] + 15)));
		});
		legend.attr('transform', (d, i) => {
			if (i > 0) 
				return `translate(${legendTranslation[i-1]}, 0)`;
		});		
		//move the whole legend to the center
		let legendG = svg.select('g.legend').node().getBBox();
		svg.select('g.legend')
					.attr('transform', `translate(${centerX - legendG.width/2}, ${centerY + outerRadius + 35})`);


	};
	
	function tweenPie(b) {
		let i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
		return function (t) {
			return arc(i(t));
		};
	}
	
	function pieMouseover(outerRadius) {
		return mouseEvent('25px', 1, '#614767', '2px', 250, 0, outerRadius, true);
	}
	
	function pieMouseout(outerRadius) {
		return mouseEvent('18px', 0.8, 'black', '1px', 250, 100, outerRadius, false);
	}
	
	//bad design; better passed in an object! or use spread?
	function mouseEvent(labelFont, opacity, strokeColor, strokeWidth, duration, delay, outerRadius) {
		return function () {
			let t = d3.transition()
						.duration(duration)
						.delay(delay);
			let selectedType = d3.select(this).datum().data[type].replace(' ', '_');
			chart.select('text.'+selectedType).transition(t).style('font-size', labelFont);
			d3.select(this).style('opacity', opacity).style('stroke', strokeColor).style('stroke-width', strokeWidth)
							.transition(t)
							.attrTween("d", function(d) {
								let i = d3.interpolate(d.outerRadius, outerRadius);
								return (k)  => { 
									d.outerRadius = i(k); 
									return arc(d); 
								};
							});
		};
	}

	drawChart.data = function (newData) {
		data = newData;
		return drawChart;
	};
	drawChart.setCatName = function (catName) {
		type = catName;
		return drawChart;
	};
	drawChart.setValName = function (valName) {
		val = valName;
		return drawChart;
	};
	return drawChart;
}
