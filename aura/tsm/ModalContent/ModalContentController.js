({
	handleNoViolationClick : function(component, event, helper) {
        component.find("overlayLib").notifyClose();
		console.log("No Violation Click");
	},
    
    violationCheckboxClicked : function(component, event, helper) {
		console.log(document.getElementsByClassName(event.getSource().get('v.class')));
        var allCheckboxDom = "",
            buttonLabelFlg = false,
            parentDom = '',
            indexVal = event.getSource().get('v.name'),
            listOfMsg = [],
            lstcontentData = component.get('v.lstcontentData');
        if (event.getSource().get("v.value")) {
            buttonLabelFlg = true;            
        }
        
        parentDom = component.find('msg');        
        if (parentDom.length && indexVal >= 0) {
            listOfMsg = component.get('v.lstcontentMsg');
            [].forEach.call(parentDom, function(el, key) {
                if (key == indexVal) {                    
                    $A.util.toggleClass(el, 'violation-selected');
                    var selectedChat = '';
                    if (lstcontentData[indexVal] && lstcontentData[indexVal].petitioner) {
                        selectedChat = 'Petitioner : ' +lstcontentData[indexVal].petitioner;
                    }
                    if (lstcontentData[indexVal] && lstcontentData[indexVal].target) {
                        selectedChat = 'Target : ' +lstcontentData[indexVal].target;
                    }
                    if (listOfMsg.indexOf(selectedChat) == -1) {
                        listOfMsg.push(selectedChat);
                    } else {
                        listOfMsg.splice(listOfMsg.indexOf(selectedChat), 1);
                    }
                }
                if ($A.util.hasClass(el, 'violation-selected')) {
                    buttonLabelFlg = true;
                }
            });
            component.set('v.lstcontentMsg',listOfMsg);
        }                
        // Call the APP event
        var violationEvent = $A.get("e.c:ViolationSelectEvt");
        if (violationEvent != undefined) {
            violationEvent.setParams({
                violationFlg : buttonLabelFlg,
                lstOfViolationMsg: listOfMsg
            });            
            violationEvent.fire();
        }       
	},
    contentObjChanges: function(component, event, helper) {
        console.log('Obj Changes');
    },
    roleQueueAppEvtSubs: function(component, event, helper) {        
        var param = event.getParam('roleQueue'),
            userRolesList = component.get('v.UGContent'),
            roleQueueObj = component.get('v.roleQueueObj'),
            selectRoleId = component.find('userRoles') ? component.find('userRoles').get('v.value') : roleQueueObj ? roleQueueObj.selectRoleId: '',            
            queueOptions = [],
            userRoles = component.find('userRoles'),
            userQueues = component.find('userQueues');
        	//jobRoleId = ;
        if (param == 'changeRole') {
            var roleQueueFlag = component.get('v.roleQueueFlag');
            component.set('v.roleQueueFlag', !roleQueueFlag);
        }
        if (window.selectRoleId && !selectRoleId) {
            selectRoleId = window.selectRoleId;
            if (!roleQueueObj) {
                roleQueueObj = {'selectRoleId':selectRoleId};
            }
        }
        if (param == 'roleSelect' && selectRoleId) {			
            window.selectRoleId = selectRoleId;                   
            if (!roleQueueObj) {
                roleQueueObj = {'selectRoleId':selectRoleId};
            }
            else {
                roleQueueObj.selectRoleId = selectRoleId;
            }            
            component.set('v.roleQueueObj', roleQueueObj);            
            helper.getQueueListByJobRoleId(component, selectRoleId);
           	//jobRoleId = roleQueueObj.selectRoleId;
            //component.set('v.queueOptions', queueOptions);
            component.set('v.roleQueueFlag', false);
        }
        if (param == 'queueSelectFooter') {            
            var queueVals = component.find('userQueues').get('v.value'),
                queueOptions = component.get('v.queueOptions'),
                rData = '',
                qLabels = [],
                roleLabel = '',
                qLabelLength = 0,
                nMoreLabel = 0;
            roleQueueObj.queueVals = queueVals;
            component.set('v.roleQueueObj', roleQueueObj);
            for(var i=0; i<queueVals.length; i++) {
               	rData = queueOptions.find(function(pData, pindex) {
                         if (pData.value == queueVals[i]) {                 
                             return pData;
                         }
                    });
                qLabelLength += rData.label?rData.label.length:0;
                if (qLabelLength >= 100) {
                    nMoreLabel++;
                }
                qLabels.push(rData.label?rData.label:'');
            }
            rData = component.get('v.roleOptions').find( function(pData, pIndex) {
                if (roleQueueObj.selectRoleId == pData.value) return pData;
            });           
            roleLabel = rData ? rData.label : '';                        
            var roleQueueEvent = $A.get("e.c:RoleQueueAppEvt"),
                rqLabelObj = {'role': roleLabel, 'qLabel': qLabels.join(', '), 'selectedQueue': queueVals, 'roleId': roleQueueObj.selectRoleId, 'nMoreLabel': nMoreLabel};
            window.rqLabelObj = rqLabelObj;
            if (roleQueueEvent != undefined) {
                roleQueueEvent.setParams({
                    roleQueue : 'queueSelect',
                    roleQueueObj: rqLabelObj
                });
                roleQueueEvent.fire();            
            }
            //roleQueueObj
        }
    },
    roleChanged: function(component, event, helper) {
        if (event.getParam('value')) {
            // Call the APP event
            var violationEvent = $A.get("e.c:ViolationSelectEvt");
            if (violationEvent != undefined) {
                violationEvent.setParams({
                    rValidation : true,
                    jobRoleId : event.getParam('value')
                }); 
                violationEvent.fire();
            }  
        }        
    },
    queueSelected: function(component, event, helper) {
        var qvals = event.getParam('value');
        if (qvals) {
            // Call the APP event
            var violationEvent = $A.get("e.c:ViolationSelectEvt"),
                paramFlag = qvals.length?true:false;
            if (violationEvent != undefined) {
                violationEvent.setParams({
                    qValidation : paramFlag
                }); 
                violationEvent.fire();
            }  
        }
    }
})