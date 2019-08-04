var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get', 'util', 'enqueueAction']);
$A.util.removeClass = jasmine.createSpy('removeClass').and.returnValue({});
$A.util.addClass = jasmine.createSpy('addClass').and.returnValue({});
//var CodeSearchHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CodeSearch/CodeSearchHelper.js')), {$A: $A});

var CodeSearchHelper = require('../../../aura/tsm/CodeSearch/CodeSearchHelper.js');

var CodeSearchHelper = require('../../../aura/tsm/CodeSearch/CodeSearchHelper.js');

describe('CodeSearchHelper', function() {
    var component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        event.keyCode = 13;
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {},
            setCallback: ()=> {}
        });

    });

    describe('searchCode', function() {
        beforeEach(function() {
            CodeSearchHelper.searchCode(component, event);
        });
        it('should  call search code api', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
        it('should call consume code api', function() {
            expect($A.enqueueAction).toHaveBeenCalled();
        });


    });

    describe('prepareDataForRender', function() {
        beforeEach(function() {
            var data = {};
            data.multiUse = false;
            data.status = 'UNUSED';
            CodeSearchHelper.prepareDataForRender(component, event, data);
        });
        it('should  get required data', function() {
            expect(component.set.calls.count()).toEqual(8);
        });
        
    });
});

