({
    // TODO: moved to CaseActivityHelper
    /*
    getCaseUpdates : function(component, event) {
        const caseId = component.get("v.caseId"),
            spinner = component.find("spinner");
        
        // creating action for backend
        const action = component.get("c.fetchAllCurrentCaseActivities");
        action.setParams({ caseId : caseId });
        $A.util.toggleClass(spinner, "slds-hide");
        action.setCallback(this, (response)=> {
            const state = response.getState();
            $A.util.toggleClass(spinner, "slds-hide");            
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

        return false;
        


        const response = 
        [
            {
                "interactionId": "789231478921389",
                "action": "CaseCreation",
                "advisor": "Tony Blair",
                "channel": "Chat",
                "contactdirection": "inbound",
                "jobrole": "Tier 1 Advisor",
                "source": "Customer",
                "subject": "4min 34seconds",
                "emailDesc": "Test Email Desc",
                "emailAttachments": [],
                "subchannel": "Chat",
                "dateCreated": "2017-08-24T09:54:20.000+0000",
                "events": [
                  {
                    "eventcategory": "Attachment",
                    "eventnote": "",
                    "eventtype": "CaseSupplimentary",
                    "initiatedby": "Advisor",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-08-24T09:55:20.000+0000",
                    "relatedevent": "Case",
                    "eventattachment": [
                      {
                        "label": "outboundemail.jpg",
                        "url": "/0686C0000009PkYQAU",
                        "type": "jpeg"
                      },
                      {
                        "label": "outboundemail.jpg",
                        "url": "/0686C0000009PkYQAU",
                        "type": "png"
                      }
                    ]
                  },
                  {
                    "eventcategory": "StatusUpdate",
                    "eventnote": "",
                    "eventtype": "CaseEdit",
                    "initiatedby": "Advisor",
                    "relatedevent": "Case",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-08-24T09:56:20.000+0000",
                    "eventattachment": []
                  },
                  {
                    "eventcategory": "CaseNoteAddition",
                    "eventnote": "Test Notes",
                    "eventtype": "CaseSupplimentary",
                    "initiatedby": "Advisor",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-08-24T09:57:20.000+0000",
                    "relatedevent": "Case",
                    "eventattachment": []
                  }
                ]
            },
            {
                "interactionId": "789231478921389",
                "action": "CaseResume",
                "advisor": "Tony Blair",
                "channel": "Email",
                "contactdirection": "Outbound",
                "jobrole": "Tier 1 Advisor",
                "source": "Advisor",
                "subject": "Test subject",
                "emailDesc": "Test Email Desc",
                "emailAttachments": [
                  {
                    "label": "outboundemail.jpg",
                    "url": "/0686C0000009PkYQAU",
                    "type": "png"
                  },
                  {
                    "label": "outboundemail.jpg",
                    "url": "/0686C0000009PkYQAU"
                  }
                ],
                "subchannel": "Email",
                "dateCreated": "2017-09-24T09:54:20.000+0000",
                "events": [
                  {
                    "eventcategory": "Attachment",
                    "eventnote": "",
                    "eventtype": "CaseSupplimentary",
                    "initiatedby": "Advisor",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-09-24T09:55:20.000+0000",
                    "relatedevent": "Case",
                    "eventattachment": [
                      {
                        "label": "outboundemail.jpg",
                        "url": "/0686C0000009PkYQAU",
                        "type": "png"
                      },
                      {
                        "label": "outboundemail.jpg",
                        "url": "/0686C0000009PkYQAU",
                        "type": "png"
                      }
                    ]
                  },
                  {
                    "eventcategory": "StatusUpdate",
                    "eventnote": "",
                    "eventtype": "CaseEdit",
                    "initiatedby": "Advisor",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-09-24T09:56:20.000+0000",
                    "relatedevent": "Case",
                    "eventattachment": []
                  },
                  {
                    "eventcategory": "CaseNoteAddition",
                    "eventnote": "Test Notes",
                    "eventtype": "CaseSupplimentary",
                    "initiatedby": "Advisor",
                    "relatedevent": "Case",
                    "oldValue": "",
                    "newValue": "",
                    "dateCreated": "2017-09-24T09:57:20.000+0000",
                    "eventattachment": []
                  }
                ]
            }
        ];
        

        if(caseCategory == 'ALL') {
            component.set("v.caseUpdatesList", this.formatResponse(response)); 
        }else {
            component.set("v.caseUpdatesList", this.formatResponse(response).filter((m)=>m.type==caseCategory));
        }
        
        this.onSortOrderChange(component, event);
    },
    formatResponse: function(response) {

        // Object.defineProperty(response, 'safeGet', {
        //   enumerable: false,
        //   writable: false,
        //   value: function(p) {
        //     if (!p) throw new Error('[safeGet] empty value!');
        //     return p.split('.').reduce((acc, k) => {
        //       if (acc && k in acc) return acc[k];
        //       return undefined;
        //     }, this);
        //   }
        // });

        let mockList = 
        [   
            {
                id: 1,
                type : "NOTE",
                title : "John Peterson (T1 Advisor)",
                description : "Note added and Case transfered to Queue 2",
                date : new Date().setDate(new Date().getDate()-1),
                advisor : {
                    note : "This is a placeholder note for what an advisor would custom input into their note when adding a case note.",
                    actions : ['Verified Account - Email to Joedoe@gmail.com', 'Reset Password', 'Edit SQA', 'Restored player - Messi89', 'Restored player - Ibrahomvic 72']
                }
            },{
                id: 2,
                type : "EMAIL",
                title : "John Peterson (T1 Advisor)",
                description : "Sent email - 1",
                date : new Date().setDate(new Date().getDate()-1),
                content : {
                    subject : "This is an example subject email line left by the player for a case",
                    description : "I will come from <span style=\"color:red;\">salesforce</span> backend server",
                    attachements : [
                        { label : 'Game purchase receipt.pdf', url : '' },
                        { label : 'DxDiag.txt', url : '' }
                    ]
                }            
            },{
                id: 3,
                type : "CHAT",
                title : "John Peterson (T1 Advisor)",
                description : "Chatted with player for 4min 34seconds",
                date : new Date().setDate(new Date().getDate()-1)
            },{
                id: 4,
                type : "ATTACHMENT",
                title : "Player",
                description : "Attached a new document",
                date : new Date().setDate(new Date().getDate()-2),
                contents : [
                    { label : 'Game purchase receipt.pdf', url : '' },
                    { label : 'DxDiag.txt', url : '' }
                ]
            },{
                id: 5,
                type : "NOTE",
                title : "Andrew Wood (T1 Advisor)",
                description : "Message sent to player and Note added. Case status changed to Waiting on customer.",
                date : new Date().setDate(new Date().getDate()-3),
                advisor : {
                    note : "This is a placeholder note for what an advisor would custom input into their note when adding a case note.",
                    actions : ['Verified Account - Email to Joedoe@gmail.com', 'Reset Password', 'Edit SQA', 'Restored player - Messi89', 'Restored player - Ibrahomvic 72']
                }
            },{
                id: 6,
                title : "Player",
                description : "Case Created",
                date : new Date().setDate(new Date().getDate()-4)
            }
        ];

        mockList = [];

        response.forEach((data)=>{
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
                const statusUpdateEvent = data.events.find((e)=> e.eventcategory == "StatusUpdate");
                const statusText = statusUpdateEvent.newValue;

                const caseNoteAdditionEvent = data.events.find((e)=> e.eventcategory == "CaseNoteAddition");
                const eventnote = caseNoteAdditionEvent.eventnote;

                mockList.unshift({
                    id: data.interactionId,
                    type : "EMAIL",
                    title : `${data.advisor} (${data.jobrole})`,
                    description : `${ data.contactdirection == "Outbound" ? 'Sent' : 'Received'} email. Case status changed to ${statusText}`,
                    date : new Date(data.dateCreated),                    
                    
                    subject : data.subject,
                    body : data.emailDesc,
                    attachement : { 
                        list : data.emailAttachments
                    },              
                    note : {
                        text : eventnote,
                        actions : [{
                            label : "Changed case status to Waiting on customer"
                        }]
                    }                    
                })
            }            
            // Activity: Chat
            if(data.channel == 'Chat') {
                const caseNoteAdditionEvent = data.events.find((e)=> e.eventcategory == "CaseNoteAddition");
                const eventnote = caseNoteAdditionEvent.eventnote;

                mockList.unshift({
                    id: data.interactionId,
                    type : "CHAT",
                    title : `${data.advisor} (${data.jobrole})`,
                              description : `Chatted with player for ${data.subject}`,
                    date : new Date(data.dateCreated),                    
                    
                    note : {
                        text : eventnote,
                        actions : [{
                            label : "Changed case status to Waiting on customer"
                        }]
                    }                    
                })
            }
            //Activity: ATTACHMENT
            const attachmentEvents = data.events.filter((e)=> e.eventcategory == "Attachment");

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
    getNextPage: function(component, event) {
         this.getCaseUpdates(component, event);
    },
    
    doRefresh: function(component, event) {
        this.getCaseUpdates(component, event);
    },
    */
    onSortOrderChange : function(component, event) {
        const order = component.get("v.sortOrder");
        const list = component.get("v.caseUpdatesList");
        list.sort(function(a,b) {
            return order == "ASC" ?  new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        });
        component.set("v.caseUpdatesList", list);
    },
    toggleState : function(component, event) {
        const items = component.get("v.caseUpdatesList"), 
            index = event.currentTarget.dataset.index;
        items[index].expanded = !items[index].expanded;
        component.set("v.caseUpdatesList", items);
    },
    toggleStateAll: function(component, event) {
        const items = component.get("v.caseUpdatesList");
        const currentState = event.getParam("isExpanded");
        items.forEach((item)=>{
            item.expanded = !currentState;
        });
            component.set("v.caseUpdatesList", items);
    },
    handleFilterChange: function(component, event) {
        component.set("v.sortOrder", event.getParam("type"));
    }             
})