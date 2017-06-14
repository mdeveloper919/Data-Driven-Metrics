import React from 'react';
import { connect } from 'react-redux';
import ChartSidebar from './ChartSidebar';
import DailyOpsCharts from './DailyOpsCharts';
import ChartHealthTable from './ChartHealthTable';
import ChartMgtTable from './ChartMgtTable';
import DefaultNotification from './DefaultNotification';
import ChartArea from './ChartArea';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Anchor from 'grommet/components/Anchor';
import Paragraph from 'grommet/components/Paragraph';
import EditIcon from 'grommet/components/icons/base/Edit';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import { setCurrentDashboard } from '../../actions';
import Box from 'grommet/components/Box';
import ApplicationHealthMeter from '../chartlib/ApplicationHealthMeter';
import AssetManagementMeter from '../chartlib/AssetManagementMeter';
import InfoIcon from 'grommet/components/icons/base/Info';

const headerStyle = {
	'marginRight:': '30%'
    };


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state={
			LayerOpen: false,
			hcFaultCount: 0,
			hcGreenCount: 0,
			hcYellowCount: 0,
			hcUpdateDateTime: 0,
			amFaultCount: 0,
			amGreenCount: 0,
			amUpdateDateTime: 0,
			isHCTableDisplayed: false,
			isAMTableDisplayed: false,
	    DisplayHCWarning: false,
			DisplayHCPass: false,
			DisplayAMPass: false

    };

    this._handleSeriesRedClick = this._handleSeriesRedClick.bind(this);
	  this._handleSeriesYellowClick = this._handleSeriesYellowClick.bind(this);
		this._handleSeriesGreenClick = this._handleSeriesGreenClick.bind(this);
    this._handleAssetManagementMeterClicked = this._handleAssetManagementMeterClicked.bind(this);
		this._handleAssetManagementMeterGreenSeriesClicked = this._handleAssetManagementMeterGreenSeriesClicked.bind(this);
    this._hideAppHealthMeter = this._hideAppHealthMeter.bind(this);
    this._hideAssetManagementMeter = this._hideAssetManagementMeter.bind(this);

  }



  componentWillReceiveProps ({ updateHealthCheckStatus, updateAssetManagementStatus }) {

        let healthCheckStatusObj, assetManagementStatusObj ;
        healthCheckStatusObj = updateHealthCheckStatus;
        assetManagementStatusObj = updateAssetManagementStatus;

        console.log("###Asset Management Status: " + JSON.stringify(assetManagementStatusObj));
        console.log("###Health Check Status: " + JSON.stringify(healthCheckStatusObj));

        if(healthCheckStatusObj !== undefined && assetManagementStatusObj !== undefined)
        {
					console.log("fltcnt-hc: " + this.state.hcFaultCount);

					this.setState(
						{hcFaultCount: healthCheckStatusObj.redCount,
								hcYellowCount: healthCheckStatusObj.yellowCount,
								hcGreenCount: healthCheckStatusObj.greenCount,
								hcUpdateDateTime: this._getUpdatedTime(),
								amFaultCount: assetManagementStatusObj.redCount,
								amGreenCount: assetManagementStatusObj.greenCount,
								amUpdateDateTime: this._getUpdatedTime()}
							);
        }

	}

    _getUpdatedTime(){

        let updatedTime = new Date();
        updatedTime = new Date(updatedTime.getUTCFullYear(), updatedTime.getUTCMonth(), updatedTime.getUTCDate(), updatedTime.getUTCHours(),updatedTime.getUTCMinutes());
        updatedTime = updatedTime.toString().substring(0, 21);

        return updatedTime;
    }

    _handleAssetManagementMeterClicked(){

        this.setState({isHCTableDisplayed: false, isAMTableDisplayed: true, DisplayAMPass: false});
    }

		_handleAssetManagementMeterGreenSeriesClicked(){

        this.setState({isHCTableDisplayed: false, isAMTableDisplayed: true, DisplayAMPass: true});
    }

    _handleSeriesRedClick(){

        this.setState({isHCTableDisplayed: true, isAMTableDisplayed: false, DisplayHCPass: false, DisplayHCWarning: false});
    }

	_handleSeriesYellowClick(){

        this.setState({isHCTableDisplayed: true, isAMTableDisplayed: false, DisplayHCWarning: true, DisplayHCPass: false});
    }


		_handleSeriesGreenClick(){
	        this.setState({isHCTableDisplayed: true, isAMTableDisplayed: false, DisplayHCPass: true, DisplayHCWarning: false});
	    }

    _hideAppHealthMeter(){
        this.setState({isHCTableDisplayed: false});
    }


    _hideAssetManagementMeter(){
        this.setState({isAMTableDisplayed: false});
    }


  render() {
    let currentDashboard = null;
    let defaultDashboard =  null;
    let trStyle = {color: "#ffffff"};
	  let layer = (<ChartSidebar LayerOpen={this.state.LayerOpen}
    onClose={() => this.setState({LayerOpen: false})} />);

    if (this.props.currentDashboard !== '') {
      for (let i = 0; i < this.props.dashboards.length; i++) {
        if (this.props.dashboards[i].name === this.props.currentDashboard) {
            currentDashboard = this.props.dashboards[i];
          break;
        }
      }
    }
	else if (this.props.defaultDashboard !== '') {
      for (let i = 0; i < this.props.dashboards.length; i++) {
        if (this.props.dashboards[i].name === this.props.defaultDashboard) {
			       defaultDashboard = this.props.dashboards[i];
          break;
        }
      }
    }

		console.log("curr dash" + JSON.stringify(currentDashboard));

    let placeholderForTip3 = ("tip3Target");


    if (currentDashboard === null && defaultDashboard === null) {
      return (
        <Section colorIndex="grey-2" pad="small" full="vertical" flex={true} style={headerStyle}>
        <Box align="center" pad={{horizontal: "large"}} direction="row" justify="center" fill={true}>
          <Header style={{color: "grey"}} pad={{horizontal: "large"}}>
            <Heading align="center" tag="h1">Welcome to Data Driven Operations</Heading>
          </Header>
         </Box>
         <Box align="center" pad={{horizontal: "large"}} direction="row" justify="center" fill={true}>
          <Header style={{color: "grey"}} pad={{horizontal: "large"}}>
            <Heading align="center" tag="h2">Please select a dashboard under the Profile icon..</Heading>
          </Header>
         </Box>
         <Box align="center" pad={{horizontal: "large"}} direction="row" justify="center" fill={true}>
          <Header style={{color: "grey"}} pad={{horizontal: "large"}}>
            <div> <InfoIcon size="huge"/></div>
          </Header>
         </Box>
        </Section>
      );
    }
    else if(currentDashboard !== null) {
			if(currentDashboard.name === "Functional View: Daily Ops Review"){
				return (
					<Box>
					<Section colorIndex="grey-2" pad="small" full="vertical" flex={true} style={headerStyle}>
						<Box align="center" pad={{horizontal: "large"}} direction="row" justify="center" fill={true}> </Box>
						<DailyOpsCharts />
					</Section>
				</Box>
				);
			}
			else{
	      return (
	        <Section pad="small" full="vertical" flex={true} colorIndex="grey-2" style={headerStyle}>

	          <Header style={trStyle} justify="between" pad={{horizontal: "large"}}>
	            <Header style={trStyle}>
	              <Heading >{currentDashboard.name}</Heading>
	              <Paragraph size="large">{currentDashboard.description}</Paragraph>
	            </Header>
	            <Anchor style={trStyle} label="Edit Dashboard" id="Edit Dashboard"  primary={true} icon={<EditIcon  colorIndex={"light"}/>  } onClick={() => {this.setState({LayerOpen: true});}} />
	          </Header>

	          {layer}

			  <div id={placeholderForTip3}>
					<DefaultNotification onClick={this._handleAssetManagementMeterClicked} faultCount={this.state.amFaultCount} updatedTime={this.state.amUpdateDateTime} top="Asset Mgmt"/>
				  <DefaultNotification onClick={this._handleSeriesRedClick} faultCount={this.state.hcFaultCount} updatedTime={this.state.hcUpdateDateTime} top="Health Check"/>
			  </div>
	    	  <Section pad={{horizontal: "large"}} flex={true} colorIndex="grey-2">
	                <Box justify="start" align="center" wrap={true} pad="medium" margin="small" colorIndex="grey-2">
	          				<Box primary={true} flex={true} direction="row">
	          					<Box colorIndex="grey-2" align="center" pad={{horizontal: "large"}}>
												<ApplicationHealthMeter  faultCount={this.state.hcFaultCount} yellowCount={this.state.hcYellowCount} greenCount={this.state.hcGreenCount} SeriesRedClick={this._handleSeriesRedClick} SeriesYellowClick={this._handleSeriesYellowClick} SeriesGreenClick={this._handleSeriesGreenClick} />
	          					</Box>
	          					<Box align="center" pad={{horizontal: "large"}} />
	          					<Box align="center" pad={{horizontal: "large"}} />
	          					<Box align="center" pad={{horizontal: "large"}}>
												<AssetManagementMeter faultCount={this.state.amFaultCount} greenCount={this.state.amGreenCount} onClick={this._handleAssetManagementMeterClicked} onAppManagementGreenSeriesClick={this._handleAssetManagementMeterGreenSeriesClicked} />
	          					</Box>
	          				</Box>
	                </Box>
	          			<Section pad={{horizontal: "large"}} flex={true} colorIndex="lighter" />
									  <ChartHealthTable onClose={this._hideAppHealthMeter} isDisplayed={this.state.isHCTableDisplayed} isMaintenanceClicked={this.state.DisplayHCWarning} isPassClicked={this.state.DisplayHCPass}/>
				    				<ChartMgtTable onClose={this._hideAssetManagementMeter} isDisplayed={this.state.isAMTableDisplayed} isPassClicked={this.state.DisplayAMPass}/>
	            		</Section>
			      			{
			      				currentDashboard.KPIs.map(d => (<ChartArea KPI={d} key={d.name} />))
			      			}
	        </Section>
	      );
				}
    }else if(defaultDashboard !== null) {

      return (

        <Section colorIndex="grey-2" full="vertical" flex={true} style={headerStyle}>
    			<Header justify="between" pad={{horizontal: "large"}} >
    				<Header style={trStyle}>
    					<Heading>{defaultDashboard.name}</Heading>
    					<Paragraph size="large">{defaultDashboard.description}</Paragraph>
    				</Header>
    				<Anchor style={trStyle} label="Edit Dashboard" id="Edit Dashboard" primary={true} icon={<EditIcon style={trStyle} />} onClick={() => {this.setState({LayerOpen: true}); this.props.setCurrentDashboard(defaultDashboard.name);}} />
    			</Header>
    			{layer}
				<div id={placeholderForTip3}>
					<DefaultNotification onClick={this._handleAssetManagementMeterClicked} faultCount={this.state.amFaultCount} updatedTime={this.state.amUpdateDateTime} top="Asset Mgmt"/>
					<DefaultNotification onClick={this._handleSeriesRedClick} faultCount={this.state.hcFaultCount} updatedTime={this.state.hcUpdateDateTime} top="Health Check"/>
				</div>
    			<Section pad={{horizontal: "large"}} flex={true} colorIndex="lighter">
    				<Box justify="start" align="center" wrap={true} pad="medium" margin="small" colorIndex="lighter">
    					<Box primary={true} flex={true} direction="row">
    						<Box align="center" pad={{horizontal: "large"}}>
									<ApplicationHealthMeter  faultCount={this.state.hcFaultCount} yellowCount={this.state.hcYellowCount} greenCount={this.state.hcGreenCount} SeriesRedClick={this._handleSeriesRedClick} SeriesYellowClick={this._handleSeriesYellowClick} SeriesGreenClick={this._handleSeriesGreenClick} />
    						</Box>
    						<Box align="center" pad={{horizontal: "large"}} />
    						<Box align="center" pad={{horizontal: "large"}}>
									<AssetManagementMeter faultCount={this.state.amFaultCount} greenCount={this.state.amGreenCount} onClick={this._handleAssetManagementMeterClicked} onAppManagementGreenSeriesClick={this._handleAssetManagementMeterGreenSeriesClicked}/>
    						</Box>
    					</Box>
    				</Box>
    				<Section pad={{horizontal: "large"}} flex={true} colorIndex="lighter">
    					<ChartHealthTable onClose={this._hideAppHealthMeter} isDisplayed={this.state.isHCTableDisplayed} isMaintenanceClicked={this.state.DisplayHCWarning}  isPassClicked={this.state.DisplayHCPass} />
    					<ChartMgtTable onClose={this._hideAssetManagementMeter} isDisplayed={this.state.isAMTableDisplayed} isPassClicked={this.state.DisplayAMPass}/>
    				</Section>
    			</Section>
      		{
			       defaultDashboard.KPIs.map(d => (<ChartArea KPI={d} key={d.name} />))
		      }
        </Section>
      );
    }

  }
}

Main.propTypes = {
  dashboards:          React.PropTypes.array.isRequired,
  currentDashboard:    React.PropTypes.string.isRequired,
  defaultDashboard:    React.PropTypes.string.isRequired,
  updateHealthCheckStatus : React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
  ]),
  updateAssetManagementStatus : React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
  ]),
  setCurrentDashboard: React.PropTypes.func.isRequired
};

const mapStatetoProps = ({ currentDashboard, defaultDashboard,  dashboards, updateHealthCheckStatus, updateAssetManagementStatus}) => ({ currentDashboard, defaultDashboard, dashboards, updateHealthCheckStatus, updateAssetManagementStatus });
export default connect(mapStatetoProps,{setCurrentDashboard})(Main);
