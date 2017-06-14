import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import ApplicationHealthMeter from '../chartlib/ApplicationHealthMeter';
import AssetManagementMeter from '../chartlib/AssetManagementMeter';

class ChartHead extends Component {
	constructor(props) {
		super(props);
	}
  render() {
    return(
      <Box justify="start" align="center" wrap={true} pad="medium" margin="small" colorIndex = "grey-2">
				<Box colorIndex = "grey-2" primary={true} flex={true} direction="row">
					<Box align="center" pad={{horizontal: "large"}}>
						<ApplicationHealthMeter />
					</Box>
					<Box align="center" pad={{horizontal: "large"}}/>
					<Box align="center" pad={{horizontal: "large"}}>
						<AssetManagementMeter />
					</Box>
				</Box>
      </Box>
    );
  }
}

ChartHead.propTypes = {
};

export default ChartHead;
