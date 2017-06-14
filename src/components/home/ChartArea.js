import React, { Component } from 'react';
import Chart from './Chart';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';



class ChartArea extends Component {
	constructor(props) {
		super(props);
	}
  render() {
	let TabStyle = {colorIndex: "#f71d1d"};
    let {KPI} = this.props;
    let trStyle = {color: "#ffffff"};
    return (
      <Section size='flex'  margin={{right: "xsmall", left: "small"}}  flex={true} colorIndex="lighter">
        <Box  flex = "true" colorIndex = "grey-2" >
         <Heading style={trStyle}  tag="h2" strong={true}>{KPI.name}</Heading>
         <Tabs  justify="start">
           {
              KPI.charts.map(d => (
                <Tab  style={trStyle} key={KPI.name+'-'+d.name} title={d.name}>
					<Chart blockName={KPI.name}  subcatName={d.name} />
                </Tab>
              ))
           }
         </Tabs>
        </Box>
      </Section>
    );
  }
}

ChartArea.propTypes = {
  KPI: React.PropTypes.object.isRequired
};
export default ChartArea;
