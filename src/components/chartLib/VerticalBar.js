import React, { Component } from 'react';
import * as d3 from 'd3';
import drawVerticalBarChart from '../../utility/drawVerticalBarChart';


class VerticalBar extends Component {
	constructor(props) {
		super(props);
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);

		let {data, colName, valName} = this.props;
		data.forEach(d => {
			d[colName] = d[colName] || 'Null';
		});
	let verticalBar = drawVerticalBarChart().data(data).colName(colName).valName(valName);
		container.call(verticalBar);
		// d3.select(window).on('resize', () => lineChart(container));
	}
	render() {
		return (
			<div ref={(c) => {this._container = c;}} />
		);
	}
}

VerticalBar.propTypes = {
	data: React.PropTypes.array.isRequired,
	colName: React.PropTypes.string.isRequired,
	valName: React.PropTypes.string.isRequired
};

export default VerticalBar;
