var vm = require('vm');var fs = require('fs');var path = require('path');

//var viewcodesController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/viewcodes/viewcodesController.js')));

var viewcodesController = require('../../../aura/tsm/viewcodes/viewcodesController.js');

var viewcodesController = require('../../../aura/tsm/viewcodes/viewcodesController.js');

describe('viewcodesController', function() {
    var component, event, helper, clubList;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        helper = jasmine.createSpyObj('helper', ['initHelper']);
    });
	
	//Spec for doInit
	describe('doInit', function() {
		beforeEach(function() {
            viewcodesController.doInit(component, event, helper);
        });
        it('Controller Method Invocation', function() {
			expect(helper.initHelper).toHaveBeenCalled();
        });
    });
	
	//Spec for closeviewcodes
	describe('closeviewcodes', function() {
		beforeEach(function() {
            viewcodesController.closeviewcodes(component, event, helper);
        });
        it('Controller Method Invocation', function() {
			expect(component.set).toHaveBeenCalled();
        });
		it('Controller Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.viewcodes',false);
        });
    });
});

