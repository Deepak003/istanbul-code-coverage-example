var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

//var TSMWrapper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TSMWrapper/TSMWrapperController.js')), {$A: $A});

var TSMWrapperController = require('../../../aura/tsm/TSMWrapper/TSMWrapperController.js');

var TSMWrapperController = require('../../../aura/tsm/TSMWrapper/TSMWrapperController.js');

describe('TSMWrapper', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['searchDetails']);
        component.find = jasmine.createSpy('find').and.returnValue({});
    });

    describe('doInit', function() {
        beforeEach(function() {
			TSMWrapperController.doInit(component, event, helper);
        });
        it('will call the helper method searchDetails', function() {       
            expect(helper.searchDetails).toHaveBeenCalled();          
        });
    });

});

