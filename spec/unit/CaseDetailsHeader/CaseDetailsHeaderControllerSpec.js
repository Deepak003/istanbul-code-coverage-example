var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

//var CaseDetailsHeaderController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderController.js')), {$A: $A});
var CaseDetailsHeaderController = require('../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderController.js');


var CaseDetailsHeaderController = require('../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderController.js');

describe('CaseDetailsHeaderController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['searchCaseData']);
    });

    describe('doInit', function() {
        beforeEach(function() {
			CaseDetailsHeaderController.doInit(component, event, helper);
        });
        it('will call the helper method searchCaseData', function() {       
            expect(helper.searchCaseData).toHaveBeenCalled();          
        });
    });

});
