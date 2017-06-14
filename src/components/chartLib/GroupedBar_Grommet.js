import React, { Component } from 'react';
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import Base from 'grommet/components/chart/Base';
import Layers from 'grommet/components/chart/Layers';
import Box from 'grommet/components/Box';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Legend from 'grommet/components/Legend';
import Marker from 'grommet/components/chart/Marker';
import HotSpots from 'grommet/components/chart/HotSpots';

// import Label from 'grommet/components/Label';
import _ from 'underscore';
const colorCode = ['accent-2', 'accent-3', 'accent-1'];

class VerticalBar extends Component {

	renderGroupedBars(chartData, colNames, labelKey) {

    let maxValue = Math.max(...chartData.map(datum => Math.max(...colNames.map(colName => datum[colName]))));

		return chartData
      .map((datum,i) => {

			return (
				<Box colorIndex = "grey-2"
					align='center'
					key={i}
					direction='column'
					size={{width: 'small'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>

            <Meter
						id={`vertical-bar-chart-${i}`}
              vertical={true}
              size='medium'
              series={colNames.map((colName, i) => ({
								value: datum[colName] || 0,
								colorIndex: colorCode[i],
								}))}
              max={maxValue} />

			{console.log("Group BAR " + colNames.map((colName, i) => (
							 datum[colName]
								)))}

      <Box colorIndex = "grey-2"
					align='center'
					key={i}
					direction='column'
					size={{width: 'medium'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>
			  <Value
					value = {(colNames.map((colName, i) => (
					 (datum[colName]  || 0) + "				"
						 //+ "	" + "	" + "	" || 0 + "	" + "	" + "	" + "	"
							)))}
					active={false}
					size = "xsmall" />

				<Box colorIndex = "grey-2" align='center'
					key={i}
					direction='column'
					size={{width: 'medium'}}
					pad={{horizontal: 'small', between: 'xsmall'}}>
						<Value
							align='center'
							value={datum[labelKey]}
							size='small'/>
			  </Box>
			</Box>

</Box>
			);
		});
	}

	render() {
		let {data, colNames, labelKey} = this.props;

		{/*console.log("GroupedBar_data: " + JSON.stringify(data));
		console.log("GroupedBar_colNames: " + colNames);
		console.log("GroupedBar_labelKey: " + labelKey); */}

		var test = [];
		test.push.apply(test, ["Created Count", "Closed Count"]);
		let legendData = test
		//colNames
		.map((colName, i) => ({label: colName, colorIndex: colorCode[i]}));

		let maxValue = Math.max(...data.map(datum => Math.max(...colNames.map(colName => datum[colName]))));

		return (
		<Box colorIndex = "grey-2" ><div id = "test">
			<Chart  class = "test" full={true} VerticalAlignWith="vertical-bar-chart">
				<Chart  id = "test" full={true} vertical={true}>
					<Legend
						size="medium"
						series={legendData}
					/>
					
					<Base
            vertical={false}
						width="small"
						height="large"
            pad={{horizontal: 'small', between: 'xsmall'}}>
						<Axis count = {5} colorIndex = "lighter"
							labels={[
								{"index": 0, "label": '0',  "colorIndex" :"lighter"},
								{"index": 1, "label": parseInt(maxValue * 0.25).toString(),  "colorIndex" :"lighter"},
								{"index": 2, "label": parseInt(maxValue * 0.50).toString(),  "colorIndex" :"lighter" },
								{"index": 3, "label": parseInt(maxValue * 0.75).toString(),  "colorIndex" :"lighter" },
								{"index": 4, "label": maxValue.toString(),  "colorIndex" :"lighter"}
							]}
							vertical={true}
							ticks={false} />

						{this.renderGroupedBars(data, colNames, labelKey)}
					</Base>
					
				</Chart>
			</Chart></div>
</Box>
		);
	}
}

export default VerticalBar;
