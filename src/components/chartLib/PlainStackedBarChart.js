import React, { Component } from 'react';
import * as d3 from 'd3';
import drawPlainStackedBarChart from '../../utility/drawPlainStackedBarChart';


class PlainStackedBarChart extends Component {
	constructor(props) {
		super(props);
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);
		let { data, xAxisName, catName, yAxisName } = this.props;
		let plainStackedBarChart = drawPlainStackedBarChart().data(data)
											.xAxisName(xAxisName)
											.catName(catName)
											.yAxisName(yAxisName);

		container.call(plainStackedBarChart);
		// d3.select(window).on('resize', () => lineChart(container));
	}
	render() {
		return (
			<div ref={(c) => {this._container = c;}}
				
				/>
		);
	}
}

PlainStackedBarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	catName: React.PropTypes.string.isRequired,
	yAxisName: React.PropTypes.string.isRequired,
	xAxisName: React.PropTypes.string.isRequired
};

export default PlainStackedBarChart;
