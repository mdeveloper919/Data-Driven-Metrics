export default (state=[], action) => {
	switch (action.type) {
		case 'ADD_DASHBOARD': {
			return state.concat({
        name: action.payload.name,
        description: action.payload.description,
        filter: action.payload.filter || [],
        KPIs: action.payload.kpi || [],
      });
    }
    case 'DELETE_DASHBOARD': {
      return state.filter(d => d.name !== action.payload);
    }
    case 'ADD_CHART': {
			let { dashboardName, KPI, chartName } = action.payload;
      return state.map(d => {
        if (dashboardName !== d.name) return d;
        else {
          let KPIs, added = false;
          KPIs = d.KPIs.map(f => {
            if (f.name !== KPI) return f;
            else {
              // already proved that chartName is unique.
              added = true;
              return {...f, charts: f.charts.concat({name: chartName})};
            }
          });
          if (!added) return {...d, KPIs: d.KPIs.concat({name: KPI, charts: [{name: chartName}]})};
          return {...d, KPIs};
        }
      });
    }
    case 'DELETE_CHART': {
      let { dashboardName, KPI, chartName } = action.payload;
      return state.map(d => {
        if (dashboardName !== d.name) return d;
        else {
          let KPIs = d.KPIs.map(f => {
            if (f.name !== KPI) return f;
            else {
              return {...f, charts: f.charts.filter(g => g.name !== chartName)};
            }
          }).filter(f => f.charts.length > 0);
          return {...d, KPIs};
        }
      });
    }
    case 'REPLACE_STATE': {
      return action.payload;
    }
    case 'ADD_DASHBOARDFILTER': {
      return state.map(d => {
        if (d.name !== action.payload.dashboardName) return d;
        else return {...d, filter: d.filter.concat(action.payload.filter)};
      });
    }
    case 'DELETE_DASHBOARDFILTER': {
      return state.map(d => {
        if (d.name !== action.payload.dashboardName) return d;
        else return {...d, filter: d.filter.filter(f => f !== action.payload.filter)};
      });
    }
	}
  return state;
};
