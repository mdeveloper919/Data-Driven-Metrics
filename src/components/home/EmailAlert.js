import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard} from '../../actions';

import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import CloseIcon from 'grommet/components/icons/base/Close';
import EmailSub from './EmailSub';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import SearchInput from 'grommet/components/SearchInput';
import Status from 'grommet/components/icons/Status';
import Toast from 'grommet/components/Toast';
import EditIcon from 'grommet/components/icons/base/Edit';
import TrashIcon from 'grommet/components/icons/base/Trash';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import RadialSelectedIcon from 'grommet/components/icons/base/RadialSelected';
import RadialIcon from 'grommet/components/icons/base/Radial';

//let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
// let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
// let baseUrlLocal = "http://localhost:4001/ddm/";


class EmailAlert extends Component {
	constructor(props) {
    super(props);
    this.state = {
		EmptyBox: '',
		SaveToast: false,
		CloseToast: false,
		EmailSubOpen: false,
		EditExistingAlerts: false,
		saved_layer: false,
		Delete_layer: false,
		currentFilter: '',
		SelectedEPRID: [],
		SelectedAlert: [],
		Existing_Alerts: [],
		filterList: [],
		serviceData1: [],
		serviceData2: [],
		combinedData: [],
		combinedSubData: [],
		postData: [],
		AddNewNotifications: false,
		isCB1Checked: false,
		CB1_name: null,
		isCB2Checked: false,
		CB2_name: null
	};
	this._onDelete = this._onDelete.bind(this);
	this._onDeleteExisting = this._onDeleteExisting.bind(this);
	this._onClose = this._onClose.bind(this);
	this._onCloseExisting = this._onCloseExisting.bind(this);
	this._onCloseDelete = this._onCloseDelete.bind(this);
	this._onAdd = this._onAdd.bind(this);
	this._onEdit = this._onEdit.bind(this);
	this._checkBox1Onchange = this._checkBox1Onchange.bind(this);
	this._checkBox2Onchange = this._checkBox2Onchange.bind(this);
	this._sendNewAlerts = this._sendNewAlerts.bind(this);
	this._onClickcheckbox1 = this._onClickcheckbox1.bind(this);
	this._onClickcheckbox2 = this._onClickcheckbox2.bind(this);
	this._EditAlertsData = this._EditAlertsData.bind(this);
	this._OpenEmailLayer = this._OpenEmailLayer.bind(this);

  }

  componentWillMount() {
    console.log('EmailAlert componentWillReceiveProps');
  }

