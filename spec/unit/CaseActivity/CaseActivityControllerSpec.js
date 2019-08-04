const vm = require('vm');const fs = require('fs');
const path = require('path');

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const rootPath = process.cwd();

/* const target = 'CaseActivity/CaseActivityController.js';
const CaseActivityController = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
);
 */
var CaseActivityController = require('../../../aura/tsm/CaseActivity/CaseActivityController.js');


var CaseActivityController = require('../../../aura/tsm/CaseActivity/CaseActivityController.js');

describe("CaseActivityController", function() {
    let component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);

        helper = jasmine.createSpyObj('helper', ['toggleExpand']); 
    });

    describe('currentCaseSelected', function() {
        beforeEach(function() {
            CaseActivityController.currentCaseSelected(component, event, helper);
        });
        it('should call the helper method toggleExpand', function() {       
            expect(helper.toggleExpand).toHaveBeenCalledWith(component, event, 'currentCaseActivity');          
        });
    });

    describe('otherCaseSelected', function() {
        beforeEach(function() {
            CaseActivityController.otherCaseSelected(component, event, helper);
        });
        it('should call the helper method toggleExpand', function() {       
            expect(helper.toggleExpand).toHaveBeenCalledWith(component, event, 'otherCaseActivity');          
        });
    });
});
