const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var RefundSubscriptionModalHelper = require('../../../aura/tsm/RefundSubscriptionModal/RefundSubscriptionModalHelper.js');

var RefundSubscriptionModalHelper = require('../../../aura/tsm/RefundSubscriptionModal/RefundSubscriptionModalHelper.js');

describe("RefundSubscriptionModalHelper", function() {
	let component, event, helper, action, response, responseState, responseData;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.nucleusId') {
	                return "12345";
	            }else if(arg == 'c.fetchProratedAmount' || arg == 'c.proratedRefundOriginSubscription' || arg == 'c.refundFullInvoice'){
                    return action;
                }else if(arg == 'v.data.currencySymbol') {
                    return '$';
                }else if(arg == 'v.data.total') {
                    return '500';
                }else if(arg == 'v.data.invoiceId') {
                    return '98765';
                }else if(arg == 'v.subscription.billingAccountId') {
                    return '987654';
                }else if(arg == 'v.subscription.subscriptionId') {
                    return '222222';
                }else if(arg == 'v.subscription.userId') {
                    return '000000';
                }else if(arg == 'v.caseId') {
                    return '111111';
                }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
            setCallback: jasmine.createSpy('setCallback').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

        // syp action methods
        Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(RefundSubscriptionModalHelper, response);
                }
            })
        });

        Object.assign(response, {
            getState: ()=> responseState,
            getReturnValue: ()=> responseData
        });

        // spy $A methods
        Object.assign($A, {
            get: jasmine.createSpy('get').and.returnValue($A),
            fire: jasmine.createSpy('fire').and.returnValue($A)
        });
    });

    describe('pullData', function() {
        it('should call correct apex method', function() {
            RefundSubscriptionModalHelper.pullData(component);
            expect(component.get).toHaveBeenCalledWith('c.fetchProratedAmount');
            expect(action.setParams).toHaveBeenCalledWith({ userId: "12345" });
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });

        it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = { prorationAmount: '100' }

            RefundSubscriptionModalHelper.pullData(component);
            expect(component.set).toHaveBeenCalledWith("v.isLoading", false);
            expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);
        });

        it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";

            RefundSubscriptionModalHelper.pullData(component);            
            expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Full Refund - $500", value: "2"}
            ]);
            expect(component.set).toHaveBeenCalledWith('v.defaultSelected', '2');
            expect(component.set).toHaveBeenCalledWith("v.isLoading", false);
        });
    });

    describe('closeModal', function() {
        it('should close modal', function() {
            RefundSubscriptionModalHelper.closeModal(component);
            expect(component.set).toHaveBeenCalledWith("v.isOpen", false);
        })
    });

    describe('doFullRefund', function() {
        it('should call correct apex method with loading', function() {
            RefundSubscriptionModalHelper.doFullRefund(component);
            expect(component.get).toHaveBeenCalledWith('c.refundFullInvoice');
            expect(action.setParams).toHaveBeenCalledWith({
                invoiceId: "98765", 
                billingAccountId: "987654"
            });
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });

        it('should trigger event by hiding loading on success response', function() {
            responseState = "SUCCESS";

            spyOn(RefundSubscriptionModalHelper, 'closeModal').and.callFake(()=> null);

            RefundSubscriptionModalHelper.doFullRefund(component);

            expect($A.get).toHaveBeenCalledWith('e.c:RefreshSubscription');
            expect($A.fire).toHaveBeenCalled();
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
            expect(RefundSubscriptionModalHelper.closeModal).toHaveBeenCalledWith(component);
        });

        it('should hiding loading on failure response with toast', function() {
            responseState = "FAILURE";

            RefundSubscriptionModalHelper.doFullRefund(component);

            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        })
    });

    describe('doProratedRefund', function() {
        it('should call correct apex method with loading', function() {
            RefundSubscriptionModalHelper.doProratedRefund(component);
            expect(component.get).toHaveBeenCalledWith('c.proratedRefundOriginSubscription');
            expect(action.setParams).toHaveBeenCalledWith({
                mapRequestParams: {
                    subscriptionId: "222222", 
                    caseId: "111111",
                    customerId: "000000"
                }                
            });
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });

        it('should trigger event by hiding loading on success response', function() {
            responseState = "SUCCESS";

            spyOn(RefundSubscriptionModalHelper, 'closeModal').and.callFake(()=> null);

            RefundSubscriptionModalHelper.doProratedRefund(component);

            expect($A.get).toHaveBeenCalledWith('e.c:RefreshSubscription');
            expect($A.fire).toHaveBeenCalled();
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
            expect(RefundSubscriptionModalHelper.closeModal).toHaveBeenCalledWith(component);
        });

        it('should hiding loading on failure response with toast', function() {
            responseState = "FAILURE";

            RefundSubscriptionModalHelper.doProratedRefund(component);

            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        })
    });
 })

