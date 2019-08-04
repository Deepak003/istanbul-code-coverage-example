({
	doInit : function(component, event, helper) {
        var invoiceId = component.get('v.invoiceId');        
        if(invoiceId != 'undefined') {
            helper.getTransactionLogs(component);		
        }        		
	},
    closeTransactionLog : function (component, event, helper) {
        component.set('v.openTransactionLogs', false);
    }  
})