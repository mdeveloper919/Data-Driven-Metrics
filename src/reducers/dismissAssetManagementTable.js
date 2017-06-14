export default (state = true, action) => {
	switch (action.type) {
		case 'CLOSE_AM_TABLE_DISPLAY': 
			return action.payload;
		default:
			return state;
	}
};
