import React, { Component } from 'react';
import * as d3 from 'd3';
import drawGroupedBarChart from '../../utility/drawGroupedBarChart';


class GroupedBar extends Component {
	constructor(props) {
		super(props);
		this._container = null;
	}
	componentDidMount() {
		let container = d3.select(this._container);
		let data = this.props.data;
		data.forEach(d => {
			if (d.PM_Created_Count === null) d.PM_Created_Count = 0;
			if (d.PM_Closed_Count === null) d.PM_Closed_Count = 0;
		});
		let groupedBarChart = drawGroupedBarChart().data(this.props.data)
		.dateCol('Date')
		.groups(['PM_Created_Count', 'PM_Closed_Count']) // can consider spread operator
		.dateFormat('%Y-%m')
		.xFormat('%b-%y');
		container.call(groupedBarChart);
		// d3.select(window).on('resize', () => lineChart(container));
	}
	render() {
		return (
			<div ref={(c) => {this._container = c;}} />
		);
	}
}

GroupedBar.propTypes = {
	data: React.PropTypes.array.isRequired
};

export default GroupedBar;
