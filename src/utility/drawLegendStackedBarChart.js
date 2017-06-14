import * as d3 from 'd3';


export default drawLegendStackedBar;

function drawLegendStackedBar() {
	let cats, setActiveFunc;
	let colorScale = d3.scaleOrdinal()
						.range(["#D9D9D9","#000000","#666666","#FFED00","#00C9FF","#64FF00"].reverse());
						// .range(["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"]);

	let drawChart = function (selection) {
		// selection.select('svg').remove();
		colorScale.domain(cats);
		let svg = selection.append('svg')
							.attr('width', 1000)
							.attr('height', 50)
							.append('g')
							.attr('transform','translate(20, 20)');
		let legend = svg.selectAll('.legend')
						.data(cats)
						.enter().append('g').attr('class','legend active');
		legend.append('rect')
				.attr('y', 0)
				.attr('width', 15)
				.attr('height', 15)
				.style('fill', (d) => colorScale(d));
		legend.append('text')
				.attr('x', 20)
				.attr('y', 12)
				.text((d) => d)
				.style('font-size', '13px')
				.style('font-family', 'sans-serif');
		// rearrange the text boxes so they are placed next to each other
		let legendTranslation = [];
		svg.selectAll('.legend').nodes().forEach(function(d, i) {
			legendTranslation.push(Math.floor(
				d.getBBox().width + (i === 0? 15 : legendTranslation[i - 1] + 15)));
		});
		legend.attr('transform', (d, i) => {
			if (i > 0) {
				return `translate(${legendTranslation[i-1]}, 0)`;
			}
		});
		legend.on('click', function(d) {
			let legendG = d3.select(this);
			if (legendG.classed('active')) {
				if (svg.selectAll('g.active').size() > 1) {
					legendG.classed('active', false);
					legendG.select('rect').style('fill', '#bbb');
					legendG.select('text').style('fill', '#bbb');

					setActiveFunc(svg.selectAll('g.active').data());
				}
			} else {
				legendG.classed('active', true);
				legendG.select('rect').style('fill', colorScale);
				legendG.select('text').style('fill', '#000');

				setActiveFunc(svg.selectAll('g.active').data());
			}
		});
	};
	drawChart.setCats = function (allCats) {
		cats = allCats;
		return drawChart;
	};
	drawChart.setActive = function(setActive) {
		setActiveFunc = setActive;
		return drawChart;
	};
	return drawChart;

}
