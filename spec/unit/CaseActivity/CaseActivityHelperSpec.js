const vm = require('vm');const fs = require('fs');
const path = require('path');

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass','toggleClass']);

/* const rootPath = process.cwd();

const target = 'CaseActivity/CaseActivityHelper.js';
const CaseActivityHelper = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
); */
var CaseActivityHelper = require('../../../aura/tsm/CaseActivity/CaseActivityHelper.js');


var CaseActivityHelper = require('../../../aura/tsm/CaseActivity/CaseActivityHelper.js');

describe('CaseActivityHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
    });

    describe('toggleExpand', ()=> {
        beforeEach(()=> {
			CaseActivityHelper.toggleExpand(component,event,'currentCaseActivity');
        });
        it('should call toggleClass', ()=> {
        	const acc = component.find("currentCaseActivity");  
            expect($A.util.toggleClass).toHaveBeenCalledWith(acc, "slds-is-open");       
        });
    });

    describe('getCaseUpdates', ()=> {
        beforeEach(()=> {
            CaseActivityHelper.getCaseUpdates(component,event);
        });
        it('should call $A.enqueueAction', ()=> {
            expect($A.enqueueAction).toHaveBeenCalled();       
        });
    });

    describe('doRefresh', ()=> {        
        it('should call getCaseUpdates', ()=> {
            const spy = spyOn(CaseActivityHelper, 'getCaseUpdates').and.returnValue([]);
            CaseActivityHelper.doRefresh(component,event);

            expect(CaseActivityHelper.getCaseUpdates).toHaveBeenCalled();   

            //spy.calls.reset();
            CaseActivityHelper.getCaseUpdates.calls.reset();
        });       
    });   

    describe('getNotes', ()=> {
        const input = {"action":"CaseCreation","advisor":"Bert Drake","channel":"Chat","contactDirection":"Inbound","dateCreated":"2018-07-24T09:54:20.000Z","events":[{"dateCreated":"2018-07-24T10:14:40.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:02:48.000Z","eventCategory":"StatusUpdate","eventType":"CaseEdit","initiatedBy":"Advisor","newValue":"Closed","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:11:08.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H4QAI","jobRole":"Tier 1 Advisor","source":"Customer","subject":"Chatted with Player for 4min 01sec"};
        it('should return expected data format', ()=> {            
            const expectedOutput = [{"date":"2018-07-24T10:11:08.000Z","label":"Testing the addition of notes"}];
            const output = CaseActivityHelper.getNotes(input);
            expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
        });
    });

    describe('getActions', ()=> {
        const input = {"action":"CaseResume","advisor":"Bert Drake","channel":"Email","contactDirection":"Outbound","dateCreated":"2018-07-24T09:58:16.000Z","emailAttachments":[{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"}],"emailDesc":"<html><br />\nTest body<br><br></html>","emailTo":"issyed@contractor.ea.com","events":[{"dateCreated":"2018-07-26T10:12:50.000Z","eventCategory":"CaseNoteAddition","eventNote":"EA Notes added by advisor for testing siba","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T11:00:00.000Z","eventCategory":"StatusUpdate","eventType":"CaseSupplimentary","initiatedBy":"Advisor","newValue":"Waiting on Customer","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:18:20.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:30:39.000Z","eventAttachment":{"attachmendId":"0686C0000009I17QAE","label":"whiteBG1.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009I17QAE"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T10:59:59.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H9QAI","jobRole":"Tier 1 Advisor","source":"Advisor","subject":"Test subject"};
        it('should return expected data without type', ()=> {            
            const expectedOutput = [{"date":"2018-07-26T10:12:50.000Z","label":"Note Added"},{"date":"2018-07-25T11:00:00.000Z","label":"Changed case status to <b>Waiting on Customer</b>"},{"date":"2018-07-25T14:18:20.000Z","label":"Attachment added by advisor."},{"date":"2018-07-25T14:30:39.000Z","label":"Attachment added by advisor."},{"date":"2018-07-25T10:59:59.000Z","label":"Note Added"}];
            const output = CaseActivityHelper.getActions(input);
            expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
        });
        it('should return expected data with type EMAIL', ()=> {            
            const expectedOutput = [{"date":"2018-07-24T09:58:16.000Z","label":"Email from issyed@contractor.ea.com"},{"date":"2018-07-26T10:12:50.000Z","label":"Note Added"},{"date":"2018-07-25T11:00:00.000Z","label":"Changed case status to <b>Waiting on Customer</b>"},{"date":"2018-07-25T14:18:20.000Z","label":"Attachment added by advisor."},{"date":"2018-07-25T14:30:39.000Z","label":"Attachment added by advisor."},{"date":"2018-07-25T10:59:59.000Z","label":"Note Added"}];
            const output = CaseActivityHelper.getActions(input,'EMAIL');
            expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
        });
        it('should return expected data with type CHAT', ()=> {
            let inputForChatType = {"action":"CaseCreation","advisor":"Bert Drake","channel":"Chat","contactDirection":"Inbound","dateCreated":"2018-07-24T09:54:20.000Z","events":[{"dateCreated":"2018-07-24T10:14:40.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:02:48.000Z","eventCategory":"StatusUpdate","eventType":"CaseEdit","initiatedBy":"Advisor","newValue":"Closed","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:11:08.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H4QAI","jobRole":"Tier 1 Advisor","source":"Customer","subject":"Chatted with Player for 4min 01sec"};            
            const expectedOutput = [{"date":"2018-07-24T09:54:20.000Z","label":"Chatted with player. "},{"date":"2018-07-24T10:14:40.000Z","label":"Attachment added by advisor."},{"date":"2018-07-24T10:02:48.000Z","label":"Changed case status to <b>Closed</b>"},{"date":"2018-07-24T10:11:08.000Z","label":"Note Added"}];
            const output = CaseActivityHelper.getActions(inputForChatType,'CHAT');
            expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
        });
    });

    describe('getAttachments', ()=> {
        it('should return expected data', ()=> {
            const input = {"action":"CaseResume","advisor":"Bert Drake","channel":"Email","contactDirection":"Outbound","dateCreated":"2018-07-24T09:58:16.000Z","emailAttachments":[{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"}],"emailDesc":"<html><br />\nTest body<br><br></html>","emailTo":"issyed@contractor.ea.com","events":[{"dateCreated":"2018-07-26T10:12:50.000Z","eventCategory":"CaseNoteAddition","eventNote":"EA Notes added by advisor for testing siba","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T11:00:00.000Z","eventCategory":"StatusUpdate","eventType":"CaseSupplimentary","initiatedBy":"Advisor","newValue":"Waiting on Customer","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:18:20.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:30:39.000Z","eventAttachment":{"attachmendId":"0686C0000009I17QAE","label":"whiteBG1.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009I17QAE"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T10:59:59.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H9QAI","jobRole":"Tier 1 Advisor","source":"Advisor","subject":"Test subject"};
            const expectedOutput = [{"date":"2018-07-25T14:18:20.000Z","details":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"}},{"date":"2018-07-25T14:30:39.000Z","details":{"attachmendId":"0686C0000009I17QAE","label":"whiteBG1.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009I17QAE"}}];
            const output = CaseActivityHelper.getAttachments(input);
            expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
        });
    });


    describe('onSortOrderChange', ()=> {
        let list = [];

        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);        
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);


        list.push({ date : yesterday });
        list.push({ date : today });
        list.push({ date : tomorrow });        
        
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.sortOrder') {
                    return 'ASC';
                }else if(arg == 'v.caseUpdatesList') {
                    return list.slice(0)
                }
            });
            CaseActivityHelper.onSortOrderChange(component,event);
        });
        it('should sort ASC order', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", list);              
        });
    });

    describe('onSortOrderChange', ()=> {
        let list = [];

        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);        
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        list.push({ date : yesterday });
        list.push({ date : today });
        list.push({ date : tomorrow });        
        
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.sortOrder') {
                    return 'DESC';
                }else if(arg == 'v.caseUpdatesList') {
                    return list.slice(0)
                }
            });
            CaseActivityHelper.onSortOrderChange(component,event);
        });
        it('should sort DESC order', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", list.reverse());              
        });
    });

    describe('formatResponse', ()=> {
        const input = [{"action":"CaseResume","advisor":"Bert Drake","channel":"Email","contactDirection":"Outbound","dateCreated":"2018-07-24T09:58:16.000Z","emailAttachments":[{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"}],"emailDesc":"<html><br />\nTest body<br><br></html>","emailTo":"issyed@contractor.ea.com","events":[{"dateCreated":"2018-07-26T10:12:50.000Z","eventCategory":"CaseNoteAddition","eventNote":"EA Notes added by advisor for testing siba","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T11:00:00.000Z","eventCategory":"StatusUpdate","eventType":"CaseSupplimentary","initiatedBy":"Advisor","newValue":"Waiting on Customer","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:18:20.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T14:30:39.000Z","eventAttachment":{"attachmendId":"0686C0000009I17QAE","label":"whiteBG1.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009I17QAE"},"eventCategory":"Attachment","eventType":"CaseEdit","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-25T10:59:59.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H9QAI","jobRole":"Tier 1 Advisor","source":"Advisor","subject":"Test subject"},{"action":"CaseCreation","advisor":"Bert Drake","channel":"Chat","contactDirection":"Inbound","dateCreated":"2018-07-24T09:54:20.000Z","events":[{"dateCreated":"2018-07-24T10:14:40.000Z","eventAttachment":{"attachmendId":"0686C0000009PkYQAU","label":"outgoing email.png","type":"png","url":"/sfc/servlet.shepherd/version/download/0686C0000009PkYQAU"},"eventCategory":"Attachment","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:02:48.000Z","eventCategory":"StatusUpdate","eventType":"CaseEdit","initiatedBy":"Advisor","newValue":"Closed","relatedEvent":"Case"},{"dateCreated":"2018-07-24T10:11:08.000Z","eventCategory":"CaseNoteAddition","eventNote":"Testing the addition of notes","eventType":"CaseSupplimentary","initiatedBy":"Advisor","relatedEvent":"Case"}],"interactionId":"a6m6C00000007H4QAI","jobRole":"Tier 1 Advisor","source":"Customer","subject":"Chatted with Player for 4min 01sec"}];

        beforeEach(()=> {
            spyOn(CaseActivityHelper, 'getNotes').and.returnValue([]);
            spyOn(CaseActivityHelper, 'getActions').and.returnValue([]);
            spyOn(CaseActivityHelper, 'getAttachments').and.returnValue([]);
        });
        it('should return expected data format', ()=> {            
            const expectedOutput = [{"id":"a6m6C00000007H9QAI","title":"Bert Drake (Tier 1 Advisor)","date":"2018-07-24T09:58:16.000Z","type":"EMAIL","description":"Sent email. ","subject":"Test subject","body":"<html><br />\nTest body<br><br></html>","notes":[],"actions":[],"attachments":[]},{"id":"a6m6C00000007H9QAI","title":"Player","date":"2018-07-24T09:58:15.000Z","type":"CASE_RESUME","description":"Resumed the Case","subject":"Test subject","attachments":[]},{"id":"a6m6C00000007H9QAI","title":"Player","date":"2018-07-24T09:58:16.000Z","type":"ATTACHMENT","description":"Attached document(s)","attachments":[]},{"id":"a6m6C00000007H9QAI","title":"Bert Drake (Tier 1 Advisor)","date":"2018-07-24T09:58:16.000Z","type":"NOTE","description":"Note added","notes":[],"actions":[]},{"id":"a6m6C00000007H4QAI","title":"Bert Drake (Tier 1 Advisor)","date":"2018-07-24T09:54:20.000Z","type":"CHAT","description":"Chatted with Player for 4min 01sec","notes":[],"actions":[],"attachments":[]},{"id":"a6m6C00000007H4QAI","title":"Player","date":"2018-07-24T09:54:19.000Z","type":"CASE_CREATE","description":"Case Created"},{"id":"a6m6C00000007H4QAI","title":"Player","date":"2018-07-24T09:54:20.000Z","type":"ATTACHMENT","description":"Attached document(s)","attachments":[]},{"id":"a6m6C00000007H4QAI","title":"Bert Drake (Tier 1 Advisor)","date":"2018-07-24T09:54:20.000Z","type":"NOTE","description":"Note added","notes":[],"actions":[]}];
            const output = CaseActivityHelper.formatResponse(input);
            //expect(JSON.stringify(output)).toBe(JSON.stringify(expectedOutput));
            expect(CaseActivityHelper.getNotes).toHaveBeenCalled();   
            expect(CaseActivityHelper.getActions).toHaveBeenCalled();   
            expect(CaseActivityHelper.getAttachments).toHaveBeenCalled();   
        });
        afterEach(()=> {            
            CaseActivityHelper.getNotes.calls.reset();
            CaseActivityHelper.getActions.calls.reset();
            CaseActivityHelper.getAttachments.calls.reset();
        })
    });

})
