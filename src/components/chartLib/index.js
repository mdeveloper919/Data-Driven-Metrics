import React from 'react';
import PieChart from './PieChart';
import LineChart from './LineChart';
import LineChartWithTargetsMonth from './LineChartWithTargetsMonth';
import LineChartWithTargetsDay from './LineChartWithTargetsDay';
import StackedBar from './StackedBar';
import GroupedBar from './GroupedBar';
import HorizontalBar from './HorizontalBar_Grommet';
import VerticalBar from './VerticalBar_Grommet';
import GrommetTableforDetails from './TableforDetails_Grommet';
import TableforDetails from './TableforDetails';
import PlainStackedBarChart from './PlainStackedBar_Grommet';
import KPIIncidents from '../chartlib/KPIIncidents';
import BarMeters from '../chartlib/BarMeters';

import GroupedBarGrommet from './GroupedBar_Grommet';


export default drawing;


function drawing (data) {

	return {
		'Asset': {
			'Count by Criticality': (<PieChart data={data} catName={'Asset_Criticality'} valName={'Count'} />),
			'Count by Status': (<PieChart data={data} catName={'Asset_Status'} valName={'Count'} />),
			'Planned Sunset List': (<TableforDetails name={'Asset_Planned_Sunset_List'} data={data} cssClassName="grommet_ten_columns" enableScroll={true} />),
			'Details': (<TableforDetails name={'Asset_Details'} data={data} cssClassName="grommet_ten_columns" enableScroll={true}/>)
		},
		'Release Server Status': {
			'Release Server Trend':(<KPIIncidents url2 = {'ReleaseServerStatus/Release_Server_Trend'} time = "TREND" /> ),
			 'Details': (<TableforDetails name={'Release_Server_Status_Details'} data={data} cssClassName="grommet_eight_columns" enableScroll={true}/>)
	},
		'Incidents': {
			'Count by L3': (<StackedBar data={data} groupFilter={'Org_L3'} colorIndex={'ok'}  />),
			'Count by AssignmentGroup': (<StackedBar data={data} groupFilter={'AG_Ownership'} />),
			'Ticket Reduction Goals by Month (COE)': (<KPIIncidents url2 = {'Incidents/Ticket_Reduction_Goals_By_Month?filter=COE_Owned'} time = "MONTH" /> ),
			'Ticket Reduction Goals by Day (COE)': (<KPIIncidents url2 = {'Incidents/Ticket_Reduction_Goals_By_Day?filter=COE_Owned'} time = "DAY" /> ),
			'COE Open Tickets': (<TableforDetails name={'Incidents_Open_Tickets'} data={data} cssClassName="grommet_eight_columns" enableScroll={true}/>)

		},
		'Problem Tickets': {
			'Count by Status': (<GroupedBarGrommet data={data} colNames={['PM_Created_Count', 'PM_Closed_Count']} labelKey='Date'/>),
			'Top Contributors': (<HorizontalBar data={data} colName={'App_Name'} valName={'Count'} />),
			'Open PMR': (<TableforDetails name={'Problem_Management_Tickets_Open_PMR'} data={data} cssClassName="grommet_thirteen_columns" enableScroll={true}/>)
		},
		'RFC': {
			'Current FY Top 10 Contributors': (<HorizontalBar data={data} colName={'Asset Name'} valName={'Count'} />),
		  	'Closed RFC by Category': (<PlainStackedBarChart data={data} colName={'Closed Date'} barName={'RFC Category'} valName={'RFC_Counts'}/>),
			'Open RFC Status': (<PlainStackedBarChart data={data} xAxisName={'Asset Org L3'} catName={'Phase'} yAxisName={'count'}/>),
			'Open TSA RFC by Assets': (<VerticalBar data={data} colName={'AssetName'} valName={'openTSA_RFC_Count'}/>),
			'Open TSA RFC by Phase':     (<VerticalBar data={data} colName={'RFC Phase'} valName={'openTSA_RFC_Tally'}/>),
			'Open TSA RFC List': (<TableforDetails name={'RFC_Open_TSA_RFC_List'} data={data} cssClassName="grommet_twelve_columns" enableScroll={true}
			/>),

		'Open RFC ADR Tally': (
			<TableforDetails name={'RFC_Open_TSA_ADR_List'} data={data} cssClassName="grommet_five_columns" enableScroll={true}/>)
		},
		'Infrastructure': {
			'Summary': (<TableforDetails name={'SUMMARY'} data={data} tableHeader={['','CPU 90%>80', 'MEM 90%>80', 'DISK SPACE 90%>80']} enableScroll={true} />),
			'Mission Critical Assets Summary': (<TableforDetails name={'CRITICAL_SUMMARY'} data={data} cssClassName="grommet_four_columns" enableScroll={true}/>),
			'Top 5 Impacted Assets': (<TableforDetails name={'TOP_5_AFFECTED_APPS'} data={data} tableHeader={['Asset Name','Criticality', '# Affected Servers']} cssClassName="grommet_three_columns" enableScroll={true}/>),
			'Impacted Server Counts by Month': (<VerticalBar name={'MONTHLY_SERVER_INFRA_STATUS'} data={data} colName="Month" valName="Count"/>),
			'Impacted Assets Counts by Month': (<VerticalBar name={'MONTHLY_ASET_INFRA_STATUS'} data={data} colName="Month" valName="Count"/>)

		},
		'Escalation': {
			'Escalation Duration by month': (<PlainStackedBarChart data={data} colName={'Created_Month'} barName={'Major_Event_Type'} valName={'Impact(Hrs)'}/>),
		}
	};
}
