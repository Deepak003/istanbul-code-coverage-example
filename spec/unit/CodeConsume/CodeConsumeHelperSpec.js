var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction','localizationService']);
//var codeConsumeHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CodeConsume/CodeConsumeHelper.js')), {$A: $A});

var CodeConsumeHelper = require('../../../aura/tsm/CodeConsume/CodeConsumeHelper.js');

var CodeConsumeHelper = require('../../../aura/tsm/CodeConsume/CodeConsumeHelper.js');

describe('CodeConsumeHelper', function() {
    var component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

    });

    describe('consumeCode', function() {
        beforeEach(function() {
            CodeConsumeHelper.consumeCode(component, event);
        });
        it('should  get required data', function() {
            expect(component.get.calls.count()).toEqual(5);
        });
        it('should call consume code api', function() {
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
});

