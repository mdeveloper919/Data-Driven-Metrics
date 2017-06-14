import React, { Component } from 'react';
import * as d3 from 'd3';
import drawLegendStackedBarChart from '../../utility/drawLegendStackedBarChart';
import drawStackedBarChart from '../../utility/drawStackedBarChart';
import Box  from 'grommet/components/Box';


import RadioButton from 'grommet/components/RadioButton';

class StackedBar extends Component {
	constructor(props) {
		super(props);
		let { data, groupFilter } = this.props;
		// later this function shall be removed; data problem.
		data.forEach((element) => {
			if (element[groupFilter] === null) {
				element[groupFilter] = 'Null';
			}
		});

		this._data      = getWeek(data).sort((a, b) => a.Created_Date - b.Created_Date);
		let groups      = _.uniqBy(data, groupFilter).map((d) => d[groupFilter]);
		this.state      = {
			groups,
			type:   'All', // All, User, NonUser
			status: 'All', // All, Open, Closed
			period: 'Monthly'// Monthly/Weekly
		};
		this._allGroups = groups;
		this._container = null;
		this._legend    = null;
		this._setActiveGroups = this._setActiveGroups.bind(this);
		this._setPeriod = this._setPeriod.bind(this);
	}
	componentDidMount() {
		let legendContainer = d3.select(this._legend);
		let legend          = drawLegendStackedBarChart().setCats(this._allGroups).setActive(this._setActiveGroups);
		legendContainer.call(legend);
		let { groupFilter } = this.props;
		let chartContainer = d3.select(this._container);
		let stackedBarChart = drawStackedBarChart().data(this._data)
													.period(this.state.period)
													.setAll(this._allGroups)
													.setActive(this.state.groups)
													.setPeriod(this._setPeriod)
													.setGroupFilter(groupFilter);
													
		chartContainer.call(stackedBarChart);

var color = d3.scale.ordinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var x = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([0, 420]);



d3.select(".chart")
  .selectAll("div")
  .data(data)
  .enter().append("div")
  // .attr("width",400)
  // .attr("depth",400)
  .style("width", function(d) {
    return d.value + "px";
  })
  .style("background-color", function(d, i) {
    return color(i);
  })
  .text(function(d, i) {
    return data[i].label;
  });

	}
	componentDidUpdate() {
		// filter the data again;
		let { groups, status, type, period } = this.state;
		let { groupFilter } = this.props;
		let data = this._data;
		if (status !== 'All') data = data.filter(d => d.Status === status);
		if (type !== 'All') data = data.filter(d => d.TicketType === type);
		data = data.filter(d => groups.indexOf(d[this.props.groupFilter]) !== -1);
		// now filter for detailed daily view
		if (period !== 'Monthly' && period !== 'Weekly') {
			let splitPeriod = period.split(' '); 
			let newPeriod = splitPeriod[0], 
			value = splitPeriod[1];
			if (newPeriod === 'Monthly') {
				data = data.filter(d => d.Created_Date.getMonth() + '/' + d.Created_Date.getFullYear() === value);
			} else { // newPeriod === 'Weekly'
				data = data.filter(d => {
					return (d.week === +value.substr(1) && d.fy === +splitPeriod[2]);
				});
			}
		}
		let chartContainer = d3.select(this._container);
		chartContainer.select('svg').remove();
		let stackedBarChart = drawStackedBarChart().data(data)
													.period(this.state.period)
													.setAll(this._allGroups)
													.setActive(this.state.groups)
													.setPeriod(this._setPeriod)
													.setGroupFilter(groupFilter)
													;
													
		chartContainer.call(stackedBarChart);

	}
	
	_setActiveGroups(groups) {
		this.setState({ groups });
	}
	_setPeriod(period) {
		this.setState({ period });
	}
	
	render() {
		 let trStyle = {color: "#ffffff"};
		return (
			
		<div><Box colorIndex = "grey-2">
			{/*<div>
				<RadioButton id="period-byMonth" name="periodByMonth" label="By Month" 
					checked={this.state.period.split(' ')[0] === 'Monthly'}
					onChange={() => this.setState({period: 'Monthly'})}
				/>
				<RadioButton id="period-byMonth" name="periodByWeek" label="By Week" 
					checked={this.state.period.split(' ')[0] === 'Weekly'}
					onChange={() => this.setState({period: 'Weekly'})}
				/>
			</div>*/}
			<div>
				
				<RadioButton style={{"fill": "#ffffff"}} style={{"color": "#ffffff"}} id="type-All" name="typeAll" label="All" 
					checked={this.state.type === 'All'}
					onChange={() => this.setState({type: 'All'})}
				/>
				<RadioButton style={{"fill": "#ffffff"}} style={{"color": "#ffffff"}}id="type-User" name="typeUser" label="User" 
					checked={this.state.type === 'User'}
					onChange={() => this.setState({type: 'User'})}
				/>
				<RadioButton  style={{"fill": "#ffffff"}} style={{"color": "#ffffff"}} id="type-NonUser" name="typeNonUser" label="Non User" 
					checked={this.state.type === 'NonUser'} 
					onChange={() => this.setState({type: 'NonUser'})}
				/>
				
			</div>
			<div>
				<RadioButton style={{"fill": "#ffffff"}} style={{"color": "#ffffff"}} id="status-All" name="statusAll" label="All" 
					checked={this.state.status === 'All'} 
					onChange={() => this.setState({status: 'All'})}
				/>
				<RadioButton style={{"fill": "#ffffff"}} style={{"color": "#ffffff"}} id="status-Open" name="statusOpen" label="Open" 
					checked={this.state.status === 'Open'}
					onChange={() => this.setState({status: 'Open'})}
				/>
				<RadioButton style={{"fill": "white"}} style={{"color": "#ffffff"}} id="status-Closed" name="statusClosed" label="Closed" 
					checked={this.state.status === 'Closed'}
					onChange={() => this.setState({status: 'Closed'})}
				/>
			</div></Box>
			<div ref={(c) => {this._legend = c;}} style={{ "fill":"white"}} />
				<Box  colorIndex = "grey-2">
			<div ref={(c) => {this._container = c; }} />
				</Box>
		</div>
		);
	}
}

StackedBar.propTypes = {
	data: React.PropTypes.array.isRequired,
	groupFilter: React.PropTypes.string.isRequired,
	yAxisName: React.PropTypes.string.isRequired,
	xAxisName: React.PropTypes.string.isRequired
};

export default StackedBar;

// helper functions
function getWeek(data) {
	let strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
	data.forEach(d => {
		d.Created_Date = strictIsoParse(d.Created_Date);
		// get fiscal year
		let curY = d.Created_Date.getFullYear();
		let fy = new Date(curY, 10, 1);
		if (d.Created_Date >= fy) {
			d.fy = curY + 1;
			d.week = Math.floor(d3.timeDay.count(fy, d.Created_Date)/7) + 1;
		} else {
			d.fy = curY;
			fy = new Date(curY - 1, 10, 1);
			d.week = Math.floor(d3.timeDay.count(fy, d.Created_Date)/7) + 1;
		}
	});
	return data;
}

