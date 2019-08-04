const vm = require('vm');const fs = require('fs');
const path = require('path');

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass','toggleClass']);

/* const rootPath = process.cwd();

const target = 'CaseHistory/CaseHistoryHelper.js';
const CaseHistoryHelper = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
); */
var CaseHistoryHelper = require('../../../aura/tsm/CaseHistory/CaseHistoryHelper.js');


var CaseHistoryHelper = require('../../../aura/tsm/CaseHistory/CaseHistoryHelper.js');

describe('CaseHistoryHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
    });

    describe('getCaseHistoryData', ()=> {
        beforeEach(()=> {
			CaseHistoryHelper.getCaseHistoryData(component);
        });
        it('should call $A.enqueueAction', ()=> {
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });

})
