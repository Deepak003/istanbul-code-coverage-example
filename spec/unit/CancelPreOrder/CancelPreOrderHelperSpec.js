var vm = require('vm');var fs = require('fs');
var path = require('path');
const $A = jasmine.createSpyObj('$A', ['get','enqueueAction']);
//var cancelPreOrderHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CancelPreOrder/CancelPreOrderHelper.js')), {$A: $A});
var CancelPreOrderHelper = require('../../../aura/tsm/CancelPreOrder/CancelPreOrderHelper.js');


var CancelPreOrderHelper = require('../../../aura/tsm/CancelPreOrder/CancelPreOrderHelper.js');

describe('cancelPreOrderHelper', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getRefundReasonCodes','confirmCancelPreOrder']);
		action = jasmine.createSpyObj('action', ['setParams']);
		action.setParams = jasmine.createSpy('action.setParams').and.returnValue('');
		component.get = jasmine.createSpy('component.get').and.returnValue('');
		component.find = jasmine.createSpy('component.find').and.returnValue({set: function() {return '';},get: function() {return '';}});
		$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';},
																setParams:function(){return '';}});
        });	
    
    //Spec for getRefundReasonCodes
    describe('getRefundReasonCodes', function() {
        beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.getRefundReasonCodes').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
                getReturnValue:function(){return ''}}               
                f(response);
            }
        });
            cancelPreOrderHelper.getRefundReasonCodes(component);
        });       
        it('Setter Method Invocation', function() {            
            expect(component.set).not.toHaveBeenCalledWith('v.reasons','{"response":[""]}');
        });
        it('Apex Method Invocation', function() {
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
	
	//Spec for confirmCancelPreOrder
    describe('confirmCancelPreOrder', function() {
		beforeEach(function() {						
			component.get = jasmine.createSpy('get').withArgs('c.cancelPreOrder').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.data').and.returnValue(Object({invoiceId: "12345", userId: "123455", status: "active", isRefundable: true }))
			.withArgs('v.data.lineItems').and.returnValue(Object([{itemId : "Malcom", quantity: "Reynolds", description: "sss", productId: "ee", platform: "ddd", isMVPRefundable: "ddd", isRefundAcceptable: "ddd", isMVPLineItem: "ddd"}]))
			.withArgs('v.data.userId').and.returnValue('12345')
			.withArgs('v.data.invoiceId').and.returnValue('12345')
			.withArgs('v.data.status').and.returnValue('Active')
			.withArgs('v.data.isRefundable').and.returnValue('true');
            cancelPreOrderHelper.confirmCancelPreOrder(component);
        });
	   it('Getter Methods Invocation', function() {			
            expect(component.get).toHaveBeenCalledWith('v.data.lineItems');
			expect(component.get).toHaveBeenCalledWith('v.data.userId');
            expect(component.get).toHaveBeenCalledWith('v.data.invoiceId');
			expect(component.get).toHaveBeenCalledWith('v.data.status');
            expect(component.get).toHaveBeenCalledWith('v.data.isRefundable');
		});
	   
		it('Backend Method Invocation', function() {
			expect($A.get).toHaveBeenCalled();
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
	
	
	
});
