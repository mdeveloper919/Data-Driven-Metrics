import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import Header from 'grommet/components/Header';
import TextInput from 'grommet/components/TextInput';
import Heading from 'grommet/components/Heading';
import Select from 'grommet/components/Select';
import Section from 'grommet/components/Section';
import RadioButton from 'grommet/components/RadioButton';
import Toast from 'grommet/components/Toast';
import Layer from 'grommet/components/Layer';
import Anchor from 'grommet/components/Anchor';
import CloseIcon from 'grommet/components/icons/base/Close';
import Form from 'grommet/components/Form';
import Status from 'grommet/components/icons/Status';

const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";

class DBModule extends Component {
	constructor(props) {
    super(props);
    this.state = {
			isActive: true,
			displayName: '',
			appName: '',
			serverAddr: '',
			databasePort: '',
			databaseName: '',
			userName: '',
			password: '',
			query: '',
			yesBtn: false,
			noBtn:	true,
			emailAlert: '0',
			EIDS: '',
			EPRID: '',
		  schedule: {value:"0",label:"Select Schedule Frequency"},
			schedules: [],
			schedulingTime: '',
			postData: {},
			saved_layer: false,
			encryptedPassword: '',
			userMessage: 'DB Logic Check Saved',
			userStatus: 'ok',
			closeModule: false
	  };

		this._onChangeRadioBtn = this._onChangeRadioBtn.bind(this);
		this._onDeploy = this._onDeploy.bind(this);
		this._onCancel = this._onCancel.bind(this);
		this._onClose = this._onClose.bind(this);
		this._deleteDBModule = this._deleteDBModule.bind(this);
		this._insertDBModule = this._insertDBModule.bind(this);
		this._updateDBModule = this._updateDBModule.bind(this);
		this._postInsert = this._postInsert.bind(this);
		this._postUpdate = this._postUpdate.bind(this);
		this._loadForm = this._loadForm.bind(this);
	}

  componentWillMount() {
		console.log("DBModule componentWillMount");
  }

  componentDidMount() {
	  console.log("DBModule componentDidMount");
		this._loadForm();
	}

  componentWillReceiveProps() {
	  console.log("DBModule componentWillReceiveProps");
		this.setState({isActive: true});
		if (this.props.Mode === 'Edit') {
			this._loadForm();
		}
  }

	_loadForm(){
    //Get schedule frequency for dropdown select component
		console.log("DBModule loadForm");
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
		 console.log("DBModule getJobID");

			if (this.props.Mode === 'Edit')
			{
				//Get record to edit by JobID
				this.serverRequest=
				$.ajax({
					xhrFields:{
						withCredentials: true
					},
					type:"GET",
					url: baseUrl + 'HealthCheckAutomation/Select_ScheduleDatabase?JobID=' + this.props.JobID,
					    dataType: 'json',
				      success: function(data) {
						     console.log('Get DBLogic Module Job ID AJAX success');
								 console.log(data);
								 this.setState({EIDS: data[0].EIDS,
																EPRID: data[0].EPRID,
																appName: data[0].AppName,
																displayName: data[0].DispName,
																serverAddr: data[0].ServerAdd,
																databasePort: data[0].DBPort,
																databaseName: data[0].DBName,
																schedulingTime: data[0].SchedulingTime,
																query: data[0].Query,
																emailAlert: data[0].EmailAlert,
																yesBtn: data[0].EmailAlert == 1 ? true : false,
																noBtn: data[0].EmailAlert == 0 ? true : false,
																userName: data[0].UserName
															});
									this._setSchedule();
					}.bind(this),
					 error: function(xhr, status, err) {
						console.error('#GET Error', status, err.toString());
					}.bind(this)
			    });
			}
	}

  _setSchedule() {
		  console.log("DBModule setSchedule");
			var sched = this.state.schedulingTime;
			var index = this.state.schedules.findIndex(function(element) {
					return element.value == sched;
					});
			this.setState({schedule: this.state.schedules[index]});
	}

	_formatSchedules() {
   //	web service returns DISPLAY_NAME, VALUE - Grommet Select dropdown component needs value, label
  //  console.log("In _setSchedules");
		console.log("DBModule formatSchedule");
		var temp = this.state.schedules;
		var temp2 = temp.map(function(item){
			return {value: item.VALUE, label: item.DISPLAY_NAME};
		});
		this.setState({schedules: temp2});
	//	console.log(this.state.schedules);
	}

	_insertDBModule () {
		  console.log("DB Logic Module insert");

			//workaround until encryption web service is working
			//remove this line, uncomment encrypt call, change to this.state.EncryptedPassword in setState postData
			this._postInsert();

			// Call web service to encrypt password user entered, then post data
			// console.log("encryptPassword");
			// $.ajax({
			// 	xhrFields: {
			// 	withCredentials: false
			// 	},
			// 	url: baseUrl + "DDOWebService/Encrypt",
			// 	type: "POST",
			// 	datatype: 'text',
			// 	contentType: 'application/json',
			// 	data: {"Password": this.state.password },
			// 	success: function(data) {
			// 		console.log('encrypt password AJAX success');
			// 		console.log(data);
			// 		this.setState({encryptedPassword: data});
			// 		this._postInsert();
			// 	}.bind(this),
			// 	error: function (xhr, status, err) {
			// 	 	console.error('#POST Error', status, err.toString());
			// 		this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
			// 		this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			// 	}.bind(this)
			// });
  }

