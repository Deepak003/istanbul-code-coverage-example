var vm = require('vm');var fs = require('fs');
var path = require('path');

//var cancelPreOrderController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CancelPreOrder/CancelPreOrderController.js')));
var CancelPreOrderController = require('../../../aura/tsm/CancelPreOrder/CancelPreOrderController.js');


var CancelPreOrderController = require('../../../aura/tsm/CancelPreOrder/CancelPreOrderController.js');

describe('cancelPreOrderController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        helper = jasmine.createSpyObj('helper', ['getRefundReasonCodes', 'confirmCancelPreOrder']);
    });
	
	//Spec for doInit
	describe('doInit', function() {
		beforeEach(function() {
            cancelPreOrderController.doInit(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.getRefundReasonCodes).toHaveBeenCalled();
        });
    });
	
	//Spec for enableConfirmButton
	describe('enableConfirmButton', function() {
		beforeEach(function() {
            cancelPreOrderController.enableConfirmButton(component, event, helper);
        });
        it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.disableConfirmButton',false);
        });
    });
	
	
	//Spec for confirmCancelPreOrder
	describe('confirmCancelPreOrder', function() {
		beforeEach(function() {
            cancelPreOrderController.confirmCancelPreOrder(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.confirmCancelPreOrder).toHaveBeenCalled();
        });
    });
	
	
	//Spec for closePreOrder
	describe('closePreOrder', function() {
		beforeEach(function() {
            cancelPreOrderController.closePreOrder(component, event, helper);
        });
        it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalled();
        });
		it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.openCancelPreOrder',false);
        });
    });
});
