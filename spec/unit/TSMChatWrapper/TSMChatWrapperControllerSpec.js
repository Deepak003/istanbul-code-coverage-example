var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

//var TSMChatWrapperController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TSMChatWrapper/TSMChatWrapperController.js')), {$A: $A});

var TSMChatWrapperController = require('../../../aura/tsm/TSMChatWrapper/TSMChatWrapperController.js');

var TSMChatWrapperController = require('../../../aura/tsm/TSMChatWrapper/TSMChatWrapperController.js');

describe('TSMChatWrapperController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['searchDetails']);
    });

    describe('doInit', function() {
        beforeEach(function() {
			TSMChatWrapperController.doInit(component, event, helper);
        });
        it('will call the helper method searchDetails', function() {       
            expect(helper.searchDetails).toHaveBeenCalled();          
        });
    });

    describe('handleOpenCase', function() {
        beforeEach(function() {
            TSMChatWrapperController.handleOpenCase(component, event, helper);
        });
        it('will call the helper method searchCaseData', function() {       
            expect(component.set.calls.count()).toEqual(1);         
        });
    });

});

