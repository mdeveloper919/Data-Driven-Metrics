import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard} from '../../actions';
import Dashboards from '../../utility/Dashboards';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import CloseIcon from 'grommet/components/icons/base/Close';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import RadioButton from 'grommet/components/RadioButton';
import SearchInput from 'grommet/components/SearchInput';
import Toast from 'grommet/components/Toast';

//let baseUrlDev = "http://c9w24829.itcs.hpecorp.net:4005/ddm/";
let baseUrlPro = "https://c9w24829.itcs.hpecorp.net/ddm/";
let baseUrlLocal = "http://localhost:4001/ddm/"

class ChartSidebar extends Component {
	constructor(props) {
    super(props);
    this.state = {
		selectedKPI: 'Asset',
		EmptyBox: '', /* added to reset the state of the input box */
		ToastOpen: false,
		currentFilter: '',
		filterList: []
	};


    this._appInitState = null;
    this._onSave = this._onSave.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._searchInputOnchange = this._searchInputOnchange.bind(this);
    this._shouldBeDefault = false;
  }

  componentWillMount() {
    this._appInitState = this.props.dashboards;
  }

  componentDidMount() {

  $.ajax({
	xhrFields: {
		withCredentials: true
		},
		type:"GET",
		url: 'https://c9w24829.itcs.hpecorp.net/ddm/FilterList/AssetList',
		dataType: 'json',
		success: function(data) {
			console.log('yes, this is a successful ajax of ChartSidebar get!');
			this._initialFilterList = data;
			this.setState({filterList: this._initialFilterList.map(function(asset) {return asset.AssetList;})});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
		});
	}


  componentWillReceiveProps(nextProps) {
        console.log('ChartSideBar componentWillReceiveProps');
				this._appInitState = nextProps.dashboards;
        let userData = JSON.stringify(this._appInitState);

        let userObject = {
			dashboards: userData, userDefaultDashboard: nextProps.defaultDashboard
        };

		console.log('userData is '+userData);

		$.ajax({
          xhrFields: {
        withCredentials: true
        },
		url: baseUrlPro + 'SaveUserProfile',
		type: "POST",
		dataType: "text",
		data:  userObject ,
		success: function(data) {
			console.log('yes, this is a successful ajax of CharSidebar Post!');
        }.bind(this),
		error: function(xhr, status, err) {
			console.error('#GET Error', status, err.toString());
			}.bind(this)
        });
    }

  _onSave() {
    this._appInitState = this.props.dashboards;
    this.props.onClose();
    this.setState({currentFilter: '', ToastOpen: true});
    let email = this.props.userEmail;
		let userDefaultDashboard= this.props.defaultDashboard;

	if (this._shouldBeDefault) {
        let currentDashboardName = this.props.currentDashboard;
        userDefaultDashboard = this.props.setDefaultDashboard(currentDashboardName).payload;

      }
}

  _onCancel() {
    this.props.replaceState(this._appInitState);
    this.props.onClose();
    this.setState({currentFilter: ''});
  }
  _findObjinArray(val, key, arr) {
    if (arr === null)  {
      return null;
    }
    for (let element of arr) {
      if (element[key] === val) {
        return element;
      } else {
        continue;
      }
    }
    return null;
  }
  _ifexisting(chartName, KPIName) {
    let dashboard = this._findObjinArray(this.props.currentDashboard, 'name', this.props.dashboards);

    if (dashboard !== null && 'KPIs' in dashboard) {
      let KPI = this._findObjinArray(KPIName, 'name', dashboard.KPIs);
      if (KPI !== null && 'charts' in KPI) {
        return !!(this._findObjinArray(chartName, 'name', KPI.charts));
      } else return false;
    } else return false;
  }
  _checkBoxOnchange(e, dashboardName, KPI, chartName) {

    if (e.target.checked) {
      this.props.addChart(dashboardName, KPI, chartName);
    } else {
      this.props.deleteChart(dashboardName, KPI, chartName);
    }
  }

  _searchInputOnchange(e) {

    if (e.target.value != '') {

        let newReg = new RegExp(e.target.value, 'gi');
        let assetlist = this.state.filterList;

         console.log("letter count: " + e.target.value.length);

         this.setState({
            filterList: assetlist.filter(d => newReg.test(d)),
            currentFilter: e.target.value
          });

    } else {
         $.ajax({
		  xhrFields: {
			  withCredentials: true
			},
			  type:"GET",
			  url: 'https://c9w24829.itcs.hpecorp.net/ddm/FilterList/AssetList',
			  dataType: 'json',
			  success: function(data) {
				  console.log('yes, this is a successful ajax of ChartSidebar get!');
				  this._initialFilterList = data;
				  this.setState({currentFilter: "", filterList: this._initialFilterList.map(function(asset) {return asset.AssetList;})});
				}.bind(this),
				error: function(xhr, status, err) {
				console.error('#GET Error', status, err.toString());
			}.bind(this)
		});
    }
  }

  render() {
	console.log('Render of ChartSidebar');
    let KPIs = Object.keys(Dashboards).sort();
		let toast = null;
	if (this.state.ToastOpen) {
      toast = (
	<Toast status="ok" onClose={() => this.setState({ToastOpen: false})}>
		Changes have been saved.
	</Toast>);
    }
	console.log('Identify name of this.props.currentDashboard of ChartSidebar');
	console.log(this.props.currentDashboard);

		if (!this.props.LayerOpen) {
			return toast;
		} else {
          let currentDashboard = null;
          for (let element of this.props.dashboards) {

            console.log(element.name);
            if (element.name === this.props.currentDashboard) {

              console.log(this.props.currentDashboard);
              currentDashboard = element;
          break;
        }

      }
			let placeholderForTip6 =("tip6Target");
		return (
            <Layer align="right">
              <Form onSubmit={(e) => e.preventDefault()}>
                <Header pad={{vertical: "small"}} >
                  <Heading tag="h1" id={placeholderForTip6}>Add Chart</Heading>
                </Header>
				
                <FormFields>
                  <fieldset>
                    <legend>Select a KPI</legend>
                    <FormField>
                      {
                        KPIs.map((d,i) => (
                          <RadioButton key={d+'-'+i} label={d} id={'kpi'+d+'-'+i}
                            checked={this.state.selectedKPI === d}
                            onChange={() => this.setState({selectedKPI: d})} />
                        ))
                      }
                    </FormField>
                  </fieldset>
                  <fieldset>
                    <legend>Select Assets</legend>
                    {

                      currentDashboard.filter.map(d => (
                        <Header key={d} size="small" justify="between">
                          <Anchor icon={<CloseIcon size="small" />}
                            label={d} primary={true}
                            onClick={()=> this.props.deleteDashboardFilter(this.props.currentDashboard, d)} />
                        </Header>
                      ))

                    }

                    <FormField>
                      <SearchInput  id="searchInput" name="searchInput-1" placeHolder="Search Assets"
                        value={this.state.currentFilter}
                        onDOMChange={(e) => this._searchInputOnchange(e)}
                        onSelect={({suggestion}) => { //when a list item is selected
                          this.setState({currentFilter: suggestion});
                          this.setState({currentFilter:(this.state.EmptyBox)}); // clear the input box upon selection

                            // check if the suggestion already exists in the dashboard.
                            let existing = false;

                            currentDashboard.filter.map(f => {
                              if (f === suggestion) existing = true;
                            });

                            if (!existing) {
                              this.props.addDashboardFilter(this.props.currentDashboard, suggestion);

                            }
                        }}
                        suggestions={this.state.filterList}

                      />
                    </FormField>
                  </fieldset>
                  <fieldset>
                    <legend>Select Charts to add</legend>
                    <FormField>
                      {
                        Dashboards[this.state.selectedKPI].map((d, i) => (
                          <CheckBox key={'chart-'+d+'-'+i} label={d} id={'chart-'+d+'-'+i}
                            checked={this._ifexisting(d, this.state.selectedKPI)}
                            onChange={(e) => this._checkBoxOnchange(e, this.props.currentDashboard, this.state.selectedKPI, d)} />
                        ))
                      }
                    </FormField>
                  </fieldset>

                  <fieldset>
                    <CheckBox id="name-checkbox1" label="I want to reset this as my default dashboard."
                      onChange={(e) => this._shouldBeDefault = e.target.checked} />
                  </fieldset>
                </FormFields>
              </Form>
              <Footer justify="between" />
              <Footer justify="between" >
                <Button label="Cancel" id="Cancel Edit Dashboard" secondary={true} onClick={this._onCancel} />
                <Button label="Save" primary={true} onClick={this._onSave} />
              </Footer>
             </Layer>
			);
		}
  }
}

ChartSidebar.propTypes = {
  LayerOpen:             React.PropTypes.bool.isRequired,
  dashboards:            React.PropTypes.array.isRequired,
  currentDashboard:      React.PropTypes.string.isRequired,
  addChart:              React.PropTypes.func.isRequired,
  addDashboardFilter:    React.PropTypes.func.isRequired,
  setDefaultDashboard:   React.PropTypes.func.isRequired,
  deleteDashboardFilter: React.PropTypes.func.isRequired,
  deleteChart:           React.PropTypes.func.isRequired,
  replaceState:          React.PropTypes.func.isRequired,
  onClose:               React.PropTypes.func.isRequired,
  defaultDashboard:      React.PropTypes.string
};


const mapStatetoProps = ({ dashboards, currentDashboard, userEmail,defaultDashboard }) => ({ dashboards, currentDashboard, userEmail,defaultDashboard });
export default connect(mapStatetoProps, { addChart, deleteChart, replaceState, addDashboardFilter, deleteDashboardFilter, setDefaultDashboard})(ChartSidebar);
