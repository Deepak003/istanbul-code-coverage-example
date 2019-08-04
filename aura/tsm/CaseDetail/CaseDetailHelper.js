({
	getContentTypes : function(component, event, selCTType) {		
        var ctSpiner = component.find('ctSpiner');
        $A.util.toggleClass(ctSpiner, 'slds-hide');
        var action = component.get("c.getContentTypes");        
        // set a callBack    
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(),
                    ctList = [];
                for (var i=0; i < storeResponse.length; i++) {
                    ctList.push({Id:storeResponse[i], Name: storeResponse[i] })
                }
                // set searchResult list with return value from server.
                component.set('v.contentTypes', ctList);
                if (selCTType) {
                    component.find('createCaseContentType').set('v.SearchKeyWord', selCTType);
                }
                $A.util.toggleClass(ctSpiner, 'slds-hide');
            }            
        });
        // enqueue the Action  
        $A.enqueueAction(action);
	},
    setValuesCaseDetailPage: function(component, caseObject) {
        if (caseObject) {
            if (caseObject.Petition_Details__r)
            	component.set('v.contentTypeVal', caseObject.Petition_Details__r.Content_Type__c);
            component.set('v.productVal', caseObject.ProductLR__r ? caseObject.ProductLR__r.Name : '');
            component.set('v.platformVal', caseObject.PlatformLR__r ? caseObject.PlatformLR__r.Name: '');
            component.set('v.categoryVal', caseObject.Case_Category__r ? caseObject.Case_Category__r.Name :'');
            if (caseObject.Petition_Details__r && caseObject.Petition_Details__r.Target_Account__r)
            	component.set('v.targetAccountID', caseObject.Petition_Details__r.Target_Account__r.Nucleus_ID__c);
            // Getting Image
            var uGContentCmp = component.find('userGeneratedContentCmp');
            if (uGContentCmp && caseObject.Petition_Details__r) {
                uGContentCmp.getContentViewDetails();
            }
        }
    },

    toggleSection : function(component,event,secId) {
        var acc = component.find(secId);
        $A.util.toggleClass(acc, 'slds-show');  
        $A.util.toggleClass(acc, 'slds-hide');  
    },
    
    getAccountTabDetails : function(component, event, strVlaue, type){ 
        var searchAction = component.get("c.getAccountDetails");
        var accountOpenSpinner = component.find('accountOpenSpinner');
        $A.util.removeClass(accountOpenSpinner, 'slds-hide');
        searchAction.setParams({"strSearchValue": strVlaue, "strIDType": type,"strNameSpace":null});
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.addClass(accountOpenSpinner, 'slds-hide');
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if (data == "Please check your input values for Search and ID-Type") {
                    this.displayToastMsg('error', 'Request is unable to process, please click after sometime.');
                    return;
                }
                data = JSON.parse(data);
                if (data.response && !data.response.length) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                var evt = $A.get("e.force:navigateToComponent");
                
                evt.setParams({
                    componentDef : "c:Account",
                    componentAttributes: {
                        simpleRecord : data,
                        accountSearch : true
                    }                        
                });evt.fire();
            }
            else if(state == 'ERROR') {
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({"message": response.getError()[0].message, "type": 'error'});                
                //toastEvent.fire();
            }       
        });
        $A.enqueueAction(searchAction);
    },

    getTargetCaseDetails : function(component, event) {
        var searchAction = component.get('c.getCustomerDetailsByPersonaID');
        searchAction.setParams({
            "strPersonaID": component.get("v.simpleCase.PersonaIdOnCase__c")
        });
        //CallBack
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if (data == "Please check your input values for Search and ID-Type") {
                    return;
                }
                data = JSON.parse(data);
                if(data.response !== null && data.response.length > 0){
                    var vr = data.response[0].persona.dateCreated;
                    var vrFullDate = vr.substring(0,vr.indexOf(':'));
                    var vrFormat = vr.substring(vr.indexOf(':')+1,vr.indexOf('Z'));
                    if(vrFormat.length==1){
                        vrFormat = '0'+vrFormat;
                        vr = vrFullDate+':'+vrFormat+'Z';
                        data.response[0].persona.dateCreated = $A.localizationService.formatDateTimeUTC(vr)+" "+ "UTC";
                        
                    }
                    else{
                        //THOR-1090 Start : Fixing improper TZ format from Studio  
                                   var actualDate,
									checkT,
									checkZ,
									convertedDate; 
                                    actualDate = data.response[0].persona.dateCreated;
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
										data.response[0].persona.dateCreated = $A.localizationService.formatDateTimeUTC(convertedDate)+" "+"UTC";
										}
										else{
											data.response[0].persona.dateCreated = $A.localizationService.formatDateTimeUTC(actualDate)+" "+"UTC";
											}
                            // data.response[0].persona.dateCreated = $A.localizationService.formatDateTimeUTC(data.response[0].persona.dateCreated)+" "+ "UTC";
                    }
                    
                    component.set("v.playerAccData",data.response[0].persona);
                    component.set("v.showSpinner", false);
                }
                else{
                    component.set("v.showSpinner", false);
                    var toastEvent = $A.get("e.force:showToast");                
                    toastEvent.setParams({                    
                        "message": "No personas available !!",
                        "type": 'info'
                    });                
                    toastEvent.fire();
                    
                }
            }
            else if(state == 'ERROR') {
                component.set("v.showSpinner", false);
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                    "message": response.getError()[0].message,
                    "type": 'error'
                            });                
                toastEvent.fire();
            }
        });
        $A.enqueueAction(searchAction);
    }
})