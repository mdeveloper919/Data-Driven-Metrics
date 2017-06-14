export default (state = true, action) => {
	switch (action.type) {
		case 'CLOSE_HC_TABLE_DISPLAY': 
			return action.payload;
		default:
			return state;
	}
};
