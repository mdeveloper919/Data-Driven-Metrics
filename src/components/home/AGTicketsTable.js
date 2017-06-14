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



class AGTicketsTable extends React.Component{
	constructor (props) {
		super(props);
		this.state =
		{
			TableData: [],
			Reducedarray: [],
			Dates: [],
			loading: true
    };
	this._AGTableData = this._AGTableData.bind(this);
	this._AGTableHeader = this._AGTableHeader.bind(this);

	}

	componentDidMount () {
		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: 'https://c9w24829.itcs.hpecorp.net/DDM/Incidents/Past_10_Days_COE_AG_IM_Tally',
			dataType: 'json',
			success: function(data) {
				this.setState({ TableData: data, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this)
			});

			var date_lookup = {};
			var new_date = [];

			let grouped = this.state.TableData.reduce((a, v) => {
			  if (!(v.Incident_Current_Assignment_Group in a)) a[v.Incident_Current_Assignment_Group] = {
				Incident_Current_Assignment_Group: v.Incident_Current_Assignment_Group,
				data: []
			  };

			  var dt = v.Created_Date.match(/(\d+-\d+-\d+)/)[0].replace(/-/g, '/');
			  if (!(dt in date_lookup)) {
					date_lookup[dt] = 1;
					new_date.push(dt);
				}


			  a[v.Incident_Current_Assignment_Group].data.push({date:dt,Ticket_count:v.Ticket_Count});
			  return a;

			}, {});

			this.state.Reducedarray = Object.keys(grouped).map(key => {
			  return grouped[key];
			});
			new_date.sort();
			this.setState({Dates: new_date});

	}

	componentWillReceiveProps ({ }) {

		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: 'https://c9w24829.itcs.hpecorp.net/DDM/Incidents/Past_10_Days_COE_AG_IM_Tally',
			dataType: 'json',
			success: function(data) {
				this.setState({ TableData: data, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this)
			});

		var date_lookup = {};
		var new_date = [];

		let grouped = this.state.TableData.reduce((a, v) => {
		  if (!(v.Incident_Current_Assignment_Group in a)) a[v.Incident_Current_Assignment_Group] = {
			Incident_Current_Assignment_Group: v.Incident_Current_Assignment_Group,
			data: []
		  };

		  var dt = v.Created_Date.match(/(\d+-\d+-\d+)/)[0].replace(/-/g, '/');
		  if (!(dt in date_lookup)) {
				date_lookup[dt] = 1;
				new_date.push(dt);
			}


		  a[v.Incident_Current_Assignment_Group].data.push({date:dt,Ticket_count:v.Ticket_Count});
		  return a;

		}, {});

		this.state.Reducedarray = Object.keys(grouped).map(key => {
		  return grouped[key];
		});
		new_date.sort();
		this.setState({Dates: new_date});
	}

	_AGTableData(rowObj){
		let trStyle = {color: "#FCD20B", "fontWeight":"bold"};

		return rowObj.map((row, i)=>{
			return (
			 <TableRow key={i}>
				<td>{row.Incident_Current_Assignment_Group}</td>
				<td>{row.data[0].Ticket_count}</td>
				<td>{row.data[1].Ticket_count}</td>
				<td>{row.data[2].Ticket_count}</td>
				<td>{row.data[3].Ticket_count}</td>
				<td>{row.data[4].Ticket_count}</td>
				<td>{row.data[5].Ticket_count}</td>
				<td>{row.data[6].Ticket_count}</td>
				<td>{row.data[7].Ticket_count}</td>
				<td>{row.data[8].Ticket_count}</td>
				<td>{row.data[9].Ticket_count}</td>
			 </TableRow>
			)

		});
		}

	_AGTableHeader(rowObj){
		let trStyle = {color: "#f71d1d", "fontWeight":"bold"};
		//need to convert obj passed to array to map style={trStyle}>
		let tableheader = ['Asset'];
		let i;
		for (i = 0; i < rowObj.length; i++) {
			tableheader.push(rowObj[i])
		}
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
      <Box colorIndex = "grey-2" className={'why'} >
			<Heading tag='h3'>
			 COE AG Tickets Tally
			</Heading>
			<Table selectable={true} style={{"color": "white"}}>
				{_this._AGTableHeader(this.state.Dates)}
				<tbody>
					{_this._AGTableData(this.state.Reducedarray)}
				</tbody>
			</Table>
			</Box>

    );
	}
  }
}


export default (AGTicketsTable);
