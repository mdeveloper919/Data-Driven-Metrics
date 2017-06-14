import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard} from '../../actions';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import CloseIcon from 'grommet/components/icons/base/Close';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Select from 'grommet/components/Select';
import Section from 'grommet/components/Section';
import Toast from 'grommet/components/Toast';
import URLModule from './URLModule';
import PingModule from './PingModule';
import DBModule from './DBModule';
import ServerModule from './ServerModule';

const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";

class HCInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
		EmptyBox: '', /* added to reset the state of the input box */
		ToastOpen: false,
		modulevalue: '',
		SelectedEPRID: [],
		ModuleApplication: [],
		filtered_Applist: [],
		Applist:	[],
		SelectedApp: [],
		serverList: [],

	};
	this._onDelete = this._onDelete.bind(this);
	this._onClose = this._onClose.bind(this);
	this._selectModule = this._selectModule.bind(this);
	this._selectedEPRID = this._selectedEPRID.bind(this);
  }

  componentWillMount() {
    console.log('HCInput componentWillMount');
  }

  componentDidMount() {
	console.log('HCInput componentDidMount');
	// populates the eprid list to make it searchable
		this.serverRequest=
		$.ajax({
			xhrFields:{
				withCredentials: true
			},
			type:"GET",
			url: baseUrl + 'HealthCheckAutomation/Select_ModuleApplication' ,
			dataType: 'json',
		    success: function(data) {
			  console.log('Get EPRID Ajax data success');
				this.setState({ModuleApplication: data});
//				console.log("TEST1" + JSON.stringify(this.state.ModuleApplication));
				this._setApplist();
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
	    });

		//Get Server list from selected app
		this.serverRequest=
		$.ajax({
			xhrFields:{
				withCredentials: true
			},
			type:"GET",
			url: baseUrl + 'HealthCheckAutomation/Select_ApplicationServer',
			dataType: 'json',
		    success: function(data) {
			this.setState({serverList: data});
	//		console.log("TESTING SERVERLIST" + JSON.stringify(this.state.serverList));
			}.bind(this),
			 error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
	    });
	}


  componentWillReceiveProps() {
         console.log('HCInput componentWillReceiveProps');
  }

	_setApplist() {
	//	web service returns ModuleApplication,  Grommet Select dropdown component needs value, label
	  console.log("HCInput setApplist");
		console.log(this.state.ModuleApplication);
		if (this.state.ModuleApplication.length != 0){
			let temp = this.state.ModuleApplication.map(function(item){
				  return item["Asset Name"]});
			let temp2 = temp.filter(x => x != null);  // remove nulls
			temp2.sort();
			this.setState({Applist: temp2});
			console.log(this.state.Applist);
		}
	}


	_onClose () {
		this.props.onClose();
		this.setState({modulevalue: '',SelectedEPRID: '', SelectedApp: ''});
		//this.setState({ToastOpen: true});
	}

	_onDelete (e) {
		console.log("what's in e " + e.target.id);
	}

	_selectModule (e){
		console.log("select Module: what's in e " + e.value);
		if (e.value != undefined){
			this.setState({modulevalue: e.value});

			console.log("The value of modulevalue is: " + this.state.modulevalue);
		}

//**************************************************************************************************
// *** work around to be able to test when user has no apps ---- COMMENT OUT when deploying *****
		// var temp = [];
		// temp.push({EPRID: "202214",'Asset Name': "Qlik (HPE)"});
		// this.setState({SelectedApp: temp});
		// console.log("this.state.SelectedApp:");
		// console.log(this.state.SelectedApp[0]);
	}

	_selectedEPRID (e){
		console.log("selectedEPRID: what's in e " + e.value);

		if (e.value !== undefined){
			let temp = this.state.ModuleApplication.filter(function(item){
				return item["Asset Name"] == e.value});
			this.setState({SelectedApp: temp});
		}
		if (e.value !== undefined){
			this.setState({SelectedEPRID: e.value});
			console.log ("The value of modulevalue is " + this.state.SelectedEPRID);
		}

    // To hide active module when EPRID is selected to force new server dropdown
		this.state.modulevalue = '';

		if (e.value !== undefined){
			let temp2;
			temp2 = this.state.serverList.filter(function(item){
				return item.AssetName == e.value});
				console.log("TESTIGN LOG " + JSON.stringify(temp2));
			this.setState({filteredServerList: temp2});
		}

	}


//, 'DB Logic Check', 'Server Check'
  render() {
	console.log('Render of HCInput');
//	console.log ("The value of serverList is " + JSON.stringify(this.state.filteredServerList));
	let toast = null;
	if (this.state.ToastOpen) {
		toast = (<Toast status="ok" onClose={() => this.setState({ToastOpen: false})}> something went wrong </Toast>) ;
	}
	if (!this.props.HCInputOpen) {
			return toast;
		} else {

		return (
            <Layer closer={true} align="center">
				<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onClose}/>
				<Article>
				  <Section pad='large' align='start'>
					<Heading align='end' strong={true} tag='h2'> Module Selection </Heading>
					<Form pad='small'>
						<Header pad={{vertical: "small"}} >
							<FormField label="Select Application *">
								<Select placeHolder='None'inline={false} multiple={false} value={this.state.SelectedEPRID} options={this.state.Applist} onChange={(e) => this._selectedEPRID(e)} />
							</FormField>
						</Header>
						<Header pad={{vertical: "small"}} >
							<FormField label="Select Module *">
								<Select value={this.state.modulevalue} inline={false} options={['URL Check', 'Ping Check', 'DB Logic Check', 'Server Check']} onChange={(e) => this._selectModule(e)}/>
							</FormField>
						</Header>
					</Form>
				  </Section>

				  {
					  this.state.modulevalue == "URL Check" && this.state.SelectedEPRID.length > 0 ?
						<URLModule Mode={"Add"} selectedApp={this.state.SelectedApp}  onClose={this._onClose}/>
					  :null
				  }

				  {
					  this.state.modulevalue == "Ping Check" && this.state.SelectedEPRID.length > 0 ?
					  <PingModule Mode={"Add"} selectedApp={this.state.SelectedApp}  onClose={this._onClose}/>

					  :null
				  }

				  {
					  this.state.modulevalue == "DB Logic Check" && this.state.SelectedEPRID.length > 0 ?
					  <DBModule Mode={"Add"} selectedApp={this.state.SelectedApp} JobID={"0"}/>

					  :null
				  }

				  {
					  this.state.modulevalue == "Server Check" && this.state.SelectedEPRID.length > 0 ?
					  <ServerModule Mode={"Add"} selectedApp={this.state.SelectedApp} JobID={"0"} />

					  :null
				  }
				</Article>
			</Layer>
			);
		}
  }
}


HCInput.propTypes = {
  HCInputOpen:          React.PropTypes.bool.isRequired,
  dashboards:            React.PropTypes.array.isRequired,
  currentDashboard:      React.PropTypes.string.isRequired,
  addChart:              React.PropTypes.func.isRequired,
  addDashboardFilter:    React.PropTypes.func.isRequired,
  setDefaultDashboard: React.PropTypes.func.isRequired,
  deleteDashboardFilter: React.PropTypes.func.isRequired,
  deleteChart:           React.PropTypes.func.isRequired,
  replaceState:          React.PropTypes.func.isRequired,
  onClose:               React.PropTypes.func.isRequired,
  defaultDashboard: React.PropTypes.string
};


const mapStatetoProps = ({ dashboards, currentDashboard, userEmail,defaultDashboard }) => ({ dashboards, currentDashboard, userEmail,defaultDashboard });
export default connect(mapStatetoProps, { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard})(HCInput);
