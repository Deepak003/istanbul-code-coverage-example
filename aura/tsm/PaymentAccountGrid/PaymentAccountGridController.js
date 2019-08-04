({
    //Added to format date as per TSM-2126
	doInit : function(component, event, helper) {
		var currentPaymentMethod = component.get("v.paymentAccount");
        if (typeof currentPaymentMethod.expirationYear !== "undefined") {
            currentPaymentMethod.displayExpirationYear = currentPaymentMethod.expirationYear.substr(2);
        }
        component.set("v.paymentAccount",currentPaymentMethod)
	}
})