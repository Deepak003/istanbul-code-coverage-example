var vm = require('vm');var fs = require('fs');var path = require('path');
//var GameStatsController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/GameStats/GamestatsController.js')));

var GameStatsHelper = require('../../../aura/tsm/GameStats/GameStatsHelper.js');

var GameStatsHelper = require('../../../aura/tsm/GameStats/GameStatsHelper.js');

describe('GameStatsHelper', function() {
    var component, event, helper, $A = { util: {}}, module;
    
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement', 'getEvent']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getgameStats']);
    });
	
	describe('getgameStats', function(){
		beforeEach(function(){
			GameStatsHelper.getgameStats(component, event, helper);
		});
		it('Helper Method Invocation', function() {
			expect(helper.getgameStats).toHaveBeenCalled();
        });
	});
});

