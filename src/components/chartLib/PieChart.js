import React, { Component } from 'react';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import Box  from 'grommet/components/Box';


class PieChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [],
			seriesCount: 0
		};
	}

	componentDidMount() {
		let { data, catName, valName } = this.props;
		let series = [];
		let colors = ["accent-1","accent-3","accent-2","neutral-2","neutral-3"];
		series = data.map(function(item, index){
			return({label: item[catName].replace(/\b[a-z]/g,function(f){return f.toUpperCase();}), value: item[valName], colorIndex: colors[index]});
		});
		
		let seriesCount = series.reduce(function(sum,value){
			return sum + value.value;
		},0);
		this.setState({series: series, seriesCount: seriesCount});
	}

	render() {
		return (
			<div>
			<Box colorIndex = "grey-2">

				<AnnotatedMeter size="medium" type="circle" legend={true} max={this.state.seriesCount} series={this.state.series} style="outline: none"/>
			</Box>
			</div>
		);
	}
}


PieChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	catName: React.PropTypes.string.isRequired,
	valName: React.PropTypes.string.isRequired,
};


export default PieChart;
