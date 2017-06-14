import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addDashboard, setDefaultDashboard, setCurrentDashboard} from '../../actions';

import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import RadioButton from 'grommet/components/RadioButton';
import Footer from 'grommet/components/Footer';
import Toast from 'grommet/components/Toast';
import CheckBox from 'grommet/components/CheckBox';

// let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
 let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
// let baseUrlLocal = "http://localhost:4001/ddm/";

//These are the config objects for preset dashboards
/*TODO refactor these configs to a PresetDashboards.js file and ref from there. Similar to Dashboards.js */
let configDashboardTwo = {"name":"Asset Owner Dashboard","description":"Description for Asset Owner Dashboard","filter":[],"KPIs":[]};
let presetDashboardNameTwo = "Asset Owner Dashboard";




class DashboardSidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:       'Asset Owner Dashboard',
			ToastOpen:      false,
			customizedName: '', //user input in the text box
      customizedDescription: ''
		};
        this._duplicated = false;
        this._shouldBeDefault = false;
        this._onSave = this._onSave.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._appInitState = null;

	}

	componentWillReceiveProps(nextProps) {
		console.log('DashboardSideBar componentWillReceiveProps');
		this._appInitState = nextProps.dashboards;
		console.log('DashboardSideBar defaultDashboard is :'+this.props.defaultDashboard.payload);
        let userData = JSON.stringify(this._appInitState);

        let userObject = {
            dashboards: userData, userDefaultDashboard: nextProps.defaultDashboard
            };
            console.log('userData is '+userData);

         $.ajax({
              xhrFields: {
            withCredentials: true
            },
      			url: baseUrlPro + 'SaveUserProfile',
      			type: "POST",
      			//  contentType: 'application/json',
      			dataType: "text",
      			data: userObject ,
      			success: function(data) {
      			console.log(data);
            console.log('DashboardSidebar ajax success of DashboardSidebar Post');

            }.bind(this),
            error: function(xhr, status, err) {
			        console.log('The Data is '+ JSON.stringify(userObject));
              con
			  sole.error('#GET Error', status, err.toString());
            }.bind(this)
          });
    }




	_onSave() {
		console.log('DashboardSidebar Save is clicked');
		let email =  this.props.userEmail;
		let userDefaultDashboard=  this.props.defaultDashboard;
		console.log('Dashboard check userEmail');
		console.log(this.props.userEmail);

    // check if the name exists
    // first, need to clear the previous value
    this._duplicated = false;
    let newName = (this.state.customizedName !== '')? this.state.customizedName : this.state.selected;
	  if (this._shouldBeDefault) {
  		this.props.setDefaultDashboard(newName);
  		userDefaultDashboard=this.props.setDefaultDashboard(newName).payload;
    }
    for (let i = 0; i < this.props.dashboards.length; i++) {
      if (newName === this.props.dashboards[i].name) {
        this._duplicated = true;
        break;
      }
    }
    if (!this._duplicated) {
      let descrip = (this.state.customizedDescription === '')?
          ('')
          : this.state.customizedDescription;

        //If this is a preset dashboard use the config for that
        if(this.state.selected == presetDashboardNameTwo)
        {
            let filter = configDashboardTwo.filter;
            let kpi = configDashboardTwo.KPIs;
            this.props.addDashboard(newName, descrip, filter, kpi);
        }
        else{
            this.props.addDashboard(newName, descrip);
             console.log(newName);
        }
		this.setState({ToastOpen: true, selected: 'Asset Owner Dashboard', customizedName: '', customizedDescription: ''});
		this.props.onClose();
		this.props.setCurrentDashboard(newName);
		}else {
			this.setState({ToastOpen: true, selected: 'Asset Owner Dashboard', customizedName: '', customizedDescription: ''});
			this.props.onClose();
			this.props.setCurrentDashboard(newName);
	}

  }


  _onCancel() {
    this.setState({selected: 'Asset Owner Dashboard', customizedName: '', customizedDescription: ''});
    this.props.onClose();
  }
  render() {
		let toast = null;
		if (this.state.ToastOpen) {
      toast = this._duplicated?
        (
          <Toast status="critical" onClose={() => this.setState({ToastOpen: false})}>
            A dashboard with the same name already exists. Please rename the dashboard.
          </Toast>
        ) : (
          <Toast status="ok" onClose={() => this.setState({ToastOpen: false})}>
            A new Dashboard is saved. You can find all your dashboards under your profile.
          </Toast>
        );
    }

		if (!this.props.LayerOpen) {
			return toast;
		} else {
			return (
				<Layer align="right">
					<Form onSubmit={(e) => e.preventDefault()}>
						<Header pad={{vertical: "medium"}} >
							<Heading tag="h1">Dashboard Creator</Heading>
						</Header>
						<FormFields>
							<fieldset>
							<legend>Select a Dashboard</legend>
              <FormField>
							{
								['Asset Owner Dashboard'].map((d, i) => (
										<RadioButton id={"radio-" + i}  key={"radio-" + i}
                      name={"Dashboard-" + i} label={d}
											onChange={() => this.setState({selected: d})}
											checked={this.state.selected === d} />
								))
							}
              </FormField>
							</fieldset>
							<fieldset>
								<legend>Give the Dashboard a Name</legend>
								<FormField htmlFor="name-input" size="large" >
									<input id="name-input" maxLength={31} type="text" placeholder={this.state.selected}
									onChange={(e) => this.setState({customizedName: e.target.value})}
									value={this.state.customizedName} />
								</FormField>
							</fieldset>
              <fieldset>
                <legend>Give the Dashboard a description</legend>
                <FormField label="" htmlFor="name-input2" size="large" >
                  <input id="name-input2" type="text" maxLength={70}
                    placeholder={"Description for " + ((this.state.customizedName === '')? this.state.selected : this.state.customizedName)}
                    onChange={(e) => this.setState({customizedDescription: e.target.value})}
                    value={this.state.customizedDescription} />
                </FormField>
              </fieldset>
              <fieldset>
                <CheckBox id="name-checkbox1" label="I want it as my default dashboard."
                  onChange={(e) => this._shouldBeDefault = e.target.checked} />
              </fieldset>
						</FormFields>
					</Form>
                  <Footer justify="between" />
                  <Footer justify="between" >
                    <Button label="Cancel" secondary={true} onClick={this._onCancel} />
                    <Button label="Save" primary={true} onClick={this._onSave} />
                  </Footer>
                  <Footer justify="between" />
				</Layer>
			);
		}
  }
}

DashboardSidebar.propTypes = {
  dashboards:          React.PropTypes.array.isRequired,
  addDashboard:        React.PropTypes.func.isRequired,
  setDefaultDashboard: React.PropTypes.func.isRequired,
  onClose:             React.PropTypes.func.isRequired,
  LayerOpen:           React.PropTypes.bool.isRequired,
  setCurrentDashboard: React.PropTypes.func.isRequired,
  defaultDashboard: React.PropTypes.string,
  userEmail: React.PropTypes.string.isRequired
};


const mapStatetoProps = ({ dashboards,userEmail ,defaultDashboard,currentDashboard}) => ({ dashboards,userEmail,defaultDashboard,currentDashboard });
export default connect(mapStatetoProps, { addDashboard, setDefaultDashboard,setCurrentDashboard})(DashboardSidebar);
