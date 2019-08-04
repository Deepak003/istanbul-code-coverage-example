var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};
//var JSON = {parse: null};
//JSON.parse = jasmine.createSpy('parse').and.returnValue({response: [{}]});

//var CaseActionTSMController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseActionTSM/CaseActionTSMController.js')), {$A: $A});
var CaseActionTSMController = require('../../../aura/tsm/CaseActionTSM/CaseActionTSMController.js');


var CaseActionTSMController = require('../../../aura/tsm/CaseActionTSM/CaseActionTSMController.js');

describe('CaseActionTSMController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['populateCaseStatus','populateEmailLocales','populateCaseQueues','populateCaseResolutions','validateData','handleSaveCase','handleSaveAndGoIdle','handleSaveGoIdleEvent','updateItemTotal','validateItem']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('doInit', function() {
        beforeEach(function() {
            CaseActionTSMController.doInit(component, event, helper);
        });
        it('will  populate case status picklist', function() {
            expect(helper.populateCaseStatus).toHaveBeenCalled();
        });
        it('will populate email locale pick list', function() {
            expect(helper.populateEmailLocales).toHaveBeenCalled();
        });
    });

    describe('handleCaseStatusChange', function() {
        beforeEach(function() {
            CaseActionTSMController.handleCaseStatusChange(component, event, helper);
        });
        it('will rerender resolution / queue', function() {
            expect(component.set.calls.count()).toEqual(4);
        });
        it('will call case resolutions if default', function() {
            expect(helper.populateCaseResolutions).toHaveBeenCalled();
        });
    });

    describe('validateFields', function() {
        beforeEach(function() {
            CaseActionTSMController.validateFields(component, event, helper);
        });
        it('will call helper to validate all fields', function() {
            expect(helper.validateData).toHaveBeenCalled();
        });
    });

    describe('handleCaseQueueChange', function() {
        beforeEach(function() {
            CaseActionTSMController.handleCaseQueueChange(component, event, helper);
        });
        it('on queue change validate', function() {
            expect(helper.validateData).toHaveBeenCalled();
        });
    });

    describe('handleCaseResolutionChange', function() {
        beforeEach(function() {
            CaseActionTSMController.handleCaseResolutionChange(component, event, helper);
        });
        it('on resolution change validate data', function() {
            expect(helper.validateData).toHaveBeenCalled();
        });
    });

    describe('saveAndGetNext', function() {
        beforeEach(function() {
            CaseActionTSMController.saveAndGetNext(component, event, helper);
        });
        it('will call the helper method handleSaveCase', function() {
            expect(helper.handleSaveCase).toHaveBeenCalled();
        });
    });

    describe('saveAndCreateNew', function() {
        beforeEach(function() {
            CaseActionTSMController.saveAndCreateNew(component, event, helper);
        });
        it('will call the helper method handleSaveCase', function() {
            expect(helper.handleSaveCase).toHaveBeenCalled();
        });
    });

    describe('saveAndGoIdle', function() {
        beforeEach(function() {
            CaseActionTSMController.saveAndGoIdle(component, event, helper);
        });
        it('will call the helper method handleSaveGoIdleEvent', function() {
            expect(helper.handleSaveAndGoIdle).toHaveBeenCalled();
        });
    });

});
