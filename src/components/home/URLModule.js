import React, { Component } from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Select from 'grommet/components/Select';
import Section from 'grommet/components/Section';
import RadioButton from 'grommet/components/RadioButton';
import Layer from 'grommet/components/Layer';
import Anchor from 'grommet/components/Anchor';
import CloseIcon from 'grommet/components/icons/base/Close';
import Form from 'grommet/components/Form';
import Status from 'grommet/components/icons/Status';

const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";

class URLModule extends Component {
	constructor(props) {
    super(props);
    this.state = {
		yesbnt: false,
		nobnt:	true,
		schedules: [],
		selectedURLCheck: [],
		displayName: '',
		urlName: '',
		userName: '',
		password: '',
		JobID: '',
		EIDS: '',
		isActive: true,
		radiobtnvalue: '0',
		userStatus: 'ok',
		closeModule: false,
		schedule: {value:"0",label:"Select Schedule Frequency"},
		userMessage: 'URL Check Saved'
	};

	this._selectschedule = this._selectschedule.bind(this);
	this._onchangeraidobtn = this._onchangeraidobtn.bind(this);
	this._insertURLModule = this._insertURLModule.bind(this);
	this._updateURLModule = this._updateURLModule.bind(this);
	this._onClose = this._onClose.bind(this);
	this._onCancel = this._onCancel.bind(this);
	this._onDeploy = this._onDeploy.bind(this);
	this._deleteUrlModule = this._deleteUrlModule.bind(this);
	this._loadForm = this._loadForm.bind(this);

  }

  componentWillMount() {
    console.log("URL Module componentWillMount");
  }

	//Get schedule frequency for dropdown select component and load selectedApp in Edit mode
	componentDidMount() {
		  console.log("URLModule componentDidMount");
			this._loadForm();
		}

	componentWillReceiveProps() {
		console.log("URLModule componentWillReceiveProps");
		this.setState({isActive: true});
		console.log("mode: " + this.props.Mode);
		if (this.props.Mode === 'Edit') {
			this._loadForm();
		}
  }

	//Get schedule frequency for dropdown select component
	_loadForm() {
		console.log("URL Module loadForm");
		this.serverRequest=
		$.ajax({
			xhrFields:{
				withCredentials: true
			},
			type:"GET",
			url: baseUrl + 'FilterList/GetDDO_CodeName?Type=SchedulerFrequency&Module=HealthCheckAutomation',
					dataType: 'json',
					success: function(data) {
						 console.log('Get Scheules Ajax data success');
						 this.setState({schedules: data});
						 console.log(this.state.schedules);
						 this._formatSchedules(data);
						 if (this.props.Mode === 'Edit') {
                this._getJobID();
						 }
			}.bind(this),
			 error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
			});
  }

	_getJobID() {
		//Get record to edit by JobID
		console.log("URL Module getJobID");
		this.serverRequest=
		$.ajax({
			xhrFields:{
				withCredentials: true
			},
			type:"GET",
			url: baseUrl + 'HealthCheckAutomation/Select_ScheduleURL?JobID=' + this.props.JobID,
					dataType: 'json',
					success: function(data) {
					 console.log('Get URL Module Job ID AJAX success');
					 console.log("TESTING DATA " + JSON.stringify(data));
					 this.setState({
							JobID: data[0].JobID,
						 	EIDS: data[0].EIDS,
							EPRID: data[0].EPRID,
							AppName: data[0].AppName,
							displayName: data[0].DispName,
							urlName: data[0].URLAdd,
							userName: data[0].UserName,
							schedulingTime: data[0].SchedulingTime
					 });
					this._setSchedule();
			}.bind(this),
			 error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
			});
	}

	// set selected schedule
	_setSchedule() {
		  console.log("URL Module setSchedule");
			console.log("Schedules length = " + this.state.schedules.length);
			var sched = this.state.schedulingTime;
			var index = this.state.schedules.findIndex(function(element) {
			 		return element.value == sched;
			 		});
			this.setState({schedule: this.state.schedules[index]});
	}


		//	web service returns DISPLAY_NAME, VALUE - Grommet Select dropdown component needs value, label
	_formatSchedules(data) {
		console.log("URL Module formatSchedules");
		let temp = data;
		let temp2 = temp.map(function(item){
			return {value: item.VALUE, label: item.DISPLAY_NAME};
		});
		this.setState({schedules: temp2});
	}

	// function to handle on change of Schedule change
	_selectschedule (e){
		console.log("URL Module selectSchedule");
		let selection ={value: e.value.value, label: e.value.label};
		this.setState({schedule: selection});
	}