	_postInsert() {
		  console.log("DB Logic Module postInsert");
			this.state.postData= {  Action: "Insert",
															EPRID: this.props.selectedApp[0].EPRID,
															AppName: this.props.selectedApp[0]['Asset Name'],
															DisplayName: this.state.displayName,
															ServerAdd: this.state.serverAddr,
															Query: this.state.query,
															DatabasePort: this.state.databasePort,
															DatabaseName: this.state.databaseName,
															SchedulingTime: this.state.schedule.value,
															EmailAlert: this.state.emailAlert,
															UserName: this.state.userName,
															EncryptedPassword: this.state.password };
			console.log(this.state.postData);

			// Insert DB Logic Module record from postData array
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				url: baseUrl + "HealthCheckAutomation/ScheduleDatabase",
				type: "POST",
				datatype: 'json',
				contentType: 'application/x-www-form-urlencoded',
				data: this.state.postData,
				success: function (status) {
					console.log("_insertDBModule: " + status);
					this.setState({postData: {}});
					this.setState({userStatus: "ok", userMessage: "DB Logic Check Saved", closeModule: true});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this),
				error: function (xhr, status, err) {
					console.error('#POST Error', status, err.toString());
					this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this)
			});
	}

	_updateDBModule () {
			console.log("DB Logic Module update");

			//workaround until encryption web service is working
			//remove this line, uncomment encrypt call, change to this.state.EncryptedPassword in setState postData
			this._postUpdate();

			// Call web service to encrypt password user entered, then post data
			// console.log("encryptPassword");
			// $.ajax({
			// 	xhrFields: {
			// 	withCredentials: false
			// 	},
			// 	url: baseUrl + "DDOWebService/Encrypt",
			// 	type: "POST",
			// 	datatype: 'text',
			// 	contentType: 'application/json',
			// 	data: {"Password": this.state.password },
			// 	success: function(data) {
			// 		console.log('encrypt password AJAX success');
			// 		console.log(data);
			// 		this.setState({encryptedPassword: data});
			// 		this._postUpdate();
			// 	}.bind(this),
			// 	error: function (xhr, status, err) {
			// 		console.error('#POST Error', status, err.toString());
			// 		this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
			// 		this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
			// 	}.bind(this)
			// });
		}

  _postUpdate() {
		  console.log("DB module postUpdate");
			this.state.postData = {Action: "Update",
														 EPRID: this.state.EPRID,
														 JobID: this.props.JobID,
														 EIDS: this.state.EIDS,
														 AppName: this.state.appName,
														 DisplayName: this.state.displayName,
														 ServerAdd: this.state.serverAddr,
														 Query: this.state.query,
														 DatabasePort: this.state.databasePort,
														 DatabaseName: this.state.databaseName,
														 SchedulingTime: this.state.schedule.value,
														 EmailAlert: this.state.emailAlert,
														 UserName: this.state.userName,
														 EncryptedPassword: this.state.password };
			console.log(this.state.postData);

			// Update DB Logic Module record from postData array
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				url: baseUrl + "HealthCheckAutomation/ScheduleDatabase",
				type: "POST",
				datatype: 'json',
				contentType: 'application/x-www-form-urlencoded',
				data: this.state.postData,
				success: function (status) {
					console.log("_updateDBModule: " + status);
					this.setState({postData: {}});
					this.setState({userStatus: "ok", userMessage: "DB Logic Check Updated", closeModule: true});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this),
				error: function (xhr, status, err) {
					console.error('#POST Error', status, err.toString());
					this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this)
			});
	}

	_deleteDBModule () {
		  console.log("DB Logic Module Delete");

			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				url: baseUrl + "HealthCheckAutomation/ScheduleDatabase",
				type: "POST",
				datatype: 'json',
				contentType: 'application/x-www-form-urlencoded',
				data: {Action: "Delete", JobID: this.props.JobID, EIDS: this.state.EIDS},
				success: function (status) {
					console.log("_deleteDBModule: " + status);
					this.setState({userStatus: "ok", userMessage: "DB Logic Check Deleted", closeModule: true});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this),
				error: function (xhr, status, err) {
					console.error('#POST Error', status, err.toString());
					this.setState({userStatus: "critical", userMessage: "Database Error", closeModule: false});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}.bind(this)
			});
	}


	_onChangeSchedule (event) {
			var selection ={value: event.value.value, label: event.value.label};
	    this.setState({schedule: selection});
	}

	_onChangeRadioBtn (e){
		 console.log("what's in e " + e.target.name);
		 if (e.target.name == "yesBtn" && this.state.yesBtn == false){
		 	this.setState({yesBtn: true});
			this.setState({noBtn: false});
			this.setState({emailAlert: '1'});
		}else if (e.target.name == "yesBtn" && this.state.yesBtn == true){
			this.setState({yesBtn: false});
			this.setState({noBtn: true});
			this.setState({emailAlert: '0'});
		}

		if (e.target.name == "noBtn" && this.state.noBtn == false){
			this.setState({noBtn: true});
			this.setState({yesBtn: false});
			this.setState({emailAlert: '0'});
		}else if (e.target.name == "noBtn" && this.state.noBtn == true){
			this.setState({noBtn: false});
			this.setState({yesBtn: true});
			this.setState({emailAlert: '1'});
		}
	}

	_onDeploy() {
		if (this.state.displayName.length == 0 || this.state.serverAddr.length == 0 || this.state.databasePort.length == 0 || this.state.databaseName.length == 0 ||
				this.state.query.length == 0 || this.state.schedule.value.length == 0 || this.state.schedule.label == 'Select Schedule Frequency' ||
				this.state.userName.length == 0 || this.state.password == '') {
					this.setState({userStatus: "warning", userMessage: "Please enter all required fields", closeModule: false});
					this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
				}
		else {
			if (this.props.Mode === 'Add'){
				 this._insertDBModule();
			}else if (this.props.Mode === 'Edit'){
				 this._updateDBModule();
			}
	 };
	}

	_onCancel () {
		this.setState({isActive: false,
									 displayName: '',
									 appName: '',
									 serverAddr: '',
									 databasePort: '',
									 databaseName: '',
									 userName: '',
									 password: '',
									 query: '',
									 yesBtn: false,
									 noBtn: true,
									 emailAlert: '0',
								   schedule: {value:"0",label:"Select Schedule Frequency"}
								 });
	}

	_onClose () {
		if(this.state.saved_layer){
			this.setState({saved_layer: false});
		}
		
		if (this.props.Mode === 'Edit' && this.state.userStatus === 'ok') {
			this.props.onClose();
		}
		
		if(this.state.closeModule){
		   this._onCancel();
		}
	}

	render() {
//		console.log("Render of DBModule");

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
					  <Heading align="center" strong={true} tag="h3"> {this.props.Mode} DB Logic Check </Heading>
						<FormField label="Display Name *">
							<input id="displayName" type="text" value={this.state.displayName} onChange={(e) => this.setState({displayName: e.target.value})}/>
						</FormField>
						<br/>
						<FormField label="Database Server Address *">
								<input id="serverAddress" type="text" value={this.state.serverAddr} onChange={(e) => this.setState({serverAddr: e.target.value})}/>
						</FormField>
						<br/>
						<FormField label="Database Port *">
							  <input id="databasePort" type="text" value={this.state.databasePort} onChange={(e) => this.setState({databasePort: e.target.value})}/>
						</FormField>
						<br/>
						<FormField label="Database Name *">
							  <input id="databaseName" type="text" value={this.state.databaseName} onChange={(e) => this.setState({databaseName: e.target.value})}/>
						</FormField>
						<br/>
						<FormField label="User Name *" >
								<input id="userName" type="text" value={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})}/>
						</FormField>
						<br/>
						<FormField label="Password *" >
								<input id="password" type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
						</FormField>
						<br/>
						<FormField label="Query *" >
							  <input id="query" type="text" value={this.state.query} onChange={(e) => this.setState({query: e.target.value})} />
						</FormField>
						<br/>
						<FormField label="Schedule Your DB Logic Check *">
							  <Select id="schedules" value={this.state.schedule.label} options={this.state.schedules} onChange={this._onChangeSchedule.bind(this)}/>
						</FormField>
						<br/>
						<FormField label="Enable Alerts">
							<Header pad={{horizontal: "medium"}}>
								 <RadioButton id="yesBtn" name="yesBtn" label="Yes" checked={this.state.yesBtn} onChange={(e) => this._onChangeRadioBtn(e)}/>
								 <RadioButton id="noBtn" name="noBtn" label="No" checked={this.state.noBtn} onChange={(e) => this._onChangeRadioBtn(e)}/>
							</Header>
						</FormField>
						{
						this.props.Mode == 'Add'
							?
							<Footer align="center" pad={{"vertical": "medium"}}>
							  <Box basis="1/2" margin={{horizontal: "large"}}>
							     <Button label="Deploy" primary={true} onClick={() => this._onDeploy()} />
								</Box>
								<Box basis="1/2" margin={{horizontal: "large"}}>
	 						     <Button label="Cancel" primary={true} onClick={() => this._onCancel()} />
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
									 <Button label="Delete" primary={true} onClick={() => this._deleteDBModule()} />
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

DBModule.propTypes = {
	Mode: React.PropTypes.string.isRequired,
	selectedApp: React.PropTypes.array,
	JobID: React.PropTypes.string
};

export default DBModule;
