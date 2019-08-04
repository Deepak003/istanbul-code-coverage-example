({
    searchDetails : function(component,event,secId) {
        var action = component.get("c.searchCaseDetailsByCaseId");  
        action.setParams({
            caseID : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();       
                component.set("v.caseObj",storeResponse); // TSM 1912
                component.set("v.accountId", storeResponse.AccountId);
                component.set("v.channel", storeResponse.Current_Channel__c);
                if(storeResponse.Account != undefined){
                    component.set("v.nucleusId", storeResponse.Account.Nucleus_ID__c);
                    component.set("v.emailId", storeResponse.Account.PersonEmail);
                    
                    // if no nucleus id (TSM-2093)
                    if(component.get("v.nucleusId")) {
                        //Calling the account summary component
                        this.fetchAccountSummary(component, event);
                        this.getAccountLoginHistoryData(component);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    //gets account data from apex controller 
    fetchAccountSummary: function (component, event) {
        var action = component.get("c.getAccountDetailsByNucleusId"); 
        var nucleusId = component.get("v.nucleusId");
        component.set("v.isAccountLoading", true);
        action.setParams({
            nucleusId : nucleusId
        });
        var self = this;
        action.setCallback(self, function (response) {
            //$A.util.toggleClass(spinner, "slds-hide");
            component.set("v.isAccountLoading", false);
            var state = response.getState();
            if (state === 'SUCCESS') {
                var accountSummary = response.getReturnValue();
                //Processing text
                if(accountSummary.deviceIpGeo !=null){
                    accountSummary.deviceIpGeo = accountSummary.deviceIpGeo.split("-")[0] + " " + accountSummary.deviceIpGeo.split("-")[1];
                }
                var accountBasicInfo = JSON.parse(accountSummary.accountBasicInfo).response[0];
                if(accountBasicInfo.flaggingTypes != null){
                    component.set("v.isShielded", true);
                }else{
                    component.set("v.isShielded", false);
                }
				//Check for callback number TSM-3997
				if (!accountBasicInfo.phone && !accountBasicInfo.mobileNumber && component.get('v.caseObj').callBackNumber__c) {
					accountBasicInfo.phone = component.get('v.caseObj').callBackNumber__c;
				}
				
                component.set("v.accountSummary", accountBasicInfo); 
                component.set("v.accountSnapDetails", accountSummary);
                
                //Function to load all product related information
                this.getProductInformation(component, event);
            }
        });
        $A.enqueueAction(action);
    },
    
    //Funciton initilized after the load of independent event
    getProductInformation : function(component, event) {
        this.getCustomerProducts(component, event); 
    },
    //Function used to get the customer owned products
    getCustomerProducts : function(component,event) {
        var action = component.get("c.getCustomerProducts"); 
        var getProductsMap = {};
        getProductsMap["action"] = 'getCustomerProducts';
        getProductsMap["customerId"] = component.get("v.nucleusId");
        getProductsMap["userId"] = component.get("v.nucleusId");
        getProductsMap["email"] = component.get("v.email");
        getProductsMap["sNoCache"] = 'false';
        action.setParams({
            reqParameters : getProductsMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();       
                component.set("v.customerProduct",storeResponse); 
                this.getAllProducts(component, event);
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to load all the products
    getAllProducts : function(component, event) {
        var action = component.get("c.getAllProducts");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();          
                component.set("v.allProducts", storeResponse);
                this.getFeaturedProducts(component, event);
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to load the featured product from SF box
    getFeaturedProducts : function(component, event) {
        var action = component.get("c.getFeaturedProducts");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();   
                component.set("v.featuredProduct", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },  
    getAccountLoginHistoryData:function(cmp){
        const action = cmp.get("c.getCustomerLoginHistory");
        const nucleusId = cmp.get("v.nucleusId");
        console.log('nucleusIdABC==>',nucleusId);
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 90);
        
        var toDate = new Date();
        var stringFromDate = this.formatDate(fromDate);
        var stringToDate = this.formatDate(toDate);
        
        action.setParams({ strUserId : nucleusId,
                          strFromDate:stringFromDate,
                          strToDate:stringToDate});
        
        action.setCallback(this,function(response){
            const state = response.getState(); 
            var accountSpinner = cmp.find("accountChangeSpinner");
            $A.util.toggleClass(accountSpinner, "slds-hide");
            if (state === "SUCCESS") {
                let loginHistoryData = response.getReturnValue();
                let failedloginHistoryData = [];
                for(var i=0; i < loginHistoryData.length; i++){
                    if(loginHistoryData[i].result == 'FAILED')
                        failedloginHistoryData.push(loginHistoryData[i]);
                }
                
                if(failedloginHistoryData.length > 0){
                    var counts = failedloginHistoryData.reduce(function(p, c)  {
                        var location = (c.ipGeolocation).split("-", 1);
                        if (!p.hasOwnProperty(location)) {p[location] = 0;}
                        p[location]++;
                        return p;
                    }, {});
                    var countsExtended = Object.keys(counts).map(function(k) {
                        return {name: k, count: counts[k]}; });
                    cmp.set("v.loginHistoryData",countsExtended)
                }
            }
            else {
                console.log("Failed with state in getAccountLoginHistoryData: " + state);
            }
        });
        
        $A.enqueueAction(action);    
    },
    
    formatDate:function(dt){
        
        var month = '' + (dt.getMonth() + 1),
            day = '' + dt.getDate(),
            year = dt.getFullYear(),
            hour = '' +dt.getHours(),
            minutes ='' +dt.getMinutes();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if(minutes.length<2) minutes ='0'+minutes;
        var strDateValue = [year, month, day].join('-');
        var strTimeValue=[hour,minutes].join(':')
        strTimeValue +='Z';
        var strDate = [strDateValue,strTimeValue].join('T'); 
        return strDate;
    },
})