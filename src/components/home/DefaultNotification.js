import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Value from 'grommet/components/Value';
import Anchor from 'grommet/components/Anchor';
import CloseIcon from 'grommet/components/icons/base/Close';
import Heading from 'grommet/components/Heading';
import { connect } from 'react-redux';
import Scrollchor from 'react-scrollchor';
import Scroll from 'react-scroll';


class DefaultNotification extends Component {

	constructor(props) {
		super(props);
        this._onViewDetailsClicked = this._onViewDetailsClicked.bind(this);
	}

	_toggleClose(){
		document.getElementById(this.props.top).style.display = "none";
	}

    _onViewDetailsClicked() {
        let showAMTable, showHCTable;
        showAMTable = this.props.isAMTableDisplayed;
        showHCTable = this.props.isHCTableDisplayed;
        this.props.onClick();
		    Scroll.animateScroll.scrollMore(1000);
    }




render() {
		return(
      <Box id={this.props.top} direction="row" colorIndex={this.props.faultCount===0? "ok":"critical"} align="center" justify="between"  wrap={true} pad="small" margin="small">
        <Heading style={{"color": "white"}} tag="h4" strong={false} id="header3">
					<Value  value={"You have " + this.props.faultCount + " Applications with "+ this.props.top +" Issues, as of " +  this.props.updatedTime + " UTC"}  size="small" align="start"/>
				</Heading>
				<Box direction="row" align="center" justify="between" >
					<Anchor style={{"color": "white"}} label="View Details" onClick={this._onViewDetailsClicked.bind()}/>
					<Anchor icon={<CloseIcon size="small"/>} onClick={this._toggleClose.bind(this)}/>
				</Box>
      </Box>
    );
  }
}

DefaultNotification.propTypes = {
  faultCount: React.PropTypes.number,
  updatedTime: React.PropTypes.string,
  top: React.PropTypes.string.isRequired,
  isAMTableDisplayed: React.PropTypes.bool,
  isHCTableDisplayed: React.PropTypes.bool,
  displayHealthCheckTable : React.PropTypes.bool,
  displayAssetManagementTable: React.PropTypes.bool

};



const mapStatetoProps = ({}) => ({});
export default connect(mapStatetoProps, {})(DefaultNotification);
