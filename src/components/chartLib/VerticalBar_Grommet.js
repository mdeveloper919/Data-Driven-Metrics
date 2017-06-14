import React, { Component } from 'react';
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import Base from 'grommet/components/chart/Base';
import Layers from 'grommet/components/chart/Layers';
import Box from 'grommet/components/Box';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Label from 'grommet/components/Label';


class VerticalBar extends Component {
constructor (props) {
    console.log('In VerticalBar constructor')
    super(props);

    this.state = {

  	  activeIndex: 0,
      legend: [],
 	    Index: 0

	};


}
	renderBars(barSeries, labelKey, valueKey) {
		let allValues = barSeries.map(datum => datum[valueKey]);
		let maxValue = Math.max(...allValues);

		return barSeries.map((barData,i) => {
			return (
				<Box
					align='center'
					key={i}
					direction='column'
					size={{width: 'full'}}
					>
					<Value
						align='center'
						value={barData[valueKey]}
						size='small'
					/>

					<Meter
						id={`vertical-bar-chart-${i}`}
						vertical={true}
						size='medium'
						value={barData[valueKey]}
						colorIndex = 'accent-1'
						max={maxValue} />

						<Box
							align="start"
							direction='row'
							flex={false}>
							<Label>
								{barData[labelKey]}
							</Label>
						</Box>
				</Box>
			);
		});
	}

	 _getIndex(index) {
        let lastlegend = this.state.hostname;
        if (index != undefined && lastlegend != undefined) {
            this.setState({activeIndex: index});
            lastlegend.map(x => this.state.legend);
          this.setState({legend: lastlegend, Index:index});
       }
    }

	render() {
		let {data, colName, valName} = this.props;
		let valueAxisPoints = data.map(datum => datum[valName]).sort();
		let horizontalAxisLabels = valueAxisPoints.map((point, i) => {
			return {
					label: point.toString(),
					index: i
			};
		});

		return (
			<Box full={false}>
			<Chart full={true}>
				<Chart full={true}>
					<Base vertical={false}>
						{this.renderBars(data, colName, valName)}
					</Base>
					<Layers />
				</Chart>
			</Chart>
			</Box>
		);
	}
}

VerticalBar.propTypes = {
	data: React.PropTypes.array.isRequired,
	colName: React.PropTypes.string.isRequired,
	valName: React.PropTypes.string.isRequired
};

export default VerticalBar;
