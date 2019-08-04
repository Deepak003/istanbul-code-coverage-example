var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction']);

//var ModifyCurrencyController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/ModifyCurrency/ModifyCurrencyController.js')), {$A: $A});

var ModifyCurrencyController = require('../../../aura/tsm/ModifyCurrency/ModifyCurrencyController.js');

var ModifyCurrencyController = require('../../../aura/tsm/ModifyCurrency/ModifyCurrencyController.js');

describe('ModifyCurrencyController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['checkAmountHelper','onApplyHelper']);
		action = jasmine.createSpyObj('action', ['setParams']);
		action.setParams = jasmine.createSpy('action.setParams').and.returnValue('');
		component.get = jasmine.createSpy('component.get').and.returnValue('');
		component.find = jasmine.createSpy('component.find').and.returnValue({set: function() {return '';},get: function() {return '';}});
        });

	describe('doInit', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.fetchAddCreditToWalletReasons').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.reasons').and.returnValue("")
			.withArgs('v.selectedRowForModal').and.returnValue("");
            ModifyCurrencyController.doInit(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
			expect(component.get).toHaveBeenCalledWith('v.reasons');
			expect(component.get).toHaveBeenCalledWith('v.selectedRowForModal');
			expect(component.get).toHaveBeenCalledWith('c.fetchAddCreditToWalletReasons');
        });
		it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.showDefault',true);
			expect(component.set).toHaveBeenCalledWith('v.options',[{'label': 'Grant', 'value': 'credit'},
																	{'label': 'Debit', 'value': 'debit'}]);
			expect(component.set).toHaveBeenCalledWith('v.maxCreditableValue',undefined);														
        });
		it('Backend Methods Invocation', function() {
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });		
	
	describe('checkAmount', function() {
		beforeEach(function() {
            ModifyCurrencyController.checkAmount(component, event, helper);
        });
        it('Helper Invocation', function() {
			expect(helper.checkAmountHelper).toHaveBeenCalled();
        });
    });
	
	describe('onApply', function() {
		beforeEach(function() {
            ModifyCurrencyController.onApply(component, event, helper);
        });
        it('Helper Invocation', function() {
			expect(helper.onApplyHelper).toHaveBeenCalled();
        });
    });
	
	describe('closeModal', function() {
		beforeEach(function() {
			$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';}});
            ModifyCurrencyController.closeModal(component, event, helper);
        });
        it('Controller Method Invocation', function() {
			expect($A.get).toHaveBeenCalled();
        });
    });
	
});

