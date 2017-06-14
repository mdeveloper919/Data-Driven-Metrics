import React, { Component } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Scrollchor from 'react-scrollchor';
import Scroll from 'react-scroll';
import Spinning from 'grommet/components/icons/Spinning';
import Table from 'grommet/components/Table';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Title from 'grommet/components/Title';



//const baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4001/";
//const baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";

class ChartMgtTable extends Component {
	constructor (props) {
		super(props);
		this.state =
		{
			AssetManagementData: [],
			MIData: [],
			IMData: [],
			PMData: [],
			RFCData: [],
			SelectedIM: [],
			SelectedMI: [],
			SelectedPM: [],
			SelectedRFC: [],
			SelectedExp: [],
			EXPData: [],
			isOverallStatusDisplayed: true,
			isIMTableDisplayed: false,
			isMITableDisplayed: false,
			isPMTableDisplayed: false,
			isRFCTableDisplayed: false,
			isExpTableDisplayed: false,
			loading: true
        };


    this._AMTablePassedData = this._AMTablePassedData.bind(this);
		this._AMTableData = this._AMTableData.bind(this);
    this._CloseAssetSlected = this._CloseAssetSlected.bind(this);
		this._onAssetSelected = this._onAssetSelected.bind(this);
		this._MIDrilldownTable = this._MIDrilldownTable.bind(this);
		this._IMDrilldownTable = this._IMDrilldownTable.bind(this);
		this._PMDrilldownTable = this._PMDrilldownTable.bind(this);
		this._RFCDrilldownTable = this._RFCDrilldownTable.bind(this);
		this._ExpSRPADrilldownTable = this._ExpSRPADrilldownTable.bind(this);
	}



