({
	loadProducts: function(cmp) {
        if (window.products) {
            this.createProductList(cmp, window.products);
        }
        else {
        	var productAction = cmp.get("c.getProducts");
            productAction.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {                
                    var products = response.getReturnValue();
                    this.createProductList(cmp, products);
                }
            });
            $A.enqueueAction(productAction);    
        }		        
	},
    
	//THOR-916 START
    updatePetitionActions: function(component) {
        //updating actions petition preview page
        var getRolesAction = component.get("c.getRoleWiseCaseActions");
        getRolesAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
                var roleBasedOptions = response.getReturnValue();
                var setRoleBasedOptions =[];
                for (var i=0; i<roleBasedOptions.length; i++) {
                    var option = {};
                    	if(window.permsList){
                            option.value = roleBasedOptions[i];
                            var actName = option.value.toLowerCase();
                            if (actName.includes('resolve') && window.permsList.includes('resolve')) {
                                option.value = roleBasedOptions[i];
                                option.label = roleBasedOptions[i];
                                var checkViolationFound;
                                checkViolationFound = option.label.replace(/ /g,'');
                                checkViolationFound = checkViolationFound.toLocaleLowerCase();
                                if(!checkViolationFound.includes("resolve-violationfound")){
                                    setRoleBasedOptions.push(option);
                                }                                
                            }
                            else if (actName.includes('transfer') && window.permsList.includes('transfer')) {
                                option.value = roleBasedOptions[i];
                                option.label = roleBasedOptions[i];
                                setRoleBasedOptions.push(option);
                            }
                            else if (actName.includes('escalate') && window.permsList.includes('escalate')) {
                                option.value = roleBasedOptions[i];
                                option.label = roleBasedOptions[i];
                                setRoleBasedOptions.push(option);
                            }
                            else if (actName.includes('move') && window.permsList.includes('move')) {
                                option.value = roleBasedOptions[i];
                                option.label = roleBasedOptions[i];
                                setRoleBasedOptions.push(option);
                            }
                        }
                }
				window.caseActionOptions = setRoleBasedOptions;				   
                component.set("v.petitionActions", setRoleBasedOptions);
            } 
            else{
                console.log('Error in getting action roles for mass actions');
            }
        });
        $A.enqueueAction(getRolesAction); 
    },
    //THOR-916 END
	
    createProductList: function(cmp, products) {
        var productList = [];
        for (var i=0; i<products.length; i++) {                    
            productList.push({label: products[i].Name.replace(':', ''), value: products[i].Id.replace(':', '')});
        }                
        cmp.set("v.productOptions", productList);
    },
    
    loadCategories: function(cmp, prodId) {
		var categoryAction = cmp.get("c.getTosCategoriesByProduct");
        categoryAction.setParams({"strProductId": prodId});        
        categoryAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var categories = response.getReturnValue(),
                    categoryList = [];
                for (var i=0; i<categories.length; i++) {                    
                    categoryList.push({label: categories[i].Name.replace(':', ''), value: categories[i].Id.replace(':', '')});
                }                
                cmp.set("v.categoryOptions", categoryList); 
                // Check if the category is populated or not
                var categoryCBox = cmp.find('selectcategory');
                if (categoryCBox && typeof categoryCBox.get == 'function' && !categoryCBox.get('v.value')) {
                    var CaseObj = cmp.get('v.simpleCase');
                    categoryCBox.set('v.value', CaseObj.Case_Category__c)
                }
            }
            /*/ Display toast message to indicate load status
            var toastEvent = $A.get("e.force:showToast");
            if (state === 'SUCCESS'){
                toastEvent.setParams({
                    "title": "Success!",
                    "message": " Your contacts have been loaded successfully."
                });
            }
            else {
                toastEvent.setParams({
                        "title": "Error!",
                        "message": " Something has gone wrong."
                });
            }
            toastEvent.fire();*/
        });
        $A.enqueueAction(categoryAction);        
	},
    
    loadPlatforms: function(cmp, prodId) {
		var platformAction = cmp.get("c.getPlatformsByProduct");
        platformAction.setParams({"strProductId": prodId});        
        platformAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var platforms = response.getReturnValue(),
                    platformList = [];
                
                if (platforms && platforms.length) {
                    for (var i=0; i<platforms.length; i++) {                    
                        platformList.push({label: platforms[i].Name.replace(':', ''), value: platforms[i].Id.replace(':', '')});
                    } 
                }
                cmp.set("v.platformOptions", platformList);
                
            }            
        });
        $A.enqueueAction(platformAction);        
	},
    
    loadSubCategories : function(cmp) {
		var subCategAction = cmp.get("c.getSubCategories");
        subCategAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var subCategories = response.getReturnValue(),
                    subCategoryList = [];
                for (var i=0; i<subCategories.length; i++) {                    
                    subCategoryList.push({label: subCategories[i].Name.replace(':', ''), value: subCategories[i].Id.replace(':', '')});
                }                
                cmp.set("v.subCategoryOptions", subCategoryList);
            }
        });
        $A.enqueueAction(subCategAction);        
	},
    // Get a case petition detail after click of a petition.
    getCasePetition : function(cmp, event) {         
        var casePetitionData,
         	casePetitionAction = cmp.get("c.getCaseByCaseIdorCaseNumber"),
        	caseId = cmp.get("v.recordId"),
            tabViewFlag = cmp.get("v.tabViewFlag");  
        
        var strContentVO;
        
        // Checking the tabs value
        if (window.tabFlag && window.tabFlag != cmp.get('v.tabViewFlag')) {
        	cmp.set('v.tabViewFlag', window.tabFlag);
        }
        casePetitionAction.setParams({"strFilter": "Id",  "strFilterVal" :caseId });
        casePetitionAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                casePetitionData = response.getReturnValue(); 
                if (casePetitionData.Petition_Details__r && casePetitionData.Petition_Details__r.View_Url__c && casePetitionData.Petition_Details__r.Content_Type__c == "Text") {
                   	var regEx = new RegExp("'", "g"),
                        tempObj = casePetitionData.Petition_Details__r.View_Url__c.replace(regEx, '"');
                    if (tempObj.indexOf('[') == 0 || (tempObj.indexOf('{') >= 0 && tempObj.indexOf('{') <= 1 )) {
                        tempObj = JSON.parse(tempObj);
                    }                    	
                    if (tempObj.length) {
                        //casePetitionData.Petition_Details__r.Content_Type__c = "Chat";
                        casePetitionData.Petition_Details__r.View_Url__c = tempObj;
                    } 
                }
                /*if (casePetitionData.Petition_Details__r && casePetitionData.Petition_Details__r.Content_Type__c == "Graphic") {
                    if (casePetitionData.Petition_Details__r.View_Url__c && casePetitionData.Petition_Details__r.View_Url__c.indexOf('ea') < 0) {
                        casePetitionData.Petition_Details__r.Content_Type__c = "Text";
                    }
                }*/
                if (casePetitionData.Petition_Details__r) {
                    var chkCTAct = casePetitionData.Petition_Details__r.Content_Action__c ? true : false,
                        contentActPermsHide = false,
                        contentActPermsShow = false;
                    // THOR 1141 
                    if (!chkCTAct) {
                        if ( casePetitionData.Petition_Details__r.Content_Action__c  != 'hide'  &&
                              casePetitionData.Petition_Details__r.Content_Action__c  != 'unhide' 
                                && casePetitionData.Petition_Details__r.ContentID__c) 
                        {
                            contentActPermsHide = true
                        }
                    }
                    if (chkCTAct) {
                        if (casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && casePetitionData.Petition_Details__r.ContentID__c) {
                            contentActPermsShow = true
                        }
                    }
                
                    if (chkCTAct) {
                        if (casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() == 'unhide' && casePetitionData.Petition_Details__r.ContentID__c) {
                            contentActPermsHide = true
                        }
                    }
					// End of THOR 1141
					if (chkCTAct) {
                        if (casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() != 'hide' && casePetitionData.Petition_Details__r.Unhide_Url__c) {
                            contentActPermsHide = true
                        }
                    }
                    if (!chkCTAct && casePetitionData.Petition_Details__r.Hide_Url__c) {
                        contentActPermsHide = true;
                    }
                    if (!contentActPermsHide) {
                        if (casePetitionData.Petition_Details__r.Content_Action__c && casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && casePetitionData.Petition_Details__r.Unhide_Url__c) {
                            contentActPermsShow = true
                        }
                    }
                    if (contentActPermsHide && window.permsList) {
                    	contentActPermsHide = window.permsList.includes('content hide');
                    }
                    if (contentActPermsShow && window.permsList) {
                    	contentActPermsShow = window.permsList.includes('content unhide');
                    }
                    cmp.set('v.contentActPermsHide', contentActPermsHide);
                    cmp.set('v.contentActPermsShow', contentActPermsShow);
                }
                
                cmp.set("v.simpleCase",casePetitionData); 
                if (caseActionCmp == undefined) {
                    window.caseObj = casePetitionData;
                }
                var caseActionCmp = cmp.find('caseactioncomponent');
                if (tabViewFlag == 'Completed' && caseActionCmp) {
                    caseActionCmp.set("v.petitionActionFlag", false);                    
                }
                else if(caseActionCmp) {
                    caseActionCmp.set("v.petitionActionFlag", true);                     
                }
                if (caseActionCmp && caseActionCmp.find('selectPetitionAction') && typeof caseActionCmp.find('selectPetitionAction').set != 'undefined') {
                    caseActionCmp.find('selectPetitionAction').set('v.value', '');
                    caseActionCmp.set('v.petitionCommitFlg', false);
                }
                this.loadCategories(cmp, cmp.get("v.simpleCase").ProductLR__c);
                this.loadPlatforms(cmp, cmp.get("v.simpleCase").ProductLR__c);
                if (caseActionCmp && caseActionCmp.find('petitionNotes')) {
                	caseActionCmp.find('petitionNotes').getCaseNote();
                }
                // Getting Image
                var uGContentCmp = cmp.find('userGeneratedContentCmp');
                if (uGContentCmp) {
                    uGContentCmp.set('v.imageBaseData', '');
                    uGContentCmp.set('v.contentData', '');
                }                
                if (uGContentCmp && casePetitionData.Petition_Details__r) {
                    uGContentCmp.getContentViewDetails();
                }



            }
        });
        $A.enqueueAction(casePetitionAction);
	},
    
    getCasePetitionPlayer: function(cmp, event) {
        var casePetitionData = cmp.get("v.simpleCase");
        this.getCasePetitionDetail(cmp, event, casePetitionData, null, null, "account");
    },
    
    // Petition Detail view Call
    getCasePetitionDetail: function(cmp, event, caseData, id, domElmt, pType) {
        var appEvent = $A.get("e.c:PetitionDetailEvent"),
            products = cmp.get("v.productOptions"),
            platforms = cmp.get("v.platformOptions"),
            categories = cmp.get("v.categoryOptions"),
            workId = cmp.get("v.workId"); 
		var patientdetailStatusEvent = cmp.getEvent('petitionDetailCompEvent');																   
        if (caseData) {
            caseData.products = [];
            caseData.platforms = [];
            caseData.categories = [];
            for (var i=0; i<products.length; i++) {                    
                caseData.products.push({Name: products[i].label, Id: products[i].value});
            } 
            for (var i=0; i<platforms.length; i++) {                    
                caseData.platforms.push({Name: platforms[i].label, Id: platforms[i].value});
            }
            for (var i=0; i<categories.length; i++) {                    
                caseData.categories.push({Name: categories[i].label, Id: categories[i].value});
            }            
        }
		// Application Event Fire
        if (appEvent != undefined) {
            appEvent.setParams({
                id: id,
                domEl: domElmt,
                type: pType,
                objCase: caseData,
                agentWorkId: workId
            });           
            appEvent.fire();
        }        
		// Component Event Fire
        if(patientdetailStatusEvent){
            patientdetailStatusEvent.setParams({
                id: id,
                domEl: domElmt,
                type: pType,
                objCase: caseData,
                agentWorkId: workId
            });           
            patientdetailStatusEvent.fire();
        } 					  
    }
})