({
	setPaymentOptions : function(component,event) {
		let columns = [
            {label: 'Credit Card', value: 'CreditCard'},
            {label: 'Billing Account', value: 'BillingAccount'},
            {label: 'Retail Card', value: 'RetailCard'},
          ];

        component.set("v.paymentTypes",columns);			
	},
    setCreditCardTypes:function(component,event){
    	let creditCardTypes = [
            {label: 'Visa', value: 'VISA'},
            {label: 'Master Card', value: 'MASTERCARD'},
            {label: 'American Express', value: 'AMERICAN_EXPRESS'},
            {label: 'JCB', value: 'JCB'},
            {label: 'Discover', value: 'DISCOVER'},
          ];
        component.set("v.creditCardTypes",creditCardTypes);        
    },
    setPaymentAccount: function(component,event) {
		//TODO 		
	},
    validateSearchButtonEnable: function(component,event) {
        let paymentValue = component.find("paymentType").get("v.value");
        let enableSearchEvt = $A.get("e.c:EnableSearchButtonEvt");
        
        //Checking for type credit card
        if(paymentValue === 'CreditCard'){
            var lastName = component.find("lastName");
            var fourDigits = component.find("fourDigits");
            var cardType = component.find("cardType");
            var isValid = false;    
            //Getting validation parameter
            var lastNameValidation = /^([a-zA-Z\xC0-\xFF\u0152\u0153\u0160\u0161\u0178\u0600-\u06FF\u0192\uAA00-\uD7AF]*)$/.test(lastName.get("v.value"));
            var fourDigitsValidation = /^([0-9]{4,})$/.test(fourDigits.get("v.value"));
            
            //Setting validity
            if(lastNameValidation){
                lastName.setCustomValidity("");
            }else{
                lastName.setCustomValidity("*Invalid format");
            }
            lastName.reportValidity(); //Reporting validity
            
            if(fourDigitsValidation || fourDigits.get("v.value") == ""){
                fourDigits.setCustomValidity("");
            }else{
                fourDigits.setCustomValidity("*Invalid format");
            }
            fourDigits.reportValidity(); //Reporting validity
            
            //Checking for valid condition
            if(lastName.get("v.validity").valid && lastName.get("v.value") != ""
               && fourDigits.get("v.validity").valid && fourDigits.get("v.value") != ""
               && cardType.get("v.value") != undefined){
                isValid = true;
            }
        }
        
        //Calling the toggle function if the validity is true
        if(isValid){
            this.fireEnableSearchButton(component,event);
        }else{
            enableSearchEvt.setParams({"enableSearch" : false});
            enableSearchEvt.fire();
        }
    },
    fireEnableSearchButton:function(component,event) {
        let paymentValue = component.find("paymentType").get("v.value");
        let enableSearchEvt = $A.get("e.c:EnableSearchButtonEvt");
        
        if(paymentValue === 'CreditCard'){
            if(component.get("v.lastName") && component.get("v.fourDigits") && component.get("v.creditCardType")){
                enableSearchEvt.setParams({"enableSearch" : true,
                                           "paymentType":paymentValue,
                                           "lastName":component.get("v.lastName"),
                                          "fourDigits":component.get("v.fourDigits"),
                                          "cardType":component.get("v.creditCardType")});
                enableSearchEvt.fire();
            }else{
                enableSearchEvt.setParams({"enableSearch" : false});
                enableSearchEvt.fire();
            }	  
        }
        if(paymentValue === 'BillingAccount'){
            if(component.get("v.billingAcctEmail")){
                enableSearchEvt.setParams({"enableSearch" : true,
                                          "paymentType":paymentValue,
                                           "billingEmail":component.get("v.billingAcctEmail")});
                enableSearchEvt.fire();
            }else{
                enableSearchEvt.setParams({"enableSearch" : false});
                enableSearchEvt.fire();
            }	 
        }
        if(paymentValue === 'RetailCard'){
            if(component.get("v.retailCardNumber")){
                enableSearchEvt.setParams({
                    "enableSearch" : true,
                    "paymentType":paymentValue,
                    "retailNumber":component.get("v.retailCardNumber")
                });
                enableSearchEvt.fire();
            }else{
                enableSearchEvt.setParams({"enableSearch" : false});
                enableSearchEvt.fire();
            }	
        }
	},
    setPaymentAccounts:function(component, event){
    	let paymentOptionList = event.getParam("paymentOption");
        let transformedList = this.transformPaymentOptionList(component,paymentOptionList);
        component.set("v.paymentAccount",transformedList);
    },
    transformPaymentOptionList:function(component,paymentOptionList){
       let constructData = [];
       paymentOptionList.forEach((paymentOption)=>{
           let formattedIconType;
           let formattedExpirationYear;
           let formattedCardNumber;
           let formattedTitle;
           let isExpiredCC;
           let cardStatus;
           let amount;
           let currency;
           let similarAccount=false;
           let emailValue;
           if(component.get("v.nucleusId") == paymentOption.userId){
           		similarAccount= true;	     
           }
           if(paymentOption.billingAccountType && paymentOption.billingAccountType ==="creditCard"){
           		formattedIconType = this.formatIconType(paymentOption.cardType);	
           		formattedExpirationYear = this.formatExpirationYear(paymentOption.expirationYear);
           		formattedCardNumber = this.formatCardNumber(paymentOption.cardNumber);
           		formattedTitle = this.formatTitle(paymentOption.cardType);
           		isExpiredCC = this.checkExpiry(paymentOption.expirationMonth,paymentOption.expirationYear);
          		
           }else if(paymentOption.retailCardNumber){
           		formattedIconType = "CREDITCARD";
           		formattedTitle = "Retail Card";
           		formattedCardNumber = paymentOption.retailCardNumber;
           		cardStatus = paymentOption.status;
               	amount = paymentOption.amount;
              	currency = paymentOption.currency_x;
           }
           else{
           		formattedIconType = this.formatIconType(paymentOption.type_x);
        		formattedTitle = this.formatTitle(paymentOption.type_x);
           }
    	   
    	   
        
           let paymentObj = {
          	iconType: formattedIconType,
            title:formattedTitle,
            expirationMonth:paymentOption.expirationMonth,
            expirationYear:formattedExpirationYear,
            otherCardEmail:paymentOption.email,
            cardNumber:formattedCardNumber,
    		isSameAccount:similarAccount, 
    		nucleusId:paymentOption.userId,
 			accountId:paymentOption.accountId,
            isExpired:isExpiredCC,
            cardStatus:cardStatus,
            amount:amount,
            currency:currency,
            sfAccountId: paymentOption.sfAccountId
           }
		   constructData.push(Object.assign({},paymentObj));
       })
       return  constructData; 
    },
    formatIconType:function(cardType){
       if(cardType === "VISA"){
       	   return "VISA-LIGHT";    
       }else if(cardType === "MASTERCARD"){
           return "MASTERCARD";
       }else if(cardType === "AMERICAN_EXPRESS"){
           return "AMERICAN_Express-LIGHT";
       }else if(cardType === "DISCOVER"){
           return "DISCOVER-LIGHT";
       }else if(cardType === "PAYPAL"){
           return "PAYPAL";
       }else{
           return "CREDITCARD";
       }
    },
    formatExpirationYear:function(expYear){
        if(expYear){
            let last2Digits = expYear.slice(2,4);
            return  last2Digits;
        } 
       	return expYear;
    },
    formatCardNumber:function(cardNum){
        if(cardNum){
            let spacedNumberString = "XXXX XXXXX XXXX ";
            spacedNumberString += cardNum.slice(-4);
        	return spacedNumberString;   
        }  
       	return cardNum;
    },
    formatTitle:function(cardTitle){
        if(cardTitle){
            if(cardTitle.indexOf("_")>-1){
            	let newTitle = cardTitle.replace("_"," ");
                return newTitle;
            }else if(cardTitle === "PAYPAL"){
                return "PayPal";
            }else if(cardTitle === "VISA"){
                return "Visa";
            }else if(cardTitle === "MASTERCARD"){
                return "Mastercard";
            }  
        }
       	return cardTitle;
    },
    checkExpiry:function(expiryMonth,expiryYear){
    	let dt = new Date();
        let dtYear = dt.getFullYear();
        let dtMonth = dt.getMonth()+1;
        if(expiryYear>dtYear){
            return false;
        }else if(expiryYear == dtYear){
            if(expiryMonth >= dtMonth){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    },
    /*setPaymentOptions : function(component,event) {
    	var columns = [
            
        ];
        
        component.set("v.creditCardTypes",columns);			
    },*/
})