export default (state = '', action) => {
	switch (action.type) {
		case 'SET_USEREMAIL': 
			return action.payload;
		default:
			return state;
	}
};
