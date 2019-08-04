({
	setPicklistOptions : function() {
		var columns = [
            {label: 'Case Number', value: 'CaseNumber'},
            {label: 'Codes', value: 'Codes'},
            {label: 'Credit Card Number', value: 'CCNumber'},
            {label: 'Invoice Number', value: 'InvoiceNumber'},
            {label: 'Billing Account', value: 'BillingAccount'},
            {label: 'Retail Card Number', value: 'RetailCardNumber'},
          ];

        return columns;					
	},
    setBackupList : function(component,event) {
		component.set("v.paymentOptionsBkp",component.get("v.paymentOptions"));
        component.set("v.invoicesBkp",component.get("v.invoices"));
	},        
    setInvoicesData: function(component,queryTerm) {
        var invoiceSpinner = component.find("invoicesSpinner");
        $A.util.toggleClass(invoiceSpinner, "slds-hide");
        if(queryTerm && queryTerm===''){
            component.set("v.paymentOptions",component.get("v.paymentOptionsBkp"));
        	component.set("v.invoices",component.get("v.invoicesBkp"));
        }
		var invoicesAction = component.get("c.getInvoiceDetailsById");
        invoicesAction.setParams({ strInvoiceId  : queryTerm, requestType : 'SearchInvoice'});
        invoicesAction.setCallback(this, (response)=> {
            const state = response.getState(); 
            $A.util.toggleClass(invoiceSpinner, "slds-hide");
            if (state === "SUCCESS") {
                let invoiceList = this.associateRefundInvoices(response.getReturnValue()) || [];
            	component.set("v.paymentOptions",[]);
        		component.set("v.invoices",invoiceList);
        		component.set("v.totalInvoiceCount", invoiceList.length);
            }
            else {
            	Util.handleErrors(component, response);
                
            }
        });
        
 		$A.enqueueAction(invoicesAction);    
	},
    displayModal:function(component,event){
    	let modalHeader
        var modalBody;
        var modalFooter;
        
        let nucleusId = component.get("v.nucleusId");
        let uniqueId = component.get("v.billingCmpId");
        let accountData = component.get("v.accountData");
        let caseId = component.get("v.caseId")

        $A.createComponents([
            ["c:paymentFilterModalContent",{"nucleusId" : nucleusId,"uniqueId":uniqueId}],
            ["c:paymentFilterModalFooter",{"nucleusId" : nucleusId, accountData: accountData}],
            ["c:ModalHeader",{"headerText":"Search Payment Option"}]
        ],
        function(components, status){
            if (status === "SUCCESS") {
                modalBody = components[0];
                modalFooter = components[1];
                modalHeader = components[2];
                component.find('overlayModal').showCustomModal({
                   header: modalHeader,
                   body: modalBody, 
                   footer: modalFooter,
                   showCloseButton: true,
                   cssClass: caseId ? 'caseModal' : 'accountModal',
                   closeCallback: function(){
                   	component.set("v.showModal",false);
                   }
                })
            }
        }
       );        
    },
	associateRefundInvoices: function(invoices){
        var duplicates = [];
        var data = invoices.map(function(_invoice, _index, _invoices) {
            if(Array.isArray(_invoice.refunds)) {
                _invoice.refunds = _invoice.refunds.map(function(_refund) {
                    duplicates.push(_refund.refundId);
                    return Object.assign({}, _refund, _invoices.find((i)=> i.invoiceId==_refund.refundId));
                })
            }
            return _invoice;
        }).filter((_invoice)=> !duplicates.includes(_invoice.invoiceId));
        return data;
    },
    /*openDifferentAccountTab:function(component,event){
        let uniqueId = event.getParam("uniqueId");
        
        let billingCmpId = component.get("v.billingCmpId");
        if(uniqueId == billingCmpId){
        	let nucleusId = event.getParam("nucleusId");
            let paymentId = event.getParam("paymentId");
            let emailAddress = event.getParam("emailAddress");
            const accountAction = component.get("c.accountIdSearch");
            accountAction.setParams({strCustomerId:nucleusId});
            accountAction.setCallback(this,function(response){
                const state = response.getState();
                if (state === "SUCCESS") {
                    let object = response.getReturnValue();
                    
                    let accountId = (object && object.accountId) ? object.accountId : '';
                    emailAddress = (object && object.email) ? object.email : emailAddress;
                    
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        workspaceAPI.openSubtab({
                            parentTabId: response.tabId,
                            //url: '/lightning/r/Account/'+ accountId +'/view',
                            focus: true,
                            pageReference: {
                                    /*"type": "standard__component",
                                    "attributes": {
                                        "componentName": "c__TSMAccountWrapper"
                                    },*/
                                    /*"type": "standard__component",
                                    "attributes": {
                                        "componentName":"c__TSMAccountWrapper"
                                    },
                                    tabLabel: "email value",
                                    "state": {
                                        "uid": "1",
                                        "openFrom": "BillingTab",
                                        "sfAccountId":accountId,
                                        "paymentId":paymentId,
                                        "emailAddress":emailAddress,
                                    }
                                }
                        });
                        
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }
                else {
                    Util.handleErrors(component, response);
                }    
            });
            event.stopPropagation();
            $A.enqueueAction(accountAction);    
        }
    	  
    }*/
})