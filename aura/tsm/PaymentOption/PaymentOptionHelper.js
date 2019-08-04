({
    fetchInvoicesByPayment : function(component) {
		const self = this;
        component.set("v.invoiceSource", 'payment-option');
        Promise.all([
            this.fetchInvoices(component), 
            this.fetchInvoicesCount(component)
        ])
        .then($A.getCallback(function(data){                    
            component.set("v.invoicesRaw", self.associateRefundInvoices(data.shift() || []));
            component.set("v.totalInvoiceCount", data.shift() || 0);
        }));        
    },
    fetchInvoices : function(component) {
        const action = component.get("c.getInvoicesByBillingId"),
            strAccountId = component.get("v.selectedPaymentOption").accountId,
            strPageNumber = component.get("v.invoicePageNumber").toString();
        
        action.setParams({ strAccountId , strPageNumber, strPageSize : "20", strPurchaseType : component.get("v.invoiceType") });
        
        component.set("v.isInvoiceLoading", true);
                
        //return this.serverAction(action, component);
        return this.serverAction(action, component)
            .then($A.getCallback(function(data){
                component.set("v.isInvoiceLoading", false);
                return data;
            })).catch($A.getCallback(function(err){
                component.set("v.isInvoiceLoading", false);
                throw err;
            }));
    },
    fetchInvoicesCount : function(component) {
        const action = component.get("c.getInvoicesCountByBillingId"),
            strAccountId = component.get("v.selectedPaymentOption").accountId;
        
        action.setParams({ strAccountId, strPurchaseType : component.get("v.invoiceType") });
        
        return this.serverAction(action, component);
    },
    serverAction : function(action, component) {
        const self = this;
        return new Promise(function(resolve, reject) {
            action.setCallback(self, function(response){
                const state = response.getState();                
                if(state == 'SUCCESS'){
                    return resolve.call(this, response.getReturnValue());
                }
                else{
                    Util.handleErrors(component, response);
                    return reject.call(this, response);
                }
            });            
            $A.enqueueAction(action);
        });
    },
    handleShowModal: function(component, event) {
        const items = component.get("v.paymentOptions"),
            index = event.getSource().get("v.value"),
            currentAccount = items[index];
        
        $A.createComponent("c:DeletePaymentAccount", {
            paymentAccount : currentAccount,
            caseId:component.get("v.caseId"),
            accountId:component.get("v.accountId"),
            nucleusId:component.get("v.nucleusId")
        },
           function(content, status) {
               if (status === "SUCCESS") {
                   component.find('overlayLib').showCustomModal({
                       header: "Delete Payment Account",
                       body: content, 
                       showCloseButton: true,
                       cssClass: "cDeletePaymentAccount",
                       closeCallback: function() {
                           console.log('You closed the alert!');
                           console.log( content.get('v.data') )
                       }
                   })
               }                               
           });
    },
    setSelectedPaymentOption : function(component, event){
        var items = component.get("v.paymentOptions"),
        index = event.getSource().get("v.value"),
        currentAccount = items[index];
        console.log('@@@ Index'+index);
        component.set("v.updateIndex", index);
        component.set("v.selectedPaymentAccount", currentAccount);
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
})