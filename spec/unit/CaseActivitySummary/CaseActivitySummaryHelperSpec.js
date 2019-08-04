var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = jasmine.createSpyObj('$A', ['enqueueAction']);
//var CaseActivitySummaryHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryHelper.js')), {$A: $A});
var CaseActivitySummaryHelper = require('../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryHelper.js');


var CaseActivitySummaryHelper = require('../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryHelper.js');

describe('CaseActivitySummaryHelper', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getToSVoilationCount']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function() {}
        });
    });

    describe('getToSVoilationCount', function() {
        beforeEach(function() {
			CaseActivitySummaryHelper.getToSVoilationCount(component, event, helper);
        });
        it('will call the backend method getToSVoilationCaseCount', function() {       
            expect($A.enqueueAction).toHaveBeenCalled();          
        });
    });

});
