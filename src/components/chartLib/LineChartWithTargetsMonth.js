import React, { Component } from 'react';
import * as d3 from 'd3';
import drawLineWithTargetsMonth from '../../utility/drawLineWithTargetsMonth';

class LineChart extends Component {
	constructor(props) {
		super(props);
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);
		let { dateCol, valCol, dateFormat, targetCol, data } = this.props;
		let lineChart = drawLineWithTargetsMonth().data(data)
													.dateCol(dateCol)
													.valCol(valCol)
													.dateFormat(dateFormat)
													.targetCol(targetCol);
		container.call(lineChart);
	}
	render() {
		return (
			<div ref={(c) => {this._container = c;}} >
				 
			
				</div>
				 
		);
		
	}
}

LineChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	dateCol: React.PropTypes.string.isRequired,
	valCol: React.PropTypes.string.isRequired,
	dateFormat: React.PropTypes.string.isRequired,
	targetCol: React.PropTypes.string.isRequired
};


export default LineChart;
