import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard} from '../../actions';

import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import CloseIcon from 'grommet/components/icons/base/Close';
import EmailAlert from './EmailAlert';
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
import RadioButton from 'grommet/components/RadioButton';

//let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
// let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
// let baseUrlLocal = "http://localhost:4001/ddm/";


class EmailSub extends Component {
	constructor(props) {
    super(props);
    this.state = {
		EmptyBox: '',
		SaveToast: false,
		CloseToast: false,
		EmailAlertOpen: false,
		EditExistingSubs: false,
		saved_layer: false,
		Delete_layer: false,
		currentFilter: '',
		SelectedEPRID: [],
		SelectedSubs: [],
		Existing_Subs: [],
		filterList: [],
		serviceData1: [],
		serviceData2: [],
		serviceData3: [],
		combinedAlertData: [],
		combinedSubData: [],
		postData: [],
		AddNewSub: false,
		isCB1Checked: false,
		CB1_name: null,
		isCB2Checked: false,
		CB2_name: null,
		isCB3Checked: false,
		CB3_name: null,
		radio_btn1: true,
		radio_btn2: false,
		Frequency: "daily"
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
	this._checkBox3Onchange = this._checkBox3Onchange.bind(this);
	this._raidoBtn1Onchange = this._raidoBtn1Onchange.bind(this);
	this._sendNewSubscriptions = this._sendNewSubscriptions.bind(this);
	this._onClickcheckbox1 = this._onClickcheckbox1.bind(this);
	this._onClickcheckbox2 = this._onClickcheckbox2.bind(this);
	this._onClickcheckbox3 = this._onClickcheckbox3.bind(this);	 // might be needed
	this._EditSubscriptionsData = this._EditSubscriptionsData.bind(this);
	this._raidoBtnChecked = this._raidoBtnChecked.bind(this);
	this._OpenEmailLayer = this._OpenEmailLayer.bind(this);

  }

  componentWillMount() {
    console.log('EmailSubscription componentWillReceiveProps');
  }

  componentDidMount() {
	console.log('EmailSubscription componentWillReceiveProps');
	// populates the eprid list to make it searchable
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


		/* Retrieve data for Existing Subscriptions */
		$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Subscription",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({serviceData1: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open RFC";})});
				this.setState({serviceData2: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Service Account Expiration";})});
				this.setState({serviceData3: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Assets Management Overview";})});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

    }


	componentWillReceiveProps() {
		/* Retrieve data for Existing Subscriptions on change of props */
		$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Subscription",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({serviceData1: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Open RFC";})});
				this.setState({serviceData2: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Service Account Expiration";})});
				this.setState({serviceData3: this._initialdata.filter(function(asset) {return asset.SERVICE_NAME == "Assets Management Overview";})});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		/* logging the data pulled from the web services, 0 - raw data 1- filtered on Open IM Ticket 2-filtered on Open IM Ticket Open Major Escalation Ticket */
		console.log("Existing_Subs " + JSON.stringify(this._initialdata));
		console.log("serviceData1 " + JSON.stringify(this.state.serviceData1));
		console.log("serviceData2 " + JSON.stringify(this.state.serviceData2));
		console.log("serviceData3 " + JSON.stringify(this.state.serviceData3));


		/* merging data into unique EPRIDS array with service_name array  */
		let obj = {};
		this.setState({combinedSubData: this.state.serviceData1.concat(this.state.serviceData2,this.state.serviceData3).reduce(function(r, e) {
			if (!obj[e.EPRID]) {
				obj[e.EPRID] = {
					EPRID: e.EPRID,
					ASSET_NAME: e.ASSET_NAME,
					FREQUENCY: e.FREQUENCY,
					service_name: []

				};
			r.push(obj[e.EPRID]);
			}
			obj[e.EPRID].service_name.push(e.SERVICE_NAME);
				return r;
			}, [])
		});


			$.ajax({
			xhrFields: {
			withCredentials: true
			},
			type: "GET",
            url: "https://c9w24829.itcs.hpecorp.net/DDM/Email/Get_User_All_Subscription/Notification",
			dataType: "json",
            success: function(data) {
				this._initialdata = data;
				this.setState({combinedAlertData: this._initialdata});
            }.bind(this),
            error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
            }.bind(this)
        });

		console.log("combinedData Alert" + JSON.stringify(this.state.combinedAlertData));

    }

	/* On Click of the Close button to close layer and show toast */
	_onClose () {
		this.props.onClose();
		this.setState({currentFilter: '', CloseToast: true});
		if(this.state.saved_layer === true){
			this.setState({saved_layer: false});
		}
		if(this.state.EditExistingSubs === true){
			this.setState({EditExistingSubs: false});
		}
	}

	/* On Click of the close button for Delete layer*/
	_onCloseDelete () {
		if(this.state.delete_layer === true){
			this.setState({delete_layer: false});
		}
	}

	/* On Click of the Close button in Existing Subscriptions panel */
	_onCloseExisting  () {
		if(this.state.EditExistingSubs === true){
			this.setState({EditExistingSubs: false});
		}
	}

	_OpenEmailLayer(){
		this.props._OpenEmailLayer2();
	}

	/* On Click of the trash can for ADD New Notifications to remove the wrongly added EPRID */
	_onDelete (EPRID) {

		console.log('Value clicked ' + EPRID);
		console.log('complete list of EPRIDS ' + this.state.SelectedEPRID);
		let tmp_DeletedSubscription;
		tmp_DeletedSubscription = this.state.SelectedEPRID.filter(function (el) {
			return (el != EPRID);
		});

		this.setState({SelectedEPRID: tmp_DeletedSubscription});
		console.log('filtered ' + JSON.stringify(this.state.SelectedEPRID));
	}

	/* On Click of the Delete button for Edit Existing Subscriptions to fully remove Subscription */
	_onDeleteExisting (EPRID) {

		let tmp_Existing_Subs;
		tmp_Existing_Subs = this.state.combinedSubData.filter(function (el) {
			return (el != EPRID);
		});
		console.log("tmp_exis " + JSON.stringify(tmp_Existing_Subs));
		this.setState({combinedSubData: tmp_Existing_Subs});
		this.state.delete_layer ? this.setState({delete_layer: false}) : this.setState({delete_layer: true});
		console.log('New Existing Subscriptions ' + JSON.stringify(this.state.combinedSubData));
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

	/* On Click of checkbox 2 get and save target value and name*/
	_onClickcheckbox3 (e) {
		this.setState({isCB3Checked: (e.target.checked)});
		this.setState({CB3_name: (e.target.id)});
	}


	/* On Change of  Open RFC for Edit Existing Subscriptions */
    _checkBox1Onchange(e,obj) {
		if (e.target.checked === true) {
			console.log ("Open RFC Should be true");
			console.log ("value checkbox 1 " + JSON.stringify(obj));
			let i = (obj.service_name.length);
			obj.service_name[i] = "Open RFC";
			console.log ("obj " + JSON.stringify(obj));
		}else if (obj.service_name.length != 0) {
			console.log ("Open RFC should be False");
			let RFC_index = obj.service_name.indexOf("Open RFC");
			console.log ("RFC_index" + RFC_index);
			obj.service_name.splice(RFC_index,1);
			console.log ("value of obj " + JSON.stringify(obj));
		}

		let index = this.state.combinedSubData.findIndex(x => x.EPRID == obj.EPRID);
		this.state.combinedSubData[index] = obj;
		console.log ("value of combinedSubData " + JSON.stringify(this.state.combinedSubData));

		let tmp_combinedSubData;
		tmp_combinedSubData = this.state.combinedSubData;
		this.setState({combinedSubData: tmp_combinedSubData});

	}


	/* On Change of  Open IM for Edit Existing Subscriptions */
    _checkBox2Onchange(e,obj){
		if (e.target.checked === true) {
			console.log ("Service Account Expiration Should be true");
			console.log ("value checkbox 2 " + JSON.stringify(obj));
			let i = (obj.service_name.length);
			obj.service_name[i] = "Service Account Expiration";
		}else if (obj.service_name.length != 0) {
			console.log ("Service Account Expiration should be False");
			let SAE_index = obj.service_name.indexOf("Service Account Expiration");
			console.log ("SAE_index" + SAE_index);
			obj.service_name.splice(SAE_index,1);
			console.log ("value of obj " + JSON.stringify(obj));
		}

		let index = this.state.combinedSubData.findIndex(x => x.EPRID == obj.EPRID);
		console.log ("TEST " + index);
		this.state.combinedSubData[index] = obj;
		console.log ("value of combinedSubData " + JSON.stringify(this.state.combinedSubData));

		let tmp_combinedSubData;
		tmp_combinedSubData = this.state.combinedSubData;
		this.setState({combinedSubData: tmp_combinedSubData});
	}

	_checkBox3Onchange(e,obj){
		if (e.target.checked === true) {
			console.log ("Assets Management Overview Should be true");
			console.log ("value checkbox 3 " + JSON.stringify(obj));
			let i = (obj.service_name.length);
			obj.service_name[i] = "Assets Management Overview";
		}else if (obj.service_name.length != 0) {
			console.log ("Assets Management Overview should be False");
			let AMO_index = obj.service_name.indexOf("Assets Management Overview");
			console.log ("AMO_index" + AMO_index);
			obj.service_name.splice(AMO_index,1);
			console.log ("value of obj " + JSON.stringify(obj));
		}

		let index = this.state.combinedSubData.findIndex(x => x.EPRID == obj.EPRID);
		console.log ("TEST " + index);
		this.state.combinedSubData[index] = obj;
		console.log ("value of combinedSubData " + JSON.stringify(this.state.combinedSubData));

		let tmp_combinedSubData;
		tmp_combinedSubData = this.state.combinedSubData;
		this.setState({combinedSubData: tmp_combinedSubData});
	}

   /* On Click on save button send data in Add New Notifications */
	_sendNewSubscriptions(){

		console.log("New Added Subscriptions " + this.state.SelectedEPRID);

		if (this.state.radio_btn1 == true){
			this.setState({Frequency: "daily"});
		}else if (this.state.radio_btn2 == true){
			this.setState({Frequency: "weekly"});
		}

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

		if (this.state.CB3_name != null){
			this.setState({isCB3Checked: (this.state.isCB3Checked)});
			this.setState({CB3_name: (this.state.CB3_name )});
			console.log("changed 3");
			console.log(this.state.CB3_name + " " + this.state.isCB3Checked);
		} else console.log("unchanged 3");

		console.log("ServerJustification post...");
		console.log(this.state.CB1_name + " " + this.state.isCB1Checked);
		console.log(this.state.CB2_name + " " + this.state.isCB2Checked);
		console.log(this.state.CB3_name + " " + this.state.isCB3Checked);

		console.log("Testing postdata" + this.state.postData);

	/* maps newely added EPRIDS and checkbox values to postdata array */
		this.state.SelectedEPRID.map(ele => {
			console.log ("eprids + " + ele);
			if (this.state.isCB1Checked === true && this.state.isCB2Checked === true && this.state.isCB3Checked === true ) {
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB1_name,FREQUENCY: this.state.Frequency},{EPRID: parseInt(ele),SERVICE_NAME: this.state.CB2_name,FREQUENCY: this.state.Frequency}, {EPRID: parseInt(ele),SERVICE_NAME: this.state.CB3_name,FREQUENCY: this.state.Frequency});

			}else if (this.state.isCB1Checked === true && this.state.isCB2Checked === true && this.state.isCB3Checked === false){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB1_name,FREQUENCY: this.state.Frequency},{EPRID: parseInt(ele),SERVICE_NAME: this.state.CB2_name,FREQUENCY: this.state.Frequency});

			}else if (this.state.isCB1Checked === true && this.state.isCB2Checked === false && this.state.isCB3Checked === true){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB1_name,FREQUENCY: this.state.Frequency},{EPRID: parseInt(ele),SERVICE_NAME: this.state.CB3_name,FREQUENCY: this.state.Frequency});

			}else if (this.state.isCB1Checked === false && this.state.isCB2Checked === true && this.state.isCB3Checked === true){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB2_name,FREQUENCY: this.state.Frequency},{EPRID: parseInt(ele),SERVICE_NAME: this.state.CB3_name,FREQUENCY: this.state.Frequency});

			}else if (this.state.isCB1Checked === true && this.state.isCB2Checked === false && this.state.isCB3Checked === false){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB1_name,FREQUENCY: this.state.Frequency});

			}else if (this.state.isCB1Checked === false && this.state.isCB2Checked === false && this.state.isCB3Checked === true){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB3_name,FREQUENCY: this.state.Frequency});
			}else if (this.state.isCB1Checked === false && this.state.isCB2Checked === true && this.state.isCB3Checked === false){
				this.state.postData.push({EPRID: parseInt(ele),SERVICE_NAME: this.state.CB2_name,FREQUENCY: this.state.Frequency});
			}else
				console.log("Can Post invalid data");
			}
		);

	/* maps existing Subscriptions with changes to services types */
		if (this.state.combinedSubData != null) {
			this.state.combinedSubData.map((data) => {
				console.log ("length" + data.service_name.length);
				if (data.service_name.length > 1){
					this.state.postData.push({EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[0]),FREQUENCY: (data.FREQUENCY)},{EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[1]),FREQUENCY: (data.FREQUENCY)},{EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[2]),FREQUENCY: (data.FREQUENCY)});
				}else if (data.service_name.length > 0){
					this.state.postData.push({EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[0]),FREQUENCY: (data.FREQUENCY)},{EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[1]),FREQUENCY: (data.FREQUENCY)});
				}else
					this.state.postData.push({EPRID: (data.EPRID),SERVICE_NAME:(data.service_name[0]),FREQUENCY: (data.FREQUENCY)});
				});
			console.log("NEW postdata   " + JSON.stringify(this.state.postData));
		}

		/* maps existing alerts with changes to services types */
		if (this.state.combinedAlertData != null) {
				this.state.combinedAlertData.map((obj) => {
					console.log("TESTING ***** " + JSON.stringify(obj));
					this.state.postData.push (obj);
				console.log("NEW Testing postdata after combinedAlertData  " + JSON.stringify(this.state.postData));
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

			this.setState({currentFilter: '', SaveToast: true, SelectedEPRID: [], combinedSubData: [], postData: [], isCB1Checked: false, isCB2Checked: false, isCB3Checked: false, CB1_name: null, CB2_name: null, CB3_name: null, EditExistingSubs: false, AddNewSub: false});
			this.state.saved_layer ? this.setState({saved_layer: false}) : this.setState({saved_layer: true});
		}



	/* On Click of the Downward arrow to allow you add new Subscriptions */
	_onAdd () {
		console.log("&& combinedAlertData &&" + JSON.stringify(this.state.combinedAlertData));
		if(this.state.AddNewSub === false){
			this.setState({AddNewSub: true});
		} else if (this.state.AddNewSub === true){
			this.setState({AddNewSub: false});
		}
	}


	/* On Click of the Edit button for Existing Subscriptions */
	_onEdit (data) {
		console.log ("value of data " + JSON.stringify(data));
		console.log ("combinedSubData before edit " + JSON.stringify(this.state.combinedSubData));
		if(this.state.EditExistingSubs === false){
			this.setState({EditExistingSubs: true});
		}

		console.log('Value clicked ' + data.EPRID);
		console.log('complete list of EPRIDS 2 ' + this.state.combinedSubData);

		let tmp_SelectedSubs;
		tmp_SelectedSubs = this.state.combinedSubData.filter(function (el) {
			return (el.EPRID == data.EPRID);
		});

		this.setState({SelectedSubs: tmp_SelectedSubs});
		console.log('filtered LIST ***  ' + JSON.stringify(this.state.SelectedSubs));

	}

	_raidoBtnChecked (e){
		if (e.target.id == "daily"){
			this.setState({radio_btn1: true});
			this.setState({radio_btn2: false});
			this.setState({Frequency: "daily"});
		}else if (e.target.id == "weekly"){
			this.setState({radio_btn2: true});
			this.setState({radio_btn1: false});
			this.setState({Frequency: "weekly"});
		}
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

  	/* On Change of  FREQUENCY for Edit Existing Subscriptions */
    _raidoBtn1Onchange(e,obj) {
		console.log("II@M HERE NIALL")
		if (e.target.checked === true && e.target.id == "daily") {
			console.log ("Daily Should be true");
			console.log ("value raido Btn 1 " + JSON.stringify(obj));
			obj.FREQUENCY = "Daily";
			console.log ("obj " + JSON.stringify(obj));
		}else if (e.target.checked === true && e.target.id == "weekly") {
			console.log ("Daily should be False");
			obj.FREQUENCY = "Weekly";
			console.log ("value of obj " + JSON.stringify(obj));
		}

		let index = this.state.combinedSubData.findIndex(x => x.EPRID == obj.EPRID);
		this.state.combinedSubData[index] = obj;
		console.log ("value of combinedSubData " + JSON.stringify(this.state.combinedSubData));

		let tmp_combinedSubData;
		tmp_combinedSubData = this.state.combinedSubData;
		this.setState({combinedSubData: tmp_combinedSubData});

	}

	/* Create Edit alter Data bases on existing data */
	_EditSubscriptionsData(rowObj) {
		return rowObj.map((obj)=>{
			let new_cb1 = '';
			let new_cb2 = '';
			let new_cb3 = '';
			let new_rb1 = '';
			let new_rb2 = '';

			console.log ("CHICKEN ** " + JSON.stringify(rowObj));
			if (obj.service_name[0] == "Open RFC" || obj.service_name[1] == "Open RFC" || obj.service_name[2] == "Open RFC"){
				new_cb1 = true;
			}else
				new_cb1 = false;

			if (obj.service_name[0] == "Service Account Expiration" || obj.service_name[1] == "Service Account Expiration" || obj.service_name[2] == "Service Account Expiration"){
				new_cb2 = true;
			}else
				new_cb2 = false;

			if (obj.service_name[0] == "Assets Management Overview" || obj.service_name[1] == "Assets Management Overview" || obj.service_name[2] == "Assets Management Overview"){
				new_cb3 = true;
			}else
				new_cb3 = false;

			if (obj.FREQUENCY == "Daily"){
				new_rb1 = true;
			}else
				new_rb1 = false;

			if (obj.FREQUENCY == "Weekly"){
				new_rb2 = true;
			}else
				new_rb2 = false;


			console.log("***** CheckBox 1 should be ****" + new_cb1);
			console.log("*****  CheckBox 2 should be  ****" + new_cb2);

			return (
			<fieldset>
				<Heading tag="h3" strong={true}>
					{obj.EPRID} {obj.ASSET_NAME}
					<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onCloseExisting}/>
				</Heading>
				<Header pad={{vertical: "small"}} >
					<Heading tag="h3">Change Service Type</Heading>
				</Header>
				<fieldset>
					<CheckBox id="Open RFC" label="Open RFC Tickets" checked ={new_cb1} onChange={(e) => this._checkBox1Onchange(e, obj)} />
					<br />
					<CheckBox id="Service Account Expiration" label="Service Account Expiration" checked ={new_cb2} onChange={(e) => this._checkBox2Onchange(e, obj)} />
					<br />
					<CheckBox id="Assets Management Overview" label="Assets Management Overview" checked ={new_cb3} onChange={(e) => this._checkBox3Onchange(e, obj)} />
				</fieldset>
				<fieldset>
					<Heading tag="h3" > Delivery Frequency </Heading>
					<RadioButton id='daily' name='daily' label='daily (8am UTC)' checked={new_rb1} onChange={(e) => this._raidoBtn1Onchange(e, obj)}/>
					<br />
					<RadioButton id='weekly' tag="h3"name='weekly'label='weekly (8am UTC Mon)'checked={new_rb2} onChange={(e) => this._raidoBtn1Onchange(e, obj)}/>
				</fieldset>
			</fieldset>
			);
		});
	}


  render() {
	console.log('Render of EmailSubscription');
	console.log("combinedSubData down in Render " + JSON.stringify(this.state.combinedSubData));
	let that = this;
	let Email_Alert = <EmailAlert EmailAlertOpen={this.state.EmailAlertOpen} onClose={() => this.setState({EmailAlertOpen: false})} />;

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
						<Heading tag="h2" align ={"end"}>E-mail Subscription Saved</Heading>
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
						<Heading tag="h2" align = {"end"}>E-mail Subscription Deleted</Heading>
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
		save_toast = (<Toast status="ok" onClose={() => this.setState({SaveToast: false})}> E-Mail Subscriptions Saved </Toast>) ;
	}

	let close_toast = null;
	if (this.state.CloseToast) {
		close_toast = (<Toast status="critical" onClose={() => this.setState({CloseToast: false})}> E-Mail Closed Without Saving </Toast>) ;
	}

	if (!this.props.EmailSubOpen) {
			return save_toast;
		} else {

		return (
		<div>
		{Email_Alert}
            <Layer closer={true} align="right">
				{saved_layer}
				{delete_layer}
				<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onClose}/>
				<Form pad="small">
					<Header pad={{vertical: "small"}} >
						<Heading tag="h1">E-mail Subscription</Heading>
					</Header>
					<FormFields>
						<fieldset>
							<Heading tag="h3" strong={true}> Edit Existing Subscriptions </Heading>
							<FormField>
							{
							this.state.combinedSubData.map(f => (
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
						this.state.EditExistingSubs
							?
							<fieldset>
								{that._EditSubscriptionsData(this.state.SelectedSubs)}
							</fieldset>

							:  null

						}


						<fieldset>
						<Heading tag="h3" strong={true}> Add New Subscriptions
							<Anchor align="end" >
								<CaretDownIcon   onClick={this._onAdd}/>
							</Anchor>
						</Heading>
						{
							this.state.AddNewSub
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
								<CheckBox id="Open RFC" label="Open RFC Tickets" onChange={(e) => this._onClickcheckbox1(e)} />
								<br />
								<CheckBox id="Service Account Expiration" label="Service Account Expiration" onChange={(e) => this._onClickcheckbox2(e)}/>
								<br />
								<CheckBox id="Assets Management Overview" label="Assets Management Overview" onChange={(e) => this._onClickcheckbox3(e)}/>
							</fieldset>
						<fieldset>
							<Heading tag="h3" > Delivery Frequency </Heading>
							<RadioButton id='daily' name='daily' label='daily (8am UTC)' checked={this.state.radio_btn1} onChange={(e) => this._raidoBtnChecked(e)}/>
							<br />
							<RadioButton id='weekly' tag="h3"name='weekly'label='weekly (8am UTC Mon)'checked={this.state.radio_btn2} onChange={(e) => this._raidoBtnChecked(e)}/>
						</fieldset>
						</fieldset>

						</Form>

						:  null
						}

						</fieldset>

					</FormFields>
					<Footer justify="between" />
					<Footer justify="between"  >
						<Button icon={<RadialIcon size="small" />} />
						<Button icon={<RadialSelectedIcon size="small" colorIndex={'ok'} />} />
						<Button label="<  E-Mail Alert  " primary={true} onClick={() => this._OpenEmailLayer ()} />
						<Button label="Save" primary={true} onClick={this._sendNewSubscriptions} />
					</Footer>
				</Form>
			</Layer>
			</div>
			);
		}
  }
}


EmailSub.propTypes = {
  EmailSubOpen:          React.PropTypes.bool.isRequired,
  _OpenEmailLayer2: 	 React.PropTypes.func.isRequired,
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
export default connect(mapStatetoProps, { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard})(EmailSub);
