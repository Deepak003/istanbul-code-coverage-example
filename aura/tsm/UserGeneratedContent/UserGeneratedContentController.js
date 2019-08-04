({
    init: function(component, event, helper) {
        /*var obj = {
            Petition_Details__r: {
                View_Url__c: [{userName: 'personaNameA', text: "This is what I say.", isHidden: false, dateTime:"1462579200" },
                              { userName: 'personaNameB', text: "NO, THIS is what I say.", isHidden: false, dateTime:"1462579400" },
                              { userName: 'personaNameA', text: "You no not what you speak of, I will report you.", isHidden: false, dateTime:"1462579600" }, 
                              { userName: 'personaNameA', text: "Here is a picture\n\r[http://unknowprovider.com/some/image/file]", isHidden: false, dateTime:"1462579800" },
                              { userName: 'personaNameB', text: "[http://unknowprovider.com/some/image/file]", isHidden: false , dateTime:"1462571100"}],
                Content_Type__c: 'Chat'
            }
        };*/
        //component.set('v.simpleCase', obj);
    },
	handleShowModal: function(component, event, helper) {
        var resourceURL = event.currentTarget.getAttribute('data-model'),
            modalBody = "",
            headerModal = "",
            footerModal = "",
            casePetitionData = component.get('v.simpleCase'),
            contentType = component.get('v.contentType'),
            isChat = component.get('v.isChat');
        var caseObj = component.get('v.simpleCase');
        if (isChat) {
            var dess = component.get('v.chatData').split("<br>");
        	//console.log('Des===='+dess);
            var vrDescription =[],
                petitionerId = '',
                targetId = '',
                arrChatItem = '',
                targetAccId = caseObj.Petition_Details__r && caseObj.Petition_Details__r.Target_Account__r ? caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c : '';
            for(var i=0;i<dess.length;i++){
                //console.log('string=='+i+'=='+dess[i]);
                
                if(dess[i]!=''){
                    if (dess[i].indexOf(':') >=0) {
                        arrChatItem = dess[i].split(':');
                        if (targetAccId && targetAccId.indexOf(arrChatItem[0]) >=0) {                            
                            targetId = arrChatItem[0];
                        }
                        else if(!petitionerId) {
                            petitionerId = arrChatItem[0];
                        }
                        if (petitionerId == arrChatItem[0]) {
                            vrDescription.push({'petitioner': arrChatItem[1]});
                        }
                        else {
                            vrDescription.push({'target': arrChatItem[1]});
                        }
                    }
                    //dess[i] = dess[i].substring(dess[i].indexOf(':')+1,dess[i].length);
             		//vrDescription.push(dess[i]);
                }
            }
            component.set('v.lstDescription',vrDescription);
            contentType = 'Text';
        }
        
        var imgcode = component.get('v.imageBaseData');
        
        $A.createComponents([
                ["c:ModalContent",{}],
                ["c:ModalHeader",{}],
            	["c:ModalFooter",{}]
            ], function(components, status) {
                if (status === "SUCCESS") {
                    modalBody = components[0];
                    headerModal = components[1];
                    footerModal = components[2];
                    modalBody.set('v.resourceURL', resourceURL);
                    modalBody.set('v.UGContent', casePetitionData);

                    modalBody.set('v.imageBaseData',imgcode);
                    modalBody.set('v.contentData', component.get('v.contentData'));
                    if (isChat) {
                    	modalBody.set('v.lstcontentData', vrDescription);
                    }
                    footerModal.set('v.UGContent', casePetitionData);                    
                    modalBody.set('v.contentDataType', contentType);
                    modalBody.set('v.contentType', 'UGContent');
                    footerModal.set('v.ContentType', contentType);
                    footerModal.set('v.isChat', isChat);                   
                    if (contentType=='chat') {
                        headerModal.set('v.headerText', "Reported Chatlog");
                        headerModal.set('v.headerSummary', "Select messages that violate EA's Rules and click Violation confirmed to add it to notes. Otherwise, click No violation.");                    	
                    }
                    if (casePetitionData.Petition_Details__r) {
                        var chkCTAct = casePetitionData.Petition_Details__r.Content_Action__c ? true : false,
                            contentActPermsHide = false,
                            contentActPermsShow = false;
                        if (chkCTAct) {
                            if (casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() != 'hide' && casePetitionData.Petition_Details__r.Unhide_Url__c) {
                                contentActPermsHide = true
                            }
                        }
                        if (!chkCTAct && casePetitionData.Petition_Details__r.Hide_Url__c) {
                            contentActPermsHide = true;
                        }
                        if (!contentActPermsHide) {
                            if (casePetitionData.Petition_Details__r.Content_Action__c && casePetitionData.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && casePetitionData.Petition_Details__r.Unhide_Url__c) {
                                contentActPermsShow = true
                            }
                        }
                        footerModal.set('v.contentActPermsHide', contentActPermsHide);
                        footerModal.set('v.contentActPermsShow', contentActPermsShow);                        
                    }
                    
                    component.find('overlayLib').showCustomModal({
                        header: headerModal,                                       
                        body: modalBody,
                        footer: footerModal,
                        showCloseButton: true,
                        cssClass: "mymodal",
                        closeCallback: function() {
                            //alert('You closed the alert!');
                        }
                    });
                }
            });
    },
    
    getContentViewDetails: function(component, event, helper) {
        var caseObj = component.get('v.simpleCase');
        //Reset the data
        component.set('v.contentType', '');
        component.set('v.chatData', '');
        component.set('v.contentData', '');
        component.set('v.caseDescData', '');
        component.set('v.urlProfileImg', false);
        
        
        /***** Thor -1400 Start*****/
        if (caseObj.Petition_Details__r && caseObj.Petition_Details__r.Content_Type__c == 'Text' &&
            caseObj.Description &&  caseObj.Description.toLowerCase().includes('chat log') &&  caseObj.Description.toLowerCase().indexOf('chat log') >=0 ) {
            component.set('v.isChat', true);
            component.set('v.chatData', caseObj.Description);
            return;
        }
        
        if (caseObj.Petition_Details__r &&  caseObj.Description && caseObj.Petition_Details__r.Content_Type__c ) {
            if(caseObj.Description.toLowerCase().includes('player name') && caseObj.Description.toLowerCase().indexOf('player name') >=0){
                helper.getCaseDecription(component,'player name');
            } 
            
            if(caseObj.Description.toLowerCase().includes('baseline') && caseObj.Description.toLowerCase().indexOf('baseline') >=0){
                helper.getCaseDecription(component,'baseline');
            }
            
            if(caseObj.Description.toLowerCase().includes('team name') && caseObj.Description.toLowerCase().indexOf('team name') >=0){
                helper.getCaseDecription(component,'team name');
            }
            
            if(caseObj.Description.toLowerCase().includes('sim name') && caseObj.Description.toLowerCase().indexOf('sim name') >=0){
                helper.getCaseDecription(component,'sim name');
            } 
            
            if(caseObj.Description.toLowerCase().includes('courtname') && caseObj.Description.toLowerCase().indexOf('courtname') >=0){
               console.log('Inside courtname');
                helper.getCaseDecription(component,'courtname');
            }

            
            if(caseObj.Description.toLowerCase().includes('player profile image') && caseObj.Description.toLowerCase().includes('http') && caseObj.Description.toLowerCase().indexOf('player profile image') >=0){
               	console.log('caseDescData--->'+component.get('v.caseDescData'));
                console.log('displayCaseDesc--->'+component.get('v.displayCaseDesc'));
                console.log('urlProfileImg--->'+component.get('v.urlProfileImg'));
                component.set('v.urlProfileImg', true);
                helper.getCaseDecription(component,'http');
            } 
            
            var isdisplayCaseDesc = component.get('v.displayCaseDesc');
            
            if  (!isdisplayCaseDesc && caseObj.Petition_Details__r.Content_Type__c == 'Text' && (caseObj.Description.indexOf('<br>') != -1 || caseObj.Description.toLowerCase().indexOf('\n') >=0 )) {
                
                component.set('v.isChat', true);
                component.set('v.chatData', caseObj.Description);
                return;
            }
        }
        
        /***** Thor -1400 end*****/
        
        helper.getContentViewDetails(component);
    }
})