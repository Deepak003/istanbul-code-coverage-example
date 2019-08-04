({
	init: function(component, event, helper) {
        /*var isCaseView = window.location.href.indexOf('/Case/'),
            urlParts,
            recordId;
        if(isCaseView != -1) {
            urlParts = window.location.href.split('/');
            recordId = urlParts[urlParts.length - 2];
            component.find('recordLoader').set('v.recordId', recordId);
            console.log(recordId);
        }*/
        var caseObject = component.get('v.simpleCase');
        if (caseObject) {
            helper.setValuesCaseDetailPage(component, caseObject);
        }
		// Added below code for THOR-1069
        var lockScreen = window.lockscreen;
        if(lockScreen){
            $A.util.addClass(component.find("contentType"),"lockScreen");
            $A.util.addClass(component.find("product"),"lockScreen");
            $A.util.addClass(component.find("platform"),"lockScreen");
            $A.util.addClass(component.find("category"),"lockScreen");
            $A.util.addClass(component.find("accountStatus"),"lockScreen");
            
         }								 
    },
    
    getPetitionDetails: function(component, event, helper) {
        var acc = component.find('expandPetitionDetail');
        component.set('v.togglePetition', false);
        component.set('v.togglePetition', true);
        component.set('v.products', []);
        component.set('v.platforms', []);
        component.set('v.categories', []);
        if($A.util.hasClass(acc, 'slds-show'))
            helper.toggleSection(component,event,'expandPetitionDetail');  
        var caseObj = event.getParam("objCase"),
            caseDetail = event.getParam('arguments')[0];//caseDetail;
        if (caseDetail == 'caseDetail') {
            var caseObject = component.get('v.simpleCase'),
                AccComp = component.find('accNotes'),
                actlCmp = component.find('actlCmp'),
				SupportingPetitionsComp = component.find('supportingPetitions');                         
            if (caseObject) {
                component.set('v.contentTypeVal', caseObject.Petition_Details__r.Content_Type__c);
                component.set('v.productVal', caseObject.ProductLR__r.Name);
                component.set('v.platformVal', caseObject.PlatformLR__r.Name);
                component.set('v.categoryVal', caseObject.Case_Category__r.Name);
                //THOR-1255
                if (AccComp) {
                    if (caseObject.Petition_Details__r.Target_Account__r) {
                        AccComp.set('v.targetAccountID',caseObject.Petition_Details__r.Target_Account__r.Nucleus_ID__c);
                    } else {
                        AccComp.set('v.targetAccountID',null);
                    }
                    AccComp.getAccountNotes(); 
                }  
                component.set('v.targetAccountID', caseObject.Petition_Details__r.Target_Account__r ? caseObject.Petition_Details__r.Target_Account__r.Nucleus_ID__c : '');
                component.set('v.targetAccountSFId', caseObject.Petition_Details__r.Target_Account__r ? caseObject.Petition_Details__r.Target_Account__r.Id : '');
                component.find('createCaseContentType').set('v.SearchKeyWord', caseObject.Petition_Details__r ? caseObject.Petition_Details__r.Content_Type__c: '');
                component.find('createCaseProduct').set('v.SearchKeyWord', caseObject.ProductLR__r ? caseObject.ProductLR__r.Name : '');
                component.find('createCaseCategory').set('v.SearchKeyWord', caseObject.Case_Category__r ? caseObject.Case_Category__r.Name : '');
                component.find('createCasePlatform').set('v.SearchKeyWord', caseObject.PlatformLR__r  ?caseObject.PlatformLR__r.Name : '');
                if(caseObject.ProductLR__r) {
                    component.find('createCaseCategory').set('v.sRecord', caseObject.ProductLR__r);
                	component.find('createCasePlatform').set('v.sRecord', caseObject.ProductLR__r);
                }
                // Getting Image
                var uGContentCmp = component.find('userGeneratedContentCmp');
				//Reset the UGC
                if (uGContentCmp) {
                    if (uGContentCmp.find('imageCont')) {
                        $A.util.addClass(uGContentCmp.find('imageCont'), 'slds-hide');
                    }
                    if (uGContentCmp.find('ugcContent')) {
                        var ugcContent = uGContentCmp.find('ugcContent');
                        if (ugcContent.length) {
                            for (var i=0; ugcContent.length > i; i++) {
                                $A.util.addClass(ugcContent[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.addClass(ugcContent, 'slds-hide');
                        }
                    }                    
                }
                if (uGContentCmp && caseObject.Petition_Details__r) {
                    uGContentCmp.getContentViewDetails();
                }
                
				var strikesEvent = $A.get("e.c:updateStrikesAndPetCount");
                    if (strikesEvent != undefined) {
                        strikesEvent.setParams({
                            targetID:caseObject.Petition_Details__r.Target_Account__c                        
                        });
                        strikesEvent.fire();
                    }
                actlCmp.getCaseNotes();
                SupportingPetitionsComp.getMergedPetitions();
                var accStatusCmp = component.find('accStatusCmp'); //
                if (accStatusCmp) {
					accStatusCmp.set('v.targetAccountSFId',caseObject.Petition_Details__r.Target_Account__r.Id); 
                    accStatusCmp.getSrikesAcc();
                }
            }
        }        
        /*if (caseObj) {
            component.set('v.products', caseObj.products);
            component.set('v.platforms', caseObj.platforms);
            component.set('v.categories', caseObj.categories);
            delete caseObj.products;
            delete caseObj.platforms;
            delete caseObj.categories;
            
            component.set('v.simpleCase', caseObj);
            component.set('v.recordId', caseObj.Id);
            //component.set('v.workId', workId);
          	var contentTypes = component.get('v.contentTypes'),
                selCTType = caseObj.Petition_Details__r ? caseObj.Petition_Details__r.Content_Type__c : '',
                AccComp = component.find('accNotes');
            if (!contentTypes.length) {
                helper.getContentTypes(component, event, selCTType);
            }
            AccComp.getAccNotes();
        }  */      	
    },
    getStrikesDetails: function(component, event, helper) {
         var caseObj = component.get('v.simpleCase');
        var accStatusCmp = component.find('accStatusCmp'); 
        if (accStatusCmp) {
            accStatusCmp.set('v.targetAccountSFId',caseObj.Petition_Details__r&&caseObj.Petition_Details__r.Target_Account__r?caseObj.Petition_Details__r.Target_Account__r.Id : caseObj.Account?caseObj.Account.Id:''); 
            accStatusCmp.getSrikesAcc();
        }
    },

    accountNotesHandler:function(component, event, helper)
    {
        var accComp = component.find('accNotes');
        accComp.getAccountNotes();
    },    
    
    caseObjChanges: function(component, event, helper) {
        var products = component.get('v.products'),
            platforms = component.get('v.platforms'),
            categories = component.get('v.categories'),
            contentTypes = component.get('v.contentTypes'),
            newVal = event.getParam("value"),
            mData= '';
        if (newVal && typeof newVal == "string") {
            mData = contentTypes.find(function(pData, pindex) {
                 if (pData.Name == newVal) {                     
                     return pData;
                 }
            });
            if (mData == undefined) {
                mData = products.find(function(pData, pindex) {
                     if (pData.Name == newVal) {                         
                         return pData;
                     }
                });
            }
            if (mData == undefined) {
                mData = categories.find(function(pData, pindex) {
                     if (pData.Name == newVal) {                         
                         return pData;
                     }
                });
            }
            if (mData == undefined) {
                mData = platforms.find(function(pData, pindex) {
                     if (pData.Name == newVal) {                         
                         return pData;
                     }
                });
            }
            if (mData != undefined) {
                setTimeout(function() {
                    var caseObj = component.get('v.simpleCase');
                    if (component.find('createCaseProduct').get('v.oRecord')) {
                        caseObj.ProductLR__r = component.find('createCaseProduct').get('v.oRecord');
                        caseObj.ProductLR__c = component.find('createCaseProduct').get('v.oRecord').Id;
                    }
                    if (component.find('createCasePlatform').get('v.oRecord')) {
                        caseObj.PlatformLR__r = component.find('createCasePlatform').get('v.oRecord');
                        caseObj.PlatformLR__c = component.find('createCasePlatform').get('v.oRecord').Id;                    
                    }
                    if (component.find('createCaseCategory').get('v.oRecord')) {
                        caseObj.Case_Category__r = component.find('createCaseCategory').get('v.oRecord');
                        caseObj.Case_Category__c = component.find('createCaseCategory').get('v.oRecord').Id;
                    }                
                    component.set('v.simpleCase', caseObj);                   
                    //Update CaseObj into the CaseAction Cmp
                    // Application Event Fire
                    var caseObjEvent = $A.get("e.c:UpdateCaseObjectAppEvt");
                    if (caseObjEvent != undefined) {
                        caseObjEvent.setParams({
                            caseObj : caseObj                            
                        });
                        caseObjEvent.fire();
                    }
                }, 100);
            }
        }        
        
    },

    expandClick : function(component, event, helper) {
        component.set("v.showSpinner", true);
        helper.toggleSection(component,event,'expandPetitionDetail');  
        helper.getTargetCaseDetails(component, event);
    },
    
    accountTabOpen : function(component, event, helper){
        var simpleCase = component.get('v.simpleCase');
        if(simpleCase && simpleCase.Account && simpleCase.Account.Nucleus_ID__c != null && simpleCase.Account.Nucleus_ID__c != ''){
            helper.getAccountTabDetails(component, helper, simpleCase.Account.Nucleus_ID__c, 'nucleusId');
        }
        else if(simpleCase && simpleCase.PersonaIdOnCase__c != null && simpleCase.PersonaIdOnCase__c !=''){
            helper.getAccountTabDetails(component, helper, simpleCase.PersonaIdOnCase__c, 'PersonaId');
        }
            else{
                this.displayToastMsg('error', 'Please Wait for some time to click the link again');
                return;
            }
    }    
})