	// function to handle on change of Enable Alert radio buttons
	_onchangeraidobtn (e){
		console.log("what's in e " + e.target.name);
		if (e.target.name == "yesbnt" && this.state.yesbnt == false){
			this.setState({yesbnt: true});
			this.setState({nobnt: false});
			this.setState({radiobtnvalue: e.target.value});
		}else if (e.target.name == "yesbnt" && this.state.yesbnt == true){
			this.setState({yesbnt: false});
			this.setState({nobnt: true});
			this.setState({radiobtnvalue: e.target.value});
		}

		if (e.target.name == "nobnt" && this.state.nobnt == false){
			this.setState({nobnt: true});
			this.setState({yesbnt: false});
			this.setState({radiobtnvalue: e.target.value});
		}else if (e.target.name == "nobnt" && this.state.nobnt == true){
			this.setState({nobnt: false});
			this.setState({yesbnt: true});
			this.setState({radiobtnvalue: e.target.value});
		}

	}

	// function to handle both possible functions form the deploy button
	_onDeploy() {
		if (this.state.displayName.length == 0 || this.state.urlName == 0 || this.state.schedule.label == 'Select Schedule Frequency') {
						this.setState({userStatus: "warning", userMessage: "Please enter all required fields", closeModule: false});
						this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
					}
			else {
				if (this.props.Mode === 'Add'){
				this._insertURLModule();
			}else if (this.props.Mode === 'Edit'){
				this._updateURLModule();
			};
		};
	}

	// Insert postdata array to the web-serives
	_insertURLModule(){
		let postData;
		postData = {Action: "Insert", EPRID: this.props.selectedApp[0].EPRID, AppName: this.props.selectedApp[0]['Asset Name'],DisplayName: this.state.displayName, Url: this.state.urlName, SchedulingTime: this.state.schedule.value, UserName: this.state.userName, EncryptedPassword: this.state.password, EmailAlert: this.state.radiobtnvalue};

		console.log ("TESTING POST" + JSON.stringify(postData))
		 $.ajax({
			 xhrFields: {
				 withCredentials: true
			 },
			 url: baseUrl + 'HealthCheckAutomation/ScheduleURL',
			 type: "POST",
			 datatype: 'json',
			 contentType: 'application/x-www-form-urlencoded',
			 data: postData,
			 success: function (status) {
				 console.log("success Post: " + status);
				 this.setState({userStatus: "ok", userMessage: "URL Check Saved", closeModule: true});
				this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			 }.bind(this),
			 error: function (xhr, status, err) {
				 console.error('#POST Error', status, err.toString());
				 this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
				this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			 }.bind(this)
		 });
	}


