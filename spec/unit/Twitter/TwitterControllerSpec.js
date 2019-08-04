var vm = require('vm');var fs = require('fs');var path = require('path');

var clearInterval = jasmine.createSpy('clearInterval');
var setInterval = jasmine.createSpy('setInterval');

const $A = jasmine.createSpyObj('$A', ['get', 'getCallback']);

//var TwitterController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/Twitter/TwitterController.js')), {$A: $A, clearInterval, setInterval});

var TwitterController = require('../../../aura/tsm/Twitter/TwitterController.js');

var TwitterController = require('../../../aura/tsm/Twitter/TwitterController.js');

describe('TwitterController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['currentTarget', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['updatePaginationData','handleChange','toggleRow','onCategoryChange','handlePageChange']);
        component.get = jasmine.createSpy('component.get').and.returnValue('');
        });
		

	describe('On load/refresh', function() {
		beforeEach(function() {
            TwitterController.onRefresh(component, event, helper);
        });
        it('Controller Method invoked', function() {
            expect(component.set).toHaveBeenCalledWith('v.timeCount', 0);
            expect(component.get).toHaveBeenCalledWith('v.twitterList');
        });
        it('App loaded from static resources', function() {
            expect($A.get).toHaveBeenCalled();
        });
    });
	
});

