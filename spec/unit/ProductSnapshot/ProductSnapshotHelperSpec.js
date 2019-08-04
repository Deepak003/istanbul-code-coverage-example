var vm = require('vm');var fs = require('fs');var path = require('path');

//var ProductSnapshotController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/ProductSnapshot/ProductSnapshotController.js')));

var ProductSnapshotHelper = require('../../../aura/tsm/ProductSnapshot/ProductSnapshotHelper.js');

var ProductSnapshotHelper = require('../../../aura/tsm/ProductSnapshot/ProductSnapshotHelper.js');

describe('ProductSnapshotHelper', function() {
    var component, event, helper;
    
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['generatePersonList','initPersonaDetails','getplatformstatus','firePersonaChange']);
    });
	
	describe('initPersonaDetails', function() {
		beforeEach(function() {
            ProductSnapshotHelper.initPersonaDetails(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.initPersonaDetails).toHaveBeenCalled();
        });
    });
	
	describe('generatePersonList', function() {
		beforeEach(function() {
            ProductSnapshotHelper.generatePersonList(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.generatePersonList).toHaveBeenCalled();
        });
    });
	
	describe('getplatformstatus', function() {
		beforeEach(function() {
            ProductSnapshotHelper.getplatformstatus(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.getplatformstatus).toHaveBeenCalled();
        });
    });
	
	describe('firePersonaChange', function() {
		beforeEach(function() {
            ProductSnapshotHelper.firePersonaChange(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.firePersonaChange).toHaveBeenCalled();
        });
    });
});

