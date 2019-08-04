const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var SubscriptionInvoiceModalController = require('../../../aura/tsm/SubscriptionInvoiceModal/SubscriptionInvoiceModalController.js');

var SubscriptionInvoiceModalController = require('../../../aura/tsm/SubscriptionInvoiceModal/SubscriptionInvoiceModalController.js');

describe("SubscriptionInvoiceModalController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.invoiceSource') {
	                return invoiceSource;
	            }else if(arg == 'v.subscription') {
	            	return { 
	            		invoices : [
	            			{ 
	            				creditCardTransaction : { provider : "abc", providerReference : "xyz" }
	            			}
	            		],
	            		productName: "abcd"
	            	};
	            }
	        })
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue({ invoiceId : "12345678" }),
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
    	beforeEach(function() {
            SubscriptionInvoiceModalController.doInit(component, event, helper);
        });
        it('should set attribute v.invoices', function() {
            expect(component.set).toHaveBeenCalledWith('v.invoices', [{ creditCardTransaction : { provider : "abc", providerReference : "xyz" }, provider : "abc", providerReference : "xyz", productName : "abcd" }]);
        });
    });

    describe('handleCloseClick', function() {
        beforeEach(function() {
            SubscriptionInvoiceModalController.handleCloseClick(component, event, helper);
        });
        it('should set attribute v.isOpen to false', function() {
            expect(component.set).toHaveBeenCalledWith('v.isOpen', false);
        });
    });

    describe('onClickViewLog', function() {
        beforeEach(function() {
            SubscriptionInvoiceModalController.onClickViewLog(component, event, helper);
        });
        it('should set attribute v.isOpen to false', function() {
            expect(component.set).toHaveBeenCalledWith('v.isOpen', false);
        });
        it('should set attribute v.transactionLogModal.isOpen to true', function() {
            expect(component.set).toHaveBeenCalledWith('v.transactionLogModal.isOpen', true);
        });
        it('should set attribute v.transactionLogModal.data', function() {
            expect(component.set).toHaveBeenCalledWith('v.transactionLogModal.data', { invoiceId : "12345678" });
        });
    });

    describe('onClickResend', function() {
        beforeEach(function() {
            SubscriptionInvoiceModalController.onClickResend(component, event, helper);
        });
        it('should set attribute v.isOpen to false', function() {
            expect(component.set).toHaveBeenCalledWith('v.isOpen', false);
        });
        it('should set attribute v.resendInvoiceModal.isOpen to true', function() {
            expect(component.set).toHaveBeenCalledWith('v.resendInvoiceModal.isOpen', true);
        });
        it('should set attribute v.resendInvoiceModal.data', function() {
            expect(component.set).toHaveBeenCalledWith('v.resendInvoiceModal.data', { invoiceId : "12345678" });
        });
    });

    describe('handleRefund', function() {
        beforeEach(function() {
            SubscriptionInvoiceModalController.handleRefund(component, event, helper);
        });
        it('should set attribute v.isOpen to false', function() {
            expect(component.set).toHaveBeenCalledWith('v.isOpen', false);
        });
        it('should set attribute v.refundModal.isOpen to true', function() {
            expect(component.set).toHaveBeenCalledWith('v.refundModal.isOpen', true);
        });
        it('should set attribute v.refundModal.invoice', function() {
            expect(component.set).toHaveBeenCalledWith('v.refundModal.invoice', { invoiceId : "12345678" });
        });
    });

})

