import React, { Component } from 'react';

import Heading from 'grommet/components/Heading';
import Menu from 'grommet/components/Menu';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Button  from 'grommet/components/Button';
import Box  from 'grommet/components/Box';
import Lines from './ApplicationHealthCheckLines';
import Spinning from 'grommet/components/icons/Spinning';
import KPIIncidents from '../chartlib/KPIIncidents';


const baseUrl = "https://c9w24829.itcs.hpecorp.net/ddm/";      //Pro
const colorArray = ['accent-1', 'accent-2', 'accent-3' , 'accent-4', 'accent-5', 'accent-6','accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok', 'grey-4', 'neutral-1', 'neutral-2', 'neutral-3'];

class ApplicationHealthCheckLineCharts 
extends Component {
   constructor (props) {
    console.log("In AppHealthLine constructor");
    super(props);

    this.state = {
      day_cpu_util: [],
      day_mem_util: [],
      day_space_util: [],
      day_host_name: [],
      day_dates: [],

      week_cpu_util: [],
      week_mem_util: [],
      week_space_util: [],
      week_host_name: [],
      week_dates: [],
     
      month_cpu_util: [],
      month_mem_util: [],
      month_space_util: [],
      month_host_name: [],
      month_dates: [],
    
      dayClicked: true,
      weekClicked: false,
      monthClicked: false,
      
      cpu_util: [],
      mem_util: [],
      space_util: [],
      host_name: [],
      date_label: [],

      loadingDay: true,
      loadingWeek: true,
      loadingMonth: true, 

      frequency: null       
   };

   this._setDataSeries = this._setDataSeries.bind(this);
   this._onDaySelected = this._onDaySelected.bind(this);
   this._onWeekSelected = this._onWeekSelected.bind(this);
   this._onMonthSelected = this._onMonthSelected.bind(this);
   
   }
  
  componentDidMount() {
 
    console.log("in AppHealthLine componentDidMount");
 
    $.ajax({
        xhrFields: {
          withCredentials: true
        },
          type:"GET",
          url: baseUrl + 'OpsHealthCheck/History_Infra/' + this.props.memLineChartEPRID[0].EPRID + '/DAY',
          //205054/DAY',
          dataType: 'json',
          success: function(dataDays) {
            console.log('AppHealthLine Ajax data success');
            this._setDataSeries(dataDays, 'DAY');        
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('#GET Error', status, err.toString());
          }.bind(this)
    });
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
        type:"GET",
        url: baseUrl + 'OpsHealthCheck/History_Infra/' + this.props.memLineChartEPRID[0].EPRID + '/WEEK',
        //205054/WEEK',
        dataType: 'json',
        success: function(dataWeeks) {
          console.log('AppHealthLine Ajax data success');
          this._setDataSeries(dataWeeks, 'WEEK');
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('#GET Error', status, err.toString());
        }.bind(this)
    });
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
        type:"GET",
        url:  baseUrl + 'OpsHealthCheck/History_Infra/' + this.props.memLineChartEPRID[0].EPRID + '/MONTH',
        //205054/MONTH',
        dataType: 'json',
        success: function(dataMonth) {
          console.log('AppHealthLine Ajax data success');
          this._setDataSeries(dataMonth, 'MONTH');
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('#GET Error', status, err.toString());
        }.bind(this)
    });
     
  }
 
 _setDataSeries(data, option) {
      let host_name = [];
      let cpu_util = [];
      let mem_util = [];
      let space_util = [];
      let dates = [];
   

      // to get all cpu info
      for(let i = 0; i < data.length; i++){
          let myArray = data[i];
          cpu_util[i] = myArray.map(x => parseFloat(x.cpu_util.toFixed(1)));
          mem_util[i] = myArray.map(x => parseFloat(x.mem_util.toFixed(1)));
          space_util[i] = myArray.map(x => parseFloat((x.space_util*100).toFixed(1)));
      }

      //to get host name an store
      let myArray2 = data;
      host_name = myArray2.map(x => x[0].host_name);
     
      //set legend
      let legend = [];
      for(const [index, element] of host_name.entries()) {
        legend.push({label: element, colorIndex: colorArray[index%9]});
      }

      switch (option) {
          case 'DAY': {
             
              dates = myArray2[0].map(x => x.ts_utc.replace('2017-','').replace('T','    ').replace(':00.000Z',''));
             this.setState({day_host_name: legend,day_cpu_util: cpu_util,day_mem_util:mem_util,
                            day_space_util:space_util,day_dates:dates});
              this.setState({loadingDay: false});
              this.setState({cpu_util: cpu_util,mem_util: mem_util,
                            space_util: space_util,host_name: legend,date_label: dates});
              break;
          }   case 'WEEK': {
            
              dates = myArray2[0].map(x => x.ts_utc.replace('2017-','').replace('T00:00:00.000Z',''));
              this.setState({week_host_name: legend,week_cpu_util: cpu_util,week_mem_util:mem_util,
                            week_space_util:space_util,week_dates:dates});
              this.setState({loadingWeek: false});
              break;
          }case 'MONTH': {
              dates = myArray2[0].map(x => x.ts_utc.replace('2017-','').replace('T00:00:00.000Z',''));
            this.setState({month_host_name: legend,month_cpu_util: cpu_util,month_mem_util:mem_util,
                            month_space_util:space_util,month_dates:dates});
              this.setState({loadingMonth: false});
              
              break;
          }
      }
        
 }


    _onDaySelected() {
        this.setState({dayClicked: true, weekClicked: false, monthClicked: false, frequency:"DAY",color:"'accent-1'" });
        this.setState({cpu_util: this.state.day_cpu_util,mem_util: this.state.day_mem_util,space_util: this.state.day_space_util,host_name: this.state.day_host_name,
        date_label:this.state.day_dates}); 
    }

    _onWeekSelected() {console.log('week selected');
        this.setState({dayClicked: false, weekClicked: true, monthClicked: false, frequency:"WEEK"});
      this.setState({cpu_util: this.state.week_cpu_util,mem_util: this.state.week_mem_util,space_util: this.state.week_space_util,host_name: this.state.week_host_name,
        date_label:this.state.week_dates}); 
      
    }
    _onMonthSelected() {
       console.log('month selected');
        this.setState({dayClicked: false, weekClicked: false, monthClicked: true, frequency:"MONTH" });
        this.setState({cpu_util: this.state.month_cpu_util,mem_util: this.state.month_mem_util,space_util: this.state.month_space_util,host_name: this.state.month_host_name,
        date_label:this.state.month_dates}); 
    }
                      
    
   render () {
     console.log('In AppHealthLine render');
      if (this.state.loadingDay)
        return <Spinning />;
      else 
        return (
           <div> <Heading tag="h3">Infrastructure Health Line Chart</Heading>           
            <Box colorIndex = "grey-2"  align="start"  >  
            <Button  onClick = {this.state.loadingDay? null: this._onDaySelected}  plain = {true} primary={this.state.dayClicked} >
             By Day 
            </Button></Box>
            <Box  colorIndex = "grey-2"  align="start"  > 
            <Button   onClick = {this.state.loadingWeek? null: this._onWeekSelected}  plain = {true} primary={this.state.weekClicked} >
              {this.state.loadingWeek? 'By Week (loading)': 'By Week'}  
            </Button>
            </Box>
            <Box colorIndex = "grey-2"  align="start" > 
            <Button  onClick = {this.state.loadingMonth? null: this._onMonthSelected }plain = {true} primary= {this.state.monthClicked} >
              {this.state.loadingMonth? 'By Month (loading)': 'By Month'}   
            </Button>
            </Box>
          <Tabs justify="start">
            <Tab  title="CPU"  >
            { 
              <Box colorIndex = "grey-2"  size={{width: "full"}}>
              <Lines InfraDataArray={this.state.cpu_util} HostName={this.state.host_name} Title='CPU Utilization' Dates={this.state.date_label} Frequency = {this.state.frequency}/>
              </Box>
            }
             </Tab>
            <Tab title="Memory">
            {
              <Box colorIndex = "grey-2" size={{width: "full"}}>
                <Lines InfraDataArray={this.state.mem_util} HostName={this.state.host_name} Title='Memory Utilization' Dates={this.state.date_label}Frequency = {this.state.frequency}/>
                      </Box>
            }
            </Tab>
            <Tab title="Disk"  >
            {
              <Box colorIndex = "grey-2" size={{width: "full"}}>
                <Lines InfraDataArray={this.state.space_util} HostName={this.state.host_name} Title='Disk Utilization' Dates={this.state.date_label}Frequency = {this.state.frequency}/>
              </Box>
            }
            </Tab>
          </Tabs>
        </div>
  
    );
     
     }
 
}

ApplicationHealthCheckLineCharts.propTypes = {
	memLineChartEPRID: React.PropTypes.array.isRequired
};




export default ApplicationHealthCheckLineCharts;
