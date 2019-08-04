({
    doInit : function(component, event, helper) {
        helper.fetchBillingDetails(component);
    },
    formatPaymentOptions : function(component, event, helepr) {
        const sortingOrder = ["ACTIVE", "DISABLED", "EXPIRED"];
        let list = component.get("v.paymentOptionsRaw");
        
        list = list.map(function(po) {            
            const formatObj = {
                title : po.billingAccountType.toUpperCase()
            };
            if(po.billingAccountType == 'creditCard') {              
                if(po.cardType == "VISA") {
                    formatObj.title = "Visa";
                    formatObj.iconType = 'VISA-LIGHT';
                }else if(po.cardType == "MASTERCARD") {
                    formatObj.title = "Mastercard";                    
                    formatObj.iconType = 'MASTERCARD';
                }else if(po.cardType == "AMERICAN_EXPRESS") {
                    formatObj.title = "American Express";
                    formatObj.iconType = 'AMERICAN_Express-LIGHT';
                }else {
                    formatObj.title = po.cardType;
                }
                formatObj.titleFormatted = `${formatObj.title}(${po.cardNumber.slice(-4)})`;
            } else {
                formatObj.email = po.email;
                if(po.billingAccountType == 'paypal') {
                    formatObj.title = "PayPal";
                    formatObj.iconType = 'PAYPAL';
                }else if (po.billingAccountType == 'VirtualCurrencyWallet') {
                    formatObj.title = 'Virtual Currency Wallet';
                    formatObj.titleFormatted = `${formatObj.title}(${po.currencyDisplayName})`;
                }
            }
            return Object.assign(po,formatObj);
        }).sort(function(a, b){
            return sortingOrder.indexOf(a.status) - sortingOrder.indexOf(b.status);
        });
        
        component.set("v.paymentOptions", list);
    },
    formatInvoices : function(component, event, helepr) {
        let list = component.get("v.invoicesRaw");
        
        list.forEach(function(l){
            // Adding billing info + status
            const billingAccount = component.get("v.paymentOptions").find((po)=>po.accountId == l.billingAccountId);
            l.statusInfo = l.status + "," + (billingAccount ? billingAccount.title : '');
            
            if(!l.userId){
                console.log('invoice without userId ', l);
            }
            
            // Cheking current invoice owner
            const userId = l.userId || (billingAccount ? billingAccount.userId : '' );
            if(userId && userId !== component.get("v.nucleusId")){
                l.otherAccountId = userId; 
            }        

			l.currencySymbol = l.currencySymbol + ' '; 
                
            //Adding currency symbol to amount
            l.amount = l.currencySymbol + l.total;
            
            // repair invalid date if any
            let tempDate = new Date(l.invoiceDate);            
            if(isNaN(tempDate)) {
                tempDate = Util.repairDate(l.invoiceDate);    
            }            
            l.invoiceDate = tempDate;
        })
        
        component.set("v.invoices", list);
    },
    onChangeInvoicePageNumber : function(component, event, helper) {
        if(!component.get("v.invoiceSource") && component.get("v.invoicePageNumber") > 1)
            helper.fetchInvoices(component).then($A.getCallback(function(data){
                component.set("v.isLoading", false);
                component.set("v.invoicesRaw", data);
            })).catch($A.getCallback(function(response){
                component.set("v.isLoading", false);
            }));
    },
    onChangeInvoiceSource : function(component, event, helper) {
        component.set("v.invoicePageNumber", 1);
    },
    expandInvoice : function(component, event, helper){
        const invoiceSource = component.get("v.invoiceSource");
        const newInvoices = event.getParam("value");
        if(invoiceSource == 'search' && newInvoices.length == 1) {
            $A.get("e.c:Expand")
                .setParams({
                    "isExpanded" : false, 
                    "targetComponent" : 'cPaymentHistoryTableExpand',
                    "id" : newInvoices.shift().invoiceId
                })
                .fire();
        }
    },    
    handleUpdateInvoiceRow : function(component, event, helper) {
        helper.refreshInvoices(component);
    },
    onChangeLoading : function(component, event, helper) {
        if(!component.get('v.isLoadedFirstTime')) {
            component.set('v.isLoadedFirstTime', true);
        }
    },
    onChangeInvoiceType : function(component, event, helper) {
        if(!component.get("v.invoiceSource")){
        	component.set("v.invoicePageNumber", 1);
        	helper.refreshInvoices(component);  
        }        
    },
    onSelectedPaymentOptionChange : function(component, event, helper) {
        const isOrfanSearch = (component.get("v.selectedPaymentOption") || {}).accountId == "ORPHANED"
        if(isOrfanSearch) {
            component.set("v.isOrfanSearch", true);
            component.set("v.invoicePageNumber", 1);  
            component.set("v.invoiceSource", "");
            helper.refreshInvoices(component);
        }else{
            component.set("v.isOrfanSearch", false);
        }
    },
    searchByDate : function(component, event, helper) {
        component.set("v.selectedPaymentOption", {});
        component.set("v.invoiceSource", "");
        component.set("v.invoiceType", "");
        
        const startDate = event.getParam("value").startDate;
        const endDate = event.getParam("value").endDate;
        component.set("v.startDate", startDate + "T00:00Z");
        component.set("v.endDate", endDate + "T23:59Z");
        
        helper.refreshInvoices(component);
    },
    setInvoiceType: function(component, event, helper) {
        component.set("v.invoiceType", event.getParam("value"));
    }
})