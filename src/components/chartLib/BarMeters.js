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
import Meter from 'grommet/components/Meter';
import Label from 'grommet/components/Label';

var baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";      //Pro
const colorArray = ['accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok','accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok', 'grey-4', 'neutral-1', 'neutral-2', 'neutral-3'];

class BarMeters
extends Component {
   constructor (props) {
    console.log('In BarMeters constructor')
    super(props);

    this.state = {
      activeIndex: 0,
     changes: [],
      counts: [],
     eChanges:[],
      date_label: [],
      Dates:[],
      chartname: [],
      series2: [],

      loading: true,
      activeIndex: 0,
      Index: 0,
      legend: [],
      legend2: [],
      url2: null

 };
   this._getIndex = this._getIndex.bind(this);
   this._setDataSeries = this._setDataSeries.bind(this);

   }
  componentWillReceiveProps() {
        console.log( 'componentWillReceiveProps ' + this.props.url2);
        this.props.url2;
        this.props.type;

    }

  componentDidMount() {
    console.log('in BarMeters componentDidMount')

    $.ajax({
       xhrFields: {
          withCredentials: true
        },
          type:"GET",
          url: baseUrl + this.props.url2,
          dataType: 'json',
          success: function(data) {
            console.log(' BarMeters  Ajax data success');
             console.log( 'componentWillReceiveProps ' + this.props.url2);
            this._setDataSeries(data, this.props.type);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('#GET Error', status, err.toString());
          }.bind(this)
    });

   }

 _setDataSeries(data, option) {
      var chartname = [];
      var counts = [];
      var series = [];
      var dates = [];
     
      var legend = [];
       var date_label = [];

      switch (option) {
          case 'RFC': {

              var changes= [];
              var eChanges = [];
               var nChanges = [];
                var rChanges = [];
               
                 counts= data.map(x => (x.RFC_Counts));
                   // counts= [1,2,3,4,5,6];
                  changes= data.map(x => (x['RFC Category']));

                  dates = data.map(x => (x['Closed Date']));

                        dates.forEach( (x, index) => {
                            date_label.push({index: index, label: x});})
//counts.length
                for (var i = 0; i < counts.length ; i++) {


                   switch (data.map(x => (x['RFC Category'][0]))[i]) {
                          case 'E': {
                            series.push({label: "Gen 7",  value: parseInt(data.map(x => (x.RFC_Counts))[i]), colorIndex: 'accent-1'})
                            console.log("Emergency CHANGES SUCESS!!!");
                            break;
                          }
                          case 'N': {                            
                            series.push({label: "Gen 7", value: parseInt(data.map(x => (x.RFC_Counts))[i]), colorIndex:'accent-2'})
                            console.log("Normal CHANGES SUCESS!!!");
                            break;
                          }
                          case 'R': {
                            series.push( {label: "Gen 7", value: parseInt(data.map(x => (x.RFC_Counts))[i]), colorIndex:'accent-3' })
                            console.log("Routine CHANGES SUCESS!!!");
                            break;
                          }

                         }
                }
      
                 

               legend.push({label: "Emergency Changes", colorIndex:'accent-1'});
                  
                  legend.push({label: "Normal Changes", colorIndex:'accent-2'});
                  legend.push({label: "Routine Changes", colorIndex:'accent-3'});
                 
                  console.log("changes " + changes);
                  console.log("counts " + counts[0]);

                  console.log("Category DATA " + data.map(x => (x['RFC Category'][0]))[2]);
                  
                  //data.map(x => (x['RFC Category'])));
                  console.log("nChanges " + nChanges);
                  console.log("rChanges " + rChanges);
             
              this.setState({legend: legend, Dates:dates, counts: counts,changes: changes, series2: series, eChanges:eChanges,loading: false});
                                console.log("SERIES!!!!!!!!!!!!! " + this.state.series2);
                  console.log("series 23421432 " + this.state.series2.map(x => (x))[0]);

              break;
          }
           case 'AssetGroup': {
             
           }
 }
 }


   _getIndex(index) {
     console.log("INDEX " + index);
        let lastlegend = this.state.legend;
        if (index != undefined && lastlegend != undefined) {
            this.setState({activeIndex: index});
            lastlegend.map(x => this.state.series2);
          this.setState({legend: lastlegend, Index:index});
       }
    }

   render () {
      console.log("TESTINGGGGGGG!!!!!! " +  this.state.series2)

      if (this.state.loading)
        return <Spinning />;
      else
    
        return (
         /*<div>*/
            <Box 
             direction ='row'
           pad={{"between": "small"}}
            full = 'true'
            >
          {this.state.counts.map((data, index ) =>{
             return ( 
    <Box
       align='center'
        pad={{"horizontal": "small", "between": "small"}}
    >

          
              <Meter vertical={true} 
                 
                 // series={this.state.series2}
                   series={this.state.series2.slice(index*3,3*(index+1))}
                   //.map(x => (x))[0]}
                   //.slice(0,3)}
              
                    label= {this.state.counts[index*3] + " " + this.state.counts[(index*3)+1] + " " + this.state.counts[(index*3)+2]}
                    size = 'large'
                    stacked={false}
                /*   {"label": "Gen 7",  "value": parseInt(this.state.series2[index]), "colorIndex": "accent-1"},
                  {"label": "Gen 7", "value": parseInt(this.state.series2[index+1]), "colorIndex": "accent-2"},
                  {"label": "Gen 7", "value": parseInt(this.state.series2[index+2]), "colorIndex": "accent-3"}]}
                  */ 
                   activeIndex = {this.state.activeIndex}
                    onActive={this._getIndex}
                   // full = 'true'
                     />
                     <Legend series={this.state.legend} />
                <Box>   
                  <Value 
                     label= {this.state.Dates[0]}
                    value= {this.state.counts[index*3] + "   " + this.state.counts[(index*3)+1] + "  " + this.state.counts[(index*3)+2]}
                      align='start' />
            </Box> 
            </Box>
            
             ); 
               
              })} 
                   
            
           </Box>
       //    </div>
                );
   }

            };


  BarMeters.propTypes = {
	url2: React.PropTypes.string.isRequired,
  	type: React.PropTypes.string.isRequired,
 

};
export default BarMeters;