	componentDidMount () {

    this.setState({ loading: true });

    		let currDashboard,defDashboard,dashboardsArray,dashboardObjCurrent,dashboardObjDefault;

        currDashboard = this.props.currentDashboard;
        defDashboard = this.props.defaultDashboard;

        dashboardsArray = this.props.dashboards;
        dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
        dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });


				let epridArray = [];
				if(dashboardObjCurrent[0] !== undefined)
        {
            console.log("curr dash filter attmp");
            for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++) {
            epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
            }
        }
        else if(dashboardObjDefault)
        {
            for (let i = 0; i < dashboardObjDefault[0].filter.length; i++) {
            epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
            }
        }

        this.setState({ loading: false });

		this.serverRequest=

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		//url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OverallStatus",
		type: "GET",
		data: { eprids : JSON.stringify(epridArray) },
		dataType: "json",
		success: function(data) {
			this.setState({ AssetManagementData: data, loading: false });
			//  console.log("First Ajax Call: "  + JSON.stringify(this.state.AssetManagementData));
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OpenMI",
		type: "GET",
		dataType: "json",
		success: function(data) {
			this.setState({ MIData: data, loading: false });
			// console.log("Second Ajax Call MIData : "  + JSON.stringify(this.state.MIData));
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OpenIM",
		type: "GET",
		dataType: "json",
		success: function(data) {
			this.setState({ IMData: data, loading: false });
			//  console.log("Third Ajax Call IMData : "  + JSON.stringify(this.state.IMData));
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OpenPM",
		type: "GET",
		dataType: "json",
		success: function(data) {
			this.setState({ PMData: data, loading: false });
			// console.log("Fourth Ajax Call PMData: "  + JSON.stringify(this.state.PMData));
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OpenRFC",
		type: "GET",
		dataType: "json",
		success: function(data) {
			this.setState({ RFCData: data, loading: false });
			//  console.log("Fifth Ajax Call RFCData: "  + JSON.stringify(this.state.RFCData));
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	$.ajax({
		xhrFields: {
			withCredentials: true
		},
		url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/ExpiringSRPA",
		type: "GET",
		dataType: "json",
		success: function(data) {
			this.setState({ EXPData: data, loading: false });
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
	});

	}


	componentWillReceiveProps ({ dashboards, currentDashboard, defaultDashboard }){

		this.setState({ loading: true });
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
		if(dashboardObjCurrent[0] !== undefined)
        {
            for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++) {
            epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
            }
        }
        else if(dashboardObjDefault)
        {
            for (let i = 0; i < dashboardObjDefault[0].filter.length; i++) {
            epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
            }
        }

		console.log("## LIST OF SELECT EPRID's when props update ## " + epridArray);

        this.setState({ loading: true});

        this.serverRequest.abort();

		this.serverRequest=

		$.ajax({
            xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OverallStatus",
            type: "GET",
            data: { eprids : JSON.stringify(epridArray) },
			dataType: "json",
            success: function(data) {
				this.setState({ AssetManagementData: data, loading: false });
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
	}

    _CloseAssetSlected () {


		this.setState({isOverallStatusDisplayed: true});
		this.setState({isMITableDisplayed: false});
		this.setState({isIMTableDisplayed: false});
		this.setState({isPMTableDisplayed: false});
		this.setState({isRFCTableDisplayed: false});
		this.setState({isExpTableDisplayed: false});
        console.log("_CloseAssetSlected");
        this.props.onClose();
		Scroll.animateScroll.scrollToTop();
		console.log(" ## All Tables Closed ## ");

	}

	_onAssetSelected() {
		if(this.state.isOverallStatusDisplayed === false){
			this.setState({isOverallStatusDisplayed: true});
			this.setState({isMITableDisplayed: false});
			this.setState({isIMTableDisplayed: false});
			this.setState({isPMTableDisplayed: false});
			this.setState({isRFCTableDisplayed: false});
			this.setState({isExpTableDisplayed: false});
		}

		console.log("OverallStatus is Set to: " + this.state.isOverallStatusDisplayed);

	}

    _MIDrilldownTable(EPRID){
		this.state.SelectedMI = this.state.MIData.filter(function (el){
			return (el.EPRID == EPRID);
		});

		if(this.state.SelectedMI.length > 0){
			this.setState({isOverallStatusDisplayed: false});
			this.setState({isMITableDisplayed: true});
		}

		console.log("Clicked EPRID "+ EPRID);
		console.log("Filtered Array based on MI selection: " + JSON.stringify(this.state.SelectedMI));
	}

	_IMDrilldownTable(EPRID) {
		this.state.SelectedIM = this.state.IMData.filter(function (el) {
			return (el.EPRID == EPRID);
		});

		if(this.state.SelectedIM.length > 0){
			this.setState({isOverallStatusDisplayed: false});
			this.setState({isIMTableDisplayed: true});
		}

		console.log("Filtered Array based on IM selection: " + JSON.stringify(this.state.SelectedIM));
    }

	_PMDrilldownTable(EPRID) {
		this.state.SelectedPM = this.state.PMData.filter(function (el) {
			return (el.EPRID == EPRID);
		});

		if(this.state.SelectedPM.length > 0){
			this.setState({isOverallStatusDisplayed: false});
			this.setState({isPMTableDisplayed: true});
		}

		console.log("Filtered Array based on PM selection: " + JSON.stringify(this.state.SelectedPM));
    }

	_RFCDrilldownTable(EPRID) {
		this.state.SelectedRFC = this.state.RFCData.filter(function (el) {
			return (el.EPRID == EPRID);
		});

		if(this.state.SelectedRFC.length > 0){
			this.setState({isOverallStatusDisplayed: false});
			this.setState({isRFCTableDisplayed: true});
		}

		console.log("Filtered Array based on RFC selection: " + JSON.stringify(this.state.SelectedRFC));
    }

	_ExpSRPADrilldownTable(EPRID){
		this.state.SelectedExp = this.state.EXPData.filter(function (el) {
			return (el.EPRID == EPRID);
		});

		console.log('"***TEST**** ' + JSON.stringify(this.state.SelectedExp));

		if(this.state.SelectedExp.length > 0){
			this.setState({isOverallStatusDisplayed: false});
			this.setState({isExpTableDisplayed: true});
		}
	}


	_AMTableData(rowObj){
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//need to convert obj passed to array to map style={trStyle}>
		return rowObj.map((tddd)=>{

			let new_mi = '';
			let new_im = '';
			let new_pm = '';
			let new_rfc = '';
			let new_srpa = '';

			if(tddd.expiringSRPA_count != 0 || tddd.mi_count != 0 || tddd.im_count != 0 || tddd.pm_count != 0 || tddd.rfc_count != 0)
 		  {
				if (tddd.expiringSRPA_count > 0){
					new_srpa = <td  style={trStyle} onClick={(e) => this._ExpSRPADrilldownTable(tddd.eprid, e)}> {tddd.expiringSRPA_count} </td>
				}else
					new_srpa = <td onClick={(e) => this._ExpSRPADrilldownTable(tddd.eprid, e)}> {tddd.expiringSRPA_count} </td>

				if (tddd.mi_count > 0){
					new_mi = <td  style={trStyle} onClick={(e) => this._MIDrilldownTable(tddd.eprid, e)}> {tddd.mi_count} </td>
				}else
					new_mi = <td  onClick={(e) => this._MIDrilldownTable(tddd.eprid, e)}> {tddd.mi_count} </td>

				if (tddd.im_count > 0){
					new_im = <td  style={trStyle} onClick={(e) => this._IMDrilldownTable(tddd.eprid, e)}> {tddd.im_count} </td>
				}else
					new_im = <td onClick={(e) => this._IMDrilldownTable(tddd.eprid, e)}> {tddd.im_count} </td>

				if (tddd.pm_count > 0){
					new_pm = <td  style={trStyle} onClick={(e) => this._PMDrilldownTable(tddd.eprid, e)}> {tddd.pm_count} </td>
				}else
					new_pm = <td onClick={(e) => this._PMDrilldownTable(tddd.eprid, e)}> {tddd.pm_count} </td>

				if (tddd.rfc_count > 0){
					new_rfc = <td  style={trStyle} onClick={(e) => this._RFCDrilldownTable(tddd.eprid, e)}> {tddd.rfc_count} </td>
				}else
					new_rfc = <td onClick={(e) => this._RFCDrilldownTable(tddd.eprid, e)}> {tddd.rfc_count} </td>

					return (
					<TableRow key={tddd.eprid}>
						<td> {tddd.eprid} </td>
						<td> {tddd.Asset_Name} </td>
						{new_srpa}
						{new_mi}
						{new_im}
						{new_pm}
						{new_rfc}
					</TableRow>
					)

			}
			else{
				return (null)
			}

		});


	}



	_AMTablePassedData(rowObj){
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//need to convert obj passed to array to map style={trStyle}>
		return rowObj.map((tddd)=>{

			//If the asset has passed AM checks
			if(tddd.expiringSRPA_count == 0 && tddd.mi_count == 0 && tddd.im_count == 0 && tddd.pm_count == 0 && tddd.rfc_count == 0)
			{
					return (
					<TableRow key={tddd.eprid}>
					  <td> {tddd.eprid} </td>
						<td> {tddd.Asset_Name} </td>
						<td> {tddd.expiringSRPA_count} </td>
						<td> {tddd.mi_count} </td>
						<td> {tddd.im_count} </td>
						<td> {tddd.pm_count} </td>
						<td> {tddd.rfc_count} </td>
					</TableRow>
					)
			}
		});
	}



    componentWillUnmount () {
    //this.serverRequest.abort();
   }

	render() {
		console.log("Render of ChartMgtTable");
		console.log("Values of AssetManagementData Array " + JSON.stringify(this.state.AssetManagementData));
		let that = this;

		let placeholderForTip7 = ("tip7Target");


		if (this.state.loading) {
			return <Spinning />;
		} else {
			if (this.state.AssetManagementData.length === 0) {
				return (<Heading>Nothing to Show</Heading>);
			} else {
				return (
				this.props.isDisplayed
				?
					<div>
							{
							this.state.isOverallStatusDisplayed
								?
								<div style={{"color": "white"}}>
								<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
											<Title id={placeholderForTip7}>
												Asset Management
											</Title>
										</Header>
											<Anchor  icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
										</Header>
									<br />


									<Table selectable={true} >
										<TableHeader labels={["EPRID", "Application Name", "Expiring Account (SRPA)", "Open MI", "Open IM", "Open PM", "Open RFC"]} />
											{
												this.state.AssetManagementData.map(function (app, index) {
                        if(that.props.isPassClicked === true){
                            return (
															<tbody>
																{that._AMTablePassedData(app)}
															</tbody>
															);
                        }
												else{
													return (
														<tbody>
															{that._AMTableData(app)}
														</tbody>
														);
												}
												})
											}
									</Table>
								</div>
								:  null
							}

							{
							this.state.isIMTableDisplayed
								? //2nd Level IM Drill down
								<div style={{"color": "white"}}>
									<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
										<Title  id={placeholderForTip7} onClick={() => that._onAssetSelected()}>
											Asset Management
										</Title>
										<Title>
											> Open IM Tickets
										</Title>
										</Header>
											<Anchor icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
										</Header>
									<br />
									<Table selectable={true} >
										<TableHeader labels={["EPRID", "Application Name", "Incident Identifier", "Current Assigned Group", "Status", "Title"]} />
										<tbody>
											{
												this.state.SelectedIM.map(function (asset) {
													return (
														<TableRow key={asset.Incident_Identifier}>
															<td> {asset.EPRID} </td>
															<td> {asset.Asset_Name} </td>
															<td> {asset.Incident_Identifier} </td>
															<td> {asset.Incident_Current_Assignment_Group_Name} </td>
															<td> {asset.Incident_Current_Status_Description} </td>
															<td> {asset.Incident_Title} </td>
														</TableRow>
													);
												})
											}
										</tbody>
									</Table>
								</div>
								:  null
							}

							{
							this.state.isMITableDisplayed
								? //2nd Level MI Drill down
								<div style={{"color": "white"}}>
									<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
										<Title  id={placeholderForTip7} onClick={() => that._onAssetSelected()}>
											Asset Management
										</Title>
										<Title>
											> Open MI Tickets
										</Title>
										</Header>
											<Anchor icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
									</Header>
									<br />
									<Table selectable={true} >
										<TableHeader labels={["EPRID", "Application Name", "Major Escalation Identifier", "Current Assigned Group", "Status", "Title", "Start Date"]} />
										<tbody>
											{
												this.state.SelectedMI.map(function (asset) {
													return (
														<TableRow key={asset.Application_Major_Incident_Identifier}>
															<td> {asset.EPRID} </td>
															<td> {asset.Asset_Name} </td>
															<td> {asset.Application_Major_Incident_Identifier} </td>
															<td> {asset.Application_Affected_Configuration_Item} </td>
															<td> {asset.Application_Major_Incident_Status_Name} </td>
															<td> {asset.Application_Major_Incident_Title_Text} </td>
															<td> {asset.Application_Major_Incident_Event_Start_Date} </td>
														</TableRow>
													);
												})
											}
										</tbody>
									</Table>
								</div>
								:  null
							}

							{
							this.state.isPMTableDisplayed
								? //2nd Level PM Drill down
								<div style={{"color": "white"}}>
									<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
										<Title  id={placeholderForTip7} onClick={() => that._onAssetSelected()}>
											Asset Management
										</Title>
										<Title>
											> Open PM Tickets
										</Title>
										</Header>
											<Anchor icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
									</Header>
									<br />
									<Table selectable={true} >
										<TableHeader labels={["Problem Identifier", "Application Name","PM Phase Description", "PM Short Description", "Problem Owner Assigned Group", "Problem Owner","Problem Root Cause Assignment Group", "Problem Root Cause Owner", "Predicted Biz Impact Scale", "Aged Days", "PM Update Date"]} />
										<tbody>
											{
												this.state.SelectedPM.map(function (asset) {
													return (
														<TableRow key={asset.PM_Identifier}>
															<td> {asset.PM_Identifier} </td>
															<td> {asset.Asset_Name} </td>
															<td> {asset.PM_Phase_Description} </td>
															<td> {asset.PM_Short_Description} </td>
															<td> {asset.PM_Owner_Assignment_Group_Name} </td>
															<td> {asset.PM_Owner_Full_Name} </td>
															<td> {asset.Root_Cause_Owner_Assignment_Group_Name} </td>
															<td> {asset.Root_Cause_Owner_Full_Name} </td>
															<td> {asset.Problem_Predicted_Business_Impact_Scale} </td>
															<td> {asset["Problem_Aged_Duration_(sum_days)"]} </td>
															<td> {asset.Problem_Update_Date} </td>
														</TableRow>
													);
												})
											}
										</tbody>
									</Table>
								</div>
								:  null
							}

							{
								this.state.isRFCTableDisplayed
								? //2nd Level RFC Drill down
								<div style={{"color": "white"}}>
									<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
										<Title  id={placeholderForTip7} onClick={() => that._onAssetSelected()}>
											Asset Management
										</Title>
										<Title>
											> Open RFC Tickets
										</Title>
										</Header>
											<Anchor icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
									</Header>
									<br />
									<Table selectable={true} >
										<TableHeader labels={["EPRID", "Application Name","RFC ID", "RFC Phase", "RFC Category", "RFC Description", "Planned Implementation Start", "Planned Implementation End", "RFC Requestor"]} />
										<tbody>
											{
												this.state.SelectedRFC.map(function (asset) {
													return (
														<TableRow key={asset.RFC_Identifier}>
															<td> {asset.EPRID} </td>
															<td> {asset.Asset_Name} </td>
															<td> {asset.RFC_Identifier} </td>
															<td> {asset.RFC_Phase_Description} </td>
															<td> {asset.RFC_Category} </td>
															<td> {asset.RFC_Description_Text} </td>
															<td> {asset.RFC_Planned_Implementation_Start_Date.substr(0,10)} </td>
															<td> {asset.RFC_Planned_Implementation_End_Date.substr(0,10)} </td>
															<td> {asset.RFC_Requestor_Email_Address_Name} </td>
														</TableRow>
													);
												})
											}
										</tbody>
									</Table>
								</div>
								:  null
							}

							{
							this.state.isExpTableDisplayed
								?
								<div style={{"color": "white"}}>
								<Header  justify="between" pad={{horizontal: "large"}} size="xlarge">
										<Header>
										<Title  id={placeholderForTip7} onClick={() => that._onAssetSelected()}>
											Asset Management
										</Title>
										<Title>
											> Expiring Account (SRPA)
										</Title>
										</Header>
											<Anchor icon={<CloseIcon size="small"/>} onClick={() => that._CloseAssetSlected()}/>
									</Header>
									<br />
									<Table selectable={true} >
										<TableHeader labels={["EPRID", "Application Name","SRPA ID", "Service Account", "Days till Expire", "Expire Date","Server Name", "Requestor"]} />
										<tbody>
											{
												this.state.SelectedExp.map(function (Exp, index) {
													return (
														<TableRow key={index}>
															<td> {Exp.EPRID} </td>
															<td> {Exp.Application_Name} </td>
															<td> {Exp.SRPA_ID} </td>
															<td> {Exp.Service_Account} </td>
															<td> {Exp.Days_to_Expire} </td>
															<td> {Exp.Expires.substr(0,10)} </td>
															<td> {Exp.Server_Name} </td>
															<td> {Exp.Requestor} </td>
														</TableRow>
													);
												})
											}
										</tbody>
									</Table>
								</div>
								:  null
							}
					</div >
					: null
				);
			}
		}
	}
}



ChartMgtTable.propTypes = {

  currentDashboard: React.PropTypes.string.isRequired,
  dashboards : React.PropTypes.array.isRequired,
  defaultDashboard: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  displayAssetManagementTable : React.PropTypes.bool


};


const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard}) => ({ currentDashboard, dashboards, defaultDashboard });
export default connect(mapStatetoProps)(ChartMgtTable);