  componentDidMount() {
	// populates the eprid list to make it searchable
	console.log('EmailAlert componentWillReceiveProps');
	$.ajax({
	xhrFields: {
		withCredentials: true
		},
		type:"GET",
		url: 'https://c9w24829.itcs.hpecorp.net/ddm/FilterList/AssetList',
		dataType: 'json',
		success: function(data) {
			console.log('yes, this is a successful ajax of ChartSidebar get!');
			this._initialFilterList = data;
			this.setState({filterList: this._initialFilterList.map(function(asset) {return asset.AssetList;})});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
		});


		/* Retrieve data for Existing Alerts */
		$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Notification",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({serviceData1: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open IM Ticket";})});
				this.setState({serviceData2: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open Major Escalation Ticket";})});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

	}

	componentWillReceiveProps() {
		/* Retrieve data for Existing Alerts on change of props */
		$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Notification",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({serviceData1: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open IM Ticket";})});
				this.setState({serviceData2: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open Major Escalation Ticket";})});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		/* logging the data pulled from the web services, 0 - raw data 1- filtered on Open IM Ticket 2-filtered on Open IM Ticket Open Major Escalation Ticket */
		console.log("Existing_Alerts " + JSON.stringify(this._initialdata));
		console.log("serviceData1 " + JSON.stringify(this.state.serviceData1));
		console.log("serviceData1 " + JSON.stringify(this.state.serviceData2));


		/* merging data into unique EPRIDS array with service_name array  */
		let obj = {};
		this.setState({combinedData: this.state.serviceData1.concat(this.state.serviceData2).reduce(function(r, e) {
			if (!obj[e.EPRID]) {
				obj[e.EPRID] = {
					EPRID: e.EPRID,
					ASSET_NAME: e.ASSET_NAME,
					service_name: []
				};
			r.push(obj[e.EPRID]);
			}
			obj[e.EPRID].service_name.push(e.SERVICE_NAME);
				return r;
			}, [])
		});

		console.log("combinedData" + JSON.stringify(this.state.combinedData));

			$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Subscription",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({combinedSubData: this._initialdata});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

    }

	/* On Click of the Close button to close layer and show toast */
	_onClose () {
		this.props.onClose();
		this.setState({currentFilter: '', CloseToast: true});
		if(this.state.saved_layer === true){
			this.setState({saved_layer: false});
		}
	}

	/* On Click of the close button for Delete layer*/
	_onCloseDelete () {
		if(this.state.delete_layer === true){
			this.setState({delete_layer: false});
		}
	}

	/* On Click of the Close button in Existing Alerts panel */
	_onCloseExisting  () {
		if(this.state.EditExistingAlerts === true){
			this.setState({EditExistingAlerts: false});
		}
	}

	/* On Click of the trash can for ADD New Notifications to remove the wrongly added EPRID */
	_onDelete (EPRID) {

		console.log('Value clicked ' + EPRID);
		let tmp_DeletedAlert;
		tmp_DeletedAlert = this.state.SelectedEPRID.filter(function (el) {
			return (el != EPRID);
		});

		this.setState({SelectedEPRID: tmp_DeletedAlert});
		console.log('filtered ' + JSON.stringify(this.state.SelectedEPRID));
	}

	/* On Click of the Delete button for Edit Existing Alerts to fully remove Alert */
	_onDeleteExisting (EPRID) {

		let tmp_Existing_Alerts;
		tmp_Existing_Alerts = this.state.combinedData.filter(function (el) {
			return (el != EPRID);
		});
		console.log("tmp_exis " + JSON.stringify(tmp_Existing_Alerts));
		this.setState({combinedData: tmp_Existing_Alerts});
		this.state.delete_layer ? this.setState({delete_layer: false}) : this.setState({delete_layer: true});
		console.log('New Existing Alerts ' + JSON.stringify(this.state.combinedData));
	}

	/* On Click of checkbox 1 get and save target value and name*/
	_onClickcheckbox1 (e) {
		this.setState({isCB1Checked: (e.target.checked)});
		this.setState({CB1_name: (e.target.id)});
	}

	/* On Click of checkbox 2 get and save target value and name*/
	_onClickcheckbox2 (e) {
		this.setState({isCB2Checked: (e.target.checked)});
		this.setState({CB2_name: (e.target.id)});
   }

	/* On Change of  Major Escalation for Edit Existing Alerts */
    _checkBox1Onchange(e,obj) {
		if (e.target.checked === true) {
			console.log ("I Should be true");
			obj.service_name[1] = "Open Major Escalation Ticket";
			console.log ("obj " + JSON.stringify(obj));
		}else if (obj.service_name.length != 0) {
			console.log ("I should be False");
			obj.service_name.splice(1,2);
			console.log ("obj equal " + JSON.stringify(obj));
		}

		let index = this.state.combinedData.findIndex(x => x.EPRID == obj.EPRID);
		console.log ("Index is equal to " + index);
		//this.setState({combinedData[index]: (obj)});
		this.state.combinedData[index] = obj;
		console.log ("value of combinedData " + JSON.stringify(this.state.combinedData));

		let tmp_combinedData;
		tmp_combinedData = this.state.combinedData;
		this.setState({combinedData: tmp_combinedData});

	}

	/* On Change of  Open IM for Edit Existing Alerts */
    _checkBox2Onchange(e,obj){
		if (e.target.checked === true) {
			console.log ("I Should be true");
			obj.service_name[0] = "Open IM Ticket";
			obj.service_name[1] = "Open Major Escalation Ticket";
			console.log ("obj " + JSON.stringify(obj));
		}else if (obj.service_name.length != 0) {
			console.log ("I should be False " + obj.service_name.length);
			obj.service_name.splice(0,1);
			console.log ("obj equal " + JSON.stringify(obj));
		}

		let index = this.state.combinedData.findIndex(x => x.EPRID == obj.EPRID);
		console.log ("TEST " + index);
		//this.setState({combinedData[index]: (obj)});
		this.state.combinedData[index] = obj;
		console.log ("value of combinedData " + JSON.stringify(this.state.combinedData));

		let tmp_combinedData;
		tmp_combinedData = this.state.combinedData;
		this.setState({combinedData: tmp_combinedData});
	}

   /* On Click on save button send data in Add New Notifications */
	_sendNewAlerts(){

		console.log("New Added Alerts " + this.state.SelectedEPRID);

		let Frequency = "";
	/* gets updated values for both checkboxs */
		if (this.state.CB2_name != null){
			this.setState({isCB1Checked: (this.state.isCB1Checked)});
			this.setState({CB1_name: (this.state.CB1_name )});
			console.log("changed 1");
			console.log(this.state.CB1_name + " " + this.state.isCB1Checked);
		} else console.log("unchanged 1");

		if (this.state.CB1_name != null){
			this.setState({isCB2Checked: (this.state.isCB2Checked)});
			this.setState({CB2_name: (this.state.CB2_name )});
			console.log("changed 2");
			console.log(this.state.CB2_name + " " + this.state.isCB2Checked);
		} else console.log("unchanged 2");

		console.log("ServerJustification post...");
		console.log(this.state.CB1_name + " " + this.state.isCB1Checked);
		console.log(this.state.CB2_name + " " + this.state.isCB2Checked);

		console.log("Testing postdata" + this.state.postData);

	/* maps newely added EPRIDS and checkbox values to postdata array */
		this.state.SelectedEPRID.map(ele => {
			console.log ("eprids + " + ele);
			if (this.state.isCB1Checked === true && this.state.isCB2Checked === true) {
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB1_name,FREQUENCY: Frequency},{EPRID: parseInt(ele),SERVICE_NAME: this.state.CB2_name,FREQUENCY: Frequency});
			}else if (this.state.isCB1Checked === true && this.state.isCB2Checked === false){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME:this.state.CB1_name,FREQUENCY: Frequency});
			}else if (this.state.isCB2Checked === true && this.state.isCB1Checked === false){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME:this.state.CB2_name,FREQUENCY: Frequency});
			}else
				console.log("Can Post invalid data");
			}
		);

	/* maps existing alerts with changes to services types */
		if (this.state.combinedData != null) {
			this.state.combinedData.map((data) => {
				if (data.service_name.length > 0){
					this.state.postData.push({EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[0]),FREQUENCY: Frequency},{EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[1]),FREQUENCY: Frequency});
				}else this.state.postData.push({EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[0]),FREQUENCY: Frequency});});
			console.log("NEW Testing postdata 111  " + JSON.stringify(this.state.postData));
		}

	/* maps existing Subscription to post data */
		if (this.state.combinedSubData != null) {
			this.state.combinedSubData.map((data) => {
				this.state.postData.push (data);
			console.log("NEW  postdata after sub data added  " + JSON.stringify(this.state.postData));
		});
	}




	/*Posts postdata array to the web-serives */
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Update_Subscription",
			type: "POST",
			datatype: 'json',
			contentType: 'application/x-www-form-urlencoded',
			data: { data: this.state.postData },
			success: function (status) {
				console.log("_onDeleteExisting: " + status);
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('#POST Error', status, err.toString());
			}.bind(this)
		});

			this.setState({currentFilter: '', SaveToast: true, SelectedEPRID: [], combinedData: [], postData: [], isCB1Checked: false, isCB2Checked: false, CB1_name: null, CB2_name: null, EditExistingAlerts: false, AddNewNotifications: false});
			this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
		}



	/* On Click of the Downward arrow to allow you add new Alerts */
	_onAdd () {
		if(this.state.AddNewNotifications === false){
			this.setState({AddNewNotifications: true});
		} else if (this.state.AddNewNotifications === true){
			this.setState({AddNewNotifications: false});
		}
	}

	_OpenEmailLayer(){
		console.log("Open Email Layer method");
		this.props._OpenEmailLayer();
	}


	/* On Click of the Edit button for Existing Alerts */
	_onEdit (data) {
		if(this.state.EditExistingAlerts === false){
			this.setState({EditExistingAlerts: true});
		}

		console.log('Value clicked ' + data.EPRID);
		console.log('complete list of EPRIDS 2 ' + this.state.combinedData);

		let tmp_SelectedAlert;
		tmp_SelectedAlert = this.state.combinedData.filter(function (el) {
			return (el.EPRID == data.EPRID);
		});

		this.setState({SelectedAlert: tmp_SelectedAlert});
		console.log('filtered LIST ***  ' + JSON.stringify(this.state.SelectedAlert));

	}


	/* Allows users to search for EPRID */
	_searchInputOnchange(e) {

    if (e.target.value != '') {

        let newReg = new RegExp(e.target.value, 'gi');
        let assetlist = this.state.filterList;

        console.log("letter count: " + e.target.value.length);

        this.setState({
			filterList: assetlist.filter(d => newReg.test(d)),
			currentFilter: e.target.value
		});

    } else {
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			type:"GET",
			url: 'https://c9w24829.itcs.hpecorp.net/ddm/FilterList/AssetList',
			dataType: 'json',
			success: function(data) {
				console.log('yes, this is a successful ajax of ChartSidebar get!');
				this._initialFilterList = data;
				this.setState({currentFilter: "", filterList: this._initialFilterList.map(function(asset) {return asset.AssetList;})});
			}.bind(this),
			error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
			}.bind(this)
		});
    }
  }

	/* Create Edit alter Data bases on existing data */
	_EditAlertsData(rowObj) {
		return rowObj.map((obj)=>{
			let new_cb1 = '';
			let new_cb2 = '';

			if (obj.service_name[0] == "Open Major Escalation Ticket" || obj.service_name[1] == "Open Major Escalation Ticket"){
				new_cb1 = true;
			}else
				new_cb1 = false;

			if (obj.service_name[0] == "Open IM Ticket"){
				new_cb2 = true;
			}else
				new_cb2 = false;

			console.log("***** CheckBox 1 should be ****" + new_cb1);
			console.log("*****  CheckBox 2 should be  ****" + new_cb2);

			return (
			<fieldset>
				<Heading tag="h3" strong={true}>
					{obj.EPRID} {obj.ASSET_NAME}
					<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onCloseExisting}/>
				</Heading>
				<Header pad={{vertical: "small"}} >
					<Heading tag="h3">Select Service Type</Heading>
				</Header>
				<fieldset>
					<CheckBox id="Expiration_Date" label="Major Escalation Ticket" checked ={new_cb1} onChange={(e) => this._checkBox1Onchange(e, obj)} />
					<br />
					<CheckBox id="Open IM Ticket" label="Open IM Ticket" checked ={new_cb2} onChange={(e) => this._checkBox2Onchange(e, obj)} />
				</fieldset>
			</fieldset>
			);
		});
	}






  render() {
	console.log('Render of EmailAlert');
	console.log("combinedData down in Render " + JSON.stringify(this.state.combinedData));
	let that = this;
	let Email_Sub = <EmailSub EmailSubOpen={this.state.EmailSubOpen} onClose={() => this.setState({EmailSubOpen: false})} />;

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
							<Status value="ok" size = {'large'}/>
						</Header>
						<Heading tag="h2" align ={"end"}>E-mail Alert Saved</Heading>
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

	let delete_layer =  null;
	if (this.state.delete_layer) {
		delete_layer = (
			<Layer flush={false} closer={true} >
				<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onCloseDelete}/>
				<Form pad="small">
					<Header pad={{vertical: "small"}, {horizontal: "small"}} >
						<Header pad={{horizontal: "large"}} >
							<Status value="ok" size = {"large"}/>
						</Header>
						<Heading tag="h2" align = {"end"}>E-mail Alert Deleted</Heading>
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

	let save_toast = null;
	if (this.state.SaveToast) {
		save_toast = (<Toast status="ok" onClose={() => this.setState({SaveToast: false})}> E-Mail Alerts Saved </Toast>) ;
	}

	let close_toast = null;
	if (this.state.CloseToast) {
		close_toast = (<Toast status="critical" onClose={() => this.setState({CloseToast: false})}> E-Mail Closed Without Saving </Toast>) ;
	}

	if (!this.props.EmailAlertOpen) {
			return save_toast;
		} else {

		return (
		<div>
		{Email_Sub}
            <Layer closer={true} align="right">
				{saved_layer}
				{delete_layer}
				<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onClose}/>
				<Form pad="small">
					<Header pad={{vertical: "small"}} >
						<Heading tag="h1">E-mail Alert</Heading>
					</Header>
					<FormFields>
						<fieldset>
							<Heading tag="h3" strong={true}> Edit Existing Alerts </Heading>
							<FormField>
							{
							this.state.combinedData.map(f => (
									<Header key={f.index} size="small" justify="between">
									<Anchor align="end" label={f.EPRID + "  " + f.ASSET_NAME}  icon={<blank/>}/>
									<Anchor>
									<EditIcon id={f}  onClick={() => this._onEdit(f)}/>
										<TrashIcon  onClick={() => this._onDeleteExisting(f)}/>
									</Anchor>
								</Header>
								))
							}
							</FormField>
						</fieldset>

						{
						this.state.EditExistingAlerts
							?
							<fieldset>
								{that._EditAlertsData(this.state.SelectedAlert)}
							</fieldset>

							:  null

						}


						<fieldset>
						<Heading tag="h3" strong={true}> Add New Alerts
							<Anchor align="end" >
								<CaretDownIcon   onClick={this._onAdd}/>
							</Anchor>
						</Heading>
						{
							this.state.AddNewNotifications
							?

						<Form>
							<fieldset>
								<Header pad={{vertical: "small"}} >
								<Heading tag="h3">Select EPRID</Heading>
								</Header>
								<FormField>
									<SearchInput  id="searchInput" name="searchInput-1" placeHolder="Search Assets"
										value={this.state.currentFilter}
										onDOMChange={(e) => this._searchInputOnchange(e)}
										onSelect={({suggestion}) => { //when a list item is selected
											this.setState({currentFilter: suggestion});
											this.setState({currentFilter:(this.state.EmptyBox)}); // clear the input box upon selection
											// check if the suggestion already exists in the dashboard.
											let existing = false;
											this.state.SelectedEPRID.map(f => {
												if (f === suggestion) existing = true;
											});
											if (!existing) {
											this.state.SelectedEPRID.push(suggestion);
											}
										}}
										suggestions={this.state.filterList}
									/>
								</FormField>

								{
									this.state.SelectedEPRID.map(d => (
									<Header key={d} size="small" justify="between">
										<Anchor align="end" label={d} icon={<blank/>}/>
										<Anchor>
											<TrashIcon id={d}   onClick={() => this._onDelete(d)}/>
										</Anchor>
									</Header>
									))
								}

							</fieldset>

						<fieldset>
							<Header pad={{vertical: "small"}} >
								<Heading tag="h3">Select Service Type</Heading>
							</Header>
							<fieldset>
								<CheckBox id="Open Major Escalation Ticket" label="Major Escalation Ticket" onChange={(e) => this._onClickcheckbox1(e)} />
								<br />
								<CheckBox id="Open IM Ticket" label="Open IM Ticket" onChange={(e) => this._onClickcheckbox2(e)}/>
							</fieldset>
						</fieldset>

						</Form>

						:  null
						}

						</fieldset>

					</FormFields>
					<Footer justify="between" />
					<Footer justify="between" >
						<Button icon={<RadialSelectedIcon size="small" colorIndex={'ok'} />} />
						<Button icon={<RadialIcon size="small" />} />
						<Button label="E-Mail Subscription >" primary={true} onClick={() => this._OpenEmailLayer ()} />
						<Button label="Save" primary={true} onClick={this._sendNewAlerts} />
					</Footer>
				</Form>
			</Layer>
			</div>
			);
		}
  }
}


EmailAlert.propTypes = {
  EmailAlertOpen:        React.PropTypes.bool.isRequired,
  _OpenEmailLayer: 		 React.PropTypes.func.isRequired,
  dashboards:            React.PropTypes.array.isRequired,
  currentDashboard:      React.PropTypes.string.isRequired,
  addChart:              React.PropTypes.func.isRequired,
  addDashboardFilter:    React.PropTypes.func.isRequired,
  setDefaultDashboard:   React.PropTypes.func.isRequired,
  deleteDashboardFilter: React.PropTypes.func.isRequired,
  deleteChart:           React.PropTypes.func.isRequired,
  replaceState:          React.PropTypes.func.isRequired,
  onClose:               React.PropTypes.func.isRequired,
  defaultDashboard: 	 React.PropTypes.string
};


const mapStatetoProps = ({ dashboards, currentDashboard, userEmail,defaultDashboard }) => ({ dashboards, currentDashboard, userEmail,defaultDashboard });
export default connect(mapStatetoProps, { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard})(EmailAlert);
