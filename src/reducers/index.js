// Set up your root reducer here...
import { combineReducers } from 'redux';
import dashboards from './dashboards';
import userEmail from './userEmail';
import defaultDashboard from './defaultDashboard';
import currentDashboard from './currentDashboard';
import updateAssetManagementStatus from './updateAssetManagementStatus ';
import updateHealthCheckStatus from './updateHealthCheckStatus';
import dismissHealthCheckTable from './dismissHealthCheckTable';
import dismissAssetManagementTable from './dismissAssetManagementTable';


export default combineReducers({
  userEmail,
  dashboards,
  defaultDashboard,
  currentDashboard,
  updateAssetManagementStatus,
  updateHealthCheckStatus,
  dismissHealthCheckTable,
  dismissAssetManagementTable
});
