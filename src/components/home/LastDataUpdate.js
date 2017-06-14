import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinning from 'grommet/components/icons/Spinning';
import Label from 'grommet/components/Label';
import HistoryIcon from 'grommet/components/icons/base/History';


//const baseUrl = "http://c9w24829.itcs.hpecorp.net:4001/";
const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";

class LastDataUpdate extends Component {
	constructor (props) {
		super(props);
		this.state =
		{
			data: [],
			loading: true
		};

		this._findLastDataUpdate = this._findLastDataUpdate.bind(this);
	}

	componentDidMount () {
		this.setState({ loading: true });

		this.serverRequest=
		$.ajax({
			xhrFields:{
				withCredentials: true
			},
			type:"GET",
			url: baseUrl + 'AssetManagement/DDO_Timestamp',
			    dataType: 'json',
		   success: function(data) {
				   console.log('LastDataUpdate Ajax data success');
				   this.setState({data: data, loading: false});
			}.bind(this),
			 error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
	    });
	}

  _findLastDataUpdate(timestamps) {
		let {blockName, subcatName} = this.props;
		return (timestamps.KPI === blockName  && timestamps.Chart_Name === subcatName);
	}

	componentWillUnmount () {
		this.setState({data: []});

}

	render() {
		console.log('Render of LastDataUpdate');
		let lastDataUpdate;
 		let trStyle = {color: "#ffffff"};
		if (this.state.loading) {
			return <Spinning />;
		} else {
				if (this.state.data.length === 0) {
					return (<Label style={trStyle} ><HistoryIcon colorIndex = "light"/> Last data update unknown</Label>);
				} else {
					lastDataUpdate = this.state.data.find(this._findLastDataUpdate);
					if (typeof lastDataUpdate === 'undefined' || !lastDataUpdate) {
						return (<Label style={trStyle} ><HistoryIcon colorIndex = "light"/> Last data update unknown</Label>);
					} else {
						return (<Label style={trStyle} ><HistoryIcon colorIndex = "light"/> Refreshed every {lastDataUpdate.RefreshInterval} via {lastDataUpdate.DataSource}, Last update at {lastDataUpdate.Last_Update_Timestamp} UTC</Label>);
					}
				}
			}
		}
}

LastDataUpdate.propTypes = {
  blockName: React.PropTypes.string.isRequired,
  subcatName: React.PropTypes.string.isRequired,
};

export default LastDataUpdate;
