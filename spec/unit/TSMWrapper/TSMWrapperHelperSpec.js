var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var TSMWrapperHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TSMWrapper/TSMWrapperHelper.js')), {$A: $A});

var TSMWrapperHelper = require('../../../aura/tsm/TSMWrapper/TSMWrapperHelper.js');

var TSMWrapperHelper = require('../../../aura/tsm/TSMWrapper/TSMWrapperHelper.js');

describe('TSMWrapperHelper', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['helperFun']);
        component.find = function(s) {
            if (s == 'helperFun') return {one: {}, two: {}};
            return '';
        }
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return {"Account":{"Nucleus_ID__c":"","PersonEmail":""}}}}
                f(response);
            }
        });
    });

    describe('searchCaseDetails', function() {
        beforeEach(function() {
            TSMWrapperHelper.searchDetails(component, event);
        });
        it('should call the backend method searchCaseDetails and set necessary variables', function() {          
            expect(component.get.calls.count()).toEqual(2); 
            expect(component.set.calls.count()).toEqual(3);
        });
    });

});

