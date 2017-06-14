import React, { Component } from 'react';
import * as d3 from 'd3';
import drawLineChart from '../../utility/drawLineChart';


class LineChart extends Component {
	constructor(props) {
		super(props);
		// this.state = {data: this.props.data};
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);
		// let strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
		// data.forEach((d) => {
		// 	d.Date = strictIsoParse(d.Date);
		// });
		let lineChart = drawLineChart().data(this.props.data).setValName(this.props.valName);
		container.call(lineChart);
		d3.select(window).on('resize', () => lineChart(container));
	}
	render() {
		return (
			<div ref={(c) => {this._container = c;}} />
		);
	}
}

LineChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	valName: React.PropTypes.string.isRequired
};

export default LineChart;
