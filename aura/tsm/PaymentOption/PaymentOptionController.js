({
    addUnassociatedPaymentCard: function(component, event, helper) {
        const paymentOptions = component.get("v.paymentOptions");
        const isExist = !!paymentOptions.find((p)=>p.accountId == 'ORPHANED');
        if(!isExist){
            paymentOptions.push({
                accountId: "ORPHANED",
                iconType: "ORPHANED",
                title: "Unassociated\n Payments",
                hideAction: true,
                type: "ORPHANED"
            });
            component.set("v.paymentOptions", paymentOptions);
        }        
    },
    keepCopy : function(component, event, helper) {
        if($A.util.isEmpty(component.get("v.invoicesRaw_Copy"))){
            component.set("v.invoicesRaw_Copy", component.get("v.invoicesRaw"));    
        }
        if($A.util.isEmpty(component.get("v.totalInvoiceCount_Copy"))){
            component.set("v.totalInvoiceCount_Copy", component.get("v.totalInvoiceCount"));    
        }        
    },
    toggleMoreVisibility : function(component, event, helper) {
        component.set("v.showAll", !component.get("v.showAll"));
    },
    handleDeletePaymentAccountEvent : function(component, event, helper) {
        const account = event.getParam("account");
        // remove deleted account from UI
        if(account) {
            const items = component.get("v.paymentOptions"),
                index = items.findIndex((item)=>item.accountId == account.accountId);
            items.splice(index, 1);
            component.set("v.paymentOptions", items);
        }
    },
    handleActionMenuSelect: function (component, event, helper) {
        switch(event.getParam("value")) {
            case 'view' :
                helper.setSelectedPaymentOption(component, event);
                component.set("v.viewPaymentOptions", true);
                break;
            case 'edit' :
                helper.setSelectedPaymentOption(component, event);
                component.set("v.editPaymentOptions", true);
                break;
            case 'delete' :
                helper.handleShowModal(component, event, event.getParam("value"));
                break;
        }
    },
    stopClickPropagation : function (component, event, helper) {
        event.stopPropagation(); event.preventDefault();
    },
    togglePaymentCardSelect : function (component, event, helper) {        
        const paymentOptions = component.get("v.paymentOptions"),
            index = event.currentTarget.dataset.index;
        
        const targetPaymentOption = paymentOptions[index];
        const selectedPaymentOption = component.get("v.selectedPaymentOption");     
        
        //component.set("v.invoicePageNumber", 1);
        
        if(selectedPaymentOption && selectedPaymentOption.accountId == targetPaymentOption.accountId) {
            component.set("v.selectedPaymentOption", {});
        }else {
            component.set("v.selectedPaymentOption", targetPaymentOption);
        }
    },
    onSelectedPaymentOptionChange : function (component, event, helper) {
        const selectedPaymentOption = component.get("v.selectedPaymentOption");
        
        if($A.util.isEmpty(selectedPaymentOption)){
            component.set("v.invoicesRaw", component.get("v.invoicesRaw_Copy"));
            component.set("v.totalInvoiceCount", component.get("v.totalInvoiceCount_Copy"));
            component.set("v.invoiceSource", null);
            //component.getEvent("filterOrphanInvoices").setParams({value: false}).fire();
        }else if(selectedPaymentOption.accountId == "ORPHANED"){            
            // No code
        }else {            
            helper.fetchInvoicesByPayment(component);
        }        
    },
    onChangeInvoicePageNumber : function(component, event, helper) {
        if(component.get("v.invoiceSource") == "payment-option" && component.get("v.invoicePageNumber") > 1){
            helper.fetchInvoices(component);
        }        
    },
    openSearchPaymentOptionModal : function(component, event, helper){
        component.set("v.showPaymentSearchModal", true);
    },
    onChangeInvoiceType : function(component, event, helper) {
        if(component.get("v.invoiceSource") == "payment-option"){
            component.set("v.invoicePageNumber", 1);
            helper.fetchInvoicesByPayment(component);  
        }        
    },
    handlePaymentUpdate : function(component, event) { 
        var updatepayment = event.getParam("updatePaymentAccount");
        console.log('@@@@ updatepayment'+updatepayment);
        var items = component.get("v.paymentOptions");
        var index =component.get("v.updateIndex");
        items[index] = JSON.parse(updatepayment);
        component.set("v.paymentOptions", items);
    }
})