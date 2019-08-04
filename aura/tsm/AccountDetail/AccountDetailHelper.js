({
	getBasicGamerAccountDetails : function(component,event){
      var caseObj = component.get('v.simpleCase'),
      gameParams = caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c.split(';'),
      gameID = gameParams[0],
      gameIDType = gameParams[1];
        
      var gameSearchAction = component.get('c.getBasicGamerAccountDetails');
      gameSearchAction.setParams({
      	"strProductName" : caseObj.ProductLR__r.Url_Name__c,
         "strID" : gameID,
         "strIDType" : gameIDType
      });
      gameSearchAction.setCallback(this, function(response) {
      	var state = response.getState();
            component.set("v.showSpinner", false);
            if (state === "SUCCESS") {
                component.set('v.gamerDataFlag',true);
                var data = response.getReturnValue();
                if (data == "No data found matching to the search criteria specified, try changing criteria headers or parameters to get results.") {
                    var toastEvent = $A.get("e.force:showToast");                
                    toastEvent.setParams({                    
                        "message": data,
                        "type": 'error'
                    });                
                    toastEvent.fire();
                    return;
                }
                data = JSON.parse(data);  
				if(data.id == null || data.idType == null){
                    var toastEvent = $A.get("e.force:showToast");                
                    toastEvent.setParams({                    
                        "message": 'No Records found for the `ID` and `IDType`.',
                        "type": 'error'
                    });                
                    toastEvent.fire();
                    return;
                }				
                data.dob = this.getAgeAt(data.dob);
				component.set("v.targetSynergyID", data.id+';'+data.idType);
                component.set("v.playerAccData",data);
                console.log("basicSearch");
                this.getSuspendDuration(component, event);
            }else if(state == 'ERROR'){
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                    "message": response.getError()[0].message,
                    "type": 'error'
                });                
                toastEvent.fire();
                console.log('ERROR PS:'+response.getError()[0].message);
            } 
      });
      $A.enqueueAction(gameSearchAction);
    },
    getSuspendDuration: function(component, event) {
        component.set("v.showSpinner", true);
        var action = component.get("c.getSuspendDuration");
        var playerAccData = component.get('v.playerAccData');
        action.setParams({
            "accountId":playerAccData.strSFAccountId
        });
        action.setCallback(this, function(response){
            component.set("v.showSpinner", false);
            var state = response.getState();
            if (state === "SUCCESS") {
                var endDate = response.getReturnValue();
                if (endDate) {
                    endDate = $A.localizationService.formatDate(endDate, "MM/dd/yyyy");
                    //console.log("sanction end date after format:"+endDate);
                    component.set("v.sanctionEndDate", endDate);
                }                                
            }
            else if (state === "ERROR") {
                console.error("Error retrieving sanction end date");
            }
        });
        $A.enqueueAction(action);
    },
	getTargetAccountDetails : function(component, event) {
        var searchAction = component.get('c.doAccountSearch');
        if (!component.get("v.targetAccountID")) {
            component.set("v.showSpinner", false);
            return;
        }
        searchAction.setParams({
            "strSearchValue": component.get("v.targetAccountID"),
            "strIDType": 'nucleusId',
            "strNameSpace":null});
        //CallBack
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.showSpinner", false);
            if (state === "SUCCESS") {
            	var data = response.getReturnValue();
                if (data == "Please check your input values for Search and ID-Type") {
                    return;
                }
                data = JSON.parse(data);
                data.dob = this.getAgeAt(data.dob);
                data.dateCreated = this.getAgeAt(data.dateCreated);
                for(var i in data.personas){
					//THOR-1090 Start : Fixing improper TZ format from Studio														   
                    var actualDate,
                        checkT,
                        checkZ,
                        convertedDate; 
                    actualDate = data.personas[i].dateCreated;
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
                        data.personas[i].dateCreated = $A.localizationService.formatDateTimeUTC(convertedDate)+" "+"UTC";
                    }
                    else{
                        data.personas[i].dateCreated = $A.localizationService.formatDateTimeUTC(actualDate)+" "+"UTC";
                    }
                }
                //Data Issue
                if ((data.persona == 'null' || !data.persona) && data.personas[0] && data.personas[0].displayName) {
                    data.persona = data.personas[0].displayName;
                }
                if ((data.personaId == 'null' || !data.personaId) && data.personas[0] && data.personas[0].personaId) {
                    data.personaId = data.personas[0].personaId;
                }
                component.set("v.playerAccData",data);
                console.log("basicSearch");
                this.getSuspendDuration(component, event);
                window.setTimeout(function() {
                    var accNotes = component.find('accountNotes');
                    if (accNotes) {
                        accNotes.getAccountNotes();
                    }
               }, 1000);
            }
            else if(state == 'ERROR') {
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                            "message": response.getError()[0].message,
                            "type": 'error'
                            });                
                toastEvent.fire();
    			console.log('ERROR PS:'+response.getError()[0].message);
            }            
        });
        $A.enqueueAction(searchAction);
	},
	
	 // Save the Target Account Details // THOR - 1395
    saveTargetAccountDetails : function(component, event) {
        var updateAction = component.get('c.doAccountSave');
        updateAction.setParams({
            "strNucleusID": component.get("v.targetAccountID"),
            "strPersonaId": component.get("v.PersonaId"), 
            "strDisplayName": component.get("v.playerAccData.persona"),
            "accountId" : component.get("v.targetAccountSFId"),
            "oldDisplayName" : component.get("v.oldPlayerAccDataPersona")
        });
        updateAction.setCallback(this, function(response) {
           var state = response.getState();
           component.set("v.showSpinner", false);
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                            "message": 'Nucleus Persona updated successfully',
                            "type": 'success'
                            });                
                toastEvent.fire();                
            }else if(state == 'ERROR'){
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                            "message": response.getError()[0].message,
                            "type": 'error'
                            });                
                toastEvent.fire(); 
            }          
        });
        $A.enqueueAction(updateAction);        
    },
    // calculates total time (in years) spent as a customer 
    getAgeAt: function (durationAsEAMember) {
        if (!durationAsEAMember) {
            return;
        }
        var today = new Date(),
            birthDate = new Date(durationAsEAMember.replace('T', ' ')),
            todayTime = today.getTime(),
            birthDateTime = birthDate.getTime(),
            timeDiffDate = todayTime - birthDateTime,
            timeDaysinMs = 1000*60*60*24,
            daysInMs = '',
            yearsAge = '',
            daysAge = '';
        
        if (timeDiffDate) {
            daysInMs = timeDiffDate/timeDaysinMs;
        }
        if (daysInMs) {
            yearsAge = Math.floor(daysInMs/365) + ' years';
        }
        // Calculate the days
        daysAge = Math.floor(daysInMs%365) + ' days';
        
        return yearsAge + ' ' + daysAge;
    }
})