export default (state='', action) => {
	switch (action.type) {
		case 'SET_CURRENTDASHBOARD': {
			return action.payload;
			}
			case 'SET_CURRENT_FUNC_DASHBOARD': {
	      return action.payload;
	    }			
	}
	return state;
};
