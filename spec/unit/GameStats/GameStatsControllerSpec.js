var vm = require('vm');var fs = require('fs');var path = require('path');

//var GameStatsController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/GameStats/GameStatsController.js')));

var GameStatsController = require('../../../aura/tsm/GameStats/GameStatsController.js');

var GameStatsController = require('../../../aura/tsm/GameStats/GameStatsController.js');

describe('GameStatsController', function() {
    var component, event, helper, Object,dummy;
    
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement', 'getEvent']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getgameStats']);
    });
	
	describe('doInit', function(){
		beforeEach(function(){
			GameStatsController.doInit(component, event, helper);
		});
		it('Controller Method Invocation', function(){
			expect(component.get).toHaveBeenCalledWith('v.prodname');
		});
		it('Controller Method Invocation', function() {
			expect(helper.getgameStats).toHaveBeenCalled();
        });
	});
	
	describe('handleChange', function(){
		beforeEach(function(){
			GameStatsController.handleChange(component, event, helper);
		});
		it('Controller Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.generalStatsList',(component.get("v.generalStats")));
        });
	});
});



