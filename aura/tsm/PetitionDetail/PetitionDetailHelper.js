({
	getCaseNote : function(component) {
		var caseNote = {
            subject: 'Notes Appended',
            date: '2018-05-22T21:12:15.000Z',
            note: 'Possible violation found. Escalate this petition to T2 queue for further evaluation',
            advisor: 'Adam Choi',
            type: 'escalated',
            id: '0005'
        };
        component.set('v.caseNote', caseNote);
	},
    
    getProductsByAccount: function(component) {
        var spinner = component.find("petitionDetailSpinner");
       $A.util.toggleClass(spinner, "slds-hide");
        var targetAccountID = component.get("v.targetAccountId"),
            prodObj = {},
            prodList = [],
            franchiseList =[],
            prodKeys;
        
        //  Here we are calling Apex controller class method and passing required parameters
        var action = component.get("c.getProductsByAccount");
        if (action) {
            action.setParams({
                "strNucleusId": targetAccountID,
                "sNoCache": false,
            });
            window.productsToDisplay = [];
            // Here we are receiving response from Apex Aura Enabled method.
            action.setCallback(this, function(response) {
                //alert(response.getState());
                $A.util.toggleClass(spinner, "slds-hide");
                var state = response.getState();
                if (state === "SUCCESS") {
                   var data = JSON.parse(response.getReturnValue()),
                    prodKeys = Object.keys(data);
                    for (var i=0; i<prodKeys.length; i++) 
                    {	//manipulating and storing the product data
                        var prodName = data[prodKeys[i]].displayName?data[prodKeys[i]].displayName:data[prodKeys[i]].name,
                            prodId = data[prodKeys[i]].name;                    
                        prodObj = {Id: prodId, Name: prodName};
                        prodList.push(prodObj);
                    }
					prodObj = {Id:'defaultCRMProduct', Name:'Other'};
                    prodList.push(prodObj);
					var franchiseForProducts = {Id:null,Name:'FIFA'};
                     component.set("v.productList",prodList);
                     component.set("v.franchiseList",franchiseForProducts);
                    //window.productsToDisplay = prodList;
                    //window.franchiseForProducts = {Id:null,Name:'FIFA'};                
                }
                else
                {                
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
    },
    focusTab: function(component, tabId) {
        var workspaceAPI = component.find("workspace");
        
        if (workspaceAPI) {
            workspaceAPI.focusTab({tabId : tabId});
        }        
    },
    acceptAgentWorkSearchCase: function(component, event, selectedCaseId) {        
        var omniAPI = component.find("omniToolkit"),
			simpleCase = component.get('v.simpleCase'),        
        	self = this;
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);          
            var agentWorkId;
            var isEngaged; 
            self.updateCaseStatusAndOwner(component, selectedCaseId);
            for(var i in works){               
                if(works[i].workItemId == selectedCaseId.substring(0, 15)){
                    agentWorkId = works[i].workId;
                    isEngaged = works[i].isEngaged;
                    break;
                }
            }
            if(agentWorkId == undefined){
                self.createAgentWork(component, event, selectedCaseId);
            }
            if(agentWorkId != undefined) {
                if(!isEngaged){                    
                    //change status of agent work to accepted            
                    omniAPI.acceptAgentWork({workId: agentWorkId}).catch(function(error) {
                        console.log(error);                             
                    });
                }
            }                                     
        });
    },
    updateCaseStatusAndOwner: function(component, selectedCaseId){    
        var action = component.get("c.updateCaseStatusAndOwner");
        if (action) {
            action.setParams({"strCaseId": selectedCaseId});
            action.setCallback(this, function(response) {
            var state = response.getState();          
            if (state === "ERROR") {                
                    console.log(state);
                }
            });
            $A.enqueueAction(action);
        }
	},
    
    createAgentWork: function(component, event, selectedCaseId){    
        var action = component.get("c.createAgentWork");
        if (action) {
            action.setParams({"strCaseId": selectedCaseId});
            action.setCallback(this, function(response) {
                var state = response.getState();          
                if (state === "ERROR") {                
                    console.log(state);
                }            
                else if(state === "SUCCESS"){                
                    this.acceptAgentWorkSearchCase(component, event, selectedCaseId);
                }
            });
            $A.enqueueAction(action);
        }         
	},
    focusTabtoQueue: function(component) {
        var workspaceAPI = component.find("workspace"),
            item = '';
        workspaceAPI.getAllTabInfo().then(function(responseAll) {
            for (item of responseAll) {                    
                if (item && item.pageReference.attributes.apiName ) {
                    workspaceAPI.focusTab({tabId : item.tabId});
                }
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
})