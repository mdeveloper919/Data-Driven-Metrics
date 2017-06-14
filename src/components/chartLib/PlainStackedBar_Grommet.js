import React, { Component } from 'react';
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import Base from 'grommet/components/chart/Base';
//import Layers from 'grommet/components/chart/Layers';
import Box from 'grommet/components/Box';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Legend from 'grommet/components/Legend';
//import Marker from 'grommet/components/chart/Marker';
//import HotSpots from 'grommet/components/chart/HotSpots';
import _ from 'underscore';
const colorCode = ['accent-2', 'accent-3', 'accent-1'];

class VerticalBar extends Component {


	renderGroupedBars(chartData,barName, labelKey, valueKey, legendData, maxValue) {
		let allValues = Object.keys(chartData).map(datum => Math.max(_.pluck(datum, valueKey)));

		return Object.keys(chartData)
      .sort()
      .map((key,i) => {
			return (

				<Box colorIndex = "grey-2"
					align='center'
					key={i}
					direction='column'
					size={{width: 'medium'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>

            <Meter
						id={`vertical-bar-chart-${i}`}
              vertical={true}
              size='medium'
              series={chartData[key].map((datum, i) => ({
								value: datum[valueKey] || 0,
								colorIndex: colorCode[i],
								onClick: (s, d) => {
									console.log(s, d)
								}}))}
								 max={53}
         						 min={0}

								/*activeIndex={this.state.activeIndex}
                				onActive={this._getIndex} */
               />
						<Box colorIndex = "grey-2"
						align='center'
					key={i}
					direction='column'
					size={{width: 'medium'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>
									<Value
									//align='center'
									value = {(chartData[key].map((datum) => (
														datum[valueKey] + "	" + "	")))}
								active={false}
								size = "xsmall" />

				<Box colorIndex = "grey-2"
				align='center'
					key={i}
					direction='column'
					size={{width: 'medium'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>
							<Value
								align='center'
								value={(chartData[key].map((datum) => (
								datum[labelKey])))[0]}

								size='small'
							/>
								</Box>
								</Box>
			</Box>

			);
		});
	}


	render() {
		let {data, colName, valName, barName} = this.props;
		let chartData = _.groupBy(data, colName);

		let legendData = chartData[data[0][colName]]
			.map((datum, i) => ({label: datum[barName], colorIndex: colorCode[i]}));

		let maxValue = Math.max(...data.map(datum => datum[valName]));

		return (
			<Box colorIndex = "grey-2"><div id = "test">
			<Chart class = "test" full={true} VerticalAlignWith="vertical-bar-chart">
				<Chart   class = "test" full={true} vertical={true}>
					<Legend
						size="medium"
						series={legendData}
					/>

					<Base
            vertical={false}
						width="small"
						height="large"
            pad={{horizontal: 'small', between: 'xsmall'}}>
						{/*<Axis count = {5} colorIndex = "light-2"
							labels={[
								{"index": 0, "label": '0'},
								{"index": 1, "label": parseInt(maxValue * 0.25).toString() },
								{"index": 2, "label": parseInt(maxValue * 0.50).toString() },
								{"index": 3, "label": parseInt(maxValue * 0.75).toString() },
								{"index": 4, "label": maxValue.toString()}
							]}
							vertical={true}
							ticks={true} />*/}

						{this.renderGroupedBars(chartData,barName, colName, valName,legendData,maxValue)}
					</Base>
				</Chart>
			</Chart></div>
</Box>
		);
	}
}

export default VerticalBar;
