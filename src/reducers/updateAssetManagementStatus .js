export default (state='0', action) => {
	switch (action.type) {
        case 'UPDATE_ASSETMANAGEMENT_STATUS':
          return {redCount: action.payload.redCount || 0, greenCount: action.payload.greenCount || 0};    
        default:
            return state;
    }

};
