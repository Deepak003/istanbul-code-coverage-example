({
	getAllEvents : function(component, event) {
        //commented as not able to commit a case , as it is throwing exception
        var caseEventAction = component.get('c.getAllEventsForCase'),
            caseId = component.get('v.caseId'),
            caseEvtSpinner = component.find('caseEvtSpinner');
        
        $A.util.removeClass(caseEvtSpinner, 'slds-hide');
        caseEventAction.setParams({'caseId': caseId});
		//CallBack of the func
        caseEventAction.setCallback(this, function(response) {
            var state = response.getState(),
                evntsVal = response.getReturnValue(),
                lastEvent = '',
                eventsLength = 0,
                caseStatus = component.get('v.caseStatus'),
                eventList = [],
                eventObj = {};
            if (typeof evntsVal !== 'object') {
                evntsVal = JSON.parse(evntsVal);
            }  
            $A.util.addClass(caseEvtSpinner, 'slds-hide');
            eventsLength = evntsVal.length;
            if (state === "SUCCESS") {
                component.set('v.lastActionLength', eventsLength);                
                //eventList.sort(this.sortByField('caseInteraction.Id'));
                for(var item of evntsVal) { 
                   eventObj = {};                   
                	if (item.caseInteraction.Action__c && item.caseInteraction.Action__c.toLowerCase() === 'casecreation'
                       && item.caseInteraction.Source__c && item.caseInteraction.Source__c.toLowerCase() === 'customer' 
                       && item.caseInteraction.Status_In__c && item.caseInteraction.Status_In__c.toLowerCase() === 'new') {
                        eventObj.type = 'Customer Created Case';
                        eventObj.action = 'Case created';
                        eventObj.channel = "[FPO] In-game ToS Report";
                        eventObj.msgText = "Message from Player";
                        if (item.caseInteraction.Case__r && item.caseInteraction.Case__r.Description) {
                            eventObj.msgTextVal = item.caseInteraction.Case__r.Description;
                        }
                        eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteraction.CreatedDate, "MMM/dd/yyyy hh:mma z");
                        eventObj.sortDate = item.caseInteraction.CreatedDate;
                        if (evntsVal.length == 1 && item.eventList && item.eventList.length) {
                            eventList.push(eventObj);
                            eventObj = {};
                        }                       
                   	}                    
                    if (item.eventList && item.eventList.length) {                        
                        for(var eItemList of item.eventList) {
                            //StatusUpdate
                            if (eItemList.strEventCategory.toLowerCase() == 'statusupdate' && eItemList.caseEventDetailList) {
                                eventObj.caseStatus = eItemList.caseEventDetailList[0].strNewValue;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'casenoteaddition') {
                                eventObj.caseNote = eItemList.strEventNote;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'accountnoteaddition') {
                                eventObj.accNote = eItemList.strEventNote;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'hide') {
                                eventObj.contentAction = 'Hide';
                                eventObj.contentActionComment = eItemList.strReason;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'unhide') {
                                eventObj.contentAction = 'Un Hide';
                                eventObj.contentActionComment = eItemList.strReason;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'ban') {
                                eventObj.accActionLabel = 'Account Action(s)';
                                if (eItemList.accountEventDetailList && eItemList.accountEventDetailList.length) {
                                    var accEvtVal =[];
                                    for(var accEventItem of eItemList.accountEventDetailList) {
                                        if (accEventItem.strNewValue) {
                                            accEvtVal.push(accEventItem.strEventFieldName + ' ' + accEventItem.strNewValue + ' '+ eItemList.strEventCategory + ' Success.');
                                        }
                                        else {
                                            accEvtVal.push('<span class="slds-theme_error">' +eItemList.strRelatedEvent + ' ' + accEventItem.strEventFieldName + ' '+ eItemList.strEventCategory + ' Failed.'+'</span>');
                                        }
                                    }
                                }
                                eventObj.accActionVal =  accEvtVal.join('<br />');
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'majorstrike') {
                                var msval = '';
                                if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                    msval = eItemList.tosPrePenaltyList[0].majorStrikesNum;
                                }
                                eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Major Strike applied';
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'minorstrike') {
                                var msval = '';
                                if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                    msval = eItemList.tosPrePenaltyList[0].minorStrikesNum;
                                }
                                eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Minor Strike applied';
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'outbound-email') {
                                if(eItemList.outboundEmail && eItemList.outboundEmail['ConsolidatedOutboundMessage__c']) {
                                    eventObj.msgTextVal = eItemList.outboundEmail['ConsolidatedOutboundMessage__c'];
                                }
                            }
                            
                        }
                        if (eventObj.caseStatus) {
                            if (eventObj.caseStatus.toLowerCase() === 'resolved') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Resolved - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }
                            else if(eventObj.caseStatus.toLowerCase() === 'escalated') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Escalate - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }
                            else if(eventObj.caseStatus.toLowerCase() === 'transferred') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Transfer - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }                            
                        }
                    }
                    if (Object.keys(eventObj).length && eventObj.action) {
                        if (eventObj.action != 'Case created') {
                            eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteraction.LastModifiedDate, "MMM/dd/yyyy hh:mma z");
                            eventObj.sortDate = item.caseInteraction.LastModifiedDate;
                        }                       
                       if (item.caseInteraction.Advisor__r && eventObj.action != 'Case created') {
                            eventObj.advisor = item.caseInteraction.Advisor__r.Name;
                        }
                        eventList.push(eventObj);
                   } 
                }
                if (eventList && eventList.length) {
                    eventList.sort(this.sortByField('sortDate', 'desc'));
                    component.set('v.caseActions', eventList);                    
                }
                console.log("Success with state: " + state);                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(caseEventAction);
	},
    //Sorting by Objects val
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
    getTranscripts: function (component) {
        var caseChatTransAction = component.get('c.getChatTranscriptForCCase'),
            caseId = component.get('v.caseId'),
            chatTranscript = false,
            caseEvtSpinner = component.find('caseEvtSpinner');
        //TODO: Remove the harcode val
        //caseId = '5001g000004rFEo';
        $A.util.removeClass(caseEvtSpinner, 'slds-hide');
        caseChatTransAction.setParams({'strCaseId': caseId, 'strCaseNumber': null});
        //CallBack of the func
        caseChatTransAction.setCallback(this, function(response) {
            var state = response.getState(),
                transcriptVals = response.getReturnValue(),
                eventList = [],
                eventObj = {};
            
            if (state === "SUCCESS") {
                if (typeof transcriptVals !== 'object') {
                    transcriptVals = JSON.parse(transcriptVals);
                }            
                $A.util.addClass(caseEvtSpinner, 'slds-hide');
                if (transcriptVals.response && transcriptVals.response.length) {
                    chatTranscript = true;
                    var chatLines = transcriptVals.response[0].chat.lines,
                        chatTransArr = [];
                    for(var cItem of chatLines) {
                        if (cItem.messageBy != "info") {
                            chatTransArr.push(cItem);
                        }
                    }                
                    component.set('v.chatTransArr', chatTransArr);
                }
                component.set('v.chatTranscript', chatTranscript);
            }
            else {
                console.log('Error on Chat Transcript.');
            }            
        });
        $A.enqueueAction(caseChatTransAction);
    },
    getArchivedDetailsCase: function(component) {
        var caseArchvDetailAction = component.get('c.getCaseCommunications'),
            caseId = component.get('v.caseId'),
            chatTranscript = false,
            caseEvtSpinner = component.find('caseEvtSpinner'),
            caseType = component.get('v.caseType');
        
        //getCaseCommunications(string strCaseId, string strRecordType)
        //caseId = '500E000000B2WqoIAF';
        $A.util.removeClass(caseEvtSpinner, 'slds-hide');
        caseArchvDetailAction.setParams({'strCaseId': caseId, 'strRecordType': caseType});
        //CallBack of the func
        caseArchvDetailAction.setCallback(this, function(response) {
            var state = response.getState(),
                eventsVals = response.getReturnValue(),
                eventList = [],
                eventObj = {},
                evItem = '',
                itemDisplay = '',
                emailContent = '';
            $A.util.addClass(caseEvtSpinner, 'slds-hide');
            if (state === "SUCCESS") {
                for(evItem of eventsVals) { 
                    itemDisplay = '',
                    emailContent = '';
                    
                    if (evItem.emailContent) {
                        var regEx = new RegExp("\n", "g");
                        emailContent = evItem.emailContent.replace(regEx, '<br />');
                        regEx = new RegExp("<br>", "g");
                        emailContent = emailContent.replace(regEx, '<br />');
                    }
                    else if(evItem.htmlBody){
                        var regEx = new RegExp("\n", "g");
                        emailContent = evItem.htmlBody.replace(regEx, '<br />');
                        regEx = new RegExp("<br>", "g");
                        emailContent = emailContent.replace(regEx, '<br />');
                    }                    
                    if (evItem.isPublished != undefined && evItem.isPublished.toLowerCase() == 'n') {
                        itemDisplay += '<b>Internal Notes:</b>';
                        itemDisplay += '<div class="thor-white-space">Case Notes: '+evItem.caseNotes+'</div>';
                        itemDisplay += '<div>Created By: '+(evItem.createdByName ? evItem.createdByName : evItem.createdById)+'</div>';
                        itemDisplay += '<div>Created Date: '+$A.localizationService.formatDateTimeUTC(evItem.createdDate, "MMM/dd/yyyy hh:mma z")+'</div>';
                    }
                    if (evItem.isPublished != undefined && evItem.isPublished.toLowerCase() == 'y') {
                        itemDisplay += '<b>Case Notes:</b>';
                        itemDisplay += '<div class="thor-white-space">Case Notes: '+evItem.caseNotes+'</div>';
                        itemDisplay += '<div>Created By: '+(evItem.createdByName ? evItem.createdByName : evItem.createdById)+'</div>';
                        itemDisplay += '<div>Created Date: '+$A.localizationService.formatDateTimeUTC(evItem.createdDate, "MMM/dd/yyyy hh:mma z")+'</div>';
                    }
                    if (evItem.isInbound != undefined && !evItem.isInbound && evItem.status != undefined && evItem.toAddress === undefined) {
                        itemDisplay += '<b>Case Status:</b>';
                        itemDisplay += '<div>Case Origin: '+evItem.caseOrigin+'</div>';
                        itemDisplay += '<div>Status: '+evItem.status+'</div>';                        
                    }
                    if (evItem.isInbound != undefined && !evItem.isInbound && evItem.toAddress != undefined) {
                        itemDisplay += '<b>Outbound Email:</b>';                        
                        itemDisplay += '<div>Advisor Name: '+(evItem.createdByName ? evItem.createdByName : evItem.createdById ? evItem.createdById: '')+'</div>';
                        itemDisplay += '<div>Created Date: '+$A.localizationService.formatDateTimeUTC(evItem.createdDate, "MMM/dd/yyyy hh:mma z")+'</div>';
                        itemDisplay += '<div>Email Subject: '+evItem.subject+'</div>';
                        itemDisplay += '<div class="thor-white-space">Email Text: '+(emailContent?emailContent:'')+'</div>';
                    }
                    if (evItem.isInbound != undefined && evItem.isInbound && evItem.fromAddress != undefined) {
                        itemDisplay += '<b>Inbound Email:</b>';                        
                        itemDisplay += '<div>Customer Email: '+evItem.fromAddress+'</div>';
                        itemDisplay += '<div>Created Date: '+$A.localizationService.formatDateTimeUTC(evItem.createdDate, "MMM/dd/yyyy hh:mma z")+'</div>';
                        itemDisplay += '<div>Email Subject: '+evItem.subject+'</div>';
                        itemDisplay += '<div class="thor-white-space">Email Text: '+(emailContent?emailContent:'')+'</div>';
                    }
                   	eventList.push(itemDisplay);
                }
                if (eventList && eventList.length) {
                    //eventList.sort(this.sortByField('sortDate', 'desc'));
                    component.set('v.showRawDataFlg', true);    
                    component.set('v.showRawData', eventList.join('<br />'));                    
                }
                else {
                    component.set('v.showRawDataFlg', false);  
                }
            }
            else {
                console.log('Error on events from Omni for archived case ' + caseId);
            }
        });
        $A.enqueueAction(caseArchvDetailAction);
    },
    getEventsOmnicron : function(component) {
        var caseEventAction = component.get('c.getAllEventsForCaseOmicron'),
            caseId = component.get('v.caseId'),
            caseEvtSpinner = component.find('caseEvtSpinner'),
            strDescription = component.get('v.strDescription'),
            strSubject = component.get('v.strSubject');
        
        $A.util.removeClass(caseEvtSpinner, 'slds-hide');
        caseEventAction.setParams({'caseId': caseId, 'strSubject': strSubject,
                                   'strDescription': strDescription, 'strReason': ' '});
		//CallBack of the func
        caseEventAction.setCallback(this, function(response) {
            var state = response.getState(),
                eventsVals = response.getReturnValue(),            
            	lastEvent = '',
                eventsLength = 0,
                caseStatus = component.get('v.caseStatus'),
                eventList = [],
                eventObj = {};
            if (typeof eventsVals !== 'object') {
                eventsVals = JSON.parse(eventsVals);
            }  
            $A.util.addClass(caseEvtSpinner, 'slds-hide');
            eventsLength = eventsVals.length;
            if (state === "SUCCESS") {
                component.set('v.lastActionLength', eventsLength);                
                //eventList.sort(this.sortByField('caseInteraction.Id'));
                for(var item of eventsVals) { 
                   eventObj = {};  
                    if(!item.caseInteraction && item.caseInteractionFromOmicron) {
                        //item.caseInteractionFromOmicron
                        if (item.caseInteractionFromOmicron.strAction && item.caseInteractionFromOmicron.strAction.toLowerCase() ==='casecreation'
                           && item.caseInteractionFromOmicron.strSource && item.caseInteractionFromOmicron.strSource.toLowerCase() === 'customer'
                           && item.caseInteractionFromOmicron.strStatusIn && item.caseInteractionFromOmicron.strStatusIn.toLowerCase() === 'new' 
                           ) {
                            eventObj.type = 'Customer Created Case';
                            eventObj.action = 'Case created';
                            eventObj.channel = "[FPO] In-game ToS Report";
                            eventObj.msgText = "Message from Player";
                            if (item.caseInteractionFromOmicron.strCaseDescription) {
                                eventObj.msgTextVal = item.caseInteractionFromOmicron.strCaseDescription;
                            }
                            eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteractionFromOmicron.strCreatedDate, "MMM/dd/yyyy hh:mma z");
                            eventObj.sortDate = item.caseInteractionFromOmicron.strCreatedDate;
                            if (eventsVals.length == 1 && item.eventList && item.eventList.length) {
                                eventList.push(eventObj);
                                eventObj = {};
                            }                       
                        }
                        //StatusUpdate
                        if (item.caseInteractionFromOmicron.strStatusOut != item.caseInteractionFromOmicron.strStatusIn) {
                            eventObj.caseStatus = item.caseInteractionFromOmicron.strStatusOut;
                        }
                        if (item.eventList && item.eventList.length) {                        
                            for(var eItemList of item.eventList) {                                
                                if (eItemList.strEventCategory.toLowerCase() == 'casenoteaddition') {
                                    eventObj.caseNote = eItemList.strEventNote;
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'accountnoteaddition') {
                                    eventObj.accNote = eItemList.strEventNote;
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'hide') {
                                    eventObj.contentAction = 'Hide';
                                    eventObj.contentActionComment = eItemList.strReason;
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'unhide') {
                                    eventObj.contentAction = 'Un Hide';
                                    eventObj.contentActionComment = eItemList.strReason;
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'ban') {
                                    eventObj.accActionLabel = 'Account Action(s)';
                                    if (eItemList.accountEventDetailList && eItemList.accountEventDetailList.length) {
                                        var accEvtVal =[];
                                        for(var accEventItem of eItemList.accountEventDetailList) {
                                            if (accEventItem.strNewValue) {
                                                accEvtVal.push(accEventItem.strEventFieldName + ' ' + accEventItem.strNewValue + ' '+ eItemList.strEventCategory + ' Success.');
                                            }
                                            else {
                                                accEvtVal.push('<span class="slds-theme_error">' +eItemList.strRelatedEvent + ' ' + accEventItem.strEventFieldName + ' '+ eItemList.strEventCategory + ' Failed.'+'</span>');
                                            }
                                        }
                                    }
                                    eventObj.accActionVal =  accEvtVal.join('<br />');
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'majorstrike') {
                                    var msval = '';
                                    if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                        msval = eItemList.tosPrePenaltyList[0].majorStrikesNum;
                                    }
                                    eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Major Strike applied';
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'minorstrike') {
                                    var msval = '';
                                    if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                        msval = eItemList.tosPrePenaltyList[0].minorStrikesNum;
                                    }
                                    eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Minor Strike applied';
                                }
                                if (eItemList.strEventCategory.toLowerCase() == 'outbound-email') {
                                    if(eItemList.outboundEmail && eItemList.outboundEmail['ConsolidatedOutboundMessage__c']) {
                                        eventObj.msgTextVal = eItemList.outboundEmail['ConsolidatedOutboundMessage__c'];
                                    }
                                }
                                
                            }
                            if (eventObj.caseStatus) {
                                if (eventObj.caseStatus.toLowerCase() === 'resolved') {
                                   eventObj.type = 'WWCE Tos Resolution';
                                   eventObj.action = 'Resolved - ' + (item.caseInteractionFromOmicron.strCaseReason ? item.caseInteractionFromOmicron.strCaseReason : '');
                                   eventObj.channel = item.caseInteractionFromOmicron.strChannel;
                                   eventObj.msgText = "Email Message Sent to Player";
                                }
                                else if(eventObj.caseStatus.toLowerCase() === 'escalated') {
                                   eventObj.type = 'WWCE Tos Resolution';
                                   eventObj.action = 'Escalate - ' + (item.caseInteractionFromOmicron.strCaseReason ? item.caseInteractionFromOmicron.strCaseReason : '');
                                   eventObj.channel = item.caseInteractionFromOmicron.strChannel;
                                   eventObj.msgText = "Email Message Sent to Player";
                                }
                                else if(eventObj.caseStatus.toLowerCase() === 'transferred') {
                                   eventObj.type = 'WWCE Tos Resolution';
                                   eventObj.action = 'Transfer - ' + (item.caseInteractionFromOmicron.strCaseReason ? item.caseInteractionFromOmicron.strCaseReason : '');
                                   eventObj.channel = item.caseInteractionFromOmicron.strChannel;
                                   eventObj.msgText = "Email Message Sent to Player";
                                }                            
                            }
                        }
                    }
                    if (item.caseInteraction) {
                	if (item.caseInteraction.Action__c && item.caseInteraction.Action__c.toLowerCase() === 'casecreation'
                       && item.caseInteraction.Source__c && item.caseInteraction.Source__c.toLowerCase() === 'customer' 
                       && item.caseInteraction.Status_In__c && item.caseInteraction.Status_In__c.toLowerCase() === 'new') {
                        eventObj.type = 'Customer Created Case';
                        eventObj.action = 'Case created';
                        eventObj.channel = "[FPO] In-game ToS Report";
                        eventObj.msgText = "Message from Player";
                        if (item.caseInteraction.Case__r && item.caseInteraction.Case__r.Description) {
                            eventObj.msgTextVal = item.caseInteraction.Case__r.Description;
                        }
                        eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteraction.CreatedDate, "MMM/dd/yyyy hh:mma z");
                        eventObj.sortDate = item.caseInteraction.CreatedDate;
                        if (eventsVals.length == 1 && item.eventList && item.eventList.length) {
                            eventList.push(eventObj);
                            eventObj = {};
                        }                       
                   	}                    
                    if (item.eventList && item.eventList.length) {                        
                        for(var eItemList of item.eventList) {
                            //StatusUpdate
                            if (eItemList.strEventCategory.toLowerCase() == 'statusupdate' && eItemList.caseEventDetailList) {
                                eventObj.caseStatus = eItemList.caseEventDetailList[0].strNewValue;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'casenoteaddition') {
                                eventObj.caseNote = eItemList.strEventNote;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'accountnoteaddition') {
                                eventObj.accNote = eItemList.strEventNote;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'hide') {
                                eventObj.contentAction = 'Hide';
                                eventObj.contentActionComment = eItemList.strReason;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'unhide') {
                                eventObj.contentAction = 'Un Hide';
                                eventObj.contentActionComment = eItemList.strReason;
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'ban') {
                                eventObj.accActionLabel = 'Account Action(s)';
                                if (eItemList.accountEventDetailList && eItemList.accountEventDetailList.length) {
                                    var accEvtVal =[];
                                    for(var accEventItem of eItemList.accountEventDetailList) {
                                        if (accEventItem.strNewValue) {
                                            accEvtVal.push(accEventItem.strEventFieldName + ' ' + accEventItem.strNewValue + ' '+ eItemList.strEventCategory + ' Success.');
                                        }
                                        else {
                                            accEvtVal.push('<span class="slds-theme_error">' +eItemList.strRelatedEvent + ' ' + accEventItem.strEventFieldName + ' '+ eItemList.strEventCategory + ' Failed.'+'</span>');
                                        }
                                    }
                                }
                                eventObj.accActionVal =  accEvtVal.join('<br />');
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'majorstrike') {
                                var msval = '';
                                if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                    msval = eItemList.tosPrePenaltyList[0].majorStrikesNum;
                                }
                                eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Major Strike applied';
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'minorstrike') {
                                var msval = '';
                                if(eItemList.tosPrePenaltyList && eItemList.tosPrePenaltyList[0]) {
                                    msval = eItemList.tosPrePenaltyList[0].minorStrikesNum;
                                }
                                eventObj.accActionVal = eventObj.accActionVal +'<br />'+ msval+' Minor Strike applied';
                            }
                            if (eItemList.strEventCategory.toLowerCase() == 'outbound-email') {
                                if(eItemList.outboundEmail && eItemList.outboundEmail['ConsolidatedOutboundMessage__c']) {
                                    eventObj.msgTextVal = eItemList.outboundEmail['ConsolidatedOutboundMessage__c'];
                                }
                            }
                            
                        }
                        if (eventObj.caseStatus) {
                            if (eventObj.caseStatus.toLowerCase() === 'resolved') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Resolved - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }
                            else if(eventObj.caseStatus.toLowerCase() === 'escalated') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Escalate - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }
                            else if(eventObj.caseStatus.toLowerCase() === 'transferred') {
                               eventObj.type = 'WWCE Tos Resolution';
                               eventObj.action = 'Transfer - ' + (item.caseInteraction.Case__r ? item.caseInteraction.Case__r.Reason : '');
                               eventObj.channel = item.caseInteraction.Channel__c;
                               eventObj.msgText = "Email Message Sent to Player";
                            }                            
                        }
                    }
                    }
                    if (Object.keys(eventObj).length && eventObj.action) {
                        if (eventObj.action != 'Case created') {
                            if (item.caseInteraction) {
                                eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteraction.LastModifiedDate, "MMM/dd/yyyy hh:mma z");
                            	eventObj.sortDate = item.caseInteraction.LastModifiedDate;
                            }
                            if (item.caseInteractionFromOmicron) {
                                eventObj.createdDate = $A.localizationService.formatDateTimeUTC(item.caseInteractionFromOmicron.strLastModifiedDate, "MMM/dd/yyyy hh:mma z");
                            	eventObj.sortDate = item.caseInteractionFromOmicron.strLastModifiedDate;
                            }
                        }                       
                        if (item.caseInteraction && item.caseInteraction.Advisor__r && eventObj.action != 'Case created') {
                            eventObj.advisor = item.caseInteraction.Advisor__r.Name;
                        }
                        if (item.caseInteractionFromOmicron && item.caseInteractionFromOmicron.strLastModifiedByName && eventObj.action != 'Case created') {
                            eventObj.advisor = item.caseInteractionFromOmicron.strLastModifiedByName;
                        }
                        eventList.push(eventObj);
                   } 
                }
                if (eventList && eventList.length) {
                    eventList.sort(this.sortByField('sortDate', 'desc'));
                    component.set('v.caseActions', eventList);                 
                }
                console.log("Success with state: " + state);                
            }
            else {
                console.log("Failed with state: " + state);
            }
            
        });
        $A.enqueueAction(caseEventAction);
    }
})