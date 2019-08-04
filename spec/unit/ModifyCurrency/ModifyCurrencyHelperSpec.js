var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction']);

//var ModifyCurrencyHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/ModifyCurrency/ModifyCurrencyHelper.js')), {$A: $A});

var ModifyCurrencyHelper = require('../../../aura/tsm/ModifyCurrency/ModifyCurrencyHelper.js');

var ModifyCurrencyHelper = require('../../../aura/tsm/ModifyCurrency/ModifyCurrencyHelper.js');

describe('ModifyCurrencyHelper', function() {
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
	
	describe('checkAmountHelper', function() {
		beforeEach(function() {
            ModifyCurrencyHelper.checkAmountHelper(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.maxCreditableValue');
			expect(component.get).toHaveBeenCalledWith('v.maxDebitableValue');
        });
		it('Setter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.disableApplyButton',false);
			expect(component.set).toHaveBeenCalledWith('v.requiredVal',false);
        });
    });
	
	describe('onApplyHelper', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.modifyCurrencyOfWallet').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.selectedPersona').and.returnValue({"object":["id:123"]})
			.withArgs('v.selectedRowForModal').and.returnValue('')
			.withArgs('v.nucleusId' ).and.returnValue('')
			.withArgs('v.selectedProduct').and.returnValue('')
			.withArgs('v.currentBalance').and.returnValue('')
			.withArgs('v.selectedAmount').and.returnValue('');
			$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';},
																setParams:function(){return '';}});
            ModifyCurrencyHelper.onApplyHelper(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalledWith('v.selectedPersona');
			expect(component.get).toHaveBeenCalledWith('v.selectedRowForModal');
			expect(component.get).toHaveBeenCalledWith('v.nucleusId');
			expect(component.get).toHaveBeenCalledWith('v.selectedProduct');
			expect(component.get).toHaveBeenCalledWith('v.currentBalance');
			expect(component.get).toHaveBeenCalledWith('v.selectedAmount');
			expect(component.get).toHaveBeenCalledWith('c.modifyCurrencyOfWallet');
        });
		it('Backend Method Invocation', function() {
			expect($A.get).toHaveBeenCalled();
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
});


