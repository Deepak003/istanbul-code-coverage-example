({
    setPurchaseType : function(component, event, helper) {
        const purchaseTypes = [{
            label: "All Purchase Types",
            value: ""
        },{
            label: "Regular Purchases",
            value: "REGULAR"
        },{
            label: "Gift Purchases",
            value: "GIFT"
        },{
            label: "Pre-Orders",
            value: "PREORDER"
        }];
        component.set("v.invoiceTypes", purchaseTypes);
		component.set('v.externalData', {
            caseId : component.get('v.caseId'),
            isIssueRefund : component.get('v.accountMaskingList').BillingIssueRefunds,
            accountId : component.get('v.accountId')
        });
    },
    //TSM-3993 - Function added to handle chage modal and repopulate the external data
    onChangeAccountMaskingList: function(component, event, helper) {
        component.set('v.externalData', {
            caseId : component.get('v.caseId'),
            isIssueRefund : component.get('v.accountMaskingList').BillingIssueRefunds,
            accountId : component.get('v.accountId')            
        }); 
    },
    onChangePurchaseType : function(component, event, helper) {
        component.set("v.selectedInvoiceType", event.getParam("value"));
    },
    onChangeSelectedPurchaseType : function(component, event, helper) {
        if(!component.get("v.isLoading")){
            //alert("Selected: "+ event.getParam("value"));
            component.getEvent("setInvoiceType").setParams({value: event.getParam("value")}).fire();
        }           
    }
})