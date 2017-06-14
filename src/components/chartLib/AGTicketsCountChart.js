import React, { Component } from 'react';
import Spinning from 'grommet/components/icons/Spinning';
import Box from 'grommet/components/Box';
import VerticalBar from './VerticalBar_Grommet';
import Heading from 'grommet/components/Heading';


const Url = "https://c9w24829.itcs.hpecorp.net/ddm/Incidents/Past_10_Days_COE_AG_Tickets_Count";

class AGTicketsCountChart extends Component {
	constructor (props) {
		super(props);
		this.state =
		{
			data: [],
			loading: true
		};
	}

  componentDidMount () {
		$.ajax({
		xhrFields: {
			withCredentials: true
			},
			type:"GET",
			url: Url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: this._formatDates(data), loading: false});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error('#GET Error', status, err.toString());
				}.bind(this)
			});

	}

  componentDidMount () {
    $.ajax({
    xhrFields: {
      withCredentials: true
      },
      type:"GET",
      url: Url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: this._formatDates(data), loading: false});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('#GET Error', status, err.toString());
        }.bind(this)
      });

  }

  _formatDates(data)  {
    // Dates are in YYYY-MM-DDT00:00:00.000Z format - remove time portion
    for (var i = 0, len = data.length; i < len; i++) {
        data[i].Created_Date = data[i].Created_Date.substr(0,10);
    }
    return data;
  }

  render() {
		if (this.state.loading) {
			return <Spinning />;
		} else {
			if (this.state.data.length === 0) {
				return (<Heading>Nothing to Show</Heading>);
			} else {
				return (
					<Box colorIndex = "grey-2">
						<Box colorIndex = "grey-2" className={'why'} >
							<Heading tag='h3'>
				       COE AG Tickets Count
				      </Heading>
              <VerticalBar data={this.state.data} colName={'Created_Date'} valName={'Ticket_Count'}/>
						</Box>
					</Box>
				);
			}
		}
	}
};

export default (AGTicketsCountChart);
