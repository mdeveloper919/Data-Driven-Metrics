export default (state='', action) => {
	switch (action.type) {
		case 'SET_DEFAULTDASHBOARD': 
			return action.payload;
		default:
			return state;
	}
};
