({
	doInit : function(component, event, helper) { 
        helper.getRefundReasons(component);
        var refundType = component.get("v.refundModalTitle");
        switch(refundType) {
          case 'Refund':
            component.set('v.refundButtonLabel', 'Refund');
            component.set('v.partialRefund', true);
            component.set('v.disableRefundButton', true);
            break;
          case 'G3 Refund':
            component.set('v.refundButtonLabel', 'Refund');
            component.set('v.partialRefund', false);
            component.set('v.disableRefundButton', false);
            break;
          case 'Queue Refund':
            component.set('v.refundButtonLabel', 'Queue Refund');
            component.set('v.partialRefund', true);
            component.set('v.disableRefundButton', true);
        }
        var data = component.get("v.data");
        var refundOptions = component.get("v.refundOptions");
        refundOptions[1] = {'label': data.currencySymbol, 'value': 'currency'};
        
        var preRefundInvoiceData = JSON.stringify(data);
        component.set("v.preRefundInvoiceData",preRefundInvoiceData);  
        
        for(var key in  data.lineItems){
           data.lineItems[key].formRefundAmountType = "percent";
           data.lineItems[key].formItemRefundTotal = 0.00;
        }
        component.set("v.data",data);
	},
    closeRefundModal : function (component, event, helper) {
        component.set('v.showRefundModal', false);
        var invoiceModalStr = component.get('v.preRefundInvoiceData');
        var invoiceData = JSON.parse(invoiceModalStr);
        component.set("v.data",invoiceData);
    },
    enableConfirmButton : function(component, event, helper){
        component.set('v.disableRefundButton', false);
    },
    confirmRefund : function (component, event, helper) {               
        helper.confirmRefund(component);
    },
    rowClicked : function (component, event, helper) {               
        helper.itemRowClicked(component, event);
    },
    handleRefundAmountTypeChange : function (component, event, helper) {               
        helper.refundAmountTypeChange(component, event);
    },
    handleReasonChange : function (component, event, helper) {               
        helper.reasonChange(component, event);
    },
    handleRefundAmoundChange : function (component, event, helper) {               
        helper.refundAmountChange(component, event);
    }
    
})