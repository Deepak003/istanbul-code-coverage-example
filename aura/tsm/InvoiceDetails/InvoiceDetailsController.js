({    
    doInit: function(component, event, helper) {
        var isRefundAcceptable = false;
        var lineItems = component.get("v.data.lineItems");
        
        for(var i=0; i<lineItems.length;i++){ // If any LineItem has isRefundAcceptable TRUE, then Queue Refund button will appear
            if(lineItems[i].isRefundAcceptable)
                isRefundAcceptable = true;
        }

        if(isRefundAcceptable)
            component.set("v.isQueueRefund", true);

    },
    togglePopover : function(component, event, helper) {
        component.set('v.showPopover', !component.get('v.showPopover'));        
    },
    
    handleViewLogs : function(component, event, helper) {
        component.set('v.openTransactionLogs', true);        
    },
    
    handleCancelPreOrder : function(component, event, helper){
        component.set('v.openCancelPreOrder', true);
    },
    
    handleResendInvoice : function(component, event, helper){
        component.set('v.openResendInvoice', true)
    },
    
    handleRefund : function(component, event, helper){
        var title = event.getSource().get("v.title");
        switch(title) {
          case 'Refund':
            component.set('v.refundModalTitle', 'Refund');
            break;
          case 'G3 Refund':
            component.set('v.refundModalTitle', 'G3 Refund');
            break;
          case 'Queue Refund':
            component.set('v.refundModalTitle', 'Queue Refund');
        }
        component.set('v.showRefundModal', true);
    },
    
    refreshInvoice: function(component, event, helper){
        helper.refreshInvoice(component, event);
    }
})