({
    doInit: function(component, event, helper) {
        const data = component.get("v.data");
        const isRefunded = !!(Array.isArray(data.refunds) && data.refunds.find((r)=>r.transactionType=='REFUND' && r.statusReason=="COMPLETED"));
        component.set('v.isRefunded', isRefunded);
		
		const refundInitiated = !!(Array.isArray(data.refunds) && data.refunds.find((r)=>r.transactionType=='REFUND'));
		
		const subscription = component.get("v.subscription");        
        if(subscription.status != 'STACK CARDS' && (subscription.status == 'ENABLED' || subscription.status == 'ACTIVE' || subscription.status == 'PENDINGEXPIRED') && !refundInitiated)
        	component.set('v.isRefundable', true);
    },
    togglePopover : function(component, event, helper) {
        component.set('v.showPopover', !component.get('v.showPopover'));        
    },
    handleViewLogs : function(component, event, helper) {        
        component.getEvent('onClickViewLog').setParams({ value: component.get('v.data') }).fire();
    },
    handleResendInvoice : function(component, event, helper){
        component.getEvent('onClickResend').setParams({ value: component.get('v.data') }).fire();
    },
    handleRefund : function(component, event, helper){
        component.getEvent('onClickRefund').setParams({ value: component.get('v.data') }).fire();
    }
})