({
    //For Tier2, remove the user from all queues and add to selected queues
    addAndRemoveUsersFromQueue: function(cmp) {
        cmp.set("v.isResetOmni", true);               
        //logging out omni
        var promise1 = this.omniLogout(cmp);
        var self = this;
        //remove the user from all queues, add user to selected queues
        promise1.then(function(){
            var action = cmp.get("c.addAndRemoveUsersFromQueue"),
                selectedQueueList = cmp.get("v.selectedQueueOptions");        	
            //$A.util.removeClass(cmp.find('disScreenSpinner'), 'slds-hide');
            action.setParams({
                "strSelectedQueueList" : JSON.stringify(selectedQueueList)				
            });
            action.setCallback(self, function(response) {
                var state = response.getState();                
                //$A.util.addClass(cmp.find('disScreenSpinner'), 'slds-hide');                
                if (state === "SUCCESS") {
                    //log in omni
                    self.omniLogin(cmp);
                }else{
                    console.log("Failed with state: " + state);
                }
            });
            $A.enqueueAction(action);
        });       
    },
    
    //fetch cases based on Jobrole and bind to Grid
    fetchCasesByJobRole: function (cmp, caseIds) {       
        var action = cmp.get("c.getCasesByJobRole"),
             selectedQueueList = null,
            caseIdsList = JSON.stringify(caseIds);        
        if(cmp.get("v.queueSelectionPermission")) {
            selectedQueueList = JSON.stringify(cmp.get("v.selectedQueueOptions"));
        } 
        action.setParams({
            "strJobRoleId" : cmp.get("v.currentJobRole"),
            "strSelectedQueueList" : selectedQueueList,
            "strCaseIdsList" : caseIdsList       
        });       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var caseList = response.getReturnValue();                
                try {
                    caseList.sort(this.sortByField('CreatedDate', 'asc'));
                    var CatProdPersona = this.extractCatProdPersona(caseList);
                    CatProdPersona.personas.sort(this.sortByField('value', 'asc'));
                    cmp.set('v.filterData', CatProdPersona);
					 //Added below code for THOR-708
                    for ( var i in caseList){
                        caseList[i].CreatedDate = $A.localizationService.formatDateTimeUTC(caseList[i].CreatedDate)+" "+ "UTC";
                    }								
                    cmp.set('v.data', caseList);               
                    cmp.set('v.queueCount', caseList.length); 
                    cmp.set('v.ackMsg', false); 
                    window.CatProdPersonaQueTab = CatProdPersona;
                    $A.util.addClass(cmp.find('disableScreen'), 'slds-hide');
                    $A.util.addClass(cmp.find('disScreenSpinner'), 'slds-hide');
                }
                catch (error) {console.log(error);}                
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action); 
    },
    
    resetPresenceStatus: function(cmp)
    {
        var promise1 = this.omniLogout(cmp);
        var omniAPI = cmp.find("omniToolkit");
		var statusId = cmp.get("v.presenceStatusId");        
        promise1.then(function(resolve, reject){
          var promise2 =  resolve(omniAPI.login({statusId: statusId}));
            return promise2;
        }).catch(function(error) {
            console.log(error);
        });       
    },
    
    getAvailableStatusId: function(cmp){
         var statusAction = cmp.get("c.getAvailablePresenceStatusId");        
        statusAction.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var statusId = response.getReturnValue();
                cmp.set("v.presenceStatusId", statusId.substring(0,15));                 
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(statusAction);
    },
    omniLogin: function(cmp)
    {
        var omniAPI = cmp.find("omniToolkit");
        var promise1 = new Promise(function(resolve, reject){
            var statusId = cmp.get('v.presenceStatusId');
            resolve(omniAPI.login({statusId: statusId}));            
        }).catch(function(error) {
            console.log(error);
        });
        return promise1;
    },
    
    omniLogout: function(cmp) {        
        var omniAPI = cmp.find("omniToolkit");
        var promise1 = new Promise(function(resolve, reject){
            resolve(omniAPI.logout());            
        }).catch(function(error) {
            console.log(error);
        });
        return promise1;
    },
    
    getOmniStatus: function(cmp) {
        var omniAPI = cmp.find("omniToolkit");
		var self = this;       
        var promise1 = new Promise(function(resolve, reject){
            resolve(omniAPI.getServicePresenceStatusId());
        }).catch(function(error) {
            console.log(error);
        });
        return promise1;
    },
    
    fetchCompletedCases: function(cmp)
    {
    	var action = cmp.get("c.getCompletedCases");
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                cmp.set('v.data', response.getReturnValue());               
               
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
	},    
    
    toggleDetailContainer: function(component, pType) {
        var layoutContainer = component.find('mainLayoutContainer'),
            detailContainer = component.find('detailContainer');
        if (pType != 'Queued' && pType != 'Completed') {
        	$A.util.toggleClass(layoutContainer, 'slds-hide');
        	$A.util.toggleClass(detailContainer, 'slds-hide');
        }                
    },
    sortByField: function (fieldName, order) {
        return function(a, b) {
            if(!a.hasOwnProperty(fieldName) || !b.hasOwnProperty(fieldName)) {
              // property doesn't exist on either object
                return 0; 
            }
            var compFlag = 0;
            if (a[fieldName] > b[fieldName])
                compFlag = -1;
            if (a[fieldName] < b[fieldName])
                compFlag = 1;
            return (
                (order == 'asc') ? (compFlag * -1) : compFlag
            );
        }
    },
    extractCatProdPersona: function(caseList) {
        var categories = [{label: 'Categories', value: ''}],
            products = [{label: 'Products', value: ''}],
            persona = [{label: 'Target personas', value: ''}],
            categs = [],
            prods = [],
            pers = [];
        for(var i=0; i<caseList.length; i++) {
            if (caseList[i].Case_Category__r && categs.indexOf(caseList[i].Case_Category__r.Id) < 0) {
                categories.push({label: caseList[i].Case_Category__r.Name, value:caseList[i].Case_Category__r.Name});
                categs.push(caseList[i].Case_Category__r.Id);
            }
            if (caseList[i].ProductLR__r && prods.indexOf(caseList[i].ProductLR__r.Id) < 0) {
                products.push({label: caseList[i].ProductLR__r.Name, value:caseList[i].ProductLR__r.Name});
                prods.push(caseList[i].ProductLR__r.Id);
            }
            if (caseList[i].Petition_Details__r && caseList[i].Petition_Details__r.Target_Persona_Id__c && pers.indexOf(caseList[i].Petition_Details__r.Target_Persona_Id__c) < 0) {
                persona.push({label: caseList[i].Petition_Details__r.Target_Persona_Id__c, value:caseList[i].Petition_Details__r.Target_Persona_Id__c});
                pers.push(caseList[i].Petition_Details__r.Target_Persona_Id__c);
            }
        }
        return {"categories":categories, "products":products, "personas":persona};
    },    
    getUserRoles: function(component, event) {
        var action = component.get("c.getJobRoles");
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var userRoles = response.getReturnValue();               
                var roleOptions = [];
                for(var i=0; i<userRoles.length; i++) {
                    roleOptions.push({'label':userRoles[i].JobRole__r.Name , 'value':userRoles[i].JobRole__c});
                }
                
                component.set('v.roleOptions', roleOptions);
                //component.set('v.userRoles', userRoles);
                //this.popUpUserRoleWindow(component);
                //this.popUpUserRoleWindow(component);
                
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    popUpUserRoleWindow: function(component, selectOption) {
    	var modalBody = "",
            headerModal = "",
            footerModal = "";
        
        $A.createComponents([
            ["c:ModalContent",{}],
            ["c:ModalHeader",{}],
            ["c:ModalFooter",{}]
        ], function(components, status) {
            if (status === "SUCCESS") {
                modalBody = components[0];
                headerModal = components[1];
                footerModal = components[2];                
                modalBody.set('v.UGContent', component.get('v.userRoles'));
                modalBody.set('v.contentType', 'RolesNQueues');
                modalBody.set('v.roleOptions', component.get('v.roleOptions'));
                modalBody.set('v.queueSelectionPermission', component.get('v.queueSelectionPermission'));
                //footerModal.set('v.UGContent', component.get('v.simpleCase')); roleSelect                                                        
                headerModal.set('v.headerText', 'Choose Your Role');
                footerModal.set('v.roleFlag', true);
                footerModal.set('v.queueSelectionPermission', component.get('v.queueSelectionPermission'));
                if (component.get('v.roleOptions') && !component.get('v.roleOptions').length) {
                    modalBody.set('v.noRoleDefined', 'No Role is assigned to you. Please contact System Administrator.');
                }
                if (selectOption == 'roleSelect') {
                    modalBody.set('v.roleQueueFlag', false);
                    if (modalBody.get('v.queueOptions') && !modalBody.get('v.queueOptions').length) {
                        if (window.queueOptions && !window.queueOptions.length) { //T1
                            modalBody.set('v.roleQueueFlag', true);
                        }
                        else {
                            modalBody.set('v.queueOptions', window.queueOptions);
                            headerModal.set('v.headerText', 'Fill Your Queue');
                            footerModal.set('v.nextSaveFlag', true);
                        }                        
                    } 
                }
                component.find('overlayLib').showCustomModal({
                    header: headerModal,                                       
                    body: modalBody,
                    footer: footerModal,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        //alert('You closed the alert!');
                    }
                });
            }
            else {
                console.log(status);
            }
        });
	},  
    
    getUserPermissions: function(component, permissionName) {
        var action = component.get('c.checkPermissionByJobroleId'),
            omniRoutingPermission = '',
            queueSelectionPermission = '',
            returnValue;
        action.setParams({
            "strJobRoleId" : component.get("v.currentJobRole"),
            'strPermissionName' : permissionName			
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                returnValue = response.getReturnValue();
                console.log(returnValue);
                if (permissionName == 'Omni Routing') {
                    component.set('v.omniRoutingPermission', returnValue);
                    //get the cases if user does not have omni routing permission                
                    if(!component.get("v.omniRoutingPermission")){
                        this.fetchCasesByJobRole(component);
                    }
                }
                if (permissionName == 'Queue Selection') {
                    component.set('v.queueSelectionPermission', returnValue);
                    window.queueSelectionPermission = returnValue;
                }
            } else {
                console.log(status);
            }
        });
        $A.enqueueAction(action);
        return returnValue;
    },
    getProducts: function(component) {
        //getProducts
        var productAction = component.get("c.getProducts");
        productAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                window.allProducts = response.getReturnValue();
                component.set("v.productList",response.getReturnValue());                               
            }
        });
        $A.enqueueAction(productAction); 
    },
    
    WindowCloseHanlder: function() {	
    	//alert('My Window is closing');
    },
    
    setHistoryOverride: function() {
        (function(history){
            var pushState = history.pushState;
            history.pushState = function(state) {
                if (typeof history.onpushstate == 'function') {
                    history.onpushstate({state: state});
                }
                return pushState.apply(history, arguments);
            };
        })(window.history);
        window.onpopstate = history.onpushstate = function(e) { 
            if (e.state.location.indexOf('OMNI') != -1) {
                document.querySelectorAll('.tabItem a')[0].click();
            } 
        }
    },
    
    getJobRolePermissions: function(cmp){
        var isManageQueue = cmp.get('v.isManageQueue'),
            isChangeRole = cmp.get('v.isChangeRole');
        if(!isManageQueue || isChangeRole) {
            //get available presence statud Id to omni login
            this.getAvailableStatusId(cmp);
            this.getUserPermissions(cmp, 'Queue Selection');
            this.getUserPermissions(cmp, 'Omni Routing');
        }
        else {
            //get the cases if user does not have omni routing permission                
            if(!cmp.get("v.omniRoutingPermission")){
                this.fetchCasesByJobRole(cmp, null);
            }
            //remove the user from previous queues and add to selected queues and get the cases routed by omni
            else {
                this.addAndRemoveUsersFromQueue(cmp);
            }
        }
        
    },
    
    getAgentWorks: function(cmp) {
        var omniAPI = cmp.find("omniToolkit");
        var caseIds = [];
        var self = this;
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);
            for(var i in works){ 
                caseIds.push(works[i].workItemId);
            }
            self.fetchCasesByJobRole(cmp, caseIds);
        }).catch(function(error) {
            console.log(error);
        });
    },
    hideTabsOmni: function(component) {
        var workspaceAPI = component.find("workspace"),
            item = '';
        workspaceAPI.getAllTabInfo().then(function(responseAll) {
            for (item of responseAll) {                    
                if (item && !item.pageReference.attributes.apiName ) {
                    workspaceAPI.closeTab({tabId : item.tabId});
                }
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
})