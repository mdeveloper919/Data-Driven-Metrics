import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteDashboardFilter } from '../../actions';
import Anchor from 'grommet/components/Anchor';
import CheckBox from 'grommet/components/CheckBox';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';
import Status from 'grommet/components/icons/Status';
import Table from 'grommet/components/Table';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Title from 'grommet/components/Title';
import Scrollchor from 'react-scrollchor';
import Scroll from 'react-scroll';
import Button  from 'grommet/components/Button';
import Box  from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import EditIcon from 'grommet/components/icons/base/Edit';
import URLModule from './URLModule';
import ServerModule from '../home/ServerModule';
import PingModule from '../home/PingModule';
import DBModule from '../home/DBModule';
import Layer from 'grommet/components/Layer';





import ApplicationHealthCheckLineChart from '../chartlib/ApplicationHealthCheckLineChart';


//var baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4001/";
//var baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";

class ChartHealthTable extends Component {
	constructor (props) {
		super(props);
		this.state =
		{
			healthCheckData: [],
			InfrastructureData: [],
			ScheduleURL: [],
			SchedulePing: [],
			ScheduleDatabase: [],
			ScheduleServer:[],

			data : [],
			ApplicationData: [],
			SelectedRow: [],
			SelectedInfra: [],
			SelectedApp: [],
			isLvlOneTableDisplayed: true,
			isLvlTwoTableDisplayed: false,
			isLvlThreeTableDisplayed: false,
			isappHealthDisplayed: false,
			isappModuleDisplayed: false,

			urlDisplayed: false,
			pingDisplayed: false,
			dbDisplayed: false,
			serverDisplayed: false,


			loading: true,
            memLineChartEPRID: 0,

			PingStat:'',
			PingUpdateTime:'',
			PingFailCount: 0,

			DBStat:'',
			DBUpdateTime:'',
			DBFailCount: 0,

			ServerStat:'',
			ServerUpdateTime:'',
			ServerFailCount: 0,

			urlHTML: [],
			URLStat:'',
			URLUpdateTime:'',
			URLFailCount: 0,

			urlHTML: [],
			pingHTML: [],
			dbHTML: [],
			serverHTML: [],

			URLPres: false,
			PingPres: false,
			DBPres: false,
			ServerPres: false,
			dataPres: false,
			newText: '',
			setComment: '',
			JobID:'',
			buttonPressed : false,
			test: [],
			openLayer:false,

			EPRID: 0



        };

		this._HCTableYellowFun = this._HCTableYellowFun.bind(this);
			this._HCTableRedFun = this._HCTableRedFun.bind(this);
			this._InfaTableDate = this._InfaTableDate.bind(this);
			this._ApplTableDate = this._ApplTableDate.bind(this);
			this._CloseAppSlected = this._CloseAppSlected.bind(this);
			this._onAppSelected = this._onAppSelected.bind(this);
			this._onAppSelected2 = this._onAppSelected2.bind(this);
			this._onLatestAppUpdate = this._onLatestAppUpdate.bind(this);
			this._levelthreedisplayed = this._levelthreedisplayed.bind(this);
			this._appHealthDisplayed = this._appHealthDisplayed.bind(this);
			this._appModuleDisplayed = this._appModuleDisplayed.bind(this);
			this._sendLimitApproval = this._sendLimitApproval.bind(this);
			this._URLData = this._URLData.bind(this);
			this._PingData = this._PingData.bind(this);
			this._URLClicked = this._URLClicked.bind(this);
			this._PingClicked = this._PingClicked.bind(this);
			this._DBData = this._DBData.bind(this);
			this._DBClicked = this._DBClicked.bind(this);
			this._ServerData = this._ServerData.bind(this);
			this._ServerClicked = this._ServerClicked.bind(this);
			this._SubmitComment = this._SubmitComment.bind(this);
			this._DataPresent = this._DataPresent.bind(this);
			this._returnModule = this._returnModule.bind(this);

			this._onOpenLayer = this._onOpenLayer.bind(this);
			this._onCloseLayer = this._onCloseLayer.bind(this);


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


		this.serverRequest=
		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/OpsHealthCheck/HC_Status",
            type: "GET",
            data: { eprids : JSON.stringify(epridArray)},
			dataType: "json",
            success: function(data){
				this.setState({ healthCheckData: data, loading: false });
				console.log("First Ajax Call: "  + JSON.stringify(this.state.healthCheckData));
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
              }.bind(this)
            });

		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/OpsHealthCheck/GetOpsA_PenaltyScore",
            type: "GET",
			dataType: "json",
            success: function(data) {
			console.info("InfrastructureData");

				this.setState({ InfrastructureData: data, loading: false });
				//console.log("Second Ajax Call: "  + JSON.stringify(this.state.InfrastructureData));
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });


		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_ScheduleURL_Result",
            type: "GET",
			dataType: "json",
            success: function(data) {
				this.ScheduleURL = data;
				//this._URLData(data);
				console.info("URL data***************************************************************************************************** " + this.ScheduleURL);

				//console.log("Second Ajax Call: "  + JSON.stringify(this.state.InfrastructureData));
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });


		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_SchedulePing_Result",
            type: "GET",
			dataType: "json",
            success: function(data) {
				console.info("Ping data***************************************************************************************************** ");
				this.SchedulePing = data;
			//	this._PingData(this.SchedulePing);
				console.info("Ping data***************************************************************************************************** " + this.SchedulePing);
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_ScheduleDatabase_Result",
            type: "GET",
			dataType: "json",
            success: function(data) {
				this.ScheduleDatabase =  data;
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });


		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_ScheduleServer_Result",
            type: "GET",
			dataType: "json",
            success: function(data) {
				this.ScheduleServer = data;
		  }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		$.ajax({
			xhrFields: {
				withCredentials: true
            },
			url: "https://c9w24829.itcs.hpecorp.net/DDM/OpsHealthCheck/HC_Status",
            type: "GET",
			dataType: "json",
            success: function(data) {
				this.setState({ ApplicationData: data, loading: false });
		 }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });


		}


	componentWillReceiveProps ({ dashboards, currentDashboard, defaultDashboard }) {

        let currDashboard, defDashboard, dashboardsArray,dashboardObjCurrent,dashboardObjDefault;


        if(dashboards && currentDashboard || defaultDashboard)
        {

            currDashboard = currentDashboard;
            defDashboard = defaultDashboard;
            dashboardsArray = dashboards;
            dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
            dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });

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

        this.serverRequest.abort();

		this.serverRequest=

		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/OpsHealthCheck/HC_Status",
            type: "GET",
            data: { eprids : JSON.stringify(epridArray) },
			dataType: "json",
            success: function(data) {
				this.setState({ healthCheckData: data, loading: false });
				console.log("Second Ajax Call: "  + JSON.stringify(this.state.healthCheckData));
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });


		/*$.ajax({
			xhrFields: {
				withCredentials: true
            },
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_SchedulePing",
            type: "GET",
			dataType: "json",
            success: function(data) {
			//	console.info("Ping data***************************************************************************************************** ");
			//	this.setState({ SchedulePing: data, loading: false });
				this._PingData(data);
				console.info("Ping data***************************************************************************************************** " + data);
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });*/

		$.ajax({
			xhrFields: {
				withCredentials: true
            },
            //url: "http://localhost:4001/DDM/OpsHealthCheck/HC_Status",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/HealthCheckAutomation/Select_ScheduleURL",
            type: "GET",
			dataType: "json",
            success: function(data) {
				this.setState({ ScheduleURL: data, loading: false });
			//	this._URLData(data);
			console.log("URL data***************************************************************************************************** " + this.ScheduleURL);

				//console.log("Second Ajax Call: "  + JSON.stringify(this.state.InfrastructureData));
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		}

    _CloseAppSlected () {

			this.setState({isLvlOneTableDisplayed: true});
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed: false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = false;
			this.serverDisplayed = false;

            console.log("_CloseAppSlected");
            this.props.onClose();
			Scroll.animateScroll.scrollToTop();
		}

	_onAppSelected() {
		if(this.state.isLvlOneTableDisplayed === false){
			this.setState({isLvlOneTableDisplayed: true});
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed: false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = false;
			this.serverDisplayed = false;



		}
		console.log("Level One Table is Set to: " + this.state.isLvlOneTableDisplayed);
		}

    _onLatestAppUpdate() {

		if(this.state.isLvlTwoTableDisplayed === false){
			this.setState({isLvlOneTableDisplayed: false});
			this.setState({isLvlTwoTableDisplayed: true});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed: false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = false;
			this.serverDisplayed = false;

		}
		console.log("Level two Table is Set to: " + this.state.isLvlTwoTableDisplayed);
		}

	_onAppSelected2(EPRID) {
		if(this.state.isLvlOneTableDisplayed === true){
			this.setState({isLvlOneTableDisplayed: false});
			this.setState({isLvlTwoTableDisplayed: true});
			//console.log("Is level one showing " + this.state.isLvlOneTableDisplayed);
			//console.log("Is level two showing: " + this.state.isLvlTwoTableDisplayed);

			this.state.memLineChartEPRID = this.state.healthCheckData.filter(function (el){
				return (el.EPRID === EPRID);
			});

			this.state.SelectedRow = this.state.healthCheckData.filter(function (el) {
				return (el.EPRID === EPRID);
			});

			console.log("Filtered Array based on selection: " + JSON.stringify(this.state.SelectedRow));
		}

	}

	_levelthreedisplayed(EPRID){

		if((this.state.isLvlThreeTableDisplayed === false)){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: true});
			this.setState({isappHealthDisplayed : false});
				this.setState({isappModuleDisplayed : false});
				this.urlDisplayed = false;
				this.pingDisplayed = false;
				this.dbDisplayed = false;
				this.serverDisplayed = false;

		this.state.SelectedInfra = this.state.InfrastructureData.filter(function (el) {
			return (el.EPRID === EPRID);
			});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("## Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedInfra));

		}
		}

	_appHealthDisplayed(EPRID){

		if((this.state.isappHealthDisplayed === false)||(this.state.isLvlTwoTableDisplayed === true)|| (this.state.isLvlThreeTableDisplayed === true)){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed : true});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = false;
			this.serverDisplayed = false;


		this.state.SelectedApp = this.state.ApplicationData.filter(function (el) {
			return (el.EPRID === EPRID);
			console.log("_appHealthDisplayed EPRID " + el.EPRID );
			});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("+++++++++## _appHealthDisplayed Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedApp));

		}
		}

	_appModuleDisplayed(EPRID){

		if(this.urlDisplayed === true){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed : false});
			this.setState({isappModuleDisplayed : false});
			this.pingDisplayed = false;
			this.urlDisplayed = true;
			this.dbDisplayed = false;
			this.serverDisplayed = false;

		this.state.SelectedApp = this.state.ApplicationData.filter(function (el) {
			return (el.EPRID === EPRID);
		});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("## Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedApp));

		}else if(this.pingDisplayed === true){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed : false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = true;
			this.dbDisplayed = false;
			this.serverDisplayed = false;

		this.state.SelectedApp = this.state.ApplicationData.filter(function (el) {
			return (el.EPRID === EPRID);
		});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("## Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedApp));

		}else if(this.dbDisplayed === true){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed : false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = true;
			this.serverDisplayed = false;

		this.state.SelectedApp = this.state.ApplicationData.filter(function (el) {
			return (el.EPRID === EPRID);
		});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("## Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedApp));

		}else if(this.serverDisplayed === true){
			this.setState({isLvlTwoTableDisplayed: false});
			this.setState({isLvlThreeTableDisplayed: false});
			this.setState({isappHealthDisplayed : false});
			this.setState({isappModuleDisplayed : false});
			this.urlDisplayed = false;
			this.pingDisplayed = false;
			this.dbDisplayed = false;
			this.serverDisplayed = true;

		this.state.SelectedApp = this.state.ApplicationData.filter(function (el) {
			return (el.EPRID === EPRID);
		});
		console.log("## Selected EPRID ##  : " + EPRID);
		console.log("## Filtered Array based on selection ##: " + JSON.stringify(this.state.SelectedApp));

		}
		}


	_sendLimitApproval(hostName, e){

			let date = new Date();
			let dateFormat = date.getUTCFullYear() + "/" + Number(date.getMonth() + 1) + "/" + date.getDate();
			let isChecked = e.target.checked;

            console.log("hostName" + hostName);
            console.log("isChecked" + isChecked);


				console.log("ServerJustification post...");

                this.serverRequest=

				$.ajax({
						xhrFields: {
							withCredentials: true
						},
						//url:"http://localhost:4001/DDM/OpsHealthCheck/ServerJustification",
						url:"https://c9w24829.itcs.hpecorp.net/DDM/OpsHealthCheck/ServerJustification",
						type: "POST",
                        datatype: 'json',
						contentType: 'application/x-www-form-urlencoded', //http://api.jquery.com/jquery.ajax/ - contentType: 'text/plain' during post to prevent CORS preflight check
						data: {"HostName":hostName,"Justification":isChecked,"Time":dateFormat},
						success: function(status){
							console.log("_sendLimitApproval: " + status);
						}.bind(this),
						error: function(xhr, status, err){
							console.error('#POST Error', status, err.toString());
						}.bind(this)
					});

			}

    _InfaTableDate(rowObj){
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//	console.log('!!!! Im Here !!!!' + JSON.stringify(rowObj));
			let new_cpu = '';
			let new_mem = '';
			let new_space = '';
			let new_swap = '';

			if (rowObj.cpu_util === 'Normal'){
				new_cpu = <td> <Status value={STATUS_COLOR[rowObj.cpu_util]}/> </td>;
			}else
				new_cpu = <td style={trStyle}> {rowObj.cpu_util} </td>;

			if (rowObj.mem_util === 'Normal'){
				new_mem = <td> <Status value={STATUS_COLOR[rowObj.mem_util]}/> </td>;
			}else
				new_mem = <td style={trStyle}> {rowObj.mem_util} </td>;

			if (rowObj.space_util === 'Normal'){
				new_space = <td> <Status value={STATUS_COLOR[rowObj.space_util]}/> </td>;
			}else
				new_space = <td style={trStyle}> {rowObj.space_util} </td>;

			if (rowObj.swap_util === 'Normal'){
				new_swap = <td> <Status value={STATUS_COLOR[rowObj.swap_util]}/> </td>;
			}else
				new_swap = <td style={trStyle}> {rowObj.swap_util} </td>;

			return (
				<TableRow key={rowObj.HostName}>
					<td> {this.state.SelectedRow[0].Asset} </td>
					<td> {rowObj.HostName} </td>
					<td> {rowObj.device_name} </td>
					{new_cpu}
					{new_mem}
					{new_space}
					{new_swap}
				</TableRow>
			);


		}

		/*<td> <CheckBox toggle={true} onChange={(e) => this._sendLimitApproval(rowObj.HostName, e)} /> </td>  user Acceptance button*/


	_DataPresent(rowObj){

		let URLPres = false;
		let PingPres = false;
		let DBPres = false;
		let ServerPres = false;

		this.URLPres = false;
		this.PingPres = false;
		this.DBPres = false;
		this.ServerPres = false;
		this.dataPres = false;

				this.ScheduleURL.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						URLPres = true;
					}});
					this.URLPres = URLPres;

				this.SchedulePing.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						PingPres = true;
					}});

					this.PingPres = PingPres;

				this.ScheduleDatabase.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						DBPres = true;
					}});

					this.DBPres = DBPres;

				this.ScheduleServer.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						ServerPres = true;
					}});

					this.ServerPres = ServerPres;

			if ((this.URLPres == true) ||(this.PingPres  == true)  ||(this.DBPres == true) ||(this.ServerPres == true )){
				 this.dataPres =  true;
				 console.log("$$$$$$$$$$$DATA PRESENT true " + this.dataPres)
			}else{
				this.dataPres = false;
			//	this.isappHealthDisplayed = false;
			//	this.isLvlThreeTableDisplayed =true;
				 console.log("$$$$$$$$$$$$$$DATA PRESENT false " + this.dataPres)

			}
		}

	_URLData(){
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
			var data = this.ScheduleURL;
			var EPRID = this.EPRID;
			var displayName = '';
			var returnDesc = '';
			var URL = '';
			var frequency = '';

			var modName = '';
			var stat = '';
			var updateTime = '';

			var failCount = 0;
			var failStat = '';
			var total = 0;
			var _this = this;

			var urlHTML =[];
			this.urlHTML = [];

			data.map(function (x) {
				if (x.EPRID == EPRID)
					{
						if(JSON.stringify(x.Status) == "false" )
					{
						//console.log("FAIL Status " + JSON.stringify(x.Status));
						failCount = failCount + 1;

						//	console.log("failCount " + failCount);
					}else{
						//	console.log("PASS Status " + JSON.stringify(x.Status));
					}
					total = total +1;

					console.info("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%^^^^^^^^^^^^^^^^^^^^ " + JSON.stringify(x));

					if (x.Status == "false"){
						stat = "Fail";
					}else{
						stat = "Pass";
					}

					updateTime = x.Timestamp.replace('T','	').replace('Z','');
					urlHTML.push({"AppName": x.AppName, "JobId": x.JobID, "Status": stat,
					"lastUpdate": x.Timestamp.replace('T','	').replace('Z',''),  "displayName": x.DispName,
					 "URL": x.URLAdd, "returnDesc": x.Description, "frequency": x.SchedulingTime });


			}
				return(
					urlHTML
				)
					});
					if (failCount >0){
						failStat = 'Fail';
					}else{
						failStat ='Pass';
					}

				console.log("failStat " + failStat);
				this.URLFailCount = failCount;
				this.URLStat = failStat;
				this.URLUpdateTime = updateTime;
				this.urlHTML = urlHTML;

					console.log('URLFailCount ' + this.URLFailCount);

				console.log("####################33 " + urlHTML[0].AppName);
				console.log("####################33 " + this.urlHTML[0].AppName);
				console.log('total ' + total);
				return (



			<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => this._onLatestAppUpdate()}>
										> Latest App Update
									</Title>
									<Title onClick={() => this._appHealthDisplayed(EPRID)}>
										> Application Automation > URL

									</Title>
                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Module Name", "Status", "Display Name", "URL","Last Update", "Return Description", "Frequency (min)"]} />

										<tbody>
											{}
											{this.urlHTML.map(function (x, index) {


												return(
											<TableRow
				  //onClick={(e) => this._appModuleDisplayed(this.state.SelectedRow[0].EPRID, e)} key={rowObj.HostName}
												>

													<td  style={trStyle}> {x.AppName}</td>
													<td> {"URL"} </td>
													<td style={trStyle}> {x.Status} </td>
													<td style={trStyle}> {x.displayName} </td>
													<td style={trStyle}> {x.URL} </td>
													<td style={trStyle}> {x.lastUpdate} </td>
													<td style={trStyle}> {x.returnDesc} </td>
													<td style={trStyle}> {x.frequency} </td>
													<td> <Box colorIndex = "grey-2"  align="start" size = 'xsmall'  >
														<Button id={index} icon={<EditIcon size = 'xsmall'  /> }
														label='Edit'
															type='submit'
															size = 'xsmall'
															primary={true}
															onClick={ () =>	_this._onOpenLayer("URL", x.JobId)}

															/>
													</Box>

													{_this.state.test}
													</td>
												</TableRow>
												)	})
												}
										</tbody>
								</Table >
							</div>
			);

		}
	_returnModule(modules, jobid){
				console.info("@@@@@@@@@@@@@@@@@@@@@@@@**RETURN MODULE*************** ")
		/*
		if (this.state.buttonPressed)
		{*/
				console.info("@@@@@@@@@@@@@@@@@@@@@@@@**RETURN MODULE TRUE*************** ")

			   let layerNode;

				if (this.state.openLayer) {

				switch(modules) {
				case "URL":
						{
						layerNode = (
							<Layer flush={true} closer={true} onClose={this._onCloseLayer} align='center'>
							<Box>
							<URLModule Mode={"Edit"} JobID = {jobid} onClose={this._onCloseLayer}/>
							</Box>
							</Layer>
						);
						}
				break;
				case "Ping":
						{
						layerNode = (
							<Layer flush={true} closer={true} onClose={this._onCloseLayer} align='center'>

							<PingModule Mode={"Edit" } JobID = {jobid} onClose={this._onCloseLayer}/>

							</Layer>
						);
						}
				break;
				case "DB":
						{
						layerNode = (
							<Layer flush={true} closer={true} onClose={this._onCloseLayer} align='center'>

							<DBModule Mode={"Edit" } JobID = {jobid} onClose={this._onCloseLayer}/>

							</Layer>
						);
						}
				break;
				case "Server":
						{
						layerNode = (
							<Layer flush={true} closer={true} onClose={this._onCloseLayer} align='center'>

							<ServerModule Mode={"Edit" } JobID = {jobid} onClose={this._onCloseLayer}/>

							</Layer>
						);
						}
				break;
			}
				}

				this.setState({test:layerNode});

	}

	_onOpenLayer(modules, jobid) {
  	  this.setState({openLayer: true});
		this._returnModule(modules, jobid);
 	 }

  	_onCloseLayer() {

		this.setState({test:null});

		this.setState({openLayer: false});
		console.info("@@@@@@@@@@@@@@@@@@@@@@@@**********	_onCloseLayer() ************* ")
 		}


	_PingData(){
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//console.log('!!!! Im Here !!!!' + JSON.stringify(rowObj));

			var data = this.SchedulePing;
			var EPRID = this.EPRID;

			var failCount = 0;
			var failStat = '';
			var total = 0;
			var _this = this;


			this.pingHTML = [];

			var pingHTML =[];
			let displayName = '';
			let server = '';
			let RRT = '';

			let modName = '';
			let stat = '';
			let updateTime = '';



			data.map(function (x) {
				if (x.EPRID == EPRID)
					{
						if(JSON.stringify(x.Status) == "false" )
					{
					//	console.log("FAIL Status " + JSON.stringify(x.Status));
						failCount = failCount + 1;

						//	console.log("failCount " + failCount);
					}/*else{
						//	console.log("PASS Status " + JSON.stringify(x.Status));
					}*/
					total = total +1;

					if (x.Status == "false"){
						stat = "Fail";
					}else{
						stat = "Pass";
					}

					updateTime = x.Timestamp.replace('T','	').replace('Z','');
					pingHTML.push({"AppName": x.AppName, "JobId": x.JobID, "ModName": "Ping",  "Status": stat, "displayName": x.DispName,
					 "RTT": x.RTT, "Server": x.ServerAdd, "lastUpdate": x.Timestamp.replace('T','	').replace('Z','')});
				console.log("############################ " + pingHTML[0].AppName);



						}
						return(
							pingHTML
						)
							});
							if (failCount >0){
								failStat = 'Fail';
							}else{
								failStat ='Pass';
							}

						console.log("failStat " + failStat);
						this.PingFailCount = failCount;
						this.PingStat = failStat;
						this.PingUpdateTime = updateTime;
						this.pingHTML = pingHTML;


				return (
					<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => this._onLatestAppUpdate()}>
										> Latest App Update
									</Title>
									<Title onClick={() => this._appHealthDisplayed(EPRID)}>
										> Application Automation > Ping
									</Title>
                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Module Name", "Status", "Display Name", "Server","RTT", "Last Update"]} />
										<tbody>


											{pingHTML.map( function (x, index) {
													return(
														<TableRow>

													<td style={trStyle}> {x.AppName}</td>


													<td> {"Ping"} </td>
													<td style={trStyle}> {x.Status} </td>
													<td style={trStyle}> {x.displayName} </td>
													<td style={trStyle}> {x.Server} </td>
													<td style={trStyle}> {x.RTT} </td>
													<td style={trStyle}> {x.lastUpdate} </td>
													<td> <Box colorIndex = "grey-2"  align="start" size = 'xsmall'  >
														<Button id={index}
														icon={<EditIcon size = 'xsmall'  /> }
															label='Edit'
															size = 'xsmall'
															type='submit'
															primary={true}
															onClick={ () => _this._onOpenLayer("Ping",_this.pingHTML[index].JobId )}

															/>
																{_this.state.test}
													</Box></td>
													</TableRow>
													)
													}
													)

													}


										</tbody>
								</Table >
							</div>
			);

		}


	_DBData(){
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//console.log('!!!! Im Here !!!!' + JSON.stringify(rowObj));

			var data = this.ScheduleDatabase;
			var EPRID = this.EPRID;

			var failCount = 0;
			var failStat = '';
			var total = 0;
			var _this = this;
			var stat = '';

			this.dbHTML = [];

			var dbHTML =[];
			let updateTime = '';

			data.map(function (x) {
				if (x.EPRID == EPRID)
					{
						if(JSON.stringify(x.Status) == "false" )
					{
					//	console.log("FAIL Status " + JSON.stringify(x.Status));
						failCount = failCount + 1;

						//	console.log("failCount " + failCount);
					}else{
						//	console.log("PASS Status " + JSON.stringify(x.Status));
					}
					total = total +1;
					if (x.Status == "false"){
						stat = "Fail";
					}else{
						stat = "Pass";
					}

					updateTime = x.Timestamp.replace('T','	').replace('Z','');
					dbHTML.push({"AppName": x.AppName,"JobId": x.JobID, "displayName": x.DispName, "Status": stat,
					 "lastUpdate": x.Timestamp.replace('T','	').replace('Z',''),  "DBName": x.DBName, "Server": x.ServerAdd, "Query": x.Query, "ReturnResults": x.ReturnResults,"DBPort": x.DBPort, "frequency": x.SchedulingTime });
				console.log("############################ " + dbHTML[0].AppName);



			}
			return(
				dbHTML
			)
				});
				if (failCount >0){
					failStat = 'Fail';
				}else{
					failStat ='Pass';
				}

			console.log("failStat " + failStat);
			this.DBFailCount = failCount;
			this.DBStat = failStat;
			this.DBUpdateTime = updateTime;
			this.dbHTML = dbHTML;


				return (
					<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => this._onLatestAppUpdate()}>
										> Latest App Update
									</Title>
									<Title onClick={() => this._appHealthDisplayed(EPRID)}>
										 > Application Automation > DB
									</Title>
                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Module Name", "Status", "Display Name", "Server","DB Name", "DB Port", "Query", "Return Results", "Last Update", "Frequency (min)"  ]} />
										<tbody>

											{dbHTML.map(function (x, index) {
												return(
											<TableRow
				  //onClick={(e) => this._appModuleDisplayed(this.state.SelectedRow[0].EPRID, e)} key={rowObj.HostName}
												>

													<td style={trStyle}> {x.AppName}</td>
													<td> {"DB"} </td>
													<td style={trStyle}> {x.Status} </td>
													<td style={trStyle}> {x.displayName} </td>
													<td style={trStyle}> {x.Server} </td>
													<td style={trStyle}> {x.DBName} </td>
													<td style={trStyle}> {x.DBPort} </td>
													<td style={trStyle}> {x.Query} </td>
													<td style={trStyle}> {x.ReturnResults} </td>
													{/*<td style={trStyle}> {} </td>
													<td style={trStyle}> {} </td>*/}
													<td style={trStyle}> {x.lastUpdate} </td>
													{/*<td style={trStyle}> {} </td>*/}
													<td style={trStyle}> {x.frequency} </td>
													<td> <Box colorIndex = "grey-2"  align="start" size = 'xsmall' >
														<Button id={index}
														icon={<EditIcon size = 'xsmall'  /> }
														label='Edit'
														size = 'xsmall'
															type='submit'
															primary={true}
															onClick={ () => _this._onOpenLayer("DB",_this.dbHTML[index].JobId )}

															/>
															{_this.state.test}
													</Box></td>
												</TableRow>
												)	})
												}
										</tbody>
								</Table >
							</div>
			);

		}

	_ServerData(){
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
		//console.log('!!!! Im Here !!!!' + JSON.stringify(rowObj));

			var data = this.ScheduleServer;
			var EPRID = this.EPRID;

			var failCount = 0;
			var failStat = '';
			var total = 0;
			var stat = '';
		var _this = this;
			var serverHTML =[];
			let updateTime = '';

			data.map(function (x) {
				if (x.EPRID == EPRID)
					{
						if(JSON.stringify(x.Status) == "false" )
					{
					//	console.log("FAIL Status " + JSON.stringify(x.Status));
						failCount = failCount + 1;

						//	console.log("failCount " + failCount);
					}/*else{
							console.log("PASS Status " + JSON.stringify(x.Status));
					}*/
					total = total +1;
					if (x.Status == "false"){
						stat = "Fail";
					}else{
						stat = "Pass";
					}

					updateTime = x.Timestamp.replace('T','	').replace('Z','');
					serverHTML.push({"AppName": x.AppName,"JobId": x.JobID, "displayName": x.DispName, "Status": stat,
					 "lastUpdate": x.Timestamp.replace('T','	').replace('Z',''),  "Server": x.ServerAdd, "Service": x.ServiceName, "ServiceStatus": x.Description,"frequency": x.SchedulingTime });
				console.log("############################ " + serverHTML[0].AppName);



			}
			return(
				serverHTML
			)
				});
				if (failCount >0){
					failStat = 'Fail';
				}else{
					failStat ='Pass';
				}

			console.log("failStat " + failStat);
			this.ServerFailCount = failCount;
			this.ServerStat = failStat;
			this.ServerUpdateTime = updateTime;
			this.serverHTML = serverHTML;



				return (
					<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => this._onLatestAppUpdate()}>
										> Latest App Update
									</Title>
									<Title onClick={() => this._appHealthDisplayed(EPRID)}>
										> Application Automation > Server
									</Title>

                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Module Name", "Status", "Display Name", "Server","Service",  "Service Status",  "Last Update", "Frequency (min)"  ]} />
										<tbody>

											{serverHTML.map(function (x, index) {
												return(
											<TableRow
				  //onClick={(e) => this._appModuleDisplayed(this.state.SelectedRow[0].EPRID, e)} key={rowObj.HostName}
												>

													<td style={trStyle}> {x.AppName}</td>
													<td> {"Server"} </td>
													<td style={trStyle}> {x.Status} </td>
													<td style={trStyle}> {x.displayName} </td>
													<td style={trStyle}> {x.Server} </td>
													<td style={trStyle}> {x.Service} </td>
													<td style={trStyle}> {x.ServiceStatus} </td>
													<td style={trStyle}> {x.lastUpdate} </td>
													<td style={trStyle}> {x.frequency} </td>
												<td> <Box colorIndex = "grey-2"  align="start"  size = 'xsmall'>
														<Button id={index}
															icon={<EditIcon size = 'xsmall'  /> }
														label='Edit'
														size = 'xsmall'
															type='submit'
															primary={true}
															onClick={ () => _this._onOpenLayer("Server",_this.serverHTML[index].JobId )}

															/>
															{_this.state.test}
													</Box></td>
												</TableRow>
												)	})
												}
										</tbody>
								</Table >
							</div>
			);

		}

	_URLClicked(){

			if (this.URLPres){
			this.urlDisplayed = true;
			console.log("_URLClicked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(this.urlDisplayed );
			this._URLData();
			this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)}


		}

	_PingClicked(){

			if (this.PingPres){
			this.pingDisplayed = true;
			console.log("_PingClicked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + this.pingDisplayed);
			console.log(this.urlDisplayed );
			this._PingData();
			this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)}
		}

	_DBClicked(){

			if (this.DBPres)
			{this.dbDisplayed = true;
			console.log("_PingClicked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + this.dbDisplayed);
			console.log(this.urlDisplayed );
			this._DBData();
			this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)}
		}

	_ServerClicked(){

		if (this.ServerPres){
			this.serverDisplayed = true;
			console.log("_ServerClicked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + this.serverDisplayed);
			console.log(this.urlDisplayed );
			this._ServerData();
			this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)
		}
		}

	_SubmitComment(){
		this.setComment = this.newText;
		}




 	_ApplTableDate(rowObj){
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};
		let trStyle = {color: "#FFED00", "fontWeight":"bold"};
			//	console.log('!!!! Im Here !!!!' + JSON.stringify(rowObj));
			let new_ping = '';
			let new_url = '';
			let new_db = '';
			let new_server = '';


			let stat = '';
			let updateTime = '';
			let failCount = '';

			let modName = '';
			let comments = '';

			let pingmodName = '';
			let pingcomments = '';

			let dbmodName = '';
			let dbcomments = '';

			let servermodName = '';
			let servercomments = '';

			this.URLStat = '';
			this.URLUpdateTime= '';
			this.URLFailCount = '';

			this.PingStat = '';
			this.PingUpdateTime= '';
			this.PingFailCount = '';

			this.DBStat = '';
			this.DBUpdateTime= '';
			this.DBFailCount = '';

			this.ServerStat = '';
			this.ServerUpdateTime= '';
			this.ServerFailCount = '';

			this.URLPres = false;
			this.PingPres = false;
			this.DBPres = false;
			this.ServerPres = false;

			let URLPres = false;
			let PingPres = false;
			let DBPres = false;
			let ServerPres = false;

			 const { text } = this.state;

		this.EPRID = rowObj.EPRID;
				console.log("this._URLData(rowObj.EPRID) "+ rowObj.EPRID);

				this.ScheduleURL.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						URLPres = true;
					}});
					this.URLPres = URLPres;
					console.log("*************************//////////////////////" + this.URLPres);

				if (this.URLPres === true){
					this._URLData();

					modName = this.state.SelectedRow[0].Asset;
					new_url = "URL";
					comments = [this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)];

					}


				this.SchedulePing.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						PingPres = true;
					}});

					this.PingPres = PingPres;
					console.log("*************************//////////////////////" + this.PingPres);

				if (this.PingPres){
					this._PingData();

					pingmodName = this.state.SelectedRow[0].Asset;
					new_ping = "Ping";
					comments = [this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)];

					}

				this.ScheduleDatabase.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						DBPres = true;
					}});

					this.DBPres = DBPres;
					console.log("*************************//////////////////////" + this.DBPres);

				if (this.DBPres){
					this._DBData();

					dbmodName = this.state.SelectedRow[0].Asset;
					new_db = "DB";
					dbcomments = [this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)];

					}


				this.ScheduleServer.map(function (x) {
					if ( x.EPRID == rowObj.EPRID){
						ServerPres = true;
					}});

					this.ServerPres = ServerPres;
					console.log("*************************//////////////////////" + this.ServerPres);

				if (this.ServerPres){
					this._ServerData();

					servermodName = this.state.SelectedRow[0].Asset;
					new_server = "Server";
					servercomments = [this._appModuleDisplayed(this.state.SelectedRow[0].EPRID)];

					}

				console.log("URLStat " + this.URLStat);
				console.log("URLUpdateTime " + this.URLUpdateTime);
				console.log("URLFailCount " + this.URLFailCount);
			/*
				let uniqueIdForComments = this.props.returnIDArg[1];
				let hasUniqueIdForComments = item[uniqueIdForComments];
			*/

		return (
				<tbody>
				{this.PingPres?<TableRow onClick={() => this._PingClicked()} key={rowObj.HostName} >
				 	<td > {pingmodName} </td>
					<td style={trStyle}> {new_ping } </td>
					<td style={trStyle}> {this.PingStat} </td>
					<td style={trStyle}> {this.PingUpdateTime} </td>
					<td style={trStyle}> {this.PingFailCount} </td>
					{/*<td>
						<Box colorIndex = "grey-2"  align="start" >
							{this.setComment}
						</Box>
					</td>
					<td>
						<Form>
							 <FormField >
								<TextInput id='item1'
										name='item-1'
										value={text}
										//suggestions={suggestions}
           								 onDOMChange={this._domChange('text')}
										/>
							</FormField>
						</Form>
					</td>
					<td>
						<Box colorIndex = "grey-2"  align="start" >
							<Button label='Submit'
								type='submit'
								primary={true}
								onClick={() => this._SubmitComment()}
								/>
						</Box>
					</td>*/}
				</TableRow>:null}
			{this.URLPres?<TableRow onClick={() => this._URLClicked()} key={rowObj.HostName}>
					<td  > {modName} </td>
					<td style={trStyle}> {new_url} </td>
					<td style={trStyle}> {this.URLStat} </td>
					<td style={trStyle}> {this.URLUpdateTime} </td>
					<td style={trStyle}> {this.URLFailCount} </td>
					{/*<td> </td>
					<td></td>
					<td>
						<Box colorIndex = "grey-2"  align="start" >
							<Button   plain = {true} >
								{"Submit"}
							</Button>
						</Box>
					</td>*/}
				</TableRow>:null}
			{this.DBPres?<TableRow onClick={() => this._DBClicked()} key={rowObj.HostName} >
					<td  > {dbmodName} </td>
					<td style={trStyle}> {new_db} </td>
					<td style={trStyle}> {this.DBStat} </td>
					<td style={trStyle}> {this.DBUpdateTime} </td>
					<td style={trStyle}> {this.DBFailCount} </td>
					{/*<td> </td>
					<td> </td>
					<td>
						<Box colorIndex = "grey-2"  align="start" >
							<Button   plain = {true} >
								{"Submit"}
							</Button>
						</Box>
					</td>*/}
				</TableRow>:null}
				{this.ServerStat?<TableRow onClick={() => this._ServerClicked()} key={rowObj.HostName}>
					<td  > {servermodName} </td>
					<td style={trStyle}> {new_server} </td>
					<td style={trStyle}> {this.ServerStat} </td>
					<td style={trStyle}> {this.ServerUpdateTime} </td>
					<td style={trStyle}> {this.ServerFailCount} </td>
					{/*<td> </td>
					<td> </td>
					<td>
						<Box colorIndex = "grey-2"  align="start" >
							<Button   plain = {true} >
								{"Submit"}
							</Button>
						</Box>
					</td>*/}
				</TableRow>:null}
				</tbody>
			);

		}


   		/* onUpdateSubmit(event){
      event.preventDefault();
      //Define data JSON local reference
      let data = this.state.data;
      //TABLE ROW: Get Sending Row's id (matches the object's id)
      let tdPassed = event.currentTarget.parentNode;
      let tdParentTr_id = tdPassed.parentNode.id;//<<Had to use ID here as key (or any other attribute seemed unreachable)
      //TABLE ROW'S ITEM: Filter JSON object item from 'data' that matches row id passed from event
      let itemFromData = data.filter(function( item ) {
        return item.indexer == tdParentTr_id;
      });
      //alert("Before New Update"+JSON.stringify(itemFromData));
      //Get preceeding tr's child input tag
      let update_td = tdPassed.previousSibling.children[0];
      //check contents
      if(update_td.value.length>100){
        alert("Please keep your update comment under 100 characters!");
      }else if(update_td.value){
        //Set Timestamp For Local Only
        let update_date = new Date().toUTCString();
        //Set Email For Local Only
        let email_addr = this.props.userEmail;
        //Second I retrieve the full updated JSON array as there may be a delay in retrieval
        let data_Mod = data.map(function( item ){
          if(item.indexer == tdParentTr_id){
                item['Comments']=update_td.value;
                //Tbl 1 takes a soln instead
                item['Solutions']=update_td.value;
                //Handle multiple naming techniques on the Email retrieve Title TODO:Fix & Get email correctly!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                item['Comments_Updated_By']=email_addr;
                item['Comment_Updated_By']=email_addr;
                item['Updated_By']=email_addr;
                //Handle multiple naming techniques on the TimeStamp Title TODO:Fix!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                item['Comments_Updated_Timestamp']=update_date;
                item['Comment_Updated_Timestamp']=update_date;
                item['Updated_timestamp']=update_date;
             }
          return item;
        });
        //Third, here's the modified object retrieved
        let data_Obj = data.filter(function( item ){
          return item.indexer == tdParentTr_id
        });
        //alert(JSON.stringify(data_Mod)+"........"+JSON.stringify(data_Obj));
        //Make an object from props to pass to POST as data
        let keyForIDPassed = this.props.returnIDArg[0];
        let valForIDPassed = this.props.returnIDArg[1];
        let objForPosting ={};
        objForPosting[keyForIDPassed] = data_Obj[0][valForIDPassed];
        objForPosting["UserComment"] = update_td.value;
        let otherArgKVPS = this.props.returnOptionalArgs;//<<This is a JSON Array
        //If there are other KVPs needed for the data object to POST
        if(otherArgKVPS.length>0){
          otherArgKVPS.map(function(argObj){//For each json object...
            //Map each key and value to targetobject
            let key = Object.keys(argObj)[0];
            let val = Object.values(argObj)[0];
            objForPosting[key] = data_Obj[0][val];
            //alert("Here we are - "+JSON.stringify(key)+JSON.stringify(val));//[{"Server_Name":"Server_Name"},{"EPR_ID":"EPRID"}]
          });
        }
        //Optional further Arg keys and vals
        //alert(JSON.stringify(objForPosting));
        //****************************************************************************************************************API POST START***
        //Send POST, and, on success, update state array...........................REFORMAT DATE... MAYBE USE STANDARDISED ONE FOR NOW
        $.ajax({
    	    xhrFields: {
            withCredentials: true
          },
          type:"POST",
          url: this.props.postURL,
          dataType: "text",//<<Response is text
          contentType: "application/x-www-form-urlencoded",
          //Pass objForPosting defined by props passed above
          data: objForPosting, //<< ID is EscalationID... Also we dont pass back commenter or timestamp!!!!!!
          success: function(){
            this.setState({
                data: data_Mod
            });
          }.bind(this),
  		    error: function(xhr, status, err) {
  		      console.error('#POST Error', status, err.toString());
    		  }.bind(this)
        });
        //****************************************************************************************************************API POST END***
        //clear update field
        update_td.value = "";
      }else{
        alert("Please enter an update greater than zero characters!");
      }
  	  }
		*/
 	_domChange (type) {
		return (event) => {
		const value = event.target.value;
		const regexp = new RegExp('^' + value);
		const suggestions = VALUES.filter(val => regexp.test(val));
		const nextState = { suggestions };
		if ('text' === type) {
			nextState[type] = value;
		}
		this.setState(nextState);
		this.newText = nextState;
		};
		}

	_HCTableYellowFun(HCData){
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};
		//	console.log('!!!! Im Here !!!!' + JSON.stringify(HCData));
		if(HCData.Status_OV == "Yellow"){
		return (
				<TableRow key={HCData.EPRID} onClick={(e) => this._onAppSelected2(HCData.EPRID, e)} >
					<td> {HCData.EPRID} </td>
					<td> {HCData.Asset} </td>
					<td> <Status value={STATUS_COLOR[HCData.Status_OV]}/> </td>
					<td> <Status value={STATUS_COLOR[HCData.Status_Infra]}/> </td>

					<td> <Status value={STATUS_COLOR[HCData.Status_App]}/> </td>
				</TableRow>
			);
		}

		}


	_HCTableRedFun(HCData){
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};
		console.log('!!!! Im Here !!!!' + JSON.stringify(HCData));
		//	if(HCData.Status_OV != "Green" || HCData.Status_Infra != "Green")
		{
		return (
				<TableRow key={HCData.EPRID} onClick={(e) => this._onAppSelected2(HCData.EPRID, e)} >
					<td> {HCData.EPRID} </td>
					<td> {HCData.Asset} </td>
					<td> <Status value={STATUS_COLOR[HCData.Status_OV]}/> </td>
					<td> <Status value={STATUS_COLOR[HCData.Status_Infra]}/> </td>

					<td> <Status value={STATUS_COLOR[HCData.Status_App]}/> </td>
				</TableRow>
			);
		}

		}


   componentWillUnmount () {
    //this.serverRequest.abort();
 	  }

   render(){
	    const { text } = this.state;
		console.log('Render of ChartHealthTable');
	//	console.log("Values of healthCheckData Array " + JSON.stringify(this.state.healthCheckData));
		//console.log("## Values of SelectedRow ## "+ JSON.stringify(this.state.SelectedRow));
	//	console.log("## ~~~~~~~~~~~~~~~~~~~ ## "+ this.props.isMaintenanceClicked);

		let _this = this;
		const STATUS_COLOR =  {"Green":"ok","Red":"critical","Yellow":"warning","White":"unknown","Normal":"ok"};

		let placeholderForTip7 = ("tip7Target");

		if (this.state.loading) {
			return <Spinning />;
		} else {
			if (this.state.healthCheckData.length === 0) {
				return (<Heading>Nothing to Show</Heading>);
			} else {
				return (

				this.props.isDisplayed
				?<div size="xlarge" style={{"color": "white"}}>


							{
							this.state.isLvlOneTableDisplayed
							? <div style={{"color": "white"}}>
                            <Header justify="between" pad={{horizontal: "large"}} size="xlarge">
                            <Header>
							<Title id={placeholderForTip7}>

								Application Health
							</Title>
                            </Header>
                            <Anchor  icon={<CloseIcon size="small"/>} onClick={() => _this._CloseAppSlected()}/>
							</Header>
                            <br />
								<Table selectable={true} >
									<TableHeader labels={["EPRID", "Application Name", "Overall Status", "Infrastructure Status", "App Status"]} />
										{
											this.state.healthCheckData.map(function (asset, index) {

                                                if(_this.props.isMaintenanceClicked === true){
												return (
														<tbody>
															{_this._HCTableYellowFun(asset)}
														</tbody>
												);

                                                }else
													return (
														<tbody>
															{_this._HCTableRedFun(asset)}
														</tbody>
												);

											})
										}
								</Table>
							</div>
							:  null

					}


					{
						this.state.isLvlTwoTableDisplayed
							? <div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge" >
                                <Header>
									<Title onClick={() => _this._onAppSelected()}>
										Application Health
									</Title>
									<Title>
										> Latest App Update
									</Title>
                                </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => _this._CloseAppSlected()}/>
								</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Area", "Status"]} />
{/*									//, "Update", "Update Time", "Comments", "EPRID"]} />
*/}										<tbody>
										{this._DataPresent(this.state.SelectedRow[0])}
											<TableRow>
												<td>
													{this.state.SelectedRow[0].Asset}
												</td>
												<td>
													Overall
												</td>
												<td>
													<Status value={STATUS_COLOR[this.state.SelectedRow[0].Status_OV]}/>
												</td>
											{/*	<td>
													{this.state.SelectedRow[0].Update_By_OV}
												</td>
												<td>
													{this.state.SelectedRow[0].Update_Time_OV===null? this.state.SelectedRow[0].Update_Time_OV: this.state.SelectedRow[0].Update_Time_OV.substr(0,10)}
												</td>
												<td>
													{this.state.SelectedRow[0].Comments_OV}
												</td>
												<td>
													{this.state.SelectedRow[0].EPRID}
												</td>*/}
											</TableRow>

											<TableRow  onClick={(e) => _this._levelthreedisplayed(this.state.SelectedRow[0].EPRID, e)} >
												<td>
													{this.state.SelectedRow[0].Asset}
												</td>
												<td>
													Infrastructure
												</td>
												<td>
													<Status value={STATUS_COLOR[this.state.SelectedRow[0].Status_Infra]}/>
												</td>
											{/*	<td>
													{this.state.SelectedRow[0].Update_By_Infra}
												</td>
												<td>
													{this.state.SelectedRow[0].Update_Time_Infra===null? this.state.SelectedRow[0].Update_Time_Infra: this.state.SelectedRow[0].Update_Time_Infra.substr(0,10)}
												</td>
												<td>
													{this.state.SelectedRow[0].Comments_Infra}
												</td>
												<td>
													{this.state.SelectedRow[0].EPRID}
												</td>*/}
											</TableRow>
											<TableRow
											 onClick={this.dataPres ?  (e) => _this._appHealthDisplayed(this.state.SelectedRow[0].EPRID, e): null}
											 >
												<td>
													{this.state.SelectedRow[0].Asset}
												</td>
												<td>
													Application
												</td>
												<td>
													<Status value={STATUS_COLOR[this.state.SelectedRow[0].Status_App]}/>
												</td>
										{/*		<td>
													{this.state.SelectedRow[0].Update_By_App}
												</td>
												<td>
													{this.state.SelectedRow[0].Update_Time_App===null? this.state.SelectedRow[0].Update_Time_App: this.state.SelectedRow[0].Update_Time_App.substr(0,10)}
												</td>
												<td>
													{this.state.SelectedRow[0].Comments_App}
												</td>
												<td>
													{this.state.SelectedRow[0].EPRID}
												</td>*/}
											</TableRow>

										</tbody>
									</Table>
								</div>
							:  null

					}

					{
							this.state.isLvlThreeTableDisplayed
							?<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => _this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => _this._onLatestAppUpdate()}>
										> Latest App Update > Server Utilization
									</Title>
                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => _this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>

									<TableHeader labels={["Asset", "Server Name", "Device Name", "CPU", "Memory", "Space", "Swap"]} />
										{
											this.state.SelectedInfra.map(function (asset) {

												return (
														<tbody>
															{_this._InfaTableDate(asset)}
														</tbody>

										);
									})
								}
								</Table >
								<ApplicationHealthCheckLineChart memLineChartEPRID={this.state.memLineChartEPRID} />
							</div>
							:  null
					}


					{
							(this.state.isappHealthDisplayed
						&& this.dataPres)
							?<div style={{"color": "white"}}>
								<Header justify="between" pad={{horizontal: "large"}} size="xlarge">
									<Header>
									<Title  onClick={() => _this._onAppSelected()}>
										Application Health
									</Title>
									<Title onClick={() => _this._onLatestAppUpdate()}>
										> Latest App Update > Application Automation
									</Title>
                            </Header>
								<Anchor  icon={<CloseIcon size="small"/>} onClick={() => _this._CloseAppSlected()}/>
							</Header>
								<br />
								<Table selectable={true}>
									<TableHeader labels={["Asset", "Module Name", "Status", "Update Time", "Fail Count"]} />
										{
											this.state.SelectedApp.map(function (asset) {

												return (
														//<tbody>
															_this._ApplTableDate(asset)
														//</tbody>
										);
									})
								}
								</Table >
							</div>
							:  null
					}
						{
							this.urlDisplayed
							?this._URLData()

							:  null
						}
							{
							this.pingDisplayed
							?this._PingData()

							:  null
						}{
							this.dbDisplayed
							?this._DBData()

							:  null
						}{
							this.serverDisplayed
							?this._ServerData()

							:  null
						}

					</div>
					:null
				);
			}






		}
	}
  }



ChartHealthTable.propTypes = {
  userEmail: React.PropTypes.string.isRequired,
  currentDashboard: React.PropTypes.string.isRequired,
  dashboards : React.PropTypes.array.isRequired,
  defaultDashboard: React.PropTypes.string,
  displayHealthCheckTable : React.PropTypes.bool

};


const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard, displayHealthCheckTable, userEmail  }) => ({ currentDashboard, dashboards, defaultDashboard, displayHealthCheckTable, userEmail  });
export default connect(mapStatetoProps, { deleteDashboardFilter})(ChartHealthTable);
