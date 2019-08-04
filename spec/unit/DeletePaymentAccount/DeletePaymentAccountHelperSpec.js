const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors']);

var DeletePaymentAccountHelper = require('../../../aura/tsm/DeletePaymentAccount/DeletePaymentAccountHelper.js');

var DeletePaymentAccountHelper = require('../../../aura/tsm/DeletePaymentAccount/DeletePaymentAccountHelper.js');

describe('DeletePaymentAccountHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
    });
    describe('getPendingCharges', ()=> {
        let action, strAccountId;
        beforeEach(()=> {
            action = jasmine.createSpyObj('action', ['setCallback', 'setParams']);
            strAccountId = "1234567";

            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.paymentAccountId') {
                    return strAccountId;
                } else if (arg == 'c.getPendingInvoices') {
                    return action;
                }
            });
        });
        it('should call backend with strAccountId parameter', ()=> {
            DeletePaymentAccountHelper.getPendingCharges(component);
            expect(action.setParams).toHaveBeenCalledWith({ strAccountId });
        });
        it('should call method setCallback', ()=> {
            DeletePaymentAccountHelper.getPendingCharges(component);
            expect(action.setCallback).toHaveBeenCalled();
        });
        it('should call backend', ()=> {
            DeletePaymentAccountHelper.getPendingCharges(component);
            expect($A.enqueueAction).toHaveBeenCalledWith(action);
        });
    });
    describe('deleteAccount', ()=> {
        let action, strAccountId, reason, response;
        beforeEach(()=> {
            action = jasmine.createSpyObj('action', ['setCallback', 'setParams']);
            strAccountId = "1234567",
            reason = "TestMsg";

            response = {
                getState : ()=> {
                    if(strAccountId == '1234567')
                        return "SUCCESS"
                    else 
                        return "somethingOtherThanSuccess"
                }
            }

            action.setCallback = jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1(response);
                }
            })

            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.paymentAccountId') {
                    return strAccountId;
                } else if (arg == 'c.deleteBillingAccount') {
                    return action;
                } else if (arg == 'v.reason') {
                    return reason;
                }
            });
        });
        it('should call backend with strAccountId & reason parameter', ()=> {
            DeletePaymentAccountHelper.deleteAccount(component);
            expect(action.setParams).toHaveBeenCalledWith({ strAccountId, reason });
        });
        it('should call method setCallback', ()=> {
            DeletePaymentAccountHelper.deleteAccount(component);
            expect(action.setCallback).toHaveBeenCalled();
        });
        it('should call backend', ()=> {
            DeletePaymentAccountHelper.deleteAccount(component);
            expect($A.enqueueAction).toHaveBeenCalledWith(action);
        });
        it('should set v.isOpen to false on success', ()=> {
            DeletePaymentAccountHelper.deleteAccount(component);
            expect(component.set).toHaveBeenCalledWith('v.isOpen', false);
        });
        it('should call handleErrors on failure', ()=> {
            strAccountId = "123456";
            DeletePaymentAccountHelper.deleteAccount(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
    });
})

