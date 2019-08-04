({
    getEntitlementsByProduct : function(component,event,helper) {
         var spinner = component.find("spinner");
        $A.util.addClass(spinner, "slds-show");
        var selectedProduct = event.getParam("productObj");
        var productName = selectedProduct.Id;
        var pageNumber = component.get("v.pageNumber");
        var targetAccountID = component.get("v.targetAccountID"),
            params = {
                "strNucleusId": targetAccountID,
                "noCache": false,
                "strCrmProductName": productName ,
                "strPageSize": "50",
                "strPageNumber": pageNumber,
            };
        
        var action = component.get("c.getUserEntitlements");  
            action.setParams({
                "strEntitlementRequest": JSON.stringify(params)
            });
            action.setCallback(this, function(response) 
            {	
                component.set('v.isAccountData',true);
                component.set('v.selectedType', 'Product');
                var data = JSON.parse(response.getReturnValue());
                var state = response.getState();      
                if (state === "SUCCESS") 
                {
                    data = data.response.entitlements;
                    var entitlementKeys = Object.keys(data);        
                    var entitlementsObj = {};
					// added onlineaccessArray for THOR-835
                    var onlineaccessArray = [];
                    							  
                    var entitlementsList = [];
                        for (var i=0; i<entitlementKeys.length; i++) 
                        {
							entitlementsObj = {name:data[entitlementKeys[i]].name,entitlementTag:data[entitlementKeys[i]].entitlementTag,currentStatus:data[entitlementKeys[i]].status,until: data[entitlementKeys[i]].terminationDate};
                            if(entitlementsObj.until == "" || !entitlementsObj.until)
                            {
								entitlementsObj.checkDate = "noDate";
								entitlementsObj.until = "--";
                            }
                            else {
                            	entitlementsObj.until = $A.localizationService.formatDateTimeUTC(entitlementsObj.until, "MMM dd, yyyy hh:mma z");
                            }
							// added below check for THOR-835
                            if(entitlementsObj.entitlementTag != 'ONLINE_ACCESS'){
                                entitlementsList.push(entitlementsObj);
                            } 
                            else{
                                onlineaccessArray.push(entitlementsObj);
                            }  
                        } 
						// added below code for THOR-835
                         for(var key in onlineaccessArray){
                             entitlementsList.unshift(onlineaccessArray[key]);
                         }								   
                    component.set("v.accountStatusList", entitlementsList); 
                    $A.util.addClass(spinner, "slds-hide");
                     $A.util.addClass(component.find("mySpinner"), "slds-hide");
                    
                }
                else{
                    component.set('v.isAccountData',false);
                    console.log('Error in returning the entitlements for the selected product >> ' +state);
                    component.set("v.accountStatusList", null); 
                    component.set('v.selectedType', '');
                    $A.util.addClass(spinner, "slds-hide");
					$A.util.addClass(component.find("mySpinner"), "slds-hide");
                }
            });        
        $A.enqueueAction(action);
    },
	
	getFranchiseDetails : function(component,event,helper) {
					component.set('v.isAccountData',true);
					$A.util.addClass(component.find("accountStatusTable"), "slds-hide");
                    $A.util.removeClass(component.find("mySpinner"), "slds-hide");
					var action = component.get("c.getFranchiseStatus");  
					var targetAccountID = component.get("v.targetAccountID");
					 action.setParams({
						"strNucleusId": targetAccountID,
					});
					 action.setCallback(this, function(response) {
						var parsedData = [];
                        parsedData = JSON.parse(response.getReturnValue());
                        var allFranchise = [];
                        var bannedFranchise = [];
                        var userAttachedStatuses =[]; 
                        if (parsedData)
							userAttachedStatuses = parsedData.response[0].response.userAttachedStatus; 	
						for(var count=0;count<userAttachedStatuses.length;count++){
                            var substatusLength = userAttachedStatuses[count].subStatuses.subStatus.length;
                            for(var count1=0;count1<substatusLength;count1++){
                                    bannedFranchise.push(userAttachedStatuses[count].subStatuses.subStatus[count1]);
                            }
                        }
                        if (parsedData)
                        	allFranchise = parsedData.response[0].bannedSupportedFranchise;
                        var bannedTitles=[];
                        bannedFranchise.map(function(item) { 
                          	var bannedTitle = item.title; 
							bannedTitles.push(bannedTitle);
                        });
                        var filteredFranchiseList =[];
                        allFranchise.map(function(item){
                            if(!(bannedTitles.indexOf(item.title)>-1)){
                                filteredFranchiseList.push(item);
                            }
                        });
                        var mergedEntitlements = []; 
                        Array.prototype.push.apply(filteredFranchiseList,bannedFranchise); 
                        mergedEntitlements = filteredFranchiseList;
                        var entKeys = Object.keys(mergedEntitlements);         
                        var entObj = {};
                        var entList = [];                   
                        for (var i=0; i<entKeys.length; i++) 
                         {                        
                            entObj = {statusType:mergedEntitlements[entKeys[i]].title};
                                if(mergedEntitlements[entKeys[i]].endDate == null){
                                	entObj.checkDate = "noDate";
                                    entObj.currentStatus = "ACTIVE";
									entObj.until = "--";
                                }
                                else{
                                	entObj.currentStatus = "SUSPENDED";
                                    //THOR-708 Start : Fixing improper TZ format from Studio
									var actualDate,
									checkT,
									checkZ,
									convertedDate; 
                                    actualDate = mergedEntitlements[entKeys[i]].endDate;
                                    checkT = actualDate.split('T').pop().split(':').shift();
                                    checkZ = actualDate.split(':').pop().split('Z').shift();
                                    if(checkT.length<=1){
                                       convertedDate = actualDate.replace('T','T0');
                                    }
                                    if(checkZ.length<=1){
									if(convertedDate){
                                             convertedDate = convertedDate.replace(checkZ+'Z','0'+checkZ+'Z');
                                         }
                                         else{
                                             convertedDate = actualDate.replace(checkZ+'Z','0'+checkZ+'Z');
                                         }
                                    }
									if(convertedDate){
										entObj.until = $A.localizationService.formatDateTimeUTC(convertedDate)+" "+"UTC";
										}
										else{
											entObj.until = $A.localizationService.formatDateTimeUTC(actualDate)+" "+"UTC";
											}
                                    //THOR-708 End
									//entObj.until = $A.localizationService.formatDateTimeUTC(mergedEntitlements[entKeys[i]].endDate)+" "+ "UTC";
                                }
                                if(!mergedEntitlements[entKeys[i]].name){
                                	entObj.name = "--";
                                }
                              entList.push(entObj);
                         }
                         $A.util.addClass(component.find("emptyRow"), "slds-hide");
                         component.set("v.accountStatusList", entList);
						 $A.util.removeClass(component.find("accountStatusTable"), "slds-hide");
                          $A.util.addClass(component.find("mySpinner"), "slds-hide");
					});
				   $A.enqueueAction(action);
	},

	toggleListbox : function(cmp) {
		var listbox = cmp.find('listbox-id-1');
        $A.util.toggleClass(listbox, 'slds-hide');
	},
    
	getPetitionCountFortarget: function(component,event) {
        component.find("strikesRecord").reloadRecord();
        var action = component.get("c.getNoOfPetitions"),
            targetID,
            currentTargetId;
        if(event && event.getParam('targetID')){
            targetID = event.getParam('targetID');
            window.targetCaseIdForPetCount = targetID;
        }
        if(!targetID){//if targetid is undefined
            currentTargetId =  component.get("v.targetAccountSFId");
            //currentTargetId =  window.targetCaseIdForPetCount;
        }
        else{ //if target id is available
            currentTargetId = targetID;
        }
        action.setParams({
                "strTargetAccountID": currentTargetId
            });
            action.setCallback(this, function(response) 
            {
                var state = response.getState();
                if (state === "SUCCESS"){
                    var count = response.getReturnValue();
                 	component.set("v.targetPetitionCount", count);
                }
                else{console.log('AccountStatus comp: Error in getting petition count for target account');
                    component.set("v.targetPetitionCount", "--");}
            });
        $A.enqueueAction(action);
	},
		
    getProductsByAccount: function(component) {
        var targetAccountID = component.get("v.targetAccountID"),
            prodObj = {},
            prodList = [],
            franchiseList =[],
            prodKeys;
        
        //  Here we are calling Apex controller class method and passing required parameters
        var action = component.get("c.getProductsByAccount");
        action.setParams({
            "strNucleusId": targetAccountID,
            "sNoCache": false,
        });
        // Here we are receiving response from Apex Aura Enabled method.
        action.setCallback(this, function(response) {
            //alert(response.getState());
            var state = response.getState();
            if (state === "SUCCESS") 
            {
               var data = JSON.parse(response.getReturnValue()),
                prodKeys = Object.keys(data);
                for (var i=0; i<prodKeys.length; i++) 
                {	//manipulating and storing the product data
                    prodObj = {Id:data[prodKeys[i]].id, Name: data[prodKeys[i]].name};
                    prodList.push(prodObj);
                }
                component.set("v.productsToDisplay", prodList);
                component.set("v.franchiseForProducts",{Id:null,Name:'FIFA'} );
                component.set("v.showSpinner", false);
            }
            else
            {
                component.set("v.showSpinner", false);
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
         
        $A.enqueueAction(action);
    }
    
})