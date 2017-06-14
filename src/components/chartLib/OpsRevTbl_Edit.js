import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from 'grommet/components/Table';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Label from 'grommet/components/Label';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Spinning from 'grommet/components/icons/Spinning';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';




class OpsRevTbl_Edit extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        cols : [],
        data : [],
  			loading: true
      };
      //Done here as it's used straight after load, vs other functions later
      this.formatDates = this.formatDates.bind(this);
    }

    componentDidMount(){
      //Get Ignore fileds array from props
      const fieldsToIgnore = this.props.ignoreFields;
      //Get Table Contents and set cols & data states***********************************************API GET START***
      $.ajax({
    	  xhrFields: {
    		     withCredentials: true
    		},
    		type:"GET",
    		url: this.props.getURL,//Calendar date will set querystring date
    		dataType: 'json',
    		success: function(data_retrieved) {
          //alert('Successful Pull of data for table, with : '+data_retrieved.length+' rows');

          //Check data is not null or undefined before populating stuff
          if($.trim(data_retrieved)){
            //Parse copy of keys for columns from first object of JSON Response
            data_retrieved.map(function(i,index){
              let i_withIndex = i;
              //indexer will be added and ignored from view... Only necessary for the comment update to have unique ID that corresponds with DOM key I give
              i_withIndex.indexer = index;
              return i_withIndex;
            });
            let firstItem = data_retrieved;
            let keysForCol = Object.keys(firstItem[0]);
            //filter out unwanted keys from array
            let keysForColFiltered = keysForCol.filter(function(data_cell){
              //check passed props to ignore and the index added are not returned for the table view
              return (!fieldsToIgnore.includes(data_cell) && data_cell != "indexer")
            });
            //for each remaining key set key an label to value
            let cols = keysForColFiltered.map(function(colName){
              return ({key:colName, label:colName})
            })
            //alert(JSON.stringify(cols));
            this.setState({ data : data_retrieved, cols: cols, loading: false});
          }else{
            this.setState({ loading: false});
          }
        }.bind(this),
  			error: function(xhr, status, err) {
  				console.error('#GET Error', status, err.toString());
  			}.bind(this)
  		});
      // //******************************************************************************************API GET END***

      //Bind Event Handler, & Handler to get NT-Details from code's header, on full-load
      this.onUpdateSubmit = this.onUpdateSubmit.bind(this);
    }

    //Uses the Unique Cols (excluding the ones filtered out) from the data ajax request
    generateHeaders (){
        var cols = this.state.cols;  // [{key, label}]

        //Generate header cell components in state's 'cols', and replace all underscores with spaces
        var headersAndStyle = cols.map(function(colData) {
            return colData.label.replace(/_/g," ");
        });
        //Add the interactive header cell components not in state's 'cols'.
        headersAndStyle.push('New Update');
        headersAndStyle.push('');
        //alert(JSON.stringify(headersAndStyle)+"//////"+(typeof headersAndStyle));
      return headersAndStyle;
    }

    //Loops the Unique Cols (excluding the ones filtered out) from the data ajax request
    //to lookup corresponding attribute key-matches in data for each object (row)
    generateRows(){
      let that = this;
        let cols = this.state.cols,  // [{key, label}]
            data = this.state.data;

        //Style stuff for the trs, tds, and their contents used
        const tdTxtField = {
          backgroundColor: '#DCDCDC',
          color: 'grey',
          resize: 'vertical',
          maxHeight:'250px'
        };
        const btnStyl = {
          backgroundColor: '#DCDCDC',
          color: 'black',
          margin:'1px',
          padding: '0px'
        };
        const tdStyl={
          height:'10px',
          minWidth:'100px'
        }
        const divInTdStyl={
          maxWidth: '300px',
          overflow:'auto', //auto,hidden,visible are options
          maxHeight:'250px'
        }

        //needed to validate for unique ID below
        let uniqueIdForComments = this.props.returnIDArg[1];

        return data.map(function(item) {
          //alert(JSON.stringify(item))


          //I add two columns to the data mapped out, so I need last index+1 and +2 for unique keys for it
          let last_index_val = 0;
            //for each data object, map to row >>> for each row map tds where they match cols
            let dataAndStyle = cols.map(function(colData, index) {
                  //filter date objects to reformat
                  if (colData.key.includes("imestamp")){
                    last_index_val = index;
                    return <td key={index} style={tdStyl}><div style={divInTdStyl}>{that.formatDates(item[colData.key])}</div></td>
                  }else if (colData.key.includes("Date")){
                    last_index_val = index;
                    return <td key={index} style={tdStyl}><div style={divInTdStyl}>{item[colData.key].substring(0,10)}</div></td>;
                  }else{
                    last_index_val = index;
                    return <td key={index} style={tdStyl}><div style={divInTdStyl}>{item[colData.key]}</div></td>;
                  }
            });


            //check each item object for a unique ID passed(this.props.returnIDArg[0]), so it could POST comments, so we can disable comment posting if it's not there
            //let hasUniqueIdForComments = item[uniqueIdForComments];//<TODO:This was used below but one of the tables 'RFC Identifier' has a split between 2 possible IDs so I can't use that logic now
            //alert(hasUniqueIdForComments) //>> Used in ternary operator to return Comment textbox and submit button in td's on rows only where an the ID necessary to save the comment is present, else returning empty td's

            //Add the interactive column cell components not in state's 'data'.
            dataAndStyle.push(<td key={last_index_val+1} id={"update"}><textarea rows="3" style={tdTxtField} label="Write in me"/></td>);
            dataAndStyle.push(<td key={last_index_val+2} id={"submit"}><input type='button' style={btnStyl} value='Submit' onClick={that.onUpdateSubmit}/></td>);
            //Set every odd row to a different hue of grey so it reads clearer
            return (item.indexer%2==0)?(<TableRow responsive={false} key={item.indexer} id={item.indexer} style={{backgroundColor:"#3f3f3f"}}>{dataAndStyle}</TableRow>) : (<TableRow responsive={false} key={item.indexer} id={item.indexer}>{dataAndStyle}</TableRow>);

        });
    }

    //Used to reformat each date passed in the rows of table, as they come in from APIs in default format
    formatDates(dt_passed){
      let dt = "Unset Date";

      if(dt_passed!=null && dt_passed != '1900-01-01T00:00:00.000Z'){
        dt = new Date(dt_passed).toUTCString();
      }
      return dt;
    }

    onUpdateSubmit(event){
      event.preventDefault();
      //Define data JSON local reference
      let data = this.state.data;

      //TABLE ROW: Get Sending Row's id (matches the object's id)
      let tdPassed = event.currentTarget.parentNode;
      let tdParentTr_id = tdPassed.parentNode.id;//<<Had to use ID here as key (or any other attribute seemed unreachable)

      //TABLE ROW'S ITEM: Filter JSON object item from 'data' that matches row id passed from event
      let itemFromData = data.filter(function( item ) {
        return item.indexer == tdParentTr_id;
      });
      //alert("Before New Update"+JSON.stringify(itemFromData));

      //Get preceeding tr's child input tag
      let update_td = tdPassed.previousSibling.children[0];

      //check contents
      if(update_td.value.length>100){
        alert("Please keep your update comment under 100 characters!");
      }else if(update_td.value){
        //Set Timestamp For Local Only
        let update_date = new Date().toUTCString();

        //Set Email For Local Only
        let email_addr = this.props.userEmail;

        //Second I retrieve the full updated JSON array as there may be a delay in retrieval
        let data_Mod = data.map(function( item ){
          if(item.indexer == tdParentTr_id){
                item['Comments']=update_td.value;
                //Tbl 1 takes a soln instead
                item['Solutions']=update_td.value;

                //Handle multiple naming techniques on the Email retrieve Title TODO:Fix & Get email correctly!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                item['Comments_Updated_By']=email_addr;
                item['Comment_Updated_By']=email_addr;
                item['Updated_By']=email_addr;

                //Handle multiple naming techniques on the TimeStamp Title TODO:Fix!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                item['Comments_Updated_Timestamp']=update_date;
                item['Comment_Updated_Timestamp']=update_date;
                item['Updated_timestamp']=update_date;
             }
          return item;
        });
        //Third, here's the modified object retrieved
        let data_Obj = data.filter(function( item ){
          return item.indexer == tdParentTr_id
        });
        //alert(JSON.stringify(data_Mod)+"........"+JSON.stringify(data_Obj));

        //Make an object from props to pass to POST as data
        let keyForIDPassed = this.props.returnIDArg[0];
        let valForIDPassed = this.props.returnIDArg[1];
        let objForPosting ={};
        objForPosting[keyForIDPassed] = data_Obj[0][valForIDPassed];
        objForPosting["UserComment"] = update_td.value;
        let otherArgKVPS = this.props.returnOptionalArgs;//<<This is a JSON Array

        //If there are other KVPs needed for the data object to POST
        if(otherArgKVPS.length>0){
          otherArgKVPS.map(function(argObj){//For each json object...
            //Map each key and value to targetobject
            let key = Object.keys(argObj)[0];
            let val = Object.values(argObj)[0];
            objForPosting[key] = data_Obj[0][val];
            //alert("Here we are - "+JSON.stringify(key)+JSON.stringify(val));//[{"Server_Name":"Server_Name"},{"EPR_ID":"EPRID"}]
          });
        }
        //Optional further Arg keys and vals
        //alert(JSON.stringify(objForPosting));

        //****************************************************************************************************************API POST START***
        //Send POST, and, on success, update state array...........................REFORMAT DATE... MAYBE USE STANDARDISED ONE FOR NOW
        $.ajax({
    	    xhrFields: {
            withCredentials: true
          },
          type:"POST",
          url: this.props.postURL,
          dataType: "text",//<<Response is text
          contentType: "application/x-www-form-urlencoded",
          //Pass objForPosting defined by props passed above
          data: objForPosting, //<< ID is EscalationID... Also we dont pass back commenter or timestamp!!!!!!
          success: function(){
            this.setState({
                data: data_Mod
            });
          }.bind(this),
  		    error: function(xhr, status, err) {
  		      console.error('#POST Error', status, err.toString());
    		  }.bind(this)
        });

        //****************************************************************************************************************API POST END***

        //clear update field
        update_td.value = "";
      }else{
        alert("Please enter an update greater than zero characters!");
      }
    }

    //if loading is true, display Spinning component, then if cols is empty (Empty json array in return), display notice, else display populated table
    render() {
  		if (this.state.loading) {
  			return <Spinning />;
  		} else {
  			if (Object.keys(this.state.cols).length === 0) {
          return (<h3 style={{color:'red'}}>No Data To Be Displayed</h3>);
        } else {
  				return (
          <Box colorIndex = "grey-2" className={'why'} >
 						<Heading tag='h3'>{this.props.heading}</Heading>
          <Table  style={{color:'white', backgroundColor:'#262626'}} selectable={true}>
                <TableHeader labels={this.generateHeaders()} style={{backgroundColor:"yellow", color:"black", fontSize:"20px"}}/>
                <tbody>{this.generateRows()}</tbody>
            </Table>
          </Box>
        )
      }
    }
  }
}

OpsRevTbl_Edit.propTypes = {
  userEmail:               React.PropTypes.string.isRequired,
  getURL:                  React.PropTypes.string.isRequired,
  postURL:                 React.PropTypes.string.isRequired,
  ignoreFields:            React.PropTypes.array.isRequired,
  returnIDArg:             React.PropTypes.array.isRequired,
  returnOptionalArgs:      React.PropTypes.array,
};

//below used to get user's NT email details
const mapStatetoProps = ({ userEmail }) => ({ userEmail });
export default connect(mapStatetoProps)(OpsRevTbl_Edit);
