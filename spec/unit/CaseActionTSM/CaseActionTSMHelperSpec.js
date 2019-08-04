var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var CaseActionTSMHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseActionTSM/CaseActionTSMHelper.js')), {$A: $A});
var CaseActionTSMHelper = require('../../../aura/tsm/CaseActionTSM/CaseActionTSMHelper.js');


var CaseActionTSMHelper = require('../../../aura/tsm/CaseActionTSM/CaseActionTSMHelper.js');

describe('CaseActionTSMHelper', function() {
    var component, event, helper, module, callback, globalOptin,thirdPartyOptin;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);
        helper = jasmine.createSpyObj('helper', ['populateCaseStatus','populateEmailLocales','populateCaseQueues','populateCaseResolutions','validateData','handleSaveCase','handleSaveAndGoIdle','handleSaveGoIdleEvent','updateItemTotal','validateItem']);
        component.find = jasmine.createSpy('find').and.returnValue({one: {}, two: {}});
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"response":[{"Language":"test", "Countries":"test","language":"test_test"}]}'}}
                f(response);
            },
            language: function(){},
            currentCountry: function(){},
            currentLanguage: function(){},
            country: function(){},
            Countries: function(){},
            Languages: function(){},
            id : function(){},
            userValue : function(){},
            email : function(){}
        });
        $A.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: ()=> {},
            fire: function() {}
        });
    });

    describe('populateCaseStatus', function() {
        beforeEach(function() {
            CaseActionTSMHelper.populateCaseStatus(component, event, helper);
        });
        it('should  populate Case Status picklist', function() {
            expect(component.set.calls.count()).toEqual(3);
        });
    });

    describe('populateCaseQueues', function() {
        beforeEach(function() {
            CaseActionTSMHelper.populateCaseQueues(component, event, helper);
        });
        it('should  populate Case  Queues picklist', function() {
            expect(component.set.calls.count()).toEqual(5);
        });
    });

    describe('populateCaseResolutions', function() {
        beforeEach(function() {
            CaseActionTSMHelper.populateCaseResolutions(component, event, helper);
        });
        it('should  populate case resolutions picklist', function() {
            expect(component.set.calls.count()).toEqual(4);
        });
    });

    describe('populateEmailLocales', function() {
        beforeEach(function() {
            CaseActionTSMHelper.populateEmailLocales(component, event, helper);
        });
        it('should  populate email locales picklist', function() {
            expect(component.set.calls.count()).toEqual(3);
        });
    });

    describe('isEmpty', function() {
        var isvariableEmpty;
        beforeEach(function() {
            isvariableEmpty = CaseActionTSMHelper.isEmpty(null);
        });

        it('should  be true', function() {
            expect(isvariableEmpty).toBe(true);
        });

    });

    describe('saveCase', function() {
        beforeEach(function() {
            CaseActionTSMHelper.saveCase(component, event, function(){});
        });
        it('should  save the data', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
    });

    describe('handleSaveAndGoIdle', function() {
        beforeEach(function() {
            CaseActionTSMHelper.handleSaveAndGoIdle(component, event);
        });
        it('will show select state modal', function() {
            expect(component.set.calls.count()).toEqual(1);
        });
    });


});
