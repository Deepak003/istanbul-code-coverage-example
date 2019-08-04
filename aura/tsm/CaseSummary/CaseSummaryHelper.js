({
    getCaseUpdates : function(component, event) {
        let caseId = component.get("v.case").pk,
            spinner = component.find("spinner");
        
        console.log('caseId: ', caseId);
        
        //TODO : remove this hardcoded value
        //caseId = "5006C000001BIsvQAG";
        
        // creating action for backend
        const action = component.get("c.fetchAllCurrentCaseActivities");
        action.setParams({ caseId : caseId });
        $A.util.toggleClass(spinner, "slds-hide");
        action.setCallback(this, function(response) {
            const state = response.getState();
            $A.util.toggleClass(spinner, "slds-hide");            
            if (state === "SUCCESS") {
                const data = response.getReturnValue();
                component.set("v.caseUpdatesList", this.formatResponse(data));
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);        
    },
    formatResponse : function (response) {
        let list = [];
        
        
        response.forEach(function(interaction){
            let links = [];
            let actions = [];
            
            const statusUpdateEvent = interaction.events.find((e)=> e.eventCategory == "StatusUpdate");
            const statusText = statusUpdateEvent.newValue;
            
            const caseNoteAdditionEvent = interaction.events.find((e)=> e.eventCategory == "CaseNoteAddition");
            const eventNote = caseNoteAdditionEvent.eventNote;
            
            
            const attachmentEvents = interaction.events.filter((e)=> e.eventCategory == "Attachment");            
            const attachmentNumber = attachmentEvents.length;
            
            
            if(attachmentNumber) {
                const urls = JSON.stringify( attachmentEvents.map(function(e){
                    return {
                        id : e.eventAttachment ? e.eventAttachment.attachmendId : '',
                        workspaceUrl : e.eventAttachment ? e.eventAttachment.workspaceUrl : '',
                        name : e.eventAttachment ? e.eventAttachment.label : ''
                    }
                }));
                
                links.push({
                    label : `Attachments (${attachmentNumber})`,
                    type : 'ATTACHMENT',
                    urls : urls
                })
                actions.push(`Added ${attachmentNumber} attachment`);
            }
            
            if(interaction.channel == "Email") {
                links.push({
                    label : `Email sent`
                })
                actions.push(`${ interaction.contactDirection == "Outbound" ? 'Sent' : 'Received'} email`);
            }
            
            if(interaction.channel == "Chat") {
                links.push({
                    label : `message sent to player`
                })
                actions.push(`Chatted with Player`);
            }
            
            let obj = {
                date : new Date(interaction.dateCreated),
                caseAction : statusText || 'New',
                advisorName : interaction.advisor,
                note : {
                    title : eventNote,
                    actions : actions
                },
                links : links
            };
            
            list.push(obj);
        })
        
        return list;        
    },
    onLinkClick : function(component, event) {
        const urls = JSON.parse(event.currentTarget.dataset.urls);
        urls.forEach((url)=> this.openTab(component, url) );
    },
    openTab : function(component, url) {
        const workspaceAPI = component.find("workspace");
        const href = url.workspaceUrl;
        //href = "/servlet/servlet.FileDownload?file=" + url.id;
        console.log('href : ', href);
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                url: href,
                active: true,
                tabLabel: url.name,
                id: null,
                callback: function(){},
                name: url.name
            });         
        })
        .catch(function(error) {
            console.log(error);
        });
        
        
        /*
       workspaceAPI.getFocusedTabInfo().then(function(response) {
             workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                url: href,
                active: true
            });
         
       })
       .catch(function(error) {
            console.log(error);
        });
        
        //set sub tab name and icon
        setTimeout(function(){
           workspaceAPI.getFocusedTabInfo().then(function(response) {
               console.log(response);
                workspaceAPI.setTabLabel({
                    tabId: response.tabId,
                    label: url.name
                });
               workspaceAPI.setTabIcon({
                    tabId: response.tabId,
                    icon: "doctype:attachment",
                    iconAlt: ""
               });
           }).catch(function(error) {
                console.log(error);
           });
       }, 1000);
       */
    }
})