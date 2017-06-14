import React, { Component } from 'react';
import * as d3 from 'd3';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';

class TableforDetails extends Component {

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

		for (let index in array[0]){
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
	_downloadCSV(json, name) {
		let csv = this._convertJSONtoCSV(json);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = name + '.csv';
    hiddenElement.click();
	}

  renderTableBody(data){
    if(!data.length)
      return null;

    let keys = Object.keys(data[0]);

    return data.map(datum => (<TableRow>
    {
     keys.map(key => <td>{datum[key]}</td>)
    }
  </TableRow>));
}

render() {
	let tableHeader;
	let data = this.props.data;

	if(this.props.tableHeader)
		tableHeader = this.props.tableHeader;
	else
	tableHeader = data[0] && Object.keys(data[0]).map(d => d.replace(/_/g, " "));

  return (
    <div>
      <div ref={c => this.container=c} style={{"marginTop": "20px", "marginBottom": "30px", maxWidth: '800px'}}>
        <Table>
          <TableHeader
            labels={tableHeader}
            sortIndex={0}
            sortAscending={true}
          />
          <tbody>
          {this.renderTableBody(data)}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
}

TableforDetails.propTypes = {
	data: React.PropTypes.array.isRequired,
	name: React.PropTypes.string.isRequired
};

export default TableforDetails;


