({
	 doInit : function(component, event, helper) {
         helper.getEmailHistory(component);
         component.set('v.columns', [
            {label: 'EVENT NAME', fieldName: 'eventName', type: 'text', initialWidth:170},
            {label: 'RECIPIENT', fieldName: 'recipient', type: 'text'},
            {label: 'LAST SENT', fieldName: 'lastSentDate', type: 'text', initialWidth:120}
            
        ]);
	},
    
    resendInvoiceClick : function (component, event, helper) {   
        helper.resendInvoice(component);
    },
    
    closeResendInvoice : function (component, event, helper) {               
        component.set('v.openResendInvoice', false);
    },
    
    updateSelectedRows: function (component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.resendHistoryList', selectedRows);
        if(selectedRows.length > 0){
            component.set('v.disableConfirmButton', false);
        }
        else{
             component.set('v.disableConfirmButton', true);
		}
    }
})