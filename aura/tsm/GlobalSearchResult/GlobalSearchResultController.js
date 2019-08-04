({
    init: function (cmp, event, helper) {
        var fetchData = [{
            fullName: "Bikash Tam",
            email : "btamuly@gmail.com",
            priorEmail : "btamuly@gmail.com",
            id : "1000076321594",
            country: "US",
            dob : "1990-01-01",
            type : "Nucleus"
        }];
        fetchData = window.localStorage.getItem('searchData');
        if (fetchData !== '' && typeof fetchData !== 'object') {
            fetchData = JSON.parse(fetchData);
        }
        else {
            fetchData = [];
        }
        cmp.set('v.searchDataVal', window.localStorage.getItem('searchDataVal'));
		cmp.set('v.data', fetchData);
		cmp.set('v.columns', [
            {label: 'Full Name', fieldName: 'fullName', type: 'text'},
            {label: 'Current Email', fieldName: 'email', type: 'email'},            
            {label: 'Prior Email', fieldName: 'priorEmail', type: 'email'},
            {label: 'Nucleus Id', fieldName: 'id', type: 'text'},
            {label: 'Country', fieldName: 'country', type: 'text'},
            {label: 'DOB', fieldName: 'dob', type: 'text'},            
            {label: 'Type', fieldName: 'type', type: 'text'},
            {label: 'View', type: 'button', initialWidth: 135, typeAttributes: { label: 'View Account', name: 'view_details', title: 'Click to View Account'}}
            //{label: ' ', fieldName: ' ', type: 'text'}
        ]);        
    },
    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        cmp.set('v.isLoading', true);
        switch (action.name) {
            case 'view_details':
                //helper.showRowDetails(cmp, row);
                helper.playerAccountSearch(cmp, event, 'nucleusId', row.id);
                break;
            case 'edit_status':
                helper.editRowStatus(cmp, row, action);
                break;
            default:
                helper.showRowDetails(cmp, row);
                break;
        }
    }
})