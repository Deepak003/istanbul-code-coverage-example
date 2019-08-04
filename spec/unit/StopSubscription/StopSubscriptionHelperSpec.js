var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction']);

//var StopSubscriptionHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/StopSubscription/StopSubscriptionHelper.js')), {$A: $A});

var StopSubscriptionHelper = require('../../../aura/tsm/StopSubscription/StopSubscriptionHelper.js');

var StopSubscriptionHelper = require('../../../aura/tsm/StopSubscription/StopSubscriptionHelper.js');

describe('StopSubscriptionHelper', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getOriginStopOrCancelSubscription','getCancelSubscriptionDetails']);
		action = jasmine.createSpyObj('action', ['setParams']);
		action.setParams = jasmine.createSpy('action.setParams').and.returnValue('');
		component.get = jasmine.createSpy('component.get').and.returnValue('');
		$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';},
																setParams:function(){return '';}});
        });

	describe('getStopSubscriptionDetails', function() {
		beforeEach(function() {
            StopSubscriptionHelper.getStopSubscriptionDetails(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.subscriptionType');
        });
    });	
	
	describe('getCancelSubscriptionDetails', function() {
		beforeEach(function() {
            StopSubscriptionHelper.getCancelSubscriptionDetails(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.subscriptionType');
        });
    });	
	
	describe('getOriginStopOrCancelSubscription', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.stopOrCancelOriginSubscriptions').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.subscription').and.returnValue("")
			.withArgs('v.caseId').and.returnValue("");
            StopSubscriptionHelper.getOriginStopOrCancelSubscription(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.subscription');
			expect(component.get).toHaveBeenCalled();
        });
    });	
		
	describe('getNucleusStopSubscription', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.stopOrCancelSubscriptions').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.subscription').and.returnValue("")
			.withArgs('v.caseId').and.returnValue("");
            StopSubscriptionHelper.getNucleusStopSubscription(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.subscription');
			expect(component.set).toHaveBeenCalledWith('v.isOpen',false);
        });
    });		
});

