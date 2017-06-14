import React, { Component } from 'react';
import Heading from 'grommet/components/Heading';
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import Line from 'grommet/components/chart/Line';
import Layers from 'grommet/components/chart/Layers';
import Base from 'grommet/components/chart/Base';
import Legend from 'grommet/components/Legend';
import Menu from 'grommet/components/Menu';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Button  from 'grommet/components/Button';
import Box  from 'grommet/components/Box';
//import Lines from './ApplicationHealthCheckLines';
import Spinning from 'grommet/components/icons/Spinning';
import Value from 'grommet/components/Value';
import MarkerLabel from 'grommet/components/chart/MarkerLabel';
import Marker from 'grommet/components/chart/Marker';
import HotSpots from 'grommet/components/chart/HotSpots';
import Grid from 'grommet/components/chart/Grid';


var baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";      //Pro
const colorArray = ['accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok','accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok', 'grey-4', 'neutral-1', 'neutral-2', 'neutral-3'];
class KPIIncidents
extends Component {
   constructor (props) {
    console.log('In Incidents constructor')
    super(props);

    this.state = {
      activeIndex: 0,
      legend: [],
      daycounts: [],
      dayIMTargets: [],
      dayhostName: [],
      daydates: [],

      monthcounts: [],
      monthIMTargets: [],
      monthhostName: [],
      monthdates: [],

      trendcounts: [],
      trendhostName: [],
      trenddates: [],

      counts: [],
      IMTargets: [],
      hostname: [],
      date_label: [],
      Dates:[],
      chartname: [],

      loading: true,
      activeIndex: 0,
      Index: 0,
      legend: [],
      legend2: [],
      url2: null,
      chartHeading: ''

 };
   this._getIndex = this._getIndex.bind(this);
   this._setDataSeries = this._setDataSeries.bind(this);

   }
  componentWillReceiveProps() {
        console.log( 'componentWillReceiveProps ' + this.props.url2);
        this.props.url2;
        this.props.time;


    }

  componentDidMount() {
    console.log('in Incidents componentDidMount')
 // this.serverRequest=
    $.ajax({
       xhrFields: {
          withCredentials: true
        },
          type:"GET",
          url: baseUrl + this.props.url2,
          dataType: 'json',
          success: function(data) {
            console.log(' Goals by MONTH  Ajax data success');
             console.log( 'componentWillReceiveProps ' + this.props.url2);
            this._setDataSeries(data, this.props.time);
           console.log( 'KPI Incidents!!!!!! ' + this.props.url2);

          }.bind(this),
          error: function(xhr, status, err) {
            console.error('#GET Error', status, err.toString());
          }.bind(this)
    });

   }
/* componentWillUnmount () {
    this.serverRequest.abort();
   }*/
 _setDataSeries(data, option) {
      var chartname = [];
      var counts = [];
      var IMTargets = [];
      var dates = [];
      var countsmaxmin = [];
      var IMTargetsmaxmin = [];
      let myArray = [];
      var legend = [];
      var date_label = [];

      switch (option) {
          case 'DAY': {


                  IMTargets = data.map(x=> (x.IM_Targets));

                 myArray[0] = data[0]['Accumulated_Number'].map(x => (x.Actual_Count));


                  dates = data[0]['Accumulated_Number'].map(x => (x.Created_Date.substring( x.Created_Date.indexOf('-')+1)));

                        dates.forEach( (x, index) => {
                            if (index%2 == 1 )
                            date_label.push({index: index, label: x});})


                  legend.push({label: "Accumulated Number", colorIndex:'accent-1'});
                  legend.push({label: "IM Target", colorIndex:'critical'});
                   chartname.push('Ticket Reduction Goals by Day (COE)');
              this.setState({dayhostName: legend, daycounts: counts, dayIMTargets: IMTargets, daydates: date_label});
              this.setState({chartname: chartname, Dates:dates, legend2: myArray, counts: counts, IMTargets: IMTargets, hostname: legend, date_label: date_label, loading: false});
              console.log("myArray : " + myArray);
              console.log("dates : " + dates);
           console.log("IMTargets  : " + IMTargets );
              break;
          }
          case 'MONTH':{
              console.log("MONTH DATA : " + data);

                IMTargets = data.map(x=> ((parseInt(x.IM_Targets)||0)));

                counts= data.map(x => (x.Actual_Count));
                 myArray[0] = data.map(x=> ((parseInt(x.IM_Targets)||0)));
                 myArray[1] = data.map(x => (x.Actual_Count));

                dates = data.map(x => (x.Created_Date.replace('20',"'")));
                dates.forEach( (x, index) => {
                  date_label.push({index: index, label: x});})

                legend.push({label: "IM Targets", colorIndex:'accent-1'});
                legend.push({label: "Actual Count", colorIndex:'accent-2'});
                chartname.push('Ticket Reduction Goals by Month (COE)');

              this.setState({monthhostName: legend, monthcounts: counts, monthIMTargets: IMTargets, monthdates: date_label});
          //    this.setState({loadingDay: false});
              this.setState({Dates:dates, counts: counts, IMTargets: IMTargets, hostname: legend, date_label: date_label, chartname: chartname, legend2: myArray, loading: false});
              console.log("myArray 0 : " + myArray[0]);
              console.log("legend2 0 : " + this.state.legend2[0]);
              console.log("dates : " + dates);
              console.log("IMTargets : " + typeof this.state.IMTargets);
              console.log("IMTargets type: " + this.state.IMTargets);
              console.log("Max : " +  Math.max(...this.state.counts.map(x => Math.max(x))));
              break;
          }
          case 'TREND':{
              IMTargets = data.map(x=> (x.ServerCounts));
               myArray[0] = data.map(x=> ((parseInt(x.ServerCounts)||0)));
                dates = data.map(x => x.Date.replace('20',"'").replace('T00:00:00.000Z',' '));
                dates.forEach( (x, index) => {
                 if (index%9 == 1 )
                  date_label.push({index: index, label: x});})

                legend.push({label: "Server Counts", colorIndex:'accent-1'});

                chartname.push('Release Server Trend');

              this.setState({trendhostName: legend, monthcounts: counts, monthdates: date_label});
              this.setState({loadingDay: false});
              this.setState({IMTargets: IMTargets, Dates: dates, counts: counts, hostname: legend, date_label: date_label, chartname: chartname, legend2: myArray, loading: false});
              console.log("myArray 0 : " + myArray[0]);
              console.log("legend2 0 : " + this.state.legend2[0]);
              console.log("dates : " + dates);
         break;
          }
 }
 }


   _getIndex(index) {
        let lastlegend = this.state.hostname;
        if (index != undefined && lastlegend != undefined) {
            this.setState({activeIndex: index});
            lastlegend.map(x => this.state.legend2);
          this.setState({legend: lastlegend, Index:index});
       }
    }

   render () {


      if (this.state.loading)
        return <Spinning />;
      else
        console.log('In Incidents render');
        var maxValue = Math.max(...this.state.IMTargets);
        var minValue = Math.min(...this.state.legend2[0]);
        var diff = maxValue - minValue;
        return (
         <div>

				      <Box colorIndex="grey-2" height="medium" full={true} >
                <Heading tag='h3'>{this.props.chartHeading}</Heading>
                 <Chart full={true}  loading={true} >
                    <Axis count = {5}
                      labels={[
                      {"index": 0 , "label": minValue.toString()},
                      {"index": 1, "label": parseInt((minValue + diff * 0.25).toFixed(1).toString()) },
                      {"index": 2, "label": parseInt((minValue + diff /2 ).toFixed(1).toString()) },
                      {"index": 3, "label": parseInt((minValue + diff *.75 ).toFixed(1).toString())},
                      {"index": 4, "label": parseInt((maxValue -1).toString()) }]}
                      vertical={true} />

                   <Chart full={true} vertical={true} loading={true}>
                   {this.state.legend2.map((eachLine, index) =>
                      <MarkerLabel count={eachLine.length}
                      index={this.state.activeIndex}
                       colorIndex = {colorArray[index%9]}
                        width = "full"
                      label={<Value value={eachLine[this.state.activeIndex]} />} />
                      )}
                   <Base height='medium' width="full"/>
                      <Layers full={true}>
                      <Grid rows={5} columns={this.state.Dates.length} full={true}/>
                      {this.state.IMTargets.map((eachLine, index) =>
                        {if (this.state.dayIMTargets[0] != null)
                              return(
                                <Marker colorIndex='critical' max = {maxValue}
                                 value={this.state.dayIMTargets[0] -1} />
                              ) }
                        )}
                      <Marker vertical={true} colorIndex='accent-1'
                            count={this.state.Dates.length}
                            max = {maxValue}
                            width = "full"
                            index={this.state.activeIndex} />

                          {this.state.legend2.map((eachLine, index) =>
                            <Line values={this.state.legend2[index]}
                            colorIndex = {colorArray[index%9]}
                            key={index}
                            max ={maxValue}
                            activeIndex={this.state.activeIndex}
                        />
                  )}
                    </Layers>

                     <HotSpots count = {this.state.Dates.length}
                        max={maxValue}
                        activeIndex={this.state.activeIndex}
                        onActive={this._getIndex}  width = "full" />

                <Axis count = {this.state.Dates.length }
                    full={true}
                    labels= {this.state.date_label} />
                <Legend series={this.state.hostname}  />
                </Chart>
                 {this.state.IMTargets.map((eachLine, index) =>
                    {if (this.state.dayIMTargets[0] != null)
                          return(
                    <MarkerLabel colorIndex='critical'
                      value={this.state.dayIMTargets[0]}
                      max = {maxValue}
                    //  size = 'medium'
                      label= {this.state.dayIMTargets[0]}
                      vertical={true} />
                   ) }
                    )}
                </Chart>
             </Box>
             </div>
                );
              }

            };
KPIIncidents.propTypes = {
	  url2: React.PropTypes.string.isRequired,
  	time: React.PropTypes.string.isRequired
};
export default KPIIncidents;
