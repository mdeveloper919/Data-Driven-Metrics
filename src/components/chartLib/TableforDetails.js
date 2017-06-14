import React, { Component } from 'react';
import Button from 'grommet/components/Button';
import Headline from 'grommet/components/Headline';
import * as d3 from 'd3';
import Box from 'grommet/components/Box';

// import handsontable from 'handsontable';



class TableforDetails extends Component {
	constructor(props) {
		super(props);
		this.container = null;
		this.keys      = Object.keys(this.props.data[0]);
		this.headers   = this.keys.map(d => d.replace('_', ' '));
		this.columns   = this.keys.map(d => ({data: d}));
		this.processedData = this._formateDate(this.props);
	}

	
	componentDidMount() {
		let height = 22 * (this.processedData.length + 3);
		height = height > 800? 800:height;
		let hot = new Handsontable(this.container,{
			data:               this.processedData,
			rowHeaders:         true,
			colHeaders:         this.headers,
			manualRowResize:    true,
			manualColumnResize: true,
			columnSorting:      true,
			width:             1750,
			colWidths: 190,
			height,
			columns:            this.columns
		});
	}
	
	_formateDate({ data, dateColm=[], dateFormat }) {
		let strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
		let format = d3.timeFormat(dateFormat);
		data.forEach(d => {
			dateColm.forEach(f => {
				if (d[f])
					d[f] = format(strictIsoParse(d[f]));
			});
		});
		return data;
	}

	_convertJSONtoCSV(objArray) {
		// code from http://jsfiddle.net/sturtevant/vunf9/
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let line = '';

        for (let index in array[0]) {
            let value = index + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }


        line = line.slice(0, -1);
        str += line + '\r\n';
		
		for (let i = 0; i < array.length; i++){
			let line = '';
			
			for (let index in array[i]){
				let value = array[i][index] + "";
				line += '"' + value.replace(/"/g, '""') + '",';
            }
			
			line = line.slice(0, -1);
			str += line + '\r\n';
		}
		
		return str;
	}
	
	_downloadCSV(json, name){
		let csv = this._convertJSONtoCSV(json);
		let hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
		hiddenElement.target = '_blank';
		hiddenElement.download = name + '.csv';
		hiddenElement.click();
	}
	
	
	render() {
		return (
			<div>
				 <Box  colorIndex = "grey-2" >
            <Button  label="Download CSV" onClick={() => this._downloadCSV(this.processedData, this.props.name)}/>
				</Box>
				<Headline size="small" align="start" >Use arrow keys to navigate in the table. Click the headers to sort</Headline>
				<div ref={c => this.container=c} style={{"marginTop": "20px", "marginBottom": "30px", "color":"black"}} />
				
			</div>
		);
	}
}

TableforDetails.propTypes = {
	data: React.PropTypes.array.isRequired,
	name: React.PropTypes.string.isRequired
};

export default TableforDetails;
