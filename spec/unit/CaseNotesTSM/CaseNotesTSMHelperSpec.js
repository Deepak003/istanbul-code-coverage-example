const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

/* const target = 'CaseNotesTSM/CaseNotesTSMHelper.js';

const CaseNotesTSMHelper = vm.runInNewContext(
    fs.readFileSync(path.join(rootPath, '.', 'aura', 'tsm', target)), {$A, Util}
); */
var CaseNotesTSMHelper = require('../../../aura/tsm/CaseNotesTSM/CaseNotesTSMHelper.js');


var CaseNotesTSMHelper = require('../../../aura/tsm/CaseNotesTSM/CaseNotesTSMHelper.js');

describe("CaseNotesTSMHelper", function() {
	let component, event, helper, action, response, responseState, responseData, searchTerm, isDescending, isArchivedPulled, isNonArchivedPulled, pageNo, pageSize, selectedFilter;
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
	        	if(arg == 'v.caseId') {
                    return "123456789";
                }else if(arg == 'c.fetchCaseNotesByCaseId'){
                    return action;
                }else if (arg == 'v.caseNumber') {
                    return "1234567890";
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
        });

        // syp helper methods
        Object.assign(helper, {});

        // syp action methods
        Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(CaseNotesTSMHelper, response);
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
            fire: jasmine.createSpy('fire').and.returnValue($A)
        });
    });

    describe('fetchNotes', ()=> {
        it('should call apex methods with correct parameters', ()=>{
            CaseNotesTSMHelper.fetchNotes(component);
            expect(action.setParams).toHaveBeenCalledWith({caseId: "123456789", caseNumber:"1234567890"});        
        });

        it('should call setCallback', ()=>{
            CaseNotesTSMHelper.fetchNotes(component);
            expect(action.setCallback).toHaveBeenCalledWith(CaseNotesTSMHelper, jasmine.any(Function));
        });

        it('should set response', ()=>{
            responseState = "SUCCESS";
            responseData = "somthing randome response";
            CaseNotesTSMHelper.fetchNotes(component);
            expect(component.set).toHaveBeenCalledWith('v.responseResult', "somthing randome response");
        });

       
    });
    

});
