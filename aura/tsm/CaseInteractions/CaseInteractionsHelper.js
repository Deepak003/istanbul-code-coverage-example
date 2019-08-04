({   
    toggleState: function(component, event) {
        const items = component.get("v.interactions"), 
            index = event.currentTarget.dataset.index;
        items[index].expanded = !items[index].expanded;
        component.set("v.interactions", items);
    },
    toggleStateAll: function(component) {
        const items = component.get("v.interactions");
        const currentState = items[0].expanded;
        items.forEach(function(item){
            item.expanded = !currentState;
        });
        component.set("v.interactions", items);
    },
    formatData: function(data, component) {
        const interactionObj = Object.assign({}, data.caseInteraction, { eventList: data.eventList || [] });
        const isInbound = interactionObj.source != "Advisor";        
        
        let description = [], title = "";
        
        if(isInbound) {
            description = description.concat(this.getActionDescription(interactionObj));
            title = "Player";
        }else {
            description = [];
            title = interactionObj.advisorName + (interactionObj.advisorJobRole ? " ("+ interactionObj.advisorJobRole +")" : "");
            switch(interactionObj.channel) {
                case "Email":
                    description = [].concat("Emailed player");
                    break;
                case "Chat":
                    description = [].concat("Chatted with player");
                    const time = ((seconds)=>({ d: Math.floor(seconds/86400), h: Math.floor(((seconds/86400)%1)*24), m: Math.floor(((seconds/3600)%1)*60), s: Math.round(((seconds/60)%1)*60) }))((interactionObj.chatTranscript || {}).chatDuration || 0);
                    const timeLabel = (time.m ? time.m + "min " : "") + time.s + "seconds";
                    description.push(" for " + timeLabel);
                    break;
            }
            
            if(interactionObj.action == "CaseTransfer") {
                description.concat(this.getActionDescription(interactionObj));
            }            
        }
        
        return Object.assign({}, interactionObj, {
            title: title,
            description: description.join(". "),
            createdDate: new Date(interactionObj.createdDate),
            advisorActions: this.formatAdvisorAction(interactionObj,component)            
        });
    },
    formatAdvisorAction: function(interactionObj, component) {
        return interactionObj.eventList.map(function(event){
            const caseEventDetail = [].concat(event.caseEventDetailList, event.accountEventDetailList, event.grantEventDetailList).filter(Boolean);
            return caseEventDetail.map(function(eventDetail){
                let message = "";
                if(event.strRelatedEvent && event.strRelatedEvent =="Grant"){
                    
                    message += `${eventDetail.strGrantOperation} ${event.strEventType}`;
                    
                    if(eventDetail.strEventFieldName){
                        message += ` ${eventDetail.strEventFieldName} `;
                    }

                    if(eventDetail.currencyType){
                        message += ` ${eventDetail.currencyType} `;
                    }
                    
                    if(eventDetail.strNewValue){
                        message += ` : ${eventDetail.strNewValue} `;
                    }           
                }else{
                    if(event.strEventSubType){
                        message += `${event.strEventSubType} `;
                    }
                    if(eventDetail.strEventFieldName){
                        message += `${eventDetail.strEventFieldName} `;
                    }
                    if(eventDetail.strOldValue){
                        message += `from ${eventDetail.strOldValue} `;
                    }
                    if(eventDetail.strNewValue){
                        message += `to ${eventDetail.strNewValue} `;
                    }
                }
                //Adding logic to display the email address of the account changed
                if(event.accountId != undefined){
                    if(component.get("v.accountId") != event.accountId){
                        message = 'Change made to account '  + event.accountEmail + ' : ' + message;
                    }       
                }

                return message;
            })
        }).filter(Boolean).reduce((a,b)=>a.concat(b), []);
    },
    getActionDescription: function(interactionObj) {
        const action = interactionObj.action;
        switch(action) {
            case "CaseCreation":
                return "Case created";
            case "CaseResume":
                return "Resumed the case";
            case "CaseTransfer":
                return interactionObj.queueName ? "Case transferred to " + interactionObj.queueName : "";
        }
    },
    fetchInteractions: function(component) {
        var self = this;
        let action = component.get("c.fetchInteractionsAndEventsByCaseId");
        // Archived case action
        if(component.get("v.data.status") == "Archived") {
            action = component.get("c.fetchArchiveCaseDetail");
        }
        
        action.setParams({
            caseId: component.get("v.data.caseId"),
            caseNumber: component.get("v.data.caseNumber"),
        });
        
        component.set('v.isLoading', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);            
            const state = response.getState();
            if (state === "SUCCESS") {
                var isOmega = false;
                const interactions = response.getReturnValue().map(function(data){return this.formatData(data, component)}, this);
                interactions.sort((a,b)=>b.createdDate-a.createdDate);
                component.set("v.interactions", interactions);
                isOmega = self.checkOmegaCase(interactions);
                component.set('v.isOmega', isOmega);
                component.set('v.isPhoneTranscriptAvailable', !!interactions.find((i)=>i.channel=='Phone'));
                component.set('v.isChatTranscriptAvailable', !!interactions.find((i)=>i.channel=='Chat'));
                component.set('v.isEmailTranscriptAvailable', !!interactions.find((i)=>i.channel=='Email' && i.source!="Advisor" && i.action=="CaseCreation"));
                component.set('v.isNoteAvailable', !!interactions.find((i)=>!$A.util.isEmpty(i.caseNotes)));
            }else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);  
    },
    checkOmegaCase: function(interactions) {
        var isOmega = false;
        /* Added the below if condition to stop showing omega icon if there only interaction that's created by player for TSM-3692*/
        if(interactions.length == 1 && interactions[0].title == 'Player'){       
           isOmega = false;
        }else{
            for(var i = 0; i < interactions.length; i++) {            
                if (interactions[i].hasOwnProperty("eventId")) {
                    isOmega = true;
                    break;
                }
            }
        }
        return isOmega;
    },
    openSubTab: function(component, type) {
        const config = { 
            note: { 
                title: 'Case notes', icon: 'utility:note', cmp: 'c__CaseNotesTSM'
            },
            email: { 
                title: 'Email transcript', icon: 'utility:email', cmp: 'c__EmailTranscript'
            },
            chat: { 
                title: 'Chat transcript', icon: 'utility:comments', cmp: 'c__ChatTranscript'
            },
            phone: { 
                title: 'Phone records', icon: 'utility:call', cmp: 'c__PhoneTranscript'
            }
        };
        
        const tabIcon = config[type].icon;
        const tabTitle = config[type].title;
        const cmpName = config[type].cmp;
        
        const caseId = component.get("v.data.caseId");
        const caseNumber = component.get("v.data.caseNumber");
        const isArchiveCase = component.get("v.data.status") == "Archived";
        
        const workspaceAPI = component.find("workspace");
        /*
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                focus: true,
                pageReference: {
                    "type": "standard__component",
                    "attributes": {
                        "componentName": cmpName
                    },                            
                    "state": { 
                        caseId: caseId,
                        tabIcon: tabIcon,
                        tabTitle: tabTitle,
                        isArchiveCase: isArchiveCase,
                        caseNumber: caseNumber
                    }
                }
            }).catch(console.log);
        }).catch(console.log);
        */
        
        workspaceAPI.getEnclosingTabId().then(function(enclosingTabId) {
            workspaceAPI.openSubtab({
                parentTabId: enclosingTabId,
                focus: true,
                url: `/lightning/cmp/${cmpName}?c__caseId=${caseId}&c__tabIcon=${tabIcon}&c__tabTitle=${tabTitle}&c__isArchiveCase=${isArchiveCase}&c__caseNumber=${caseNumber}`,
            }).catch(console.log);
        }).catch(console.log);
    }
})