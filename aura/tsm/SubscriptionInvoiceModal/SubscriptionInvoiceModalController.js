({
    doInit: function(component, event, helper) {
        const subscription = component.get('v.subscription') || {};
        const invoices = subscription.invoices || [];
                
        const duplicates = [];
        const data = invoices.map(function(_invoice) {
            const paymentTransaction = _invoice.webPaymentTransaction || _invoice.creditCardTransaction || {};            
            return Object.assign({}, _invoice, {
                provider: paymentTransaction.provider,
                providerReference: paymentTransaction.providerReference,
                productName: subscription.productName
            })
        }).map(function(_invoice, _index, _invoices) {
            if(Array.isArray(_invoice.refunds)) {
                _invoice.refunds = _invoice.refunds.map(function(_refund) {
                    duplicates.push(_refund.refundId);
                    return Object.assign({}, _refund, _invoices.find((i)=> i.invoiceId==_refund.refundId));
                })
            }
            return _invoice;
        }).filter((_invoice)=> !duplicates.includes(_invoice.invoiceId));
        
        component.set('v.invoices', data);
    },
    handleCloseClick: function(component, event, helper) {
        component.set('v.isOpen', false);
    },
    onClickViewLog: function(component, event, helper) {
        component.set('v.isOpen', false);
        
        const transactionLogModal = component.get('v.transactionLogModal');
        transactionLogModal.data = event.getParam('value');
        transactionLogModal.isOpen = true;        
        component.set('v.transactionLogModal', transactionLogModal);
    },
    onClickResend: function(component, event, helper) {
        component.set('v.isOpen', false);
        
        const resendInvoiceModal = component.get('v.resendInvoiceModal');
        resendInvoiceModal.data = event.getParam('value');
        resendInvoiceModal.isOpen = true;        
        component.set('v.resendInvoiceModal', resendInvoiceModal);
    },
    handleRefund: function(component, event, helper) {
        //const index = event.getSource().get('v.value');
        //const target = component.get('v.invoices')[index];
        
        component.set('v.isOpen', false);
        const invoice = event.getParam('value');
        
        component.set('v.refundModal.isOpen', true);
        component.set('v.refundModal.invoice', invoice);
    }
})