	// poulate postData array from JobID web-serives call above
	_updateURLModule  () {
		console.log("URL Module update");
	let postData;

		postData =
		{ 	Action: "Update",
			JobID: this.state.JobID,
			EIDS: this.state.EIDS,
			EPRID: this.state.EPRID,
			AppName: this.state.AppName,
			DisplayName: this.state.displayName,
			Url: this.state.urlName,
			SchedulingTime: this.state.schedule.value,
			UserName: this.state.userName,
			EncryptedPassword: this.state.password,
			EmailAlert: this.state.radiobtnvalue
		};
		console.log("TESTING UPDATE DATA " + postData);

		// Update URL module record from postData array
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			url: baseUrl + "HealthCheckAutomation/ScheduleURL",
			type: "POST",
			datatype: 'json',
			contentType: 'application/x-www-form-urlencoded',
			data: postData,
			success: function (status) {
				console.log("_updateURLModule : " + status);
				this.setState({userStatus: "ok", userMessage: "URL Check Updated", closeModule: true});
				this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('#POST Error', status, err.toString());
				this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
				this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			}.bind(this)
		});
	}

	// Delete URL Check from DB based on JobID and EIDS
	_deleteUrlModule () {
		  console.log("URL Module Delete");
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				url: baseUrl + "HealthCheckAutomation/ScheduleURL",
				type: "POST",
				datatype: 'json',
				contentType: 'application/x-www-form-urlencoded',
				data: {Action: "Delete", JobID: this.state.JobID, EIDS: this.state.EIDS},
				success: function (status) {
					console.log("_deleteServerModule: " + status);
					this.setState({userStatus: "ok", userMessage: "URL Check Deleted", closeModule: true});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this),
				error: function (xhr, status, err) {
					console.error('#POST Error', status, err.toString());
					this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this)
			});
	}

	// Close both parent and child layers, also close save layer if opened
	_onClose () {
		if (this.props.Mode === 'Add' && this.state.userStatus === 'ok') {
				    this.props.onClose();
		}
		
		if (this.props.Mode === 'Edit' && this.state.userStatus === 'ok') {
			this.props.onClose();
		}
		
		if(this.state.saved_layer){
			this.setState({saved_layer: false});
		}
		if(this.state.closeModule){
		   this._onCancel();
		}
	}

	// Close both child layers on click of cancle button
	_onCancel () {
		this.setState({
			isActive: false,
			displayName: '',
			appName: '',
			userName: '',
			password: '',
			yesBtn: false,
			noBtn: true,
			emailAlert: '0',
			schedule: {value:"0",label:"Select Schedule Frequency"}
		});
	}

	render() {
		//Data for postData array
		// console.log("Render of HCInput");
		// console.log(this.props.selectedApp)
		// console.log("displayName " + this.state.displayName);
		// console.log("urlName " + this.state.urlName);
		// console.log("userName " + this.state.userName);
		// console.log("password " + this.state.password);
		// console.log("scheduleoptions " + JSON.stringify(this.state.scheduleoptions));
		// console.log("Enable Alerts value " + this.state.radiobtnvalue);

		// Get date and time stamp for save layer
		let now = new Date();
		let dateFormat = now.getUTCFullYear() + "/" + Number(now.getMonth() + 1) + "/" + now.getDate();
		now.setHours(now.getHours());
		let isPM = now.getHours() >= 12;
		let isMidday = now.getHours() == 12;
		let min = now.getMinutes() ;
			if (now.getMinutes() < 10) {
				min = '0' + now.getMinutes();
			}
		let time = [now.getHours() - (isPM && !isMidday ? 12 : 0), min || '00'].join(':') + (isPM ? ' pm' : 'am');


		let saved_layer =  null;
	  if (this.state.saved_layer) {
				saved_layer = (
					<Layer flush={false} closer={true} >
						<Anchor align={"end"} icon={<CloseIcon size={"small"} />} onClick={this._onClose}/>
						<Form pad="small">
							<Header pad={{vertical: "small"}, {horizontal: "small"}} >
								<Header pad={{horizontal: "large"}} >
									<Status value={this.state.userStatus} size = {'large'}/>
								</Header>
								<Heading tag="h2" align ={"start"}>{this.state.userMessage}</Heading>
								</Header>
								<Header pad={"small"} alignSelf = {"end"}>
								<Header pad={{horizontal: "small"}} >
									<Heading tag="h3" align = {"end"} >{dateFormat}</Heading>
								</Header>
								<Heading tag="h3" align = {"end"} >{time}</Heading>
							</Header>
						</Form>
					</Layer> ) ;
		}

		return (

	   <div >
			{this.state.isActive && <div>
	       <Section >
		   {saved_layer}
					  <Heading align="center" strong={true} tag="h3"> URL Check </Heading>
						<FormField label="Display Name *">
							<input id="displayName" maxLength={40} type="text" value={this.state.displayName}  onChange={(e) => this.setState({displayName: e.target.value})} />
						</FormField>
						<br/>
						<FormField label="URL *">
								<input id="serverName" maxLength={100} type="text" value={this.state.urlName} onChange={(e) => this.setState({urlName: e.target.value})} />
						</FormField>
						<br/>{/*
						<FormField label="User Name - (optional)" >
							<input id="userName" maxLength={40} type="text" value={this.state.userName}  onChange={(e) => this.setState({userName: e.target.value})} />
						</FormField>
						<br/>
						<FormField label="Password - (optional)" >
							<input id="password" type="password" maxLength={20}  onChange={(e) => this.setState({password: e.target.value})} />
						</FormField>
						<br/>
						*/}
						<FormField label="Schedule Your Service Check *">
							  <Select id="shedule" value={this.state.schedule.label} options={this.state.schedules} onChange={(e) => this._selectschedule(e)}/>
						</FormField>
						 <br/>
						 <FormField label="Enable Alerts *">
							 <Header pad={{horizontal: "medium"}}>
								 <RadioButton id="yesbnt" name="yesbnt" value = "1" label="Yes" checked={this.state.yesbnt} onChange={(e) => this._onchangeraidobtn(e)}/>
								 <RadioButton id="nobnt" name="nobnt" value = "0" label="No" checked={this.state.nobnt} onChange={(e) => this._onchangeraidobtn(e)}/>
							 </Header>
						 </FormField>
						<br/>

					  	{
						this.props.Mode == 'Add'
							?
							<Footer align="center" pad={{"vertical": "medium"}}>
							  <Box basis="1/2" margin={{horizontal: "large"}}>
								 <Button label="Deploy" primary={true} onClick={this._onDeploy} />
								</Box>
								<Box basis="1/2" margin={{horizontal: "large"}}>
								 <Button label="Cancel" primary={true} onClick={this._onCancel} />
								</Box>
								<Box />
						  </Footer>

							:  null
						}

						{
						this.props.Mode == "Edit"
							?
							<Footer align="center" pad={{"vertical": "medium"}}>
							  <Box basis="1/3" margin={{horizontal: "large"}}>
							     <Button label="Deploy" primary={true} onClick={() => this._onDeploy()} />
								</Box>
								<Box basis="1/3" margin={{horizontal: "large"}}>
									 <Button label="Delete" primary={true} onClick={() => this._deleteUrlModule()} />
								</Box>
								<Box basis="1/3" margin={{horizontal: "large"}}>
	 						     <Button label="Cancel" primary={true} onClick={() => this._onCancel()} />
								</Box>
								<Box />
						  </Footer>

							: null

						}
			   </Section>
					</div>}
			   </div>
				);
		  }
}

URLModule.propTypes = {
	Mode: React.PropTypes.string.isRequired,
	selectedApp: React.PropTypes.array,
	JobID: React.PropTypes.string,
	userEmail: React.PropTypes.string,
	onClose: React.PropTypes.func,
};

const mapStatetoProps = ({userEmail}) => ({userEmail});
export default connect(mapStatetoProps, {})(URLModule);
