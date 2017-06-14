import React, { Component } from 'react';
import * as d3 from 'd3';
import drawLineWithTargetsDay from '../../utility/drawLineWithTargetsDay';
import KPIIncidents from '../chartlib/KPIIncidents';

class LineChart extends Component {
	constructor(props) {
		super(props);
		// this.state = {data: this.props.data};
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);
		let { dateCol, actualCol, data, targetCol, valCol} = this.props;

		let lineChart = drawLineWithTargetsDay().data(data[0][valCol])
								.actualCol(actualCol)
								.targetVal(data[0][targetCol])
								.dateCol(dateCol);
		container.call(lineChart);

	}
	render() {
		return (<div ref={(c) => {
				this._container = c;
			}}>
			</div>	);
	}
}

LineChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	actualCol: React.PropTypes.string.isRequired,
	dateCol: React.PropTypes.string.isRequired,
	targetCol: React.PropTypes.string.isRequired,
	valCol: React.PropTypes.string.isRequired
};

export default LineChart;

