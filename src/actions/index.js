export const setUserEmail = (userEmail) => {
	return {
		type: 'SET_USEREMAIL',
		payload: userEmail
	};
};

export const addDashboard = (name, description, filter, kpi) => {
  return {
    type: 'ADD_DASHBOARD',
    payload: {name, description, filter, kpi}
  };
};



export const deleteDashboard = (name) => {
  return {
    type: 'DELETE_DASHBOARD',
    payload: name
  };
};


export const setDefaultDashboard = (name) => {
  return {
    type: 'SET_DEFAULTDASHBOARD',
    payload: name
  };
};

export const setCurrentDashboard = (name) => {
  return {
    type: 'SET_CURRENTDASHBOARD',
    payload: name
  };
};

export const addChart = (dashboardName, KPI, chartName) => {
  return {
    type: 'ADD_CHART',
    payload: {dashboardName, KPI, chartName}
  };
};

export const deleteChart = (dashboardName, KPI, chartName) => {
  return {
    type: 'DELETE_CHART',
    payload: {dashboardName, KPI, chartName}
  };
};

export const replaceState = (newDashboards) => {
  return {
    type: 'REPLACE_STATE',
    payload: newDashboards
  };
};

export const addDashboardFilter = (dashboardName, filter) => {
  return {
    type: 'ADD_DASHBOARDFILTER',
    payload: {dashboardName, filter}
  };
};

export const deleteDashboardFilter = (dashboardName, filter) => {
  return {
    type: 'DELETE_DASHBOARDFILTER',
    payload: {dashboardName, filter}
  };
};

export const updateAssetManagementStatus = (redCount, greenCount) => {
  return {
    type: 'UPDATE_ASSETMANAGEMENT_STATUS',
    payload: {redCount, greenCount}
  };
};

export const updateHealthCheckStatus = (redCount, yellowCount, greenCount) => {
  return {
    type: 'UPDATE_HEALTHCHECK_STATUS',
    payload: {redCount, yellowCount, greenCount}
  };
};