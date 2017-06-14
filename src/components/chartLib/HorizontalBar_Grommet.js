import React, { Component } from 'react';
import Chart from 'grommet/components/chart/Chart';
// import Axis from 'grommet/components/chart/Axis';
import Base from 'grommet/components/chart/Base';
import Layers from 'grommet/components/chart/Layers';
import Box from 'grommet/components/Box';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Label from 'grommet/components/Label';


class HorizontalBar extends Component {

	renderBars(barSeries, labelKey, valueKey) {
		let allValues = barSeries.map(datum => datum[valueKey]);
		let maxValue = Math.max(...allValues);

		return barSeries.map((barData,i) => {
			return (
				<Box colorIndex = "grey-2"
						align='center'
						key={i}
						direction='row'
						size={{width: 'full'}}
						pad={{horizontal: 'small', between: 'small'}}>
					<Box colorIndex = "grey-2"
						align="start"
						direction='row'
						flex={false}
						size={{width: 'small'}}>
						<Label align='center'>
							{barData[labelKey]}
						</Label>
					</Box>

					<Meter
						id={`horizontal-bar-chart-${i}`}
						vertical={false}
						size='medium'
						value={barData[valueKey]}
						colorIndex = 'accent-1'
						max={maxValue} />

					<Value
						align='center'
						value={barData[valueKey]}
						size='small'
					/>
				</Box>
			);
		});
	}

	render() {
		let {data, colName, valName} = this.props;
		// let valueAxisPoints = data.map(datum => datum[valName]).sort();
		// let horizontalAxisLabels = valueAxisPoints.map((point, i) => {
		// 	return {
		// 			label: point.toString(),
		// 			index: i
		// 	};
		// });

		return (
			<Box colorIndex = "grey-2" direction='column'>
			<Chart full={false} HorizontalAlignWith="horizontal-bar-chart-0">



				<Chart HorizontalAlignWith="horizontal-bar-chart-0">
					<Base vertical={true} width={"large"}>
						{this.renderBars(data, colName, valName)}
					</Base>
					<Layers />
				</Chart>
			</Chart>
			</Box>
		);
	}
}

HorizontalBar.propTypes = {
	data: React.PropTypes.array.isRequired,
	colName: React.PropTypes.string.isRequired,
	valName: React.PropTypes.string.isRequired,
};


export default HorizontalBar;
