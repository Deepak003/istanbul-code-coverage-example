({
    init : function(component, event, helper) {
        component.set("v.counter", 0);
        component.set("v.status", '');
        component.set("v.statusDescription", '');  
        component.set("v.selEntitlement", []);
        component.set("v.searchString" , "");
        var product = '';
        if(component.get("v.selectedProduct") != null)
            product = component.get("v.selectedProduct").Url_Name__c; 
        if(component.get("v.from") != 'Account'){
            helper.disableAddNewButton(component, event, helper);
        }else{
            //Adding masking for add entitlement
            if(component.get("v.accountMaskingList").AccountAddNewEntitlement){
                component.set("v.canGrant",true);   
            }
        }     
        this.getPlatformList(component, event, helper); //TSM-3324 - Added code to get the total platform list
        this.getEntitlementsByPage(component, event, helper);            
    },
    
    //TSM-3324 - Getting the list of platforms
    getPlatformList : function(component,event, helper){
        var action = component.get("c.getPlatformList"); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                var reformattedStoreResponse = storeResponse.map(object =>{ 
                    var retrunObject = {};
                    retrunObject["Name"] = object.Name; 
                    retrunObject["Id"] = object.Name;
                    return retrunObject;
                });
                //Addding all
                var defaultList= [{'Name': 'All', 'Id': 'All'}];
                reformattedStoreResponse = defaultList.concat(reformattedStoreResponse);
                component.set("v.types",reformattedStoreResponse); 
            }
        });
        $A.enqueueAction(action);        
    },
    
    getAllEntitlements : function(component,event, helper){
        var totalSize = component.get("v.totalSize");
        if(totalSize > 500){
            var totalCalls = totalSize/500;
            totalCalls = totalCalls - component.get("v.counter");
            component.set("v.totalCalls", totalCalls);
            if(totalCalls > 0){
                this.getEntitlementsByPage(component, helper);                    
            }
            else{
                component.set("v.searchedcount",component.get("v.entitlementData"));
                //this.sortTableData(component, event, helper,'date' ,'desc'); 
                this.updatePaginationData(component, event, helper,component.get("v.entitlementData"));
            }
        }else{
            component.set("v.searchedcount",component.get("v.entitlementData"));
            //this.sortTableData(component, event, helper,'date' ,'desc'); 
            this.updatePaginationData(component, event, helper,component.get("v.entitlementData"));
        }
        component.set("v.isSpinner", false);
    },

    // Function used to show Entitlement Level Ban TSM-3024 
   getCustomerProducts : function(component,event,helper) {
        var action = component.get("c.getCustomerProducts"); 
        var product = component.get("v.selectedProduct").Url_Name__c;
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
                var storeResponse =JSON.parse(response.getReturnValue()).response; 
                for(var i=0; i< storeResponse.length; i++){
                    if(storeResponse[i].name == product){
                        if(storeResponse[i].status == 'BANNED' || storeResponse[i].status == 'PARTIALLY_BANNED' ||
                           storeResponse[i].status == 'PARTIALLY_INACTIVE' || storeResponse[i].status == 'INACTIVE'){
                            component.set("v.status", storeResponse[i].status);
                            component.set("v.statusDescription", storeResponse[i].statusDescription);
                        }
                    }
                }
                component.set("v.customerProduct",storeResponse); 
                //component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    }, 
    disableAddNewButton : function(component, event, helper) {
        var product = component.get("v.selectedProduct").Url_Name__c;
        var disableAction = component.get("c.canGrantInGameEntitlement");  
        disableAction.setParams({
            "strCrmProductName": product,
            "strCategory": 'INGAMECONTENT'
        });
        disableAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var canGrant = JSON.parse(response.getReturnValue());
                //Masking for add entitlement
                if(canGrant){
                    if(!component.get("v.accountMaskingList").ProductAddNewEntitlement){
                        canGrant = false;
                    }
                } 
                component.set("v.canGrant",canGrant);
            }               
        });        
        $A.enqueueAction(disableAction);
    },
    updatePaginationData: function(component, event, helper, data) {
        component.set('v.pageNumber', 1);
        const perPage = component.get('v.perPage');
        const rows = data;
        if(rows!=null && rows!='undefined'){
            for(var i=0; i< rows.length; i++){
                rows[i].expanded = false;
                if(rows[i].grantDate != undefined){
                    rows[i].grantDate = rows[i].grantDate.split("T")[0]; //TSM-4185
                    let utcDate = new Date( new Date(rows[i].grantDate).getTime() + Math.abs(new Date(rows[i].grantDate).getTimezoneOffset()*60000) );
                    rows[i].grantDate = Util.getFormattedDateTime(utcDate, 'only-date');
                }
            }
        }
        component.set('v.paginatedData', null);
        if(rows && Array.isArray(rows)) {
            component.set('v.paginatedData', rows.slice(0, perPage));
        }
        component.set("v.isLoading", false);
    },
    toggleRow: function(component, index) {
        const items = component.get("v.paginatedData");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;          
            component.set("v.paginatedData", items);           
        }      
    },
    toggleExpand : function(component, event, helper) {
        if(event.target.id != 'chkBoxDiv'){
            if(event.currentTarget.dataset != undefined){
                var index = event.currentTarget.dataset.index;
                const items = component.get("v.paginatedData");
                let terminationDate = new Date(items[index].terminationDate) ;
                if(items[index].terminationDate != ""){
                    if(items[index].terminationDate.split("T")[1].split(":")[0].length == 1 || 
                       items[index].terminationDate.split("T")[1].split(":")[1].split("Z")[0].length ==1 ){
                        terminationDate = items[index].terminationDate;
                        var date = terminationDate.split("T")[0],
                            hours = items[index].terminationDate.split("T")[1].split(":")[0],
                            seconds = items[index].terminationDate.split("T")[1].split(":")[1];
                        if(hours.length == 1){
                            hours = hours.padStart(3, 'T0');
                        }else{
                            hours = hours.padStart(3, 'T');
                        }
                        if(seconds.length == 2){
                            seconds = seconds.padStart(3, '0'); 
                        }           
                        terminationDate = new Date(date + hours + ":"+ seconds);
                    }    
                }                
                let currentDate = new Date();
                let diff = terminationDate - currentDate;  
                if(Array.isArray(items) && items[index]){
                    if((items[index].gameDistributionSubType == 'Limited Trial' && diff < 0) && items[index].entitlementTag == 'TRIAL_ONLINE_ACCESS' &&
                       items[index].status == 'ACTIVE'){
                        items[index].displayResetTrial = true;
                    }else{
                        items[index].displayResetTrial = false;
                    }
                    //component.set("v.paginatedData", items);
                }               
            }                
            else{
               index = event.currentTarget.value; 
            }
            helper.toggleRow(component, index);
        }
    },
    handlePageChange : function(component, event, helper) {
        const perPage = component.get('v.perPage');
        const data = component.get("v.entitlementData");
        const pageNumber = component.get('v.pageNumber');
        const start = (pageNumber-1)*perPage;
        //const rows = component.get('v.items');
        component.set('v.paginatedData', null);
        if(data && Array.isArray(data)) {    
            component.set('v.paginatedData', data.slice(start, start+perPage));
        }else {
            component.set('v.paginatedData', []);
        }
		component.set("v.pcCount", data.length); 
        this.onChangeAll(component, event);
    },
    getSearchResult : function(component, event, helper) {
        let data = component.get("v.entitlementData");
        var searchString = component.get("v.searchString");
        var searchRecords=[];
        if(searchString !== ''){
            const items = data;
            for(var eachItem in items){
                //loading the search based on entered value  for all products
                try{
                    if (items[eachItem].name.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                        searchRecords.push(items[eachItem]);
                    }else if(items[eachItem].name != null){
                        if(items[eachItem].name.toLowerCase().search(searchString.toLowerCase()) >= 0){
                            searchRecords.push(items[eachItem]);
                        }
                    }
                }
                catch(err){
                }
            }
            helper.updatePaginationData(component, event, helper, searchRecords);
            component.set("v.searchedcount", searchRecords);
        }
        else{
            helper.updatePaginationData(component, event, helper, data);
            component.set("v.searchedcount", data); //TSM-3632
            component.set("v.pcCount", data.length); //TSM-3632
        }
    },
    
    getSearchPlatform : function(component, event, helper, searchTypes) {
        component.set("v.searchString", ""); //Removing the existing search text
        if(component.get("v.updateValue")){
            component.set("v.entitlementOriginalData",component.get("v.entitlementData"));
            component.set("v.updateValue",false);
        }
        //var getTypes = component.find("types");
        //var searchTypes = getTypes.get("v.value");
        var searchRecords=[];
        if(searchTypes !== 'All'){
            const items = component.get("v.entitlementOriginalData");
            for(var eachItem in items){
                //loading the search based on entered value  for all products
                try{
                    if (items[eachItem].crmProductPlatform.toLowerCase() === searchTypes.toLowerCase()) {
                        searchRecords.push(items[eachItem]);
                    }
                }
                catch(err){
                    console.log('No results');
                }
            }
            component.set("v.entitlementData",searchRecords);
            helper.updatePaginationData(component, event, helper, searchRecords);
            component.set("v.searchedcount", searchRecords);
            component.set("v.pcCount", items.length);
        }
        else{
            component.set("v.entitlementData",component.get("v.entitlementOriginalData"));
            helper.updatePaginationData(component, event, helper, component.get("v.entitlementOriginalData"));
            component.set("v.searchedcount", component.get("v.entitlementOriginalData"));
            component.set("v.pcCount", (component.get("v.entitlementOriginalData")).length);
        }
    },
    
    sortTableData : function(component, event, helper, col, dir) {
        component.set("v.isSpinner", true);
        var switching, i, x, y, shouldSwitch, switchcount = 0;
        switching = true;
        var data = component.get("v.entitlementData");
        //Checking for ascending data
        data.sort(function(dataOne, dataTwo) {
            if(col == 'name'){
                dataOne = dataOne.name;
                dataTwo = dataTwo.name;
            }else{
                dataOne = new Date(dataOne.grantDate);
                dataTwo = new Date(dataTwo.grantDate);                   
            }
            if (dir == "desc") {
                return dataOne>dataTwo ? -1 : dataOne<dataTwo ? 1 : 0;
            }else{
                return dataOne<dataTwo ? -1 : dataOne>dataTwo ? 1 : 0;    
            }
        });
        component.set("v.entitlementData" , data);
        helper.updatePaginationData(component, event, helper, data);
        component.set("v.isSpinner", false);

    },

    getEntitlementsByPage : function(component, event, helper) {
        var entitlements = [];
        var counter = component.get("v.counter");
        var entitlementData = component.get("v.entitlementData");
        if(counter != 0){
            entitlements = entitlementData.slice(0);
        }      
        var product = '';
        if(component.get("v.selectedProduct") != null)
            product = component.get("v.selectedProduct").Url_Name__c;   
        counter = counter + 1;
        component.set("v.counter", counter);
        console.log(counter);
        var params = {
            "strNucleusId": component.get("v.nucleusId"),//'1000086980867',
            "noCache": false,
            "strCrmProductName": product,//'fifa-18',
            "strPageSize": "500",
            "strPageNumber": counter,
        };
        console.log(JSON.stringify(params));
        var action = component.get("c.getEntitlements");  
        action.setParams({
            "strEntitlementRequest": JSON.stringify(params),
            "strIncludeDeleted": 'false'
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            console.log(state);
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue());
                console.log('storeResponse==>',storeResponse);
              if(storeResponse != null && storeResponse.response.entitlements != null){
                    component.set("v.entitlementData", storeResponse.response.entitlements);
                    var entitlementresponse = component.get("v.entitlementData");
                    let newArray;
                    if(counter == 1){
                        newArray = entitlementresponse.slice(0);
                    }
                    else{
                        newArray = entitlements.concat(entitlementresponse);
                    }               
                    component.set("v.searchedcount",newArray);
                    component.set("v.entitlementData" , newArray);
                    component.set("v.totalSize", storeResponse.response.totalSize);
                    this.getAllEntitlements(component, event, helper);
                }
                else{
                     component.set("v.isSpinner", false);
                }
                
               // helper.updatePaginationData(component, event, helper, storeResponse.response.entitlements);
            }               
        });        
        $A.enqueueAction(action);
    },
    
    transferEntitlement : function(component, event, helper) {
        var selectedEntitlements = component.get("v.selectedEntitlements");
        var deleteAccount = component.get("v.deleteAccount");
        var action = component.get("c.transferEntitlementsForCustomer");  
        var dataObject = {};
        var requestObject = {};
        var listDataObject = [];
        dataObject.entitlements = selectedEntitlements;
        listDataObject.push(dataObject);
        requestObject.data = JSON.stringify(listDataObject);
        requestObject.accountId = component.get("v.accountId");
        requestObject.caseId = component.get("v.caseId");
        requestObject.customerId = component.get("v.nucleusId");
        requestObject.sourceUserId = component.get("v.nucleusId");
        requestObject.targetUserId = component.get("v.targetUserId");
        console.log("requestObject--==>",requestObject);
        component.set('v.isTransfer', false);
        
        var toastEvent = $A.get("e.force:showToast");
        
        action.setParams({
            reqParameters : requestObject
        });

        component.set("v.isLoading", true);         
        action.setCallback(this, function(response) {
            debugger;
            var state = response.getState();
                
            if (state === "SUCCESS") {  debugger;
                var result = response.getReturnValue();
                if(deleteAccount)
                    helper.dltAccount(component, event, helper);
                toastEvent.setParams({
                        "message": "The selected PC entitlements are transferred successfully!",
                         "type" : "success"
                    });

                component.set("v.loaded" , false);
                component.set('v.paginatedData', []);
                component.set("v.isSpinner" , true);
                component.set("v.isDisabled", true)                
                helper.init(component, event, helper);
            }
            else{
                var errors = response.getError();
                if (errors[0] && errors[0].message) {
                    toastEvent.setParams({
                        "message": errors[0].message,
                         "type" : "error"
                    });
                } else {
                    toastEvent.setParams({
                        "message": "Transfer failed due to errors.",
                         "type" : "error"
                    });
                }
            }
            component.set("v.isLoading", false);  
            toastEvent.fire();
        });
        $A.enqueueAction(action);
        
    },
    
    dltAccount : function(component, event, helper) {
        var action = component.get("c.deleteAccount");  
        
        var requestObject = {};
        
        requestObject.email = (component.get("v.accountSummary")).email;
        requestObject.accountId = component.get("v.accountId");
        requestObject.caseId = component.get("v.caseId");
        requestObject.customerId = component.get("v.nucleusId");
        requestObject.status = 'DELETED';
        requestObject.oldStatus  = (component.get("v.accountSummary")).status;
        console.log("requestObject--==>",requestObject);
        
        var toastEvent = $A.get("e.force:showToast");
        
        action.setParams({
            reqParameters : requestObject
        });

        //component.set("v.isLoading", true);         
        action.setCallback(this, function(response) {
            debugger;
            var state = response.getState();
                
            if (state === "SUCCESS") {  debugger;
                var result = response.getReturnValue();
                toastEvent.setParams({
                        "message": "Delete success.",
                         "type" : "success"
                    });
            }
            else{
                var errors = response.getError();
                if (errors[0] && errors[0].message) {
                    toastEvent.setParams({
                        "message": errors[0].message,
                         "type" : "error"
                    });
                } else {
                    toastEvent.setParams({
                        "message": "The current account can't be deleted due to errors. ",
                         "type" : "error"
                    });
                }
            }
            toastEvent.fire();
        });
        $A.enqueueAction(action);
        
    },
    onChangeAll: function(component, event) {
        const isSelectedAll = component.get("v.isSelectedAll");
        const childCheckboxs = [].concat(component.find("checkbox")).filter(Boolean);
        
        // setting value to checkboxes
        /*
        for(let i = 0; i < childCheckboxs.length; i++){
            const ckbx= component.find("checkbox")[i];
            ckbx.set("v.value", isSelectedAll);
        }*/
        
        childCheckboxs.forEach(function(ckbx){
            ckbx.set("v.value", isSelectedAll);
        })
        
        // perform check on all entitlement
        const entitlementData = component.get("v.entitlementData") || [];        
        entitlementData.forEach(function(entitlement){
            this.onCheck(component, isSelectedAll, entitlement);
        },this)
    },
    onCheck: function(component, value, name) {
        var selEntitlement = component.get("v.selEntitlement");
        var selectedEntitlements = component.get("v.selectedEntitlements");
        var pcCount = component.get("v.pcCount");        
        
        var selectedRows = [];
        var checkvalue = component.find("checkbox");
        
        if(value){
            selEntitlement.push(name);            
        }
        else{
            selEntitlement.pop(name);            
        }
        component.set("v.selEntitlement", selEntitlement);
        
        if(!Array.isArray(checkvalue)){
            if (checkvalue.get("v.value") == true) {
                var checkedValue = checkvalue.get("v.text");
                checkedValue.id = checkedValue.entitlementId;
                selectedRows.push(checkedValue);
            }
        }else{
            for (var i = 0; i < checkvalue.length; i++) {
                if (checkvalue[i].get("v.value") == true) {
                    var checkedValue = checkvalue[i].get("v.text");
                    checkedValue.id = checkedValue.entitlementId;
                    checkedValue.entitlementName = checkedValue.name;
                    selectedRows.push(checkedValue);
                }
            }
        }
        component.set("v.isTransferButton", true);
        if(selectedRows && selectedRows.length > 0){
            var entitlementIds = [];
            for(var i = 0; i < selectedRows.length; i++){                
                entitlementIds.push(selectedRows[i].id);
                if(selectedRows[i].crmProductPlatform == 'PC')
                {
                    //Masking for transfer button
                    if(component.get("v.accountMaskingList").AccountTransferEntitlements){
                        component.set("v.isTransferButton", false);
                    }
                }
            }
            
            
            if(selectedEntitlements && selectedEntitlements.length > 0){
                for(var i = 0; i < selectedEntitlements.length; i++){
                    if(!entitlementIds.includes(selectedEntitlements[i].id))
                        selectedRows.push(selectedEntitlements[i]);
                }                
            }
            component.set("v.selectedEntitlements", selectedRows);
        }
        
        if(selectedRows.length > 0){
            //Masking enable for Update Status
            if(component.get("v.accountMaskingList").AccountUpdateStatus || component.get("v.accountMaskingList").ProductUpdateStatus){
                component.set("v.isDisabled", false);
            }
            if(pcCount == selectedRows.length)
                component.set("v.canDelete", true);
            else
                component.set("v.canDelete", false);
        }   
        else
            component.set("v.isDisabled", true);
    }
})