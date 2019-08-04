var vm = require('vm');var fs = require('fs');var path = require('path');

//var ProductSnapshotController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/ProductSnapshot/ProductSnapshotController.js')));

var ProductSnapshotController = require('../../../aura/tsm/ProductSnapshot/ProductSnapshotController.js');

var ProductSnapshotController = require('../../../aura/tsm/ProductSnapshot/ProductSnapshotController.js');

describe('ProductSnapshotController', function() {
    var component, event, helper, clubList;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement', 'getEvent']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['initPersonaDetails','getplatformstatus','generatePersonList','firePersonaChange']);
		event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}});
    });
	
	//Spec for doInit
	describe('doInit', function() {
		beforeEach(function() {
            ProductSnapshotController.doInit(component, event, helper);
        });
        it('Controller Method Invocation', function() {
			expect(helper.initPersonaDetails).toHaveBeenCalled();
        });
		it('Controller Method Invocation', function() {
			expect(helper.getplatformstatus).toHaveBeenCalled();
        });
    });
	
	//Spec for handleApplicationEvent
	describe('handleApplicationEvent', function() {
		beforeEach(function() {
            ProductSnapshotController.handleApplicationEvent(component, event, helper);
        });
    });
	
	//Spec for handleActionMenuSelect
	describe('handleActionMenuSelect', function() {
		beforeEach(function() {
			 ProductSnapshotController.handleActionMenuSelect(component, event, helper);
			})
			it('Controller Method Invocation', function() {
				expect(event.getParam).toHaveBeenCalledWith('value');
			});
		});
	
	//Spec for onChangePersona
	describe('onChangePersona', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('component.get').and.returnValue('FIFA');
			event.getSource = jasmine.createSpy('getSource').and.returnValue({get:function(){return 0;}
			});
			ProductSnapshotController.onChangePersona(component, event, helper);
        });
	
        it('Controller Method Invocation 1', function() {
			expect(component.get).toHaveBeenCalledWith('v.clubList');
        });
		
		it('Controller Method Invocation 2', function() {
			expect(component.set).toHaveBeenCalledWith('v.isGameMode',false);
        });
		
		it('Helper Method Invocation from Controller', function() {
			expect(helper.firePersonaChange).toHaveBeenCalled();
        });
		
    });
	
	//Spec for onChangeGameMode
	describe('onChangeGameMode', function() {
		beforeEach(function() {
			ProductSnapshotController.onChangeGameMode(component, event, helper);
		});
        it('Controller Method Invocation', function() {
			expect(component.get).toHaveBeenCalled();
        });
		it('Controller Method Invocation', function() {
			expect(component.get).not.toHaveBeenCalledWith('v.selectedGameMode');
        });
    });	
});

