import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scrollchor from 'react-scrollchor';
import Scroll from 'react-scroll';
import RestWatch from '../Home/RestWatch';
import Box  from 'grommet/components/Box';


import Heading from 'grommet/components/Heading';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';

//let baseUrl = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";  //Dev
let baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";      //Pro


//https://c9w24829.itcs.hpecorp.net/ddm/AssetManagement/OverallStatus

class AssetManagementMeter extends Component {
	constructor (props) {
    console.log('In AssetManagementMeter constructor');
    super(props);
    this.state = {
      data: [],
      series: [],
      seriesCount: 0,
      eprid: []

    };

    this._onClickAppManagement = this._onClickAppManagement.bind(this);
		this._onClickAppManagementGreenSeries = this._onClickAppManagementGreenSeries.bind(this);

  }

  componentDidMount() {
    console.log('in AssetManagementMeter componentDidMount');

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

    let url = baseUrl + 'AssetManagement/OverallStatus';

    this.serverRequest=

    $.ajax({
    xhrFields: {
      withCredentials: true
    },
      type:"GET",
      url: url,
      data: { eprids : JSON.stringify(epridArray) },
      dataType: 'json',
      success: function(data) {

				 let series = [
					 {value: parseInt(this.props.greenCount), label: 'Pass', colorIndex: 'ok', onClick: this._onClickAppManagementGreenSeries.bind()},
					 {value: parseInt(this.props.faultCount), label: 'Action Needed', colorIndex: 'critical', onClick: this._onClickAppManagement.bind()}
				 ];
				 let seriesCount = series.reduce(function(sum,value) {
					return sum + value.value;
				 },0);

        this.setState({data: data, eprid: epridArray, loading: false, series: series, seriesCount: seriesCount || 0});

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


        let url = baseUrl + 'AssetManagement/OverallStatus';

        this.serverRequest=

        $.ajax({
        xhrFields: {
          withCredentials: true
        },
          type:"GET",
          url: url,
          data: { eprids : JSON.stringify(epridArray) },
          dataType: 'json',
          success: function(data) {

						 let series = [
							 {value: parseInt(this.props.greenCount), label: 'Pass', colorIndex: 'ok', onClick: this._onClickAppManagementGreenSeries.bind()},
							 {value: parseInt(this.props.faultCount), label: 'Action Needed', colorIndex: 'critical', onClick: this._onClickAppManagement.bind()}
						 ];
						 let seriesCount = series.reduce(function(sum,value) {
							return sum + value.value;
						 },0);

		        this.setState({data: data, eprid: epridArray, loading: false, series: series, seriesCount: seriesCount || 0});

          }.bind(this),
          error: function(xhr, status, err) {
            console.error('#GET Error', status, err.toString());
          }.bind(this)
        });

	}

    componentWillUnmount () {
    this.serverRequest.abort();
   }

   _onClickAppManagement() {
    this.props.onClick();
	  Scroll.animateScroll.scrollTo(300);
  }

  _onClickAppManagementGreenSeries() {
		this.props.onAppManagementGreenSeriesClick();
		Scroll.animateScroll.scrollTo(300);
	}

  render () {
		console.log('eprids in AM Meter' + JSON.stringify(this.state.eprid))
		let placeholderForTip5=("tip5Target");
     let trStyle = {color: "#ffffff"};
    return (
      <div>
        <RestWatch eprid={JSON.stringify(this.state.eprid)} watch='AM' />
        <Heading tag="h3" style={trStyle}  align="center">
					<b id={placeholderForTip5}>Asset Management</b>
				</Heading>
      <Box colorIndex = "grey-2">
        <AnnotatedMeter size="medium" type="circle"  legend={true} max={this.state.seriesCount} series={this.state.series} total={true}/>
      </Box>
      </div>
    );
  }
}


AssetManagementMeter.propTypes = {
	dashboards : React.PropTypes.array.isRequired,
	currentDashboard: React.PropTypes.string.isRequired,
	defaultDashboard: React.PropTypes.string,
	onClick: React.PropTypes.func.isRequired
};



const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard }) => ({ currentDashboard, dashboards, defaultDashboard });
export default connect(mapStatetoProps, {})(AssetManagementMeter);
