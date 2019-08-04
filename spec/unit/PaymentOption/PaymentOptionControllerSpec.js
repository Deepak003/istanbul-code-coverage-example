const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass', 'isEmpty']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var PaymentOptionController = require('../../../aura/tsm/PaymentOption/PaymentOptionController.js');

var PaymentOptionController = require('../../../aura/tsm/PaymentOption/PaymentOptionController.js');

describe("PaymentOptionController", function() {
	let component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        

        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);

        helper = jasmine.createSpyObj('helper', ["fetchInvoicesByPayment", "fetchInvoices", "fetchInvoicesCount", "serverAction", "handleShowModal"]); 
    });

    describe('openSearchPaymentOptionModal', function() {
        beforeEach(function() {
            PaymentOptionController.openSearchPaymentOptionModal(component, event, helper);
        });
        it('should call the component set method', function() {       
            expect(component.set).toHaveBeenCalledWith("v.showPaymentSearchModal", true);
        });
    });

    describe('onChangeInvoicePageNumber', function() {
        let invoiceSource;
        beforeEach(function() {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.invoiceSource') {
                    return invoiceSource;
                }else if(arg == 'v.invoicePageNumber') {
                    return "2";
                }
            });
        });
        it('should call the helper method fetchInvoices', function() {       
            invoiceSource = "payment-option";
            PaymentOptionController.onChangeInvoicePageNumber(component, event, helper);
            expect(helper.fetchInvoices).toHaveBeenCalledWith(component);
        });
        it('should not call the helper method fetchInvoices', function() {       
            invoiceSource = "anything-different-than-payment-option";
            PaymentOptionController.onChangeInvoicePageNumber(component, event, helper);
            expect(helper.fetchInvoices).not.toHaveBeenCalled();
        });
    });

    describe('onSelectedPaymentOptionChange', function() {
        let selectedPaymentOption;
        beforeEach(function() {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.selectedPaymentOption') {
                    return selectedPaymentOption;
                }
            });
        });
        it('should call the helper method fetchInvoicesByPayment', function() {       
            selectedPaymentOption = { id : 12345 };
            PaymentOptionController.onSelectedPaymentOptionChange(component, event, helper);
            expect(helper.fetchInvoicesByPayment).toHaveBeenCalledWith(component);
        });
    });

    describe('togglePaymentCardSelect', function() {
        beforeEach(function() {            
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.paymentOptions') {
                    return [{ accountId : "1234" }, { accountId : "12345" }];
                }
                else if(arg == 'v.selectedPaymentOption') {
                    return { accountId : "1234" };
                }
            });
        });
        it('should clear selectedPaymentOption attribute', function() {
            event = { currentTarget : { dataset : { index : 0 } } }; 
            PaymentOptionController.togglePaymentCardSelect(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.selectedPaymentOption", {});
        });
        it('should set selectedPaymentOption attribute', function() {
            event = { currentTarget : { dataset : { index : 1 } } }; 
            PaymentOptionController.togglePaymentCardSelect(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.selectedPaymentOption", { accountId : "12345" });
        });
    });

    describe('handleActionMenuSelect', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue('delete');
        })
        it('should call helper handleShowModal method', function() {
            PaymentOptionController.handleActionMenuSelect(component, event, helper);    
            expect(helper.handleShowModal).toHaveBeenCalled();
        });
    })

    describe('handleDeletePaymentAccountEvent', function() {
        let paymentOptions = [{ accountId : 12345 }, { accountId : 1234 }, { accountId : 12346 }];
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(paymentOptions[1]);
            component.get = jasmine.createSpy('getParam').and.returnValue(paymentOptions);
        })
        it('should remove payemnt option from UI', function() {
            PaymentOptionController.handleDeletePaymentAccountEvent(component, event, helper); 
            expect(component.set).toHaveBeenCalledWith("v.paymentOptions",  [{ accountId : 12345 }, { accountId : 12346 }]);
        });
    })

    describe('toggleMoreVisibility', function() {        
        it('should set true to UI', function() {
            component.get = jasmine.createSpy('getParam').and.returnValue(false);
            PaymentOptionController.toggleMoreVisibility(component, event, helper); 
            expect(component.set).toHaveBeenCalledWith("v.showAll", true);
        });
    });

    describe('onChangeInvoiceType', function() {
        beforeEach(function() {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.invoiceSource') {
                    return "payment-option";
                }
            });
        });        
        it('should call fetchInvoicesByPayment', function() {
            PaymentOptionController.onChangeInvoiceType(component, event, helper); 
            expect(component.set).toHaveBeenCalledWith("v.invoicePageNumber", 1);
            expect(helper.fetchInvoicesByPayment).toHaveBeenCalledWith(component);
        });
    })
})

