({
    acceptAgentWork: function(component, event, selectedCaseId) {        
        var omniAPI = component.find("omniToolkit");
        var appEvent = $A.get("e.c:RowClickAppEvent");
        var self = this;
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);          
            var agentWorkId;
            var isEngaged;             
            for(var i in works){               
                if(selectedCaseId){
					if(works[i].workItemId == selectedCaseId.substring(0, 15)){
						agentWorkId = works[i].workId;
						isEngaged = works[i].isEngaged;
						break;
					}
				}
            }			            
            if(agentWorkId != undefined) {
                if(!isEngaged){                    
                    //change status of agent work to accepted
                    self.updateCaseStatusToActive(component, selectedCaseId);            
                    omniAPI.acceptAgentWork({workId: agentWorkId}).catch(function(error) {
                        console.log(error);                             
                    });
                }                           
                if (appEvent != undefined) {
                    appEvent.setParams({
                        pk : selectedCaseId,
                        agentWorkId : agentWorkId
                    });
                    appEvent.fire();
                }
            }                                     
        }).catch(function(error){
            console.log(error);
        });
    },
    
    updateCaseStatusToActive: function(cmp, selectedCaseId){    
        var action = cmp.get("c.updateCaseStatusToActive");
        action.setParams({"strCaseId": selectedCaseId});
       	action.setCallback(this, function(response) {
        var state = response.getState();          
        if (state === "ERROR") {                
                console.log(state);
            }
        });
		$A.enqueueAction(action); 
	}, 
    
	fetchCompletedCases: function (component, event) {
        var action = component.get("c.getCompletedCases");
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var caseList = response.getReturnValue();                
                caseList.sort(this.sortByField('CreatedDate', 'asc'));
                var CatProdPersona = this.extractCatProdPersona(caseList);
                CatProdPersona.personas.sort(this.sortByField('value', 'asc'));
                window.CatProdPersonaComTab = CatProdPersona;
                component.set('v.filterData', CatProdPersona);
				// Added below for loop for and CreatedDate for THOR-708 
                for(var i in caseList){
                    caseList[i].CreatedDate = $A.localizationService.formatDateTimeUTC(caseList[i].CreatedDate)+" "+ "UTC";
                }
				component.set('v.completedData', caseList);
                component.set('v.completedCnt', caseList.length);               
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);        
    },
    
    tabViewEventFire: function (componenet, event, type) {
        // Application Event tabview Fire
        var tabViewClkEvent = $A.get("e.c:TabViewClickAppEvt");
        if (tabViewClkEvent != undefined) {
            tabViewClkEvent.setParams({
                tabFlag : type
            });
            tabViewClkEvent.fire();
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
    }
    
})