({
    //Added to format date as per TSM-2126
	doInit : function(component, event, helper) {
		var currentPaymentMethod = component.get("v.paymentAccount");
        var expYear = currentPaymentMethod.expirationYear;
        currentPaymentMethod.displayExpirationYear = (typeof expYear != 'undefined' && expYear) ? expYear.substr(2) : '';
        component.set("v.paymentAccount",currentPaymentMethod)
	},
})