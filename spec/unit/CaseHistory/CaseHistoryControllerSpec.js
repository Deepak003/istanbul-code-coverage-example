var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

/* const rootPath = process.cwd();
const target = 'CaseHistory/CaseHistoryController.js';
const CaseHistoryController = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
); */
var CaseHistoryController = require('../../../aura/tsm/CaseHistory/CaseHistoryController.js');


var CaseHistoryController = require('../../../aura/tsm/CaseHistory/CaseHistoryController.js');

describe('CaseHistoryController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getCaseHistoryData']);
        component.find = jasmine.createSpy('find').and.returnValue({});
    });

    describe('getAccountSummary', function() {
        beforeEach(function() {
			CaseHistoryController.init(component, event, helper);
        });
        it('will call the helper method getCaseHistoryData', function() {       
            expect(helper.getCaseHistoryData).toHaveBeenCalled();          
        });
    });
})
