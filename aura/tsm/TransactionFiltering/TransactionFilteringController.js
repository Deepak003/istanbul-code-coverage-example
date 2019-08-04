({
    doInit : function(component, event, helper) {
        //helper.setPicklistOptions();
        //helper.setBackupList(component, event);
    },
    keepCopy : function(component, event, helper) {
        
        if($A.util.isEmpty(component.get("v.invoicesBkp"))){
            component.set("v.invoicesBkp", component.get("v.invoices"));    
        }
        if($A.util.isEmpty(component.get("v.totalInvoiceCount_Copy"))){
            component.set("v.totalInvoiceCount_Copy", component.get("v.totalInvoiceCount"));    
        } 
        if($A.util.isEmpty(component.get("v.paymentOptionsBkp"))){
            component.set("v.paymentOptionsBkp", component.get("v.paymentOptions"));    
        }
        
    },
    searchByInvoiceNumber: function (component, event, helper) {
        var isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            var queryTerm = component.find('invoiceSearch').get('v.value');
            if(queryTerm){
                component.set("v.invoiceSource","search");
                helper.setInvoicesData(component,queryTerm);    
            }else{
                let bkpPaymentOptions = component.get("v.paymentOptionsBkp");
                component.set("v.invoiceSource","");
                component.set("v.paymentOptions",component.get("v.paymentOptionsBkp"));
                component.set("v.invoices",component.get("v.invoicesBkp"));
                component.set("v.totalInvoiceCount", component.get("v.totalInvoiceCount_Copy")); 
            }
        }
    },
    displayModal: function (component, event, helper) {
        //component.set("v.showModal",true)
        if (component.get("v.showModal")) {
            helper.displayModal(component,event);
        }
    },
    handlePaymentOptionEvt:function(component, event, helper){
        let paymentOption = event.getParam("selectedPaymentOption");
        let selectedPaymntOpt = {accountId:paymentOption};
        component.set("v.selectedPaymentOption", selectedPaymntOpt);
        event.stopPropagation();
    },
    /*handleDifferentAccountEvt:function(component, event, helper){
        helper.openDifferentAccountTab(component, event);
    },*/
    toggleFilter: function(component, event, helper){
        component.set('v.showFilter', !component.get('v.showFilter'));
    }
})