import React, { Component } from 'react';
import Heading from 'grommet/components/Heading';
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import Line from 'grommet/components/chart/Line';
import Layers from 'grommet/components/chart/Layers';
import Base from 'grommet/components/chart/Base';
import Legend from 'grommet/components/Legend';
import HotSpots from 'grommet/components/chart/HotSpots';
import Marker from 'grommet/components/chart/Marker';
import Grid from 'grommet/components/chart/Grid';
import Spinning from 'grommet/components/icons/Spinning';
import MarkerLabel from 'grommet/components/chart/MarkerLabel';
import Value from 'grommet/components/Value';


const colorArray = ['accent-1', 'accent-2', 'accent-3' , 'accent-4', 'accent-5', 'accent-6','accent-1', 'accent-2', 'accent-3' , 'critical', 'warning', 'ok', 'grey-4', 'neutral-1', 'neutral-2', 'neutral-3', 'ok'];
class Lines extends Component {
    constructor (props) {
        console.log('In Lines');
        super(props);
        this.state = {
            activeIndex: 0,
            legend: []
        };
        this._getIndex = this._getIndex.bind(this);
        //this._formatLegend = this._formatLegend.bind(this);

    }

    componentWillReceiveProps() {
        this.setState({legend: this.props.HostName});
        console.log(this.props.Title + 'componentWillReceiveProps');

        console.log('legend');
        console.log(this.props.HostName);
    }

    _getIndex(index) {
        let lastlegend = this.props.HostName;
        if (index != undefined && lastlegend != undefined) {
            this.setState({activeIndex: index});
           lastlegend.map(x =>  this.props.InfraDataArray);
            this.setState({legend: lastlegend});
        }
    }

    render() {
        console.log(`Lines render`);
        console.log(this.props.Title);
        console.log(this.props.HostName);
        var maxValue = Math.max(...this.props.InfraDataArray.map(x => Math.max(...x)));
        var minValue = Math.min(...this.props.InfraDataArray.map(x => Math.min(...x)));
        var diff = maxValue - minValue;
        var dateLabel = [];
        
        if (this.props.Frequency == 'DAY' ){
            this.props.Dates.forEach( (x, index) => {
                if (index%6 == 1)
                dateLabel.push({index: index, label: x});
            });
        }else if (this.props.Frequency == 'WEEK' ) {
             this.props.Dates.forEach( (x, index) => {
                dateLabel.push({index: index, label: x});
            });
        }else{
            this.props.Dates.forEach( (x, index) => {
                 if (index%3 == 1)
                dateLabel.push({index: index, label: x});
            });
        }       
        

        if (this.props.InfraDataArray == [])
            return <Spinning />;
        else return (

            <Chart full={true} loading={true}>
            <Heading tag="h3">{this.props.Title}</Heading>
            <Axis count = {5}
                labels={[
                 {"index": 0, "label": minValue.toFixed(1).toString() + '%'},
                 {"index": 1, "label": (minValue + diff * 0.25).toFixed(1).toString() + '%' },
                 {"index": 2, "label": (minValue + diff /2 ).toFixed(1).toString() + '%'},
                 {"index": 3, "label": (minValue + diff *.75 ).toFixed(1).toString() + '%'},
                 {"index": 4, "label": maxValue.toString() + '%'}]}
                vertical={true} />
            <Chart full={true}
                vertical={true}
                loading={true}>
                 {this.props.InfraDataArray.map((eachLine, index) =>
                      <MarkerLabel count={eachLine.length}
                      index={this.state.activeIndex}
                       colorIndex = {colorArray[index]}
                      
                      label={<Value value={eachLine[this.state.activeIndex]} />} />
                      )}
                <Base  width="full"/>
                <Layers full={true}>
                    <Grid rows={10} columns={this.props.Dates.length} full = {true}/>
                    <Marker vertical={true} colorIndex="accent-1"
                        count={this.props.Dates.length} index={this.state.activeIndex} />
                    {this.props.InfraDataArray.map((eachLine, index) =>
                    <Line values={eachLine}
                        colorIndex={colorArray[index]}
                        max={Math.ceil(maxValue)}
                        min={Math.floor(minValue)}
                        key={index}
                        activeIndex={this.state.activeIndex}
                        /> )}
                    <HotSpots count = {this.props.Dates.length}
                        max={100}
                        activeIndex={this.state.activeIndex}
                        onActive={this._getIndex} />
                </Layers>
                <Axis count = {this.props.Dates.length} full = {true}
                labels={dateLabel}
                />
                <Legend series={this.state.legend} />
            </Chart>
        </Chart>
        );
    }
}


Lines.propTypes = {
	HostName: React.PropTypes.array.isRequired,
	Dates: React.PropTypes.array.isRequired,
	InfraDataArray: React.PropTypes.array.isRequired,
	Title: React.PropTypes.string.isRequired
};

export  default Lines;

