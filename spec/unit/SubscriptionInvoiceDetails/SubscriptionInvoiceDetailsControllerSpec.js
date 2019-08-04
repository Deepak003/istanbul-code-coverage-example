const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var SubscriptionInvoiceDetailsController = require('../../../aura/tsm/SubscriptionInvoiceDetails/SubscriptionInvoiceDetailsController.js');

var SubscriptionInvoiceDetailsController = require('../../../aura/tsm/SubscriptionInvoiceDetails/SubscriptionInvoiceDetailsController.js');

describe("SubscriptionInvoiceDetailsController", function() {
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
	        	if(arg == 'v.data') {
	                return {
	                	refunds: [{
	                		transactionType: "REFUND",
	                		statusReason: "COMPLETED"
	                	}]
	                };
	            }else if(arg == 'v.showPopover') {
	            	return false;
	            }
	        }),	       
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should set attribute v.isRefunded', function() {
            SubscriptionInvoiceDetailsController.doInit(component, event, helper);
            expect(component.set).toHaveBeenCalledWith('v.isRefunded', true);
        });
    });

    describe('togglePopover', function() {
        it('should set attribute v.togglePopover', function() {
            SubscriptionInvoiceDetailsController.togglePopover(component, event, helper);
            expect(component.set).toHaveBeenCalledWith('v.showPopover', true);
        });
    });

    describe('handleViewLogs', function() {
        it('should trigger component event with data', function() {
            SubscriptionInvoiceDetailsController.handleViewLogs(component, event, helper);
            expect(component.getEvent).toHaveBeenCalledWith('onClickViewLog');
            expect(component.setParams).toHaveBeenCalledWith({ value: { refunds: [{ transactionType: "REFUND", statusReason: "COMPLETED" }] }});
            expect(component.fire).toHaveBeenCalled();
        });
    });

    describe('handleResendInvoice', function() {
        it('should trigger component event with data', function() {
            SubscriptionInvoiceDetailsController.handleResendInvoice(component, event, helper);
            expect(component.getEvent).toHaveBeenCalledWith('onClickResend');
            expect(component.setParams).toHaveBeenCalledWith({ value: { refunds: [{ transactionType: "REFUND", statusReason: "COMPLETED" }] }});
            expect(component.fire).toHaveBeenCalled();
        });
    });

    describe('onClickRefund', function() {
        it('should trigger component event with data', function() {
            SubscriptionInvoiceDetailsController.handleRefund(component, event, helper);
            expect(component.getEvent).toHaveBeenCalledWith('onClickRefund');
            expect(component.setParams).toHaveBeenCalledWith({ value: { refunds: [{ transactionType: "REFUND", statusReason: "COMPLETED" }] }});
            expect(component.fire).toHaveBeenCalled();
        });
    });
 })

