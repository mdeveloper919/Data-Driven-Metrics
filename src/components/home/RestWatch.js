import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateHealthCheckStatus, updateAssetManagementStatus} from '../../actions';

const hcURL = 'https://c9w24829.itcs.hpecorp.net/ddm/WebSocketApplicationHealth';
const amURL = 'https://c9w24829.itcs.hpecorp.net/ddm/WebSocketAssetManagement';

class RestWatch extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps ( {watch} ) {

      if (this.props.watch == 'HC') {

          setInterval(() => {

                $.ajax({
                      xhrFields:{
                          withCredentials: true
                      },
                      type:"GET",
                      url: hcURL,
                      data: { eprids : this.props.eprid },
                      dataType: 'json',
                      success: function(data) {
                          let redCount = data[0].NUMBER_RED || 0;
                          let yellowCount = data[0].NUMBER_YELLOW || 0;
                          let greenCount = data[0].NUMBER_GREEN === null && data[0].NUMBER_YELLOW === null || data[0].NUMBER_RED === null  ? 1 : data[0].NUMBER_GREEN;
                          console.log("HC RW data: " + data);
                          console.log("HC RW eprid: " + this.props.eprid);
                          this.props.updateHealthCheckStatus(redCount, yellowCount, greenCount);
                      }.bind(this),
                      error: function(xhr, status,
                         err) {
                          console.error('#GET Error', status, err.toString());
                      }.bind(this)
                  });
          }, 5000);

          setInterval(() => {

                $.ajax({
                      xhrFields:{
                          withCredentials: true
                      },
                      type:"GET",
                      url: amURL,
                      data: { eprids : this.props.eprid },
                      dataType: 'json',
                      success: function(data) {
                          console.log("AM RW data: " + JSON.stringify(data));
                          console.log("AM RW eprid: " + this.props.eprid);
                          let redCount = data.RED || 0;
                          let greenCount = !data.GREEN && !data.RED ? 1 : data.GREEN;
                          this.props.updateAssetManagementStatus(redCount, greenCount);
                      }.bind(this),
                      error: function(xhr, status, err) {
                          console.error('#GET Error', status, err.toString());
                      }.bind(this)
                  });
          }, 5000);
      }



    }

    componentDidMount() {

        if (this.props.watch == 'HC') {

            setInterval(() => {

                	$.ajax({
                        xhrFields:{
                            withCredentials: true
                        },
                        type:"GET",
                        url: hcURL,
                        data: { eprids : this.props.eprid },
                        dataType: 'json',
                        success: function(data) {
                            let redCount = data[0].NUMBER_RED || 0;
                            let yellowCount = data[0].NUMBER_YELLOW || 0;
                            let greenCount = data[0].NUMBER_GREEN === null && data[0].NUMBER_YELLOW === null || data[0].NUMBER_RED === null  ? 1 : data[0].NUMBER_GREEN;
                            console.log("HC RW data: " + data);
                            console.log("HC RW eprid: " + this.props.eprid);
                            this.props.updateHealthCheckStatus(redCount, yellowCount, greenCount);
                        }.bind(this),
                        error: function(xhr, status, err) {
                            console.error('#GET Error', status, err.toString());
                        }.bind(this)
                    });
            }, 5000);

            setInterval(() => {

                  $.ajax({
                        xhrFields:{
                            withCredentials: true
                        },
                        type:"GET",
                        url: amURL,
                        data: { eprids : this.props.eprid },
                        dataType: 'json',
                        success: function(data) {
                            console.log("AM RW data: " + JSON.stringify(data));
                            console.log("AM RW eprid: " + this.props.eprid);
                            let redCount = data.RED || 0;
                            let greenCount = !data.GREEN && !data.RED ? 1 : data.GREEN;
                            this.props.updateAssetManagementStatus(redCount, greenCount);
                        }.bind(this),
                        error: function(xhr, status, err) {
                            console.error('#GET Error', status, err.toString());
                        }.bind(this)
                    });
            }, 5000);
        }


    }

    componentWillUnmount() {

      if(typeof this.connection !== 'undefined')
      {
        this.connection.close();
      }
    }

    render() {
        return null ;
    }
}

RestWatch.propTypes = {
    eprid: React.PropTypes.string,
    updateHealthCheckStatus: React.PropTypes.func.isRequired,
    updateAssetManagementStatus: React.PropTypes.func.isRequired
}
const mapStatetoProps = ({ currentDashboard, dashboards, defaultDashboard }) => ({ currentDashboard, dashboards, defaultDashboard });
export default connect( mapStatetoProps, { updateHealthCheckStatus, updateAssetManagementStatus})(RestWatch);
