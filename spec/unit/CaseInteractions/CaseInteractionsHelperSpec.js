const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

/* const target = 'CaseInteractions/CaseInteractionsHelper.js';

const CaseInteractionsHelper = vm.runInNewContext(
    fs.readFileSync(path.join(rootPath, '.', 'aura', 'tsm', target)), {$A, Util}
);
 */
var CaseInteractionsHelper = require('../../../aura/tsm/CaseInteractions/CaseInteractionsHelper.js');


var CaseInteractionsHelper = require('../../../aura/tsm/CaseInteractions/CaseInteractionsHelper.js');

describe("CaseInteractionsHelper", function() {
	let component, event, helper, action, response, responseState, responseData, searchTerm, isDescending, isArchivedPulled, isNonArchivedPulled, pageNo, pageSize, selectedFilter, interactions;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.interactions') {
                    return interactions;
                }else if(arg == 'c.fetchInteractionsAndEventsByCaseId'){
                    return action;
                }else if (arg == 'v.data.caseId') {
                    return "123456789";
                }else if (arg == 'v.data.caseNumber') {
                    return "1234567890";
                }else if(arg == 'v.nucleusId') {
                    return "56789";
                }else if(arg == 'v.accountId') {
                    return "12345";
                }else if (arg == 'v.cases') {
                    return ["This","is","to","say","hello","To","Every","One"];
                }else if (arg == 'v.selectedFilter') {
                    return selectedFilter;
                }else if (arg == 'v.isDescending') {
                    return isDescending;
                }else if (arg == 'v.isNonArchivedPulled') {
                    return isNonArchivedPulled;
                }else if (arg == 'v.isArchivedPulled') {
                    return isArchivedPulled;
                }else if (arg == 'v.pageNo') {
                    return pageNo;
                }else if (arg == 'v.pageSize') {
                    return pageSize;
                }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
            setCallback: jasmine.createSpy('setCallback').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
            currentTarget : { dataset: { index : 0 } }
        });

        // syp helper methods
        Object.assign(helper, {});

        // syp action methods
        Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(CaseInteractionsHelper, response);
                }
            })
        });

        Object.assign(response, {
            getState: ()=> responseState,
            getReturnValue: ()=> responseData
        });

        // spy $A methods
        Object.assign($A, {
            get: jasmine.createSpy('get').and.returnValue($A),
            fire: jasmine.createSpy('fire').and.returnValue($A),
            util: { isEmpty: jasmine.createSpy('fire').and.returnValue(false) }
        });
    });

    describe('toggleState', function() {
        it('should set expanded true to row', function() {
            interactions = [{}];
            CaseInteractionsHelper.toggleState(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.interactions", [{expanded: true}]);
        });
        it('should set expanded false to row', function() {
            interactions = [{expanded: true}, {expanded: true}];
            CaseInteractionsHelper.toggleState(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.interactions", [{expanded: false},{expanded: true}]);
        });
    });

    describe('toggleStateAll', function() {
        it('should set expanded true to all row when 1st is false', function() {
            interactions = [{expanded: false}, {expanded: true}];
            CaseInteractionsHelper.toggleStateAll(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.interactions", [{expanded: true}, {expanded: true}]);
        });
        it('should set expanded false to all row when 1st is true', function() {
            interactions = [{expanded: true}, {expanded: false}];
            CaseInteractionsHelper.toggleStateAll(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.interactions", [{expanded: false},{expanded: false}]);
        });
    });

    describe('formatData', function() {
        it('should format data', function() {
            const out = CaseInteractionsHelper.formatData({"caseInteraction":{"action":"CaseResume","advisorJobRole":"TSM English Chat Advisor Account Blling","advisorName":"sowjanya tadikonda","attachments":[{"name":"Case1_Transfer_From_TSM_EmailQueue to ARabicEmail_1552472533.png","urlValue":"/00P1g000004dHYZEA2"},{"name":"CaseStatus_Scrollbar_1552472542.png","urlValue":"/00P1g000004dHYeEAM"},{"name":"EmailCase_Description_Section_Removed_1552472503.png","urlValue":"/00P1g000004dHYUEA2"}],"caseDetails":[{"key":"Product","value":"52 Card Pickup"},{"key":"Platform","value":"Pogo.com"},{"key":"Category","value":"Game information"},{"key":"Issue","value":"Getting started"},{"key":"Case Status","value":"New"},{"key":"Reason"}],"caseNotes":[],"channel":"Chat","chatTranscript":{"body":"something rich text"},"contactDirection":"Inbound","createdDate":"2019-03-13T12:49:55.000Z","source":"Player","subject":"Case created through TSM. Advisor created the case"},"eventList":[]})
            expect(out).toEqual({"action":"CaseResume","advisorJobRole":"TSM English Chat Advisor Account Blling","advisorName":"sowjanya tadikonda","attachments":[{"name":"Case1_Transfer_From_TSM_EmailQueue to ARabicEmail_1552472533.png","urlValue":"/00P1g000004dHYZEA2"},{"name":"CaseStatus_Scrollbar_1552472542.png","urlValue":"/00P1g000004dHYeEAM"},{"name":"EmailCase_Description_Section_Removed_1552472503.png","urlValue":"/00P1g000004dHYUEA2"}],"caseDetails":[{"key":"Product","value":"52 Card Pickup"},{"key":"Platform","value":"Pogo.com"},{"key":"Category","value":"Game information"},{"key":"Issue","value":"Getting started"},{"key":"Case Status","value":"New"},{"key":"Reason"}],"caseNotes":[],"channel":"Chat","chatTranscript":{"body":"something rich text"},"contactDirection":"Inbound","createdDate": new Date('2019-03-13T12:49:55.000Z'),"source":"Player","subject":"Case created through TSM. Advisor created the case","eventList":[],"title":"Player","description":"Resumed the case","advisorActions":[]});
        });
    });

    describe('formatAdvisorAction', function() {
        it('should format data', function() {
            const out = CaseInteractionsHelper.formatAdvisorAction({"eventList":[{"accountId":"0011g00000cFvajAAC","advisorId":"0051g000001bmecAAA","caseEventDetailList":[{"crmEventId":"a6y1g0000008TMGAA2","eventFieldId":"a7244000000CoNoAAK","sequenceNum":0,"strEventFieldName":"Product","strNewValue":"52-card-pickup","strOldValue":"fifa-19"}],"caseId":"5001g000005cVEZAA2","caseInteractionId":"a701g0000008tP6AAI","strEventCategory":"CaseFieldUpdate","strEventType":"CaseEdit","strInitiatedBy":"Advisor","strRelatedEvent":"Case"},{"accountId":"0011g00000cFvajAAC","advisorId":"0051g000001bmecAAA","caseEventDetailList":[{"crmEventId":"a6y1g0000008TMLAA2","eventFieldId":"a7244000000CoNrAAK","sequenceNum":0,"strEventFieldName":"Status","strNewValue":"Resolved","strOldValue":"New"}],"caseId":"5001g000005cVEZAA2","caseInteractionId":"a701g0000008tP6AAI","strEventCategory":"StatusUpdate","strEventType":"CaseEdit","strInitiatedBy":"Advisor","strRelatedEvent":"Case"},{"accountId":"0011g00000cFvajAAC","advisorId":"0051g000001bmecAAA","caseEventDetailList":[{"crmEventId":"a6y1g0000008TMBAA2","eventFieldId":"a7244000000CoNpAAK","strEventFieldName":"Platform","strNewValue":"pc","strOldValue":"pogo"}],"caseId":"5001g000005cVEZAA2","caseInteractionId":"a701g0000008tP6AAI","strEventCategory":"CaseFieldUpdate","strEventType":"CaseEdit","strInitiatedBy":"Advisor","strRelatedEvent":"Case"},{"accountId":"0011g00000cFvajAAC","advisorId":"0051g000001bmecAAA","caseId":"5001g000005cVEZAA2","caseInteractionId":"a701g0000008tP6AAI","outboundEmail":{"Id":"a3Y1g000000Aq1QEAS","CRMEvent__c":"a6y1g0000008TM6AAM","CaseInteraction__c":"a701g0000008tP6AAI","ConsolidatedOutboundMessage__c":"Hello ,null<p>Thank you for contacting Electronic Arts!<br /><br />Player account security is very important to EA. Before we assist in making any changes to your account, we need to verify the account's ownership. This helps ensure that your account stays safe and secure.<br /><br />To verify your account, a one-time code has been generated for you and sent to the email that's listed on your Origin account. When requested by your Game Advisor, please provide the following code:<br /><br /><strong>641396</strong><br /><br />In addition to verifying ownership of your account, you can take steps on your own to ensure that your account remains secure against possible compromise. To learn more, head over to our Help Center and check out these helpful account security articles:<br /><br />- How to maintain account security (link to https://help.ea.com/article/how-to-maintain-account-security)<br /><br />If you have any further questions or concerns, please don't hesitate to let us know at help.ea.com. Thank you for supporting Electronic Arts and our effort to help maintain account security.</p><br /><br />Ramesh D.<br>EA Help","ToAddress__c":"ramesh.dusi@mindtree.com","CreatedDate":"2019-02-27T09:35:04.000Z","LastModifiedDate":"2019-03-13T11:35:18.000Z"},"strEventCategory":"Outbound-Email","strEventType":"CaseEdit","strInitiatedBy":"Advisor","strRelatedEvent":"Case"},{"accountId":"0011g00000cFvajAAC","advisorId":"0051g000001bmecAAA","caseId":"5001g000005cVEZAA2","caseInteractionId":"a701g0000008tP6AAI","strEventCategory":"CaseNoteAddition","strEventNote":"Test case notes","strEventType":"CaseSupplimentary","strInitiatedBy":"Advisor","strRelatedEvent":"Case"}]})
            expect(out).toEqual(["CaseEdit Product from fifa-19 to 52-card-pickup ","CaseEdit Status from New to Resolved ","CaseEdit Platform from pogo to pc "]);
        });
    });

    describe('getActionDescription', function() {
        it('should return Case created description', function() {
            const out = CaseInteractionsHelper.getActionDescription({action: 'CaseCreation'});
            expect(out).toEqual("Case created");
        });
        it('should return Resumed Case description', function() {
            const out = CaseInteractionsHelper.getActionDescription({action: 'CaseResume'});
            expect(out).toEqual("Resumed the case");
        });
    });

    describe('fetchInteractions', function() {
        beforeEach(()=> {
            spyOn(CaseInteractionsHelper, 'formatData').and.callFake((data)=> data);
        }); 

        it('should call apex methods with correct parameters', ()=>{
            CaseInteractionsHelper.fetchInteractions(component);
            expect(action.setParams).toHaveBeenCalledWith({
                caseId: "123456789",
                caseNumber: "1234567890"
            });        
        });

        it('should show isLoading spinner', ()=>{
            CaseInteractionsHelper.fetchInteractions(component);
            expect(component.set).toHaveBeenCalledWith('v.isLoading', true);
        });

        it('should call setCallback', ()=>{
            CaseInteractionsHelper.fetchInteractions(component);
            expect(action.setCallback).toHaveBeenCalledWith(CaseInteractionsHelper, jasmine.any(Function));
        });

        it('should hide isLoading spinner', ()=>{
            CaseInteractionsHelper.fetchInteractions(component);
            expect(component.set).toHaveBeenCalledWith('v.isLoading', false);
        });

        it('should set interactions', function() {
            responseState = "SUCCESS";
            responseData = [{a:10, b:20}];
            CaseInteractionsHelper.fetchInteractions(component);
            expect(component.set).toHaveBeenCalledWith("v.interactions", [{a:10, b:20}]);
        });
    });

});
