import React, { Component } from 'react';
import Tip from 'grommet/components/Tip';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Close from 'grommet/components/icons/base/Close';
import Table from 'grommet/components/Table';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';



class ActionLinksTable extends React.Component{
	constructor (props) {
		super(props);
		this.state =
		{
			TableData: [],
			Reducedarray: [],
			loading: true
    };
	this._LinksTableData = this._LinksTableData.bind(this);
	this._LinksTableHeader = this._LinksTableHeader.bind(this);

	}

	componentDidMount () {
		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: 'https://c9w24829.itcs.hpecorp.net/DDM/FilterList/GetDDO_UrlLink',
			dataType: 'json',
			success: function(data) {
				this.setState({ TableData: data, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this)
			});


	}

	componentWillReceiveProps ({ dashboards, currentDashboard, defaultDashboard }) {

		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: 'https://c9w24829.itcs.hpecorp.net/DDM/FilterList/GetDDO_UrlLink',
			dataType: 'json',
			success: function(data) {
				this.setState({ TableData: data, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this)
			});
	}

	_LinksTableData(rowObj){

		return rowObj.map((row, i)=>{

			return (
			 <TableRow key={i}>
				<td>{row.NAME}</td>
				<td><a href={row.HYPERLINK} target="window">{row.HYPERLINK}</a></td>
			 </TableRow>
			)

		});
		}

	_LinksTableHeader(){
		let trStyle = {color: "#f71d1d", "fontWeight":"bold"};
		let tableheader = ['Description', 'Link'];
		return (
			<TableHeader style={{backgroundColor:"yellow", color:"black", fontSize:"20px"}} labels = {tableheader} />
		);
	}


  render(){
		let _this = this;
		if (this.state.loading) {
			return <Spinning />;
		} else {
		return(
			<Table selectable={false} style={{"color": "white"}}>
				{_this._LinksTableHeader()}
				<tbody>
					{_this._LinksTableData(this.state.TableData)}
				</tbody>
			</Table>
    );
	}
  }
}


export default (ActionLinksTable);
