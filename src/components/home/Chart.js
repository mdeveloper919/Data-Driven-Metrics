import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteDashboardFilter } from '../../actions';

import Spinning from 'grommet/components/icons/Spinning';
import Heading from 'grommet/components/Heading';
import drawing from '../chartLib/';
import Box from 'grommet/components/Box';
import LastDataUpdate from './LastDataUpdate';


//const baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4001/";
const baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";

class Chart extends Component {
	constructor (props) {
		super(props);
		this.state =
		{
			data: [],
			loading: true
		};
	}


	componentDidMount () {

        let currDashboard,defDashboard,dashboardsArray,dashboardObjCurrent,dashboardObjDefault;

        currDashboard = this.props.currentDashboard;
        defDashboard = this.props.defaultDashboard;

        dashboardsArray = this.props.dashboards;
        dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
        dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });


		let epridArray = [];
		if(dashboardObjCurrent[0] !== undefined){
			console.log("curr dash filter attmp");
			for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++){
				epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
            }
        }else if(dashboardObjDefault){
			for (let i = 0; i < dashboardObjDefault[0].filter.length; i++){
				epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
            }
        }

		console.log("## LIST OF SELECT EPRID's when component mounts initially ## " + epridArray);
		this.setState({ loading: true });


		let level1         = this.props.blockName.replace(/[^a-zA-Z\d\s]/g, '').replace(/\s+/g, '');
		let level2         = this.props.subcatName.replace(/[^a-zA-Z\d\s]/g, '').replace(/\s+/g, '_');
		let url            =  baseUrlPro + `${level1}/${level2}/`;

    let {blockName, subcatName} = this.props;
		// special case for Incidents
    if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Month (All)')
      url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Month/?filter=All';
    else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Month (COE)')
      url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Month/?filter=COE_Owned';
    /*else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Day (All)')
      url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Day?filter=All';*/
    else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Day (COE)')
      url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Day?filter=COE_Owned';
	else if (blockName === 'Incidents' && subcatName === 'Release Server Trend')
      url = baseUrlPro + 'ReleaseServerStatus/Release_Server_Trend';

	else if (blockName === 'Infrastructure' && subcatName === 'Mission Critical Assets Summary')
		url = baseUrlPro + 'Infrastructure/Critical_Summary?filter=All';
	else if (blockName === 'Infrastructure' && subcatName === 'Top 5 Impacted Assets')
		url = baseUrlPro + 'Infrastructure/Top5_Affected_Apps?filter=All';
	else if (blockName === 'Infrastructure' && subcatName === 'Impacted Server Counts by Month')
		url = baseUrlPro + 'Infrastructure/Monthly_Server_Infra_Status?filter=All';
	else if (blockName === 'Infrastructure' && subcatName === 'Impacted Assets Counts by Month')
		url = baseUrlPro + 'Infrastructure/Monthly_Asset_Infra_Status?filter=All';



	this.serverRequest=

	$.ajax({
		xhrFields: {
			withCredentials: true
			},
            url: url,
            type: "GET",
            data: { eprids : JSON.stringify(epridArray) },
			dataType: "json",
            success: function(data) {
				console.log(data);
				this.setState({data: data , loading: false});
				console.log('DashboardSidebar ajax success');
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
	}



	componentWillReceiveProps ({ blockName, subcatName, dashboards, currentDashboard, defaultDashboard }) {

        //see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        //Instead of accessing nextProps.dashboards, we are destructuring the nextProps to be accessed directly like var dashboards = dashboards.

        let currDashboard, defDashboard, dashboardsArray,dashboardObjCurrent,dashboardObjDefault;

        if(dashboards && currentDashboard || defaultDashboard)
        {

            currDashboard = currentDashboard;
            defDashboard = defaultDashboard;
            dashboardsArray = dashboards;
            dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
            dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });

            console.log("the nextprops dashboards are: " + JSON.stringify(dashboards));
            console.log("the nextprops current dash are: " + currentDashboard);
            console.log("the nextprops default dash are: " + defaultDashboard);

        }

		let epridArray = [];
		if(dashboardObjCurrent[0] !== undefined){
			for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++) {
				epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
			}
        }
        else if(dashboardObjDefault){
            for (let i = 0; i < dashboardObjDefault[0].filter.length; i++) {
				epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
            }
        }

		console.log("## LIST OF SELECT EPRID's when props update ## " + epridArray);

		this.setState({ loading: true});

		let level1 = blockName.replace(/[^a-zA-Z\d\s]/g, '').replace(/\s+/g, '');
		let level2 = subcatName.replace(/[^a-zA-Z\d\s\s]/g, '').replace(/\s+/g, '_');
		let url    =  baseUrlPro + `${level1}/${level2}/`;
		// special case for Incidents
		if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Month (All)')
		url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Month/?filter=All';
	else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Month (COE)')
		url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Month/?filter=COE_Owned';
	/*else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Day (All)')
		url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Day?filter=All';*/
	else if (blockName === 'Incidents' && subcatName === 'Ticket Reduction Goals by Day (COE)')
		url = baseUrlPro + 'Incidents/Ticket_Reduction_Goals_By_Day?filter=COE_Owned';
	else if (blockName === 'Incidents' && subcatName === 'Release Server Trend')
		url = baseUrlPro + 'ReleaseServerStatus/Release_Server_Trend';

		else if (blockName === 'Infrastructure' && subcatName === 'Mission Critical Assets Summary')
			url = baseUrlPro + 'Infrastructure/Critical_Summary?filter=All';
		else if (blockName === 'Infrastructure' && subcatName === 'Top 5 Impacted Assets')
			url = baseUrlPro + 'Infrastructure/Top5_Affected_Apps?filter=All';
		else if (blockName === 'Infrastructure' && subcatName === 'Impacted Server Counts by Month')
			url = baseUrlPro + 'Infrastructure/Monthly_Server_Infra_Status?filter=All';
		else if (blockName === 'Infrastructure' && subcatName === 'Impacted Assets Counts by Month')
			url = baseUrlPro + 'Infrastructure/Monthly_Asset_Infra_Status?filter=All';

		this.serverRequest=
		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            url: url,
            type: "GET",
            data: { eprids : JSON.stringify(epridArray) },
            dataType: "json",
            success: function(data) {
				console.log(data);
                this.setState({data:  data, loading: false});
				console.log('DashboardSidebar ajax success');
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
	}


    componentWillUnmount () {

        this.serverRequest.abort();
   }

	render() {
		console.log('Render of Chart');

		if (this.state.loading) {
			return <Spinning />;
		} else {
			if (this.state.data.length === 0) {
				return (<Heading>Nothing to Show</Heading>);
			} else {
				return (
					<Box colorIndex = "grey-2" full='false'>
						<Box  colorIndex = "grey-2" className={'why'} >
							<LastDataUpdate blockName={this.props.blockName} subcatName={this.props.subcatName} />
							{drawing(this.state.data)[this.props.blockName][this.props.subcatName]}
						</Box>
					</Box>
				);
			}
		}
	}
}


Chart.propTypes = {
  blockName: React.PropTypes.string.isRequired,
  subcatName: React.PropTypes.string.isRequired,
  currentDashboard: React.PropTypes.string.isRequired,
  dashboards : React.PropTypes.array.isRequired,
  defaultDashboard: React.PropTypes.string

};



const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard }) => ({ currentDashboard, dashboards, defaultDashboard });
export default connect(mapStatetoProps, { deleteDashboardFilter })(Chart);
