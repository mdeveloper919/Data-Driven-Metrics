import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';



class AGTicketCountTable extends React.Component{
	constructor (props) {
		super(props);
		this.state =
		{
			TableData: [],
			Reducedarray: [],
			Dates: [],
			loading: true
    };

	this.AGTableData = this.AGTableData.bind(this);

	}

	componentDidMount() {

		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: this.props.getURL,
			dataType: 'json',
			success: function(data) {
				var date_lookup = {};
				var new_date = [];

				let grouped = data.reduce((a, v) => {
					if (!(v.Incident_Current_Assignment_Group in a)) a[v.Incident_Current_Assignment_Group] = {
					Incident_Current_Assignment_Group: v.Incident_Current_Assignment_Group,
					data: []
					};

					var dt = v.Created_Date;
					if (!(dt in date_lookup)) {
						date_lookup[dt] = 1;
						new_date.push(dt);
					}

					a[v.Incident_Current_Assignment_Group].data.push({date:dt,Ticket_count:v.Ticket_Count});
					return a;

				}, {});

				let tableDataReduced;
				tableDataReduced = this.state.Reducedarray = Object.keys(grouped).map(key => {
					return grouped[key];
				});

			  tableDataReduced.forEach(function(arrayItem)
				{
					arrayItem.data.sort(function(a, b) {
			        var x = a['date']; var y = b['date'];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
				});

				new_date.sort();
				new_date.splice(0,0, 'Asset Name');

				this.setState({Dates: new_date, ReducedArray: tableDataReduced, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this),
				timeout: 30000
			});
	}


	componentWillReceiveProps ({ }) {

		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: this.props.getURL,
			dataType: 'json',
			success: function(data) {
				var date_lookup = {};
				var new_date = [];

				let grouped = data.reduce((a, v) => {
					if (!(v.Incident_Current_Assignment_Group in a)) a[v.Incident_Current_Assignment_Group] = {
					Incident_Current_Assignment_Group: v.Incident_Current_Assignment_Group,
					data: []
					};

					var dt = v.Created_Date;
					if (!(dt in date_lookup)) {
						date_lookup[dt] = 1;
						new_date.push(dt);
					}

					a[v.Incident_Current_Assignment_Group].data.push({date:dt,Ticket_count:v.Ticket_Count});
					return a;

				}, {});

				let tableDataReduced;
				tableDataReduced = this.state.Reducedarray = Object.keys(grouped).map(key => {
					return grouped[key];
				});


				tableDataReduced.forEach(function(arrayItem)
				{
					arrayItem.data.sort(function(a, b) {
			        var x = a['date']; var y = b['date'];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
				});

				new_date.sort();
				new_date.splice(0,0, 'Asset Name');
				this.setState({Dates: new_date, ReducedArray: tableDataReduced, loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this),
				timeout: 30000
			});



	}

	AGTableData(){

    let rowObj = this.state.Reducedarray;

		return rowObj.map((row, i)=>{
			return (
			 <TableRow key={i}>
				<td>{row.Incident_Current_Assignment_Group}</td>
				<td>{row.data[0].Ticket_count || 0}</td>
				<td>{row.data[1].Ticket_count || 0}</td>
				<td>{row.data[2].Ticket_count || 0}</td>
				<td>{row.data[3].Ticket_count || 0}</td>
				<td>{row.data[4].Ticket_count || 0}</td>
				<td>{row.data[5].Ticket_count || 0}</td>
				<td>{row.data[6].Ticket_count || 0}</td>
				<td>{row.data[7].Ticket_count || 0}</td>
				<td>{row.data[8].Ticket_count || 0}</td>
 				<td>{row.data[9].Ticket_count || 0}</td>
				<td>{row.data[10].Ticket_count || 0}</td>
				<td>{row.data[11].Ticket_count || 0}</td>
 			 </TableRow>
			)

		});
		}

  render(){
		if (this.state.loading) {
			return <Spinning />;
		} else {
       if (this.state.Dates.length === 0) {
         return (<h3 style={{color:'red'}}>No Data To Be Displayed</h3>);
       } else {
         return(
					 <Box colorIndex = "grey-2" className={'why'} >
						<Heading tag='h3'>
						 COE AG Tickets Tally
						</Heading>
     			<Table style={{color:'white', backgroundColor:'#262626'}} selectable={true}>
     			  <TableHeader labels={this.state.Dates} style={{backgroundColor:"yellow", color:"black", fontSize:"20px"}}/>
     				<tbody>{this.AGTableData()}</tbody>
     			</Table>
					</Box>

         );
       }
     }
  }
}

AGTicketCountTable.propTypes = {
  getURL: React.PropTypes.string.isRequired
};


export default AGTicketCountTable;
