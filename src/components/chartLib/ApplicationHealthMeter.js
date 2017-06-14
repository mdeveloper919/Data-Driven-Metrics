import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scrollchor from 'react-scrollchor';
import Scroll from 'react-scroll';
import Heading from 'grommet/components/Heading';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import RestWatch from '../Home/RestWatch';
import Anchor from 'grommet/components/Anchor';
import Menu from 'grommet/components/Menu';
import Header from 'grommet/components/Header';
import MoreIcon from 'grommet/components/icons/base/More';
import Box  from 'grommet/components/Box';

const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";      //Pro

class ApplicationHealthMeter extends Component {
  constructor (props) {
    console.log('In AppHealthMeter constructor');
    super(props);
    this.state = {
      data: [],
      series: [],
      seriesCount: 0,
      loading: true,
      eprid: []
    };

    this._onSeriesYellowClick = this._onSeriesYellowClick.bind(this);
	  this._onSeriesRedClick = this._onSeriesRedClick.bind(this);
    this._onSeriesGreenClick = this._onSeriesGreenClick.bind(this);
  }

	componentDidMount(){
		console.log('in AppHealthMeter componentDidMount');


    let currDashboard,defDashboard,dashboardsArray,dashboardObjCurrent,dashboardObjDefault;

    currDashboard = this.props.currentDashboard;
    defDashboard = this.props.defaultDashboard;

    dashboardsArray = this.props.dashboards;
    dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
    dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });


    let epridArray = [];
    if(dashboardObjCurrent[0] !== undefined)
    {
        for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++) {
        epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
        }
    }
    else if(dashboardObjDefault)
    {
        for (let i = 0; i < dashboardObjDefault[0].filter.length; i++) {
        epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
        }

    }

    this.serverRequest=


    $.ajax({
		xhrFields:{
			withCredentials: true
		},
		type:"GET",
		url: baseUrl + 'OpsHealthCheck/HC_Status',
    data: { eprids : JSON.stringify(epridArray) },
		dataType: 'json',
		success: function(data) {
			console.log('AppHealthMeter Ajax data success');
			this.setState({data: data, loading: false, eprid: epridArray});
      this._setSeries();
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
    });
  }




	componentWillReceiveProps ({ dashboards, currentDashboard, defaultDashboard }) {

		let currDashboard, defDashboard, dashboardsArray,dashboardObjCurrent,dashboardObjDefault;

		if(dashboards && currentDashboard || defaultDashboard)
    {
        currDashboard = currentDashboard;
        defDashboard = defaultDashboard;
        dashboardsArray = dashboards;
        dashboardObjCurrent = $.grep(dashboardsArray, function(e){ return e.name == currDashboard; });
        dashboardObjDefault = $.grep(dashboardsArray, function(e){ return e.name == defDashboard; });

    }

		let epridArray = [];
		if(dashboardObjCurrent[0] !== undefined)
    {
        for (let i = 0; i < dashboardObjCurrent[0].filter.length; i++) {
        epridArray.push(dashboardObjCurrent[0].filter[i].substring(0,6));
        }
    }
    else if(dashboardObjDefault)
    {
        for (let i = 0; i < dashboardObjDefault[0].filter.length; i++) {
        epridArray.push(dashboardObjDefault[0].filter[i].substring(0,6));
        }

    }

  this.serverRequest=

	$.ajax({
		xhrFields:{
			withCredentials: true
		},
		type:"GET",
		url: baseUrl + 'OpsHealthCheck/HC_Status',
    data: { eprids : JSON.stringify(epridArray) },
		dataType: 'json',
		success: function(data) {
			console.log('AppHealthMeter Ajax data success');
			this.setState({data: data, loading: false, eprid: epridArray});
      this._setSeries();
		}.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
		}.bind(this)
    });

	}

    componentWillUnmount () {
    this.serverRequest.abort();
   }


	_setSeries() {
		console.log('In AppHealthMeter setSeries');
		console.log('data length: ' + this.state.data.length);
    let greenCount  = parseInt(this.props.greenCount);
		let yellowCount = parseInt(this.props.yellowCount);
		let redCount =  parseInt(this.props.faultCount);

    let series = [
      {value: greenCount, label: 'Pass', colorIndex: 'ok', onClick: this._onSeriesGreenClick.bind()},
      {value: yellowCount, label: 'Maintenance', colorIndex: 'warning', onClick: this._onSeriesYellowClick.bind()},
      {value: redCount, label: 'Fail', colorIndex: 'critical', onClick: this._onSeriesRedClick.bind()}
    ];

    let seriesCount = series.reduce(function(sum,value) {
       return sum + value.value;
    },0);

    this.setState({series: series, seriesCount: seriesCount || 0});

  }

  _onSeriesGreenClick() {
    this.props.SeriesGreenClick();
    Scroll.animateScroll.scrollMore(800);
  }

  _onSeriesYellowClick() {
    this.props.SeriesYellowClick();
	  Scroll.animateScroll.scrollMore(800);
  }

  _onSeriesRedClick() {
    this.props.SeriesRedClick();
	  Scroll.animateScroll.scrollMore(800);
  }

  render () {
    console.log('eprids in HC Meter' + JSON.stringify(this.state.eprid))
    let placeholderForTip4 = ("tip4Target");
    let trStyle = {color: "#ffffff"};
    return (
      <div>
        <RestWatch eprid={JSON.stringify(this.state.eprid)} watch='HC' />
        <Heading tag="h3" align="center" style={trStyle}>
			    <b id={placeholderForTip4} >Application Health</b>
		    </Heading>
       <Box colorIndex = "grey-2">
        <AnnotatedMeter size="medium" type="circle" legend={true} max={this.state.seriesCount} series={this.state.series} total={true}/>
        </Box>
      </div>
    );
  }
}

ApplicationHealthMeter.propTypes = {

  currentDashboard: React.PropTypes.string.isRequired,
  dashboards : React.PropTypes.array.isRequired,
  defaultDashboard: React.PropTypes.string
};

const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard }) => ({ currentDashboard, dashboards, defaultDashboard });
export default connect(mapStatetoProps, {})(ApplicationHealthMeter);
