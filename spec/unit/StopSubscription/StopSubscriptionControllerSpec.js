var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction']);

//var StopSubscriptionController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/StopSubscription/StopSubscriptionController.js')), {$A: $A});

var StopSubscriptionController = require('../../../aura/tsm/StopSubscription/StopSubscriptionController.js');

var StopSubscriptionController = require('../../../aura/tsm/StopSubscription/StopSubscriptionController.js');

describe('StopSubscriptionController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getStopSubscriptionDetails','getCancelSubscriptionDetails']);
		action = jasmine.createSpyObj('action', ['setParams']);
		action.setParams = jasmine.createSpy('action.setParams').and.returnValue('');
		component.get = jasmine.createSpy('component.get').and.returnValue('');
		$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';},
																setParams:function(){return '';}});
        });

	describe('doInit', function() {
		beforeEach(function() {
            StopSubscriptionController.doInit(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.subscription');
        });
    });	
	
	describe('closeModal', function() {
		beforeEach(function() {
            StopSubscriptionController.closeModal(component, event, helper);
        });
        it('Setter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.isOpen',false);
        });
    });	
	
	describe('successModal', function() {
		beforeEach(function() {
            StopSubscriptionController.successModal(component, event, helper);
        });
        it('Setter Methods Invocation', function() {
			expect(helper.getCancelSubscriptionDetails).toHaveBeenCalled();
			expect(helper.getStopSubscriptionDetails).not.toHaveBeenCalled();
        });
    });	
});

