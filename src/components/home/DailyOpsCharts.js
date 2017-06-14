import React, { Component } from 'react';

import Chart from './Chart';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Paragraph from 'grommet/components/Paragraph';
import AGTicketsCountChart from '../chartlib/AGTicketsCountChart';
import ActionLinksTable from './ActionLinksTable';
import KPIIncidents from '../chartlib/KPIIncidents';
import OpsRevTbl_Edit from '../chartlib/OpsRevTbl_Edit';
import AGTicketCountTable from './AGTicketCountTable'



class DailyOpsCharts extends Component {
	constructor(props) {
		super(props);
		this.state = {selectedIndex:0};

	}
  render() {

	let DailyOpsTabs =
					<Tabs justify='start' activeIndex={this.state.selectedIndex} onActive={i=>this.setState({selectedIndex:i})}>
						<Tab title='Escalation Management'>
								<OpsRevTbl_Edit key={1}
										getURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentSelect_EscalationManagement"
										postURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentInsert_EscalationManagement"
										ignoreFields={["Updated By","Last Updated"]}
										returnIDArg={["ID","ID"]}
										returnOptionalArgs={[]}
								/>
						</Tab>
						<Tab title='Incident Management'>
						  <AGTicketCountTable getURL="https://c9w24829.itcs.hpecorp.net/DDM/Incidents/Past_10_Days_COE_AG_IM_Tally"/>
								<OpsRevTbl_Edit key={3}
										heading="Open Incident Aging Analysis (without EDW AGs)"
										getURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentSelect_IncidentManagement"
										postURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentInsert_IncidentManagement"
										ignoreFields={[""]}
										returnIDArg={["IncidentIdentifier","Incident ID"]}
										returnOptionalArgs={[]}
								/>
							  <AGTicketsCountChart />
								<KPIIncidents chartHeading="Ticket Reduction Goals by Day (COE)" url2 = {'Incidents/Ticket_Reduction_Goals_By_Day?filter=COE_Owned'} time = "DAY" />
						</Tab>
						<Tab title='Problem Management'>
								<OpsRevTbl_Edit key={2}
										getURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentSelect_ProblemManagement"
										postURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentInsert_ProblemManagement"
										ignoreFields={["PM Record Status Description","PM Owner Assignment Group Name","Root Cause Owner Full Name"]}
										returnIDArg={["PM_Identifier","PM Identifier"]}
										returnOptionalArgs={[]}
								/>
						</Tab>
						<Tab title='RFC Management'>
									<OpsRevTbl_Edit key={4}
										getURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentSelect_RFC_Management"
										postURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentInsert_RFC_Management"
										ignoreFields={["RFC Status","RFC Planned Update", "RFC Requestor"]}
										returnIDArg={["RFC_Identifier","RFC Identifier"]}
										returnOptionalArgs={[{"ADR_ID":"ADR_ID"}]}
									/>
							</Tab>
							<Tab title='Expiring Service Accounts'>
									<OpsRevTbl_Edit key={5}
										getURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentSelect_ExpiringServiceAccount"
										postURL="https://c9w24829.itcs.hpecorp.net/DDM/UserComment/CommentInsert_ExpiringServiceAccount"
										ignoreFields={["Status"]}
										returnIDArg={["SRPAID","SRPA_ID"]}
										returnOptionalArgs={[{"ServerName":"Server_Name"},{"EPRID":"EPRID"}]}
									/>
						</Tab>
						<Tab title='Actions & Links'>
							<ActionLinksTable />
						</Tab>
					</Tabs>

    return (
			<Section  margin={{right: "xsmall", left: "small"}}  flex={true}>
				{DailyOpsTabs}
			</Section>

    );
  }
}


export default DailyOpsCharts;
