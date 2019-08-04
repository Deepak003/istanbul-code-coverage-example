const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass', 'isEmpty']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

/* const target = 'CaseInteractions/CaseInteractionsController.js';

const CaseInteractionsController = vm.runInNewContext(
    fs.readFileSync(path.join(rootPath, '.', 'aura', 'tsm', target)), {$A, Util}
); */
var CaseInteractionsController = require('../../../aura/tsm/CaseInteractions/CaseInteractionsController.js');


var CaseInteractionsController = require('../../../aura/tsm/CaseInteractions/CaseInteractionsController.js');

describe("CaseInteractionsController", function() {
	let component, event, helper, pageNo, tableRows, isDescending, oldValue, getParamValue, searchTerm;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam', 'stopPropagation']);        
        helper = jasmine.createSpyObj('helper', ['fetchInteractions', 'toggleState', 'toggleStateAll', 'openSubTab']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> arg),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.callFake((arg)=> arg)
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should call helper fetchInteractions', function() {
            CaseInteractionsController.doInit(component, event, helper);
            expect(helper.fetchInteractions).toHaveBeenCalledWith(component);
        });
    });

    describe('toggleState', function() {
        it('should call helper toggleState', function() {
            CaseInteractionsController.toggleState(component, event, helper);
            expect(helper.toggleState).toHaveBeenCalledWith(component, event);
        });
    });

    describe('toggleStateAll', function() {
        it('should call helper toggleStateAll', function() {
            CaseInteractionsController.toggleStateAll(component, event, helper);
            expect(helper.toggleStateAll).toHaveBeenCalledWith(component);
        });
    });

    describe('openNotes', function() {
        it('should call helper openSubTab', function() {
            CaseInteractionsController.openNotes(component, event, helper);
            expect(helper.openSubTab).toHaveBeenCalledWith(component, 'note');
        });
    });

    describe('openEmailTranscript', function() {
        it('should call helper openSubTab', function() {
            CaseInteractionsController.openEmailTranscript(component, event, helper);
            expect(helper.openSubTab).toHaveBeenCalledWith(component, 'email');
        });
    });

    describe('openChatTranscript', function() {
        it('should call helper openSubTab', function() {
            CaseInteractionsController.openChatTranscript(component, event, helper);
            expect(helper.openSubTab).toHaveBeenCalledWith(component, 'chat');
        });
    });

    describe('openPhoneTranscript', function() {
        it('should call helper openSubTab', function() {
            CaseInteractionsController.openPhoneTranscript(component, event, helper);
            expect(helper.openSubTab).toHaveBeenCalledWith(component, 'phone');
        });
    });

});
