const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

var HiddenAccountDataController = require('../../../aura/tsm/HiddenAccountData/HiddenAccountDataController.js');

var HiddenAccountDataController = require('../../../aura/tsm/HiddenAccountData/HiddenAccountDataController.js');

describe("HiddenAccountDataController", function() {
	let component, event, helper;
	beforeEach(function() {
		component = jasmine.createSpyObj('component', ['set']);
		event = jasmine.createSpyObj('event', ['']);
		helper = jasmine.createSpyObj('helper', ['']);
	})
	describe('handleClick', function() {
		beforeEach(function() {
			HiddenAccountDataController.handleClick(component, event, helper);
		});
		it('should call the helper method fetchData', function() {
			expect(component.set).toHaveBeenCalledWith('v.openAOVFlow', true);
		});		
	});
})



