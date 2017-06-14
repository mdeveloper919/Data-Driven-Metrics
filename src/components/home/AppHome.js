import React, { PropTypes } from 'react';
import AppHeader from './AppHeader';
import AppWrap from '@hpe/millstone/components/internal/sidebar/AppWrap';
import Layer from 'grommet/components/Layer';
import Form from 'grommet/components/Form';
import Footer from 'grommet/components/Footer';
import Anchor from 'grommet/components/Anchor';
import MyTips from './MyTips';
import Notification from 'grommet/components/Notification';
import { connect } from 'react-redux';
import {  addDashboard, replaceState, setUserEmail,setDefaultDashboard } from '../../actions';
import BrowserDetection from 'react-browser-detection';


//let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4001/";
let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";

const browserHandler = {
  chrome: () => null,
  edge: () => <div><Notification status='warning' size='large' state='Please use Google Chrome browser' message='EDGE browser is not supported on Data Driven Operations.'/></div>,
  ie: () => <div><Notification status='warning' size='large' state='Please use Google Chrome browser' message='IE browser is not supported on Data Driven Operations.'/></div>,
  firefox: () => <div><Notification status='warning' size='large' state='Please use Google Chrome browser' message='Firefox browser is not supported on Data Driven Operations.'/></div>,
};
let configDashboard = {"name":"Functional View: Daily Ops Review","description":"Daily Ops Review","filter":[],"KPIs":[]};


class AppHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: '',
      newUser: false,
      tip1: false,
      tip2: false,
      tip3: false,
      tip4: false,
      tip5: false,
      tip6: false,
      tip7: false
    };

   this.props.setUserEmail('');
   this._appInitState = null;

   //Bind the Tips added
   this.startTour = this.startTour.bind(this);
   this.toggleTip1 = this.toggleTip1.bind(this);
   this.toggleTip2 = this.toggleTip2.bind(this);
   this.toggleTip3 = this.toggleTip3.bind(this);
   this.isVisibleDash = this.isVisibleDash.bind(this);
   this.toggleTip4 = this.toggleTip4.bind(this);
   this.toggleTip5 = this.toggleTip5.bind(this);
   this.toggleTip6 = this.toggleTip6.bind(this);
   this.toggleTip7 = this.toggleTip7.bind(this);
   this.isVisibleTables = this.isVisibleTables.bind(this);
   this.openSideBar = this.openSideBar.bind(this);

  }

    componentWillMount( ) {

        let email;

        $.ajax({
          xhrFields: {
        withCredentials: true
        },
          url: baseUrlPro + 'GetUserProfile',
          dataType: "json",
          success: function(data) {

          console.log("data[0][0]" + JSON.stringify(data[0][0]));
          console.log("data[0][0].Dashboard " + typeof(data[0][0].Dashboard));


            //If userEmail has a dashboard cofig
            if(data[0][0].Dashboard != '[]' && data[0][0].Dashboard !== undefined)
            {
                let dashboardString = data[0][0].Dashboard;
                let dashboardArray = JSON.parse(dashboardString);

                console.log("existing dashboardString:" + dashboardString);
                this._appInitState = dashboardArray;
                this.props.replaceState(this._appInitState);

                console.log("dashboardArray" + JSON.stringify(dashboardArray));
                email = data[0][0].Email;
                console.log("user email on load: " + email);
				        this.props.setUserEmail(email);

                let defaultDashboard= data[0][0].DefaultDashboard;

                if(defaultDashboard)
                {
                  console.log("def dash: " + defaultDashboard);
                  this.props.setDefaultDashboard(defaultDashboard);
                }
                else
                {
                  let dashboardArray = [{"name":"Asset Owner Dashboard","description":"","filter":[],"KPIs":[]}];
                  this._appInitState = dashboardArray;
                  this.props.replaceState(this._appInitState);
                  let defaultDashboard = dashboardArray[0].name;
                  this.props.setDefaultDashboard(defaultDashboard);

                }

            }
            else{

              let dashboardArray = [{"name":"Asset Owner Dashboard","description":"","filter":[],"KPIs":[]}];

              console.log("new dashboardString:" + dashboardArray);
              this._appInitState = dashboardArray;
              this.props.replaceState(this._appInitState);
              let defaultDashboard= dashboardArray[0].name;
              this.props.setDefaultDashboard(defaultDashboard);
			        this.props.addDashboard(newName, descrip, filter, kpi);

              email = data[0][0].Email;
              console.log("user email on load: " + email);
              this.props.setUserEmail(email);
              this.setState({newUser:true});

            }

          }.bind(this),
          error: function(xhr, status, err) {
            console.error('#GET Error', status, err.toString());
          }.bind(this)
        });

        this.setState({isLoggedIn: true, email: email});
    }



  setMenuItems() {
    let menuItems = [];
    // menuItems.push(<Link key="0" to="Main" activeClassName="active">Main</Link>);	// example react-router link (app navigation)

    return (menuItems);
  }
  setHeaderItems() {
    let headerItems = [];
    headerItems.push(<AppHeader justify="end" key="0" toggleStartTour={this.startTour} newUser={this.state.newUser} />);//<<Passing IDs for tip toggles 1 and 2
    return (headerItems);
  }

  //Toggles for each tip!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  startTour(){
    //Have to check to see if any tip active before restarting a tour
    if((!this.state.tip1)&&(!this.state.tip2)&&(!this.state.tip3)&&(!this.state.tip4)&&(!this.state.tip5)&&(!this.state.tip6)&&(!this.state.tip7)){
      this.setState({tip1: true})
    } //Should unify these methods [Issue 2]!!!!!!
  }
  toggleTip1(){
    this.state.tip1 ? this.setState({tip1: false}) : this.setState({tip1: true});
  }
  toggleTip2(){
    this.state.tip2 ? this.setState({tip2: false}) : this.setState({tip2: true});
  }
  toggleTip3(){
    if(this.state.tip3){
      this.setState({tip3: false});
    }else{
      //only set tip7 true if GetElement(target) exists... otherwise no action needed???
      if(this.isVisibleDash()){
        this.setState({tip3: true});
      }else{
        this.setState({tip3: false});
      }
    }
  }
  toggleTip4(){
    this.state.tip4 ? this.setState({tip4: false}) : this.setState({tip4: true});
  }
  toggleTip5(){
    this.state.tip5 ? this.setState({tip5: false}) : this.setState({tip5: true});
  }

  toggleTip6(){
    if(this.state.tip6)
      {
        this.setState({tip6: false});
        document.getElementById('Cancel Edit Dashboard').click();

      }else{

        this.openSideBar();
        setTimeout(()=>{this.setState({tip6: true})}, 200);
      }
  }
  openSideBar(){
        var getEditDash = $(document.getElementById('Edit Dashboard'));
        getEditDash[0].click();
  }
  toggleTip7(){
    if(this.state.tip7){
      this.setState({tip7: false});
    }else{
      //only set tip7 true if GetElement(target) exists... otherwise no action needed???
      if(this.isVisibleTables()){
        this.setState({tip7: true});
      }else{
        this.setState({tip7: false});
      }
    }
  }
  isVisibleTables(){
        //return document.getElementById('tip7Target');
        var getTarget7 = $(document.getElementById('tip7Target'));
        return getTarget7[0];
  }

  isVisibleDash(){
        //return document.getElementById('tip7Target');
        var getTarget3 = $(document.getElementById('tip3Target'));
        return getTarget3[0];
  }

  render() {
  console.log('Render of AppHome');
    let menuItems = this.setMenuItems();
    let headerItems = this.setHeaderItems();
    let appIcon = require('../../images/cube_wt.svg');
    let menuIcon = require('../../images/cube_bk.svg');
      return (
          <AppWrap
            appTitle="Data Driven Operations"
            appIcon={appIcon}
            //menuIcon={menuIcon}
            //menuItems={menuItems}
            headerItems={headerItems}
            >
            {this.state.tip1 &&
                <MyTips id={0} target="tip1Target" toggle1={this.toggleTip1} toggle2={this.toggleTip2}
                content="Subscribe to Email Alert Service."
                prompt="Click me for tip 2"/>
            }
            {this.state.tip2 &&
                <MyTips id={1} target="tip2Target" toggle1={this.toggleTip2} toggle2={this.toggleTip3}
                content="View existing Dashboards & create new ones."
                prompt="Click me for tip 3"/>
            }
            {this.state.tip3 &&
                <MyTips id={2} target="tip3Target" toggle1={this.toggleTip3} toggle2={this.toggleTip4}
                content="Real time Notification bars to indicate any issue for your monitored assets."
                prompt="Click me for tip 4"/>
            }
            {this.state.tip4 &&
                <MyTips id={3} target="tip4Target" toggle1={this.toggleTip4} toggle2={this.toggleTip5}
                content="Click Pie or Legend to view Asset Health Check issue details."
                prompt="Click me for tip 5"/>
            }
            {this.state.tip5 &&
                <MyTips id={4} target="tip5Target" toggle1={this.toggleTip5} toggle2={this.toggleTip6}
                content="Click Pie or Legend to view Asset Management issue details."
                prompt="Click me for tip 6"/>
            }
            {this.state.tip6 &&
                <MyTips id={5} target="tip6Target" toggle1={this.toggleTip6} toggle2={this.toggleTip7}
                content="Edit dashboard via add or delete new charts."
                prompt="Click me for tip 7"/>
            }
            {this.state.tip7 &&
                <MyTips id={6} target="tip7Target" toggle1={this.toggleTip7}
                content="Click table cells for information drilldown."
                prompt="Click me to close Tip Tour"/>
            }

            <BrowserDetection>
              { browserHandler }
            </BrowserDetection>
            {this.props.children}
          </AppWrap>
      );
  }
}

AppHome.propTypes = {
  children: PropTypes.node,
  dashboards: React.PropTypes.array.isRequired,
  addDashboard: React.PropTypes.func.isRequired,
  replaceState: React.PropTypes.func.isRequired,
  defaultDashboard: React.PropTypes.string,
  setDefaultDashboard: React.PropTypes.func.isRequired,
  setUserEmail: React.PropTypes.func.isRequired
};



const mapStatetoProps = ({ dashboards, userEmail, defaultDashboard}) => ({ dashboards, userEmail, defaultDashboard});
export default connect(mapStatetoProps, {addDashboard, setDefaultDashboard, setUserEmail, replaceState})(AppHome);
