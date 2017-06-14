import React, { Component } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import DialogBox from './DialogBox';
import EmailAlert from './EmailAlert';
import EmailSub from './EmailSub';
import HCInput from '../home/HCInput';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import Launch from 'grommet/components/icons/base/Launch';
import Menu from 'grommet/components/Menu';
import MenuDropdown from './MenuDropdown';
import Pulse from 'grommet/components/icons/Pulse';
import ServicesIcon from 'grommet/components/icons/base/Services';


const headerStyle = {
	'paddingLeft': '60%',
	'color' : 'black'

    };

		const iconPosStyle = {
		'marginBottom': '2%',
		'paddingRight': '6%'
	    };

class AppHeader extends Component {
	constructor(props){
		super(props);
		this.state = {
		DialogBoxOpen: true,
		EmailAlertOpen: false,
		EmailSubOpen: false,
		HCInputOpen: false,
		};

		this._hideEmailAlert = this._hideEmailAlert.bind(this);
		this._hideEmailSub = this._hideEmailSub.bind(this);
		this._OpenEmailLayer = this._OpenEmailLayer.bind(this);

	}

	childToggleStartTour(e) {
		e.stopPropagation();
		if(this.state.DialogBoxOpen){
			this.setState({DialogBoxOpen: false})
		}
		this.props.toggleStartTour();
	}

	 _OpenEmailLayer () {
		 console.log("Open Email Layer method in AppHeader");
		 if (this.state.EmailAlertOpen == true){
			 this.setState ({EmailAlertOpen: false});
			 this.setState ({EmailSubOpen: true});
		 } else if (this.state.EmailSubOpen == true){
			 this.setState ({EmailSubOpen: false});
			 this.setState ({EmailAlertOpen: true});
	 }
	}

	_hideEmailAlert(){
		this.setState({EmailAlertOpen: false});
    }

	_hideEmailSub(){
		this.setState({EmailSubOpen: false});
    }

	render() {
		let dialogBox;
		if (this.state.DialogBoxOpen) {
			dialogBox = (<DialogBox dialog={"Looks Like you're New! Want to take a tour?"}
										onYes={this.childToggleStartTour.bind(this)}
										onNo={() => this.setState({DialogBoxOpen: false})} />);
		}

		let Email_Alert = <EmailAlert EmailAlertOpen={this.state.EmailAlertOpen} onClose={this._hideEmailAlert} _OpenEmailLayer={this._OpenEmailLayer}/>
		let Email_sub = <EmailSub EmailSubOpen={this.state.EmailSubOpen} onClose={this._hideEmailSub} _OpenEmailLayer2={this._OpenEmailLayer}/>
		let HC_Input = <HCInput HCInputOpen={this.state.HCInputOpen} onClose={() => this.setState({HCInputOpen: false})} />;

		let Email_Menu =
			<Menu closeOnClick={true} justify="end" icon={<Pulse size="small" icon={<ServicesIcon size="small"/>} />} dropAlign={{right: 'right', top: 'top'}} inline={false} >
				<Anchor onClick={() => {this.setState({EmailAlertOpen: true});}}>
					E-mail Alert
				</Anchor>
				<Anchor onClick={() => {this.setState({EmailSubOpen: true});}}>
					E-mail Subscription
				</Anchor>
				<Anchor onClick={() => {this.setState({HCInputOpen: true});}}>
					Health Check Module
				</Anchor>
		</Menu>

		return (
			<Box style={headerStyle}>
				{Email_Alert}
				{Email_sub}
				{HC_Input}
				<Header full={true} justify={"end"} key="Apphome-Header">
					<Box direction='row' style={iconPosStyle} >
						<Anchor id="start Tour"  onClick={this.childToggleStartTour.bind(this)}>
							<Pulse size="small" icon={<Launch size="small"/>} />
						</Anchor>
					</Box>
	        {Email_Menu}
					<p id="tip1Target"></p>
					{this.props.newUser && dialogBox}
					<MenuDropdown />
					<p  id="tip2Target"></p>
					<Label style={{"color": "white"}} id="user_email">{this.props.userEmail}</Label>
				</Header>
			</Box>

    );
  }
}

AppHeader.propTypes = {
  userEmail: React.PropTypes.string.isRequired,
};

const mapStatetoProps = ({ userEmail }) => ({ userEmail });
export default connect(mapStatetoProps)(AppHeader);
