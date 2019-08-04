var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};


//var CodeConsumeController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CodeConsume/CodeConsumeController.js')), {$A: $A});

var CodeConsumeController = require('../../../aura/tsm/CodeConsume/CodeConsumeController.js');

var CodeConsumeController = require('../../../aura/tsm/CodeConsume/CodeConsumeController.js');

describe('CodeSearchController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['consumeCode']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('closeConsumeCodes', function() {
        beforeEach(function() {
            CodeConsumeController.closeConsumeCodes(component, event, helper);
        });
        it('will  close modal', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
    });

    describe('confirmConsume', function() {
        beforeEach(function() {
            CodeConsumeController.confirmConsume(component, event, helper);
        });
        it('will call consume code api', function() {
            expect(helper.consumeCode).toHaveBeenCalled();
        });
    });

});

