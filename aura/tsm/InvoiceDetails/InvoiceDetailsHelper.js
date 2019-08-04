({
	refreshInvoice: function(component, event){        
        const oldInvoice = component.get('v.data');
        const newInvoiceId = event.getParam("invoiceId");
        
        component.set('v.isLoading', true);
        Promise.all([
        	this.getInvoiceDetailsById(component, oldInvoice.invoiceId),
            this.getInvoiceDetailsById(component, newInvoiceId)
        ]).then($A.getCallback(function([newInvoice, child]){
            component.set('v.isLoading', false);
            //console.log(parent, child);
                        
            //setting changed properties
            Object.assign(oldInvoice, {
                status: newInvoice.status,
                statusReason: newInvoice.statusReason
            });
            
            // pushing new refund invoice
            oldInvoice.refunds = [].concat(oldInvoice.refunds, child).filter(Boolean);
            
            component.set('v.data', oldInvoice);
        })).catch($A.getCallback(function(){
            component.set('v.isLoading', false);
        }))
    },
    getInvoiceDetailsById : function(component, invoiceId){
        //const component = this;
        return new Promise(function(resolve, reject){
            const action = component.get("c.getInvoiceDetailsById");
            action.setParams({
                strInvoiceId : invoiceId
            });
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    resolve(response.getReturnValue()[0]);
                }else{
                    reject(response);
                }
            });
            $A.enqueueAction(action);
        })        
    }
})