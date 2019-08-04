({
    toggleExpand : function(component,event,auraId) {
        var acc = component.find(auraId);
        $A.util.toggleClass(acc, 'slds-is-open');        
    },
    /*
    onChangeFilter : function(component, auraId){
        const filterVal = component.find(auraId).get("v.value");
        console.log('Selected : ', filterVal);        
        component.set("v.sortOrder", filterVal);
    },
    */
    getCaseUpdates : function(component, event) {
        const caseId = component.get("v.caseId");
        
        // creating action for backend
        const action = component.get("c.fetchAllCurrentCaseActivities");
        action.setParams({ caseId : caseId });
        component.set("v.isSpinner", true);
        action.setCallback(this, (response)=> {
            component.set("v.isSpinner", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                const data = response.getReturnValue();
                component.set("v.caseUpdatesList", this.formatResponse(data));
                this.onSortOrderChange(component, event);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);        
    },
    doRefresh: function(component, event) {
        this.getCaseUpdates(component, event);
    },
    formatResponse: function(response) {
        //debugger;
        let mockList = [];
        response.forEach((interaction)=>{
            const genericObj = {
                id: interaction.interactionId,
                title : `${interaction.advisor} (${interaction.jobRole})`,
                date : new Date(interaction.dateCreated)
            }
            
            
            // interactions
            let type, invisualObj;
            switch(interaction.channel) {
                case "Email":             
                    type = "EMAIL";
                    invisualObj = {
                        type,
                        description : `${ interaction.contactDirection == "Outbound" ? 'Sent' : 'Received'} email. `,
                        subject : interaction.subject,
                        body : interaction.emailDesc,
                        notes : this.getNotes(interaction),
                        actions : this.getActions(interaction, type),
                        attachments : interaction.emailAttachments.map((attachment)=> {
                            return {
                                date : new Date(interaction.dateCreated),
                                details : attachment
                            }
                        })
                    }
                    mockList.push(Object.assign({}, genericObj, invisualObj));
                    break;
                case "Chat" :
                    type = "CHAT";
                    invisualObj = {
                        type,
                        description : interaction.subject,
                        notes : this.getNotes(interaction),
                        actions : this.getActions(interaction, type),
                        attachments : this.getAttachments(interaction)
                    }
                    mockList.push(Object.assign({}, genericObj, invisualObj));                
            }             
            
            // actions 
            switch(interaction.action) {
                case "CaseCreation" :
                    mockList.push(
                        Object.assign({}, genericObj, {                       
                            type : "CASE_CREATE",
                            title : "Player",
                            description : "Case Created",
                            date : new Date(new Date(interaction.dateCreated).setSeconds(new Date(interaction.dateCreated).getSeconds()-1))
                        })
                    );
                    break;
                case "CaseResume" :
                    mockList.push(
                        Object.assign({}, genericObj, {                                               
                            type : "CASE_RESUME",
                            title : "Player",
                            description : "Resumed the Case",
                            subject : interaction.subject,
                            attachments : interaction.emailAttachments.map((attachment)=> {
                                return {
                                    date : new Date(interaction.dateCreated),
                                    details : attachment
                                }
                            }).concat(this.getAttachments(interaction)),
                            date : new Date(new Date(interaction.dateCreated).setSeconds(new Date(interaction.dateCreated).getSeconds()-1))
                        })                
                    )    
            }

            // attachements
            mockList.push(
                Object.assign({}, genericObj, {                                
                    type : "ATTACHMENT",
                    title : "Player",
                    description : `Attached document(s)`,
                    attachments : this.getAttachments(interaction)
                })
            )
            
            // notes
            mockList.push(
                Object.assign({}, genericObj, {                                
                    type : "NOTE",                
                    description : "Note added",                
                    notes : this.getNotes(interaction),
                    actions : this.getActions(interaction)
                })
            );
        })
        return mockList;
    },
    getNotes : function(interaction) {
        // Advisior notes       
        const caseNoteAdditionEvents = interaction.events.filter((e)=> e.eventCategory == "CaseNoteAddition");
        const noteList = caseNoteAdditionEvents.map((event)=>{
            return {
                date : new Date(event.dateCreated),
                label : event.eventNote
            }
        })
        return noteList;        
    },
    getActions : function(interaction, type) {
        const actionList = [];
        if(type == "EMAIL"){
            actionList.push({
                date : new Date(interaction.dateCreated),
                label : `Email ${ interaction.contactDirection == "Outbound" ? 'from' : 'to'} ${interaction.emailTo}`
            })    
        }
        
        if(type == "CHAT"){
            actionList.push({
                date : new Date(interaction.dateCreated),
                label : `Chatted with player. `
            })    
        }
        
        interaction.events.forEach((event)=> {
            const obj = {
                date : new Date(event.dateCreated)
            }
            switch (event.eventCategory) {
                case "CaseNoteAddition":
                    actionList.push(Object.assign({}, obj, {
                        label : "Note Added"
                    }))
                    break;
                case "StatusUpdate":
                    actionList.push(Object.assign({}, obj, {
                        label : `Changed case status to <b>${event.newValue}</b>`
                    }))
                    break;
                case "Attachment":
                    actionList.push(Object.assign({}, obj, {
                        label : `Attachment added by ${ event.initiatedBy == "Advisor" ? 'advisor' : 'player' }.`
                    }))
                    break;
                case "Grant":
                    actionList.push(Object.assign({}, obj, {
                        label : `Granted ${event.fieldName.toLowerCase()} - <b>${event.newValue}</b>`
                    }))
                    break;
            }
        });
        return actionList;
    },
    getAttachments : function(interaction) {
        //Activity: ATTACHMENT
        const attachmentEvents = interaction.events.filter((e)=> e.eventCategory == "Attachment");
        const attachmentList = attachmentEvents.map((event)=> {
            return {
                date : new Date(event.dateCreated),
                details : event.eventAttachment
            }
        });
        return attachmentList;
    },
    // TODO: delete formatResponse_old method
    formatResponse_old: function(response) {

        let mockList = [];

        response.forEach((data)=>{
            let actions = [];
            
            // Activity: CASE_CREATE 
            if(data.action == 'CaseCreation') {
                mockList.unshift({
                    id: data.interactionId,
                    type : "CASE_CREATE",
                    title : "Player",
                    description : "Case Created",
                    date : new Date(data.dateCreated).setSeconds(new Date(data.dateCreated).getSeconds()-1)
                })
            }
            // Activity: CASE_RESUME
            if(data.action == 'CaseResume') {
                mockList.unshift({
                    id: data.interactionId,
                    type : "CASE_RESUME",
                    title : "Player",
                    description : "Resumed the Case",
                    subject : data.subject,                    
                    attachement : { 
                        list : data.emailAttachments
                    },
                    date : new Date(data.dateCreated).setSeconds(new Date(data.dateCreated).getSeconds()-1)
                })
            }

            
            // Activity: Email 
            if(data.channel == "Email") {
                const statusUpdateEvent = data.events.find((e)=> e.eventCategory == "StatusUpdate");
                const statusText = statusUpdateEvent.newValue || "New";

                const obj = {
                    id: data.interactionId,
                    type : "EMAIL",
                    title : `${data.advisor} (${data.jobRole})`,
                    description : `${ data.contactDirection == "Outbound" ? 'Sent' : 'Received'} email. `,
                    date : new Date(data.dateCreated),              
                    
                    subject : data.subject,
                    body : data.emailDesc,
                    attachement : { 
                        list : data.emailAttachments,
                        date : new Date(data.dateCreated)
                    },              
                    note : {
                        text : "",
                        actions : []
                    }                 
                }

                if(statusText) {
                    obj.description += `Case status changed to ${statusText}`;
                    obj.note.actions.push({ label  : `Changed case status to <b>${statusText}</b>`}); 
                }


                // Advisior notes
                const caseNoteAdditionEvent = data.events.find((e)=> e.eventCategory == "CaseNoteAddition");
                obj.note.text = caseNoteAdditionEvent.eventNote;
                
                    
                // Advisor actions
                obj.note.actions.push({ label  : "Email to Player."});
                    
                if(caseNoteAdditionEvent.length !=0){
                    obj.note.actions.push({ label  :"Added note."});    
                }               
                
                
                mockList.unshift(obj);
            }            
            
            // Activity: Chat
            if(data.channel == 'Chat') {
                const caseNoteAdditionEvent = data.events.find((e)=> e.eventCategory == "CaseNoteAddition");
                const eventNote = caseNoteAdditionEvent.eventNote;

                mockList.unshift({
                    id: data.interactionId,
                    type : "CHAT",
                    title : `${data.advisor} (${data.jobrole})`,
                              description : `Chatted with player for ${data.subject}`,
                    date : new Date(data.dateCreated),                    
                    
                    note : {
                        text : eventNote,
                        actions : [{
                            label : "Changed case status to Waiting on customer"
                        }]
                    }                    
                })
            }
            
            //Activity: NOTE
            const caseNoteAdditionEvents = data.events.filter((e)=> e.eventCategory == "CaseNoteAddition");

            caseNoteAdditionEvents.forEach((caseNoteAdditionEvent)=> {               
                    mockList.unshift({
                        id: data.interactionId,
                        type : "NOTE",
                        title : `${data.advisor} (${data.jobRole})`,
                        description : "Note added",
                        date : new Date(caseNoteAdditionEvent.dateCreated),
                
                        text : caseNoteAdditionEvent.eventNote,
                        actions : [{
                                label : "Note Added"
                        }]                        
                    });               
            });
            
            //Activity: ATTACHMENT
            const attachmentEvents = data.events.filter((e)=> e.eventCategory == "Attachment");

            attachmentEvents.forEach((attachmentEvent)=> {
                const attachments = attachmentEvent.eventAttachment;
                if(attachments.length != 0) {
                    mockList.unshift({
                        id: data.interactionId,
                        type : "ATTACHMENT",
                        title : "Player",
                        description : "Attached document(s)",
                        date : new Date(attachmentEvent.dateCreated),
                        list : [].concat(attachments)
                    });
                }
            });
        })

        return mockList;
    },
    
    onSortOrderChange : function(component, event) {
        const order = component.get("v.sortOrder");
        const list = component.get("v.caseUpdatesList");
        list.sort(function(a,b) {
            return order == "ASC" ?  new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        });
        component.set("v.caseUpdatesList", list);
    },
    
})