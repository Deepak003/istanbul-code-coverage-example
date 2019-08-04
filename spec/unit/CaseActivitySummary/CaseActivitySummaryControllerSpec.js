var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};
console.log(__dirname);
//var CaseActivitySummaryController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryController.js')), {$A: $A});
var CaseActivitySummaryController = require('../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryController.js');


var CaseActivitySummaryController = require('../../../aura/tsm/CaseActivitySummary/CaseActivitySummaryController.js');

describe('AccountSummaryController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getToSVoilationCount']);
        component.find = jasmine.createSpy('find').and.returnValue({});
    });

    describe('getToSVoilationCount', function() {
        beforeEach(function() {
			CaseActivitySummaryController.getToSVoilationCount(component, event, helper);
        });
        it('will call the helper method fetchAccountSummary', function() {       
            expect(helper.getToSVoilationCount).toHaveBeenCalled();          
        });
    });

});
