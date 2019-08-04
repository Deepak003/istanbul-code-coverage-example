const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var EmailTranscriptController = require('../../../aura/tsm/EmailTranscript/EmailTranscriptController.js');

var EmailTranscriptController = require('../../../aura/tsm/EmailTranscript/EmailTranscriptController.js');

describe("EmailTranscriptController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['pullTabInfo', 'setTabInfo', 'pullTranscripts']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.caseId') {
	                return "123456789";
	            }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should call helper methods', function() {
            EmailTranscriptController.doInit(component, event, helper);
            expect(helper.pullTabInfo).toHaveBeenCalledWith(component);
            expect(helper.setTabInfo).toHaveBeenCalledWith(component);
            expect(helper.pullTranscripts).toHaveBeenCalledWith(component);
        });
    });
 })

