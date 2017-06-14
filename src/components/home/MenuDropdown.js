import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteDashboard, setCurrentDashboard, replaceState } from '../../actions';
import DashboardSidebar from './DashboardSidebar';
import DialogBox from './DialogBox';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';
import Toast from 'grommet/components/Toast';
import UserIcon from 'grommet/components/icons/base/User';
import AddIcon from 'grommet/components/icons/base/Add';
import CloseIcon from 'grommet/components/icons/base/Close';
import Pulse from 'grommet/components/icons/Pulse';


// let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
// let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
// let baseUrlLocal = "http://localhost:4001/ddm/";

let configDashboard = {"name":"Functional View: Daily Ops Review","description":"Daily Ops Review","filter":[],"KPIs":[]};


class MenuDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LayerOpen: false,
      ToastOpen: false,
      DialogBoxOpen: false
    };
    this._toClose = '';
    this._appInitState = null;
  }

    componentWillReceiveProps(nextProps) {
		console.log('MenuDropdown before Nextprop');
		console.log(this.props.userEmail);
		console.log('MenueDropdown defaultDashboard is :'+this.props.defaultDashboard.payload);

		this._appInitState = nextProps.dashboards;
        let userData = JSON.stringify(this._appInitState);
		let userObject = {
			dashboards: userData, email: this.props.userEmail, userDefaultDashboard: this.props.defaultDashboard
        };
    }

	render() {
    console.log('Render of MenuDropdown');
    let layer = <DashboardSidebar LayerOpen={this.state.LayerOpen} onClose={() => this.setState({LayerOpen: false})} />,
    toast = (this.state.ToastOpen)?
              (<Toast status="ok" onClose={() => this.setState({ToastOpen: false})} >
                  The dashboard has been deleted from your profile.
              </Toast>) : null,
    dialogBox = (this.state.DialogBoxOpen)?
                  (<DialogBox   class = "deleteDashboard" dialog={'Do you want to delete this dashboard?'}
                    onYes={() => {

                    if(this.props.dashboards != null)
                    {
                        this.props.deleteDashboard(this._toClose);

                    }
                    // check if the deleted dashboard is the current shown
                    if (this.props.currentDashboard === this._toClose) {
                      this.props.setCurrentDashboard('');
                    }
                    this.setState({DialogBoxOpen: false, ToastOpen: true});
                    }} onNo={() => this.setState({DialogBoxOpen: false})} />) : null;
		return (
      <div>
        {layer}
        {dialogBox}
        {toast}
        <Menu closeOnClick={true} justify="end" icon={<Pulse size="small" icon={<UserIcon size="small"/>} />} dropAlign={{right: 'right', top: 'top'}} inline={false} >
          <Header key={configDashboard.name} size="small" onClick={() => this.props.setCurrentDashboard(configDashboard.name)}>
            <Anchor label={configDashboard.name}/>
          </Header>
          {
            this.props.dashboards.map(({name}) => {
              if(name !== configDashboard.name) {
                return (
                  <Header key={name} size="small">
                    <Anchor label={name} onClick={() => this.props.setCurrentDashboard(name)}/>
                    <Button plain={true} icon={<CloseIcon />} onClick={() => {
                        this._toClose = name;
                        this.setState({DialogBoxOpen: true});
                      }}/>
                  </Header>
                );
              }
              else {
                return (
                  null
                );
              }

            })
          }
          <Anchor icon={<AddIcon />} label="Add Dashboard" onClick={() => this.setState({LayerOpen: true})} primary={true} />
        </Menu>
      </div>
    );
	}
}

MenuDropdown.propTypes = {
  dashboards:          React.PropTypes.array.isRequired,
  currentDashboard:    React.PropTypes.string.isRequired,
  deleteDashboard:     React.PropTypes.func.isRequired,
  setCurrentDashboard: React.PropTypes.func.isRequired,
  defaultDashboard: React.PropTypes.string,
  userEmail: React.PropTypes.string

};

const mapStatetoProps = ({ dashboards, currentDashboard, userEmail,defaultDashboard }) => ({ dashboards, currentDashboard, userEmail,defaultDashboard });
export default connect(mapStatetoProps, { deleteDashboard, setCurrentDashboard, replaceState })(MenuDropdown);
