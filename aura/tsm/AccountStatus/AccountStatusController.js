({
    init: function(component, event, helper) {        
        // THOR-492
        // account_status_det_comp
        $A.util.addClass(component.find("account_status_list_comp"), "slds-hide");
        component.set("v.showSpinner", true);
        if (component.get('v.recordId'))
        	component.find("strikesRecord").reloadRecord(true);
        //helper.getProductsByAccount(component);
        
        //helper.getProductsByAccount(component);
        //var targAccountId = component.get('v.recordId');
        //component.set('v.Id',targAccountId);
    },
    
    OnStrikesUpdated: function(component,event,helper){
      	//component.set('v.Id', event.getParam("targetAccountForStrikes")); 
    	component.find("strikesRecord").reloadRecord(true); 
    },
    getSrikesAcc: function(component,event,helper){
      	//component.set('v.Id', event.getParam("targetAccountForStrikes")); 
      	//
        //if (event.getParam('arguments') && event.getParam('arguments')[0]) {
        //    component.set("v.recordId", event.getParam('arguments')[0]);
        //}
		var targetAccountID;
        targetAccountID = component.get("v.targetAccountSFId");
        component.set("v.recordId", targetAccountID);
    	component.find("strikesRecord").reloadRecord(true); 
        helper.getPetitionCountFortarget(component,event); 
    },
    handleChange: function (component, event, helper) {
        // This will contain the string of the "value" attribute of the selected option
        $A.util.addClass(component.find("account_status_list_comp"), "slds-hide");
        var selectedOptionValue = event.getParam("value");
        var productdata;
        var franchiseData;
		component.set('v.listForLookUp', '');
		component.find('prodAccStatus').set('v.SearchKeyWord','');
		$A.util.addClass(component.find("accountStatusTable"), "slds-hide");
		if(selectedOptionValue){
           /* if (window.productsToDisplay) {
                component.set('v.productsToDisplay', window.productsToDisplay);
                component.set('v.franchiseForProducts', window.franchiseForProducts);
            }*/
			var selectedType = selectedOptionValue.charAt(0).toUpperCase() + selectedOptionValue.slice(1);
			component.set('v.selectedType', selectedType);
			if(window.caseObj && window.caseObj.Petition_Details__r && window.caseObj.Petition_Details__r.Target_Account__r){
                var synergyID = window.caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c;
            }
			if(selectedOptionValue === "product" && !synergyID)  {
				component.set('v.listForLookUp', '');
				productdata = component.get('v.productsToDisplay');
				//alert('productdata '+productdata);
				component.set('v.listForLookUp', productdata);                
				component.set('v.selectedProduct', ' '); 
				component.find('prodAccStatus').set('v.listOfSearchRecordsLast', productdata);
			}
			else if(selectedOptionValue === "franchise"){	
				  component.set('v.listForLookUp', '');
				  franchiseData = component.get('v.franchiseForProducts');
				  component.set('v.listForLookUp', franchiseData);
				  component.set('v.objectApiName', 'getFranchises');    
				  component.set('v.selectedProduct', ' ');
				  component.find('prodAccStatus').set('v.listOfSearchRecordsLast', franchiseData);
			} 
            else {
				component.set('v.listForLookUp', '');
				component.find('prodAccStatus').set('v.listOfSearchRecordsLast', []);
            }
		}
        //Picking up the product and franchise values to render the same 
    },
    
	resetaccounStatus:function(component, event, helper) {
    
        component.set('v.listForLookUp', '');
        if (component.find('prodAccStatus')) {
        	component.find('prodAccStatus').set('v.SearchKeyWord','');
        }
        $A.util.addClass(component.find("account_status_list_comp"), "slds-hide");
		var optionsDropdown = component.find('sanctionStatus');
        if (optionsDropdown) {
            optionsDropdown.set('v.value', "Select");
            var options = [];
            optionsDropdown.set('v.options', options);
            options = [{'label': 'Select', 'value': 'select'},{'label': 'Franchise', 'value': 'franchise'},{'label': 'Product', 'value': 'product'}];
            optionsDropdown.set('v.options', options);
        }
        
        var PTabType = event.getParam("type");
        var objCase = event.getParam("objCase");    
        var workId = event.getParam("agentWorkId");
		if (objCase != undefined) {            
            if (objCase.Petition_Details__r) {
                //component.set('v.targetAccountID', objCase.Petition_Details__r.Target_Account__r.Nucleus_ID__c);
            	//helper.getProductsByAccount(component);
            }                           
        }
        
    },    													  
    getProductsforTargetAcc: function(component, event, helper) {
		component.set('v.listForLookUp', '');
        component.find('prodAccStatus').set('v.SearchKeyWord','');
        $A.util.addClass(component.find("account_status_list_comp"), "slds-hide");
		 var optionsDropdown = component.find('sanctionStatus');
        optionsDropdown.set('v.value', "Select");
        var options = [];
        optionsDropdown.set('v.options', options);
        options = [{'label': 'Select', 'value': 'select'},{'label': 'Franchise', 'value': 'franchise'},{'label': 'Product', 'value': 'product'}];
       optionsDropdown.set('v.options', options);
        var PTabType = event.getParam("type");
        var objCase = event.getParam("objCase");    
        var workId = event.getParam("agentWorkId");
		if (objCase != undefined) {            
            if (objCase.Petition_Details__r) {
                component.set('v.targetAccountID', objCase.Petition_Details__r.Target_Account__r.Nucleus_ID__c);
            	//helper.getProductsByAccount(component);
            }                           
        }
    },
    // Get prod by acc method
    getProductsByAccount: function(component, event, helper) {
        if (window.productsToDisplay) {
            component.set('v.productsToDisplay', window.productsToDisplay);
            component.set('v.franchiseForProducts', window.franchiseForProducts);
        }
        //helper.getProductsByAccount(component);
        //helper.getPetitionCountFortarget(component,event);
    },
    onFocus: function (cmp, event, helper){
        helper.toggleListbox(cmp);
    },
    onBlur: function (cmp, event, helper){
        helper.toggleListbox(cmp);
    },    
    showorHideAccountStatusTable: function (component, event, helper){   
        var evType = event.getParam('evType'); 
        if(evType=="product"){
            return;
        }
        if (evType == 'productAccStatus') 
        {
            var selectedStatus = component.find("sanctionStatus").get("v.value"),
                productdata = component.get('v.productsToDisplay'),
                selectedProduct = event.getParam("productObj");
            component.set('v.selectedProduct', selectedProduct);
            $A.util.removeClass(component.find("account_status_list_comp"), "slds-hide");
            if(selectedStatus=='product')
            {
                var spinner = component.find("spinner");                      
                $A.util.removeClass(component.find("mySpinner"), "slds-hide");
                $A.util.addClass(component.find("accountStatusTable"), "slds-hide");
                component.set("v.accountStatusList", null); 
                if(selectedStatus != null && selectedProduct != null )
                { 	
                    component.set('v.pageNumber','1');
                    $A.util.removeClass(component.find("accountStatusTable"), "slds-hide"); 
                    //api call to get entitlements
                    helper.getEntitlementsByProduct(component,event);
                    $A.util.addClass(spinner, "slds-hide");
                }
                component.find('prodAccStatus').set('v.listOfSearchRecordsLast', productdata);
            }
            else if(selectedStatus=='franchise')
            {
                //BRING FRANCHISE DETAILS
                helper.getFranchiseDetails(component,event);
            }
        }
    },
    
    getPetitionCount:function(component,event,helper){
        helper.getPetitionCountFortarget(component,event);
    },
    
    scrollBottom:function(component,event,helper){
        var pageCount;
        var div = component.find("account_status_list");
        if(!$A.util.isEmpty(div)){
            div = div.getElement();
            var v = div.scrollHeight - div.offsetHeight;
            if(((div.scrollHeight - div.offsetHeight)-div.scrollTop)<1) 
               { 
                	pageCount = component.get("v.pageNumber");
                	pageCount = parseInt(pageCount) + 1;
                	component.set('v.pageNumber',pageCount.toString());
                	//helper.getEntitlementsByProduct(component,event);
               }
        }
       
	},
    handleRecordUpdated: function(componenet, event, helper) {
        //TODO for the handler after updating/coomit a record in SF
        var eventParams = event.getParams();
        if(eventParams.changeType === "CHANGED") {
            // get the fields that changed for this record
            var changedFields = eventParams.changedFields;
            console.log('Fields that are changed: ' + JSON.stringify(changedFields));
            // record is changed, so refresh the component (or other component logic)
        } else if(eventParams.changeType === "LOADED") {
            console.log("Record loaded");
        } else if(eventParams.changeType === "REMOVED") {
            console.log("Record removed");
        } else if(eventParams.changeType === "ERROR") {
            console.log("Record has an error");
        }
    },

})