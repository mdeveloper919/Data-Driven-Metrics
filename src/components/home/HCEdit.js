mport React, { Component } from 'react';
import { connect } from 'react-redux';
import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Layer from 'grommet/components/Layer';
import Toast from 'grommet/components/Toast';
import CloseIcon from 'grommet/components/icons/base/Close';
import URLModule from './URLModule';
import PingModule from './PingModule';
import ServerModule from './ServerModule';
import DBModule from './DBModule';



//let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
//let baseUrlLocal = "http://localhost:4001/ddm/";


class HCEdit extends Component {
	constructor(props) {
    super(props);
    this.state = {
		selectedKPI: 'Asset',
		EmptyBox: '', /* added to reset the state of the input box */
		ToastOpen: false,
		isDisplayed: true,
		currentFilter: '',
		modulevalue: '', // change this to an empty string
		SelectedEPRID: [],
		Existing_Notification: [],
		filterList: []
	};
	this._onSave = this._onSave.bind(this);
	this._onClose = this._onClose.bind(this);
  }

  componentWillMount() {
    console.log('HCEdit componentWillReceiveProps');
  }

  componentDidMount() {
	   console.log('HCEdit componentWillReceiveProps');
	}


  componentWillReceiveProps() {
     console.log('HCEdit componentWillReceiveProps');
  }

	_onSave () {
		this.setState({currentFilter: '', ToastOpen: true});
		this.props.onClose();
		console.log("TESTING 2222 " + JSON.stringify(this.state.filterList));

	}

	_onClose () {
		this.props.onClose();
		this.setState({currentFilter: '', ToastOpen: true});
	}

  render() {
	console.log('Render of HCEdit');
	let toast = null;
	if (this.state.ToastOpen) {
		toast = (<Toast status="ok" onClose={() => this.setState({ToastOpen: false})}> something went wrong </Toast>) ;
	}
	if (!this.props.HCEditOpen) {
			return toast;
		} else {

		return (
        <Layer closer={true} align="center">
				<Anchor align={"end"} icon={<CloseIcon size="small" />} onClick={this._onSave}/>
				<Article>
				  {
					  this.props.Module == "URL" ?
						<URLModule />
					  :null
				  }

				  {
					  this.props.Module == "Ping" ?
					  <PingModule  />

					  :null
				  }

				  {
					  this.props.Module == "DB" ?
					  <DBModule Mode={"Edit"} selectedApp={[]} JobID={this.props.JobID}/>

					  :null
				  }

				  {
					  this.props.Module == "Server" ?
					  <ServerModule Mode={"Edit"} selectedApp={[]} JobID={this.props.JobID} onClose={this._onClose}/>

					  :null
				  }
				</Article>
			</Layer>
			);
		}
  }
}


HCEdit.propTypes = {
	Module:  					   React.PropTypes.string.isRequired,
	JobID:							 React.PropTypes.string.isRequired,
  HCEditOpen:          React.PropTypes.bool.isRequired,
	onClose:             React.PropTypes.func.isRequired
};

export default HCEdit;