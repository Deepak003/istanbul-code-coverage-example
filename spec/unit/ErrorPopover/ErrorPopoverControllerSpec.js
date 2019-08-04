const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

var ErrorPopoverController = require('../../../aura/tsm/ErrorPopover/ErrorPopoverController.js');

var ErrorPopoverController = require('../../../aura/tsm/ErrorPopover/ErrorPopoverController.js');

describe("ErrorPopoverController", function() {
	let component, event, helper;
	beforeEach(function() {
		component = jasmine.createSpyObj('component', ['set']);
		event = jasmine.createSpyObj('event', ['']);
		helper = jasmine.createSpyObj('helper', ['closePopover', 'getDetails']);
	})
	describe('handleClose', function() {
		it('should call the helper method closePopover', function() {       
            ErrorPopoverController.handleClose(component, event, helper);
            expect(helper.closePopover).toHaveBeenCalledWith(component);
        });
	});
	describe('doInit', function() {
		it('should call the helper method getDetails', function() {       
            ErrorPopoverController.doInit(component, event, helper);
            expect(helper.getDetails).toHaveBeenCalledWith(component);
        });
	});
})



