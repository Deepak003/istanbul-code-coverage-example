({
	formatDuration: function(seconds) {
        return { 
            d: Math.floor(seconds/86400), 
            h: Math.floor(((seconds/86400)%1)*24), 
            m: Math.floor(((seconds/3600)%1)*60), 
            s: Math.round(((seconds/60)%1)*60)
        };
    },
    getOmegaEventDetails : function(component, interactionFromParent, eventId) {
        var self = this;
        var action = '';
        if(interactionFromParent.isArchived) {
            action = component.get("c.fetchArchivedEMEventDetails");
        } else {
            action = component.get("c.fetchOmegaEventDetails");
        }
        action.setParams({
            eventId: eventId
        });     
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                var intObj = response.getReturnValue();
                var interaction = self.formatData(intObj);
                //interaction.expanded = interactionFromParent.expanded;
                interaction = Object.assign(interactionFromParent, interaction);
                component.set("v.interaction", interaction);
				var interactionsList = component.get("v.interactions");
                var interactionIndex = component.get("v.interactionIndex");
                interactionsList[interactionIndex] = interaction;
                component.set("v.interactions", interactionsList);
            }
            component.set('v.isLoading', false);
        });
        component.set('v.isLoading', true);
        $A.enqueueAction(action);            
    },
    formatData: function(data) {
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
            advisorActions: this.formatAdvisorAction(interactionObj),
            caseNotes: this.formatCaseNotes(interactionObj)            
        });
    },
    "formatCaseNotes":function(interactionObj) {
        return Array.isArray(interactionObj.caseNotes) ? interactionObj.caseNotes.map(function(cn){
            try{
              cn.commentBody = decodeURIComponent(cn.commentBody)
            }catch(err) {
                // nothing to do
            }
            return cn;
        }) : interactionObj.caseNotes;
    },
    formatAdvisorAction: function(interactionObj) {
        return interactionObj.eventList.map(function(event){
            const caseEventDetail = [].concat(event.caseEventDetailList, event.accountEventDetailList, event.grantEventDetailList).filter(Boolean);
            return caseEventDetail.map(function(eventDetail){
                let message = "";
                if(event.strRelatedEvent && event.strRelatedEvent =="Grant"){
                    
                    message += `${eventDetail.strGrantOperation} ${event.strEventType}`;
                    
                    if(eventDetail.strEventFieldName){
                        message += ` ${eventDetail.strEventFieldName} `;
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
})