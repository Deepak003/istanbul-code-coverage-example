const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass', 'removeClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var PaymentFilterModalFooterHelper = require('../../../aura/tsm/PaymentFilterModalFooter/PaymentFilterModalFooterHelper.js');

var PaymentFilterModalFooterHelper = require('../../../aura/tsm/PaymentFilterModalFooter/PaymentFilterModalFooterHelper.js');

describe("PaymentFilterModalFooterHelper", function() {
	let component, event, helper, action, response, responseState;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue('spinner'),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'c.reverseRetailCard' || arg == 'c.redeemRetailCard'){
                    return action;
                }else if(arg == 'v.accountData.id') {
                    return '$';
                }else if(arg == 'v.retailCard.retailCardNumber') {
                    return '9876542345';
                }else if(arg == 'v.accountData') {
                    return '98765';
                }else if(arg == 'v.retailCard.accountId') {
                    return '987654';
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

        // syp action methods
        Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(this, response);
                }
            })
        });

        Object.assign(response, {
            getState: ()=> responseState,
            getReturnValue: ()=> "response here"
        });

        // spy $A methods
        Object.assign($A, {});
    });

    describe('formatRetailCard', function() {
        it('should return formated data', function() {
            const input = {
                "retailCardNumber": "5550332046",
                "status": "REDEEMED",
                "amount": 25.1,
                "currency": "USD",
                "transactionHistory": [{
                    "action": "REDEMPTION",
                    "userId": "1000145101343",
                    "email": "shuanggao@ea.com",
                    "accountId": 1000020901343,
                    "retailCardUri": "/retailcards/5550332046",
                    "billingaccountUri": "/billingaccounts/1000020901343",
                    "currency": "USD",
                    "amount": 25.1,
                    "invoiceUri": "/invoices/1000038901343",
                    "dateCreated": "2013-11-21T07:13Z",
                    "source": "dev",
                    "ipAddress": "10.0.0.1",
                    "actionId": 599536,
                    "actionUuid": "eb93a181-7e24-4a72-a02d-bba3122ed04b"
                },
                {
                    "action": "REDEMPTION",
                    "userId": "1000145101343",
                    "email": "shuanggao@ea.com",
                    "accountId": 1000020901343,
                    "retailCardUri": "/retailcards/5550332046",
                    "billingaccountUri": "/billingaccounts/1000020901343",
                    "currency": "USD",
                    "amount": 25.1,
                    "invoiceUri": "/invoices/1000038101343",
                    "dateCreated": "2013-11-21T07:2Z",
                    "source": "dev",
                    "ipAddress": "10.0.0.1",
                    "actionId": 599534,
                    "actionUuid": "bb93a181-7e24-4a72-a02d-bba3122ed04b"
                },
                {
                    "action": "REVERSAL",
                    "userId": "1000145101343",
                    "email": "shuanggao@ea.com",
                    "accountId": 1000020901343,
                    "retailCardUri": "/retailcards/5550332046",
                    "billingaccountUri": "/billingaccounts/1000020901343",
                    "currency": "USD",
                    "amount": 25.1,
                    "invoiceUri": "/invoices/1000037501343",
                    "dateCreated": "2013-11-21T07:1Z",
                    "source": "dev",
                    "ipAddress": "10.0.0.1",
                    "actionId": 609261,
                    "actionUuid": "cb93a181-7e24-4a72-a02d-bba3122ed04b"
                },
                {
                    "action": "REVERSAL",
                    "userId": "1000145101343",
                    "email": "shuanggao@ea.com",
                    "accountId": 1000020901343,
                    "retailCardUri": "/retailcards/5550332046",
                    "billingaccountUri": "/billingaccounts/1000020901343",
                    "currency": "USD",
                    "amount": 25.1,
                    "invoiceUri": "/invoices/1000038301343",
                    "dateCreated": "2013-11-21T07:12Z",
                    "source": "dev",
                    "ipAddress": "10.0.0.1",
                    "actionId": 599535,
                    "actionUuid": "db93a181-7e24-4a72-a02d-bba3122ed04b"
                }]
            };
            const expectedOutput = {
                "amount": "25.01", 
                "dateCreated": "2013-11-21T07:13Z", 
                "retailCardNumber": "5550332046", 
                "source": "dev", 
                "email": "shuanggao@ea.com", 
                "accountId": 1000020901343, 
                "action": "REDEMPTION", 
                "transactionHistory": [
                    {
                        "amount": 25.1, 
                        "dateCreated": "2013-11-21T07:13Z", 
                        "source": "dev", 
                        "email": "shuanggao@ea.com", 
                        "currency": "USD", 
                        "action": "REDEMPTION", 
                        "actionUuid": "eb93a181-7e24-4a72-a02d-bba3122ed04b", 
                        "billingaccountUri": "/billingaccounts/1000020901343", 
                        "accountId": 1000020901343, 
                        "invoiceUri": "/invoices/1000038901343", 
                        "ipAddress": "10.0.0.1", 
                        "actionId": 599536, 
                        "retailCardUri": "/retailcards/5550332046", 
                        "userId": "1000145101343"
                    }, 
                    {
                        "amount": 25.1, 
                        "dateCreated": "2013-11-21T07:2Z", 
                        "source": "dev", 
                        "email": "shuanggao@ea.com", 
                        "currency": "USD", 
                        "action": "REDEMPTION", 
                        "actionUuid": "bb93a181-7e24-4a72-a02d-bba3122ed04b", 
                        "billingaccountUri": "/billingaccounts/1000020901343", 
                        "accountId": 1000020901343, 
                        "invoiceUri": "/invoices/1000038101343", 
                        "ipAddress": "10.0.0.1", 
                        "actionId": 599534, 
                        "retailCardUri": "/retailcards/5550332046", 
                        "userId": "1000145101343"
                    }, 
                    {
                        "amount": 25.1, 
                        "dateCreated": "2013-11-21T07:1Z", 
                        "source": "dev", 
                        "email": "shuanggao@ea.com", 
                        "currency": "USD", 
                        "action": "REVERSAL", 
                        "actionUuid": "cb93a181-7e24-4a72-a02d-bba3122ed04b", 
                        "billingaccountUri": "/billingaccounts/1000020901343", 
                        "accountId": 1000020901343, 
                        "invoiceUri": "/invoices/1000037501343", 
                        "ipAddress": "10.0.0.1", 
                        "actionId": 609261, 
                        "retailCardUri": "/retailcards/5550332046", 
                        "userId": "1000145101343"
                    }, 
                    {
                        "amount": 25.1, 
                        "dateCreated": "2013-11-21T07:12Z", 
                        "source": "dev", 
                        "email": "shuanggao@ea.com", 
                        "currency": "USD", 
                        "action": "REVERSAL", 
                        "actionUuid": "db93a181-7e24-4a72-a02d-bba3122ed04b", 
                        "billingaccountUri": "/billingaccounts/1000020901343", 
                        "accountId": 1000020901343, 
                        "invoiceUri": "/invoices/1000038301343", 
                        "ipAddress": "10.0.0.1", 
                        "actionId": 599535, 
                        "retailCardUri": "/retailcards/5550332046", 
                        "userId": "1000145101343"
                    }
                ], 
                "actionUuid": "eb93a181-7e24-4a72-a02d-bba3122ed04b", 
                "billingaccountUri": "/billingaccounts/1000020901343", 
                "currency": "USD", 
                "invoiceUri": "/invoices/1000038901343", 
                "ipAddress": "10.0.0.1", 
                "actionId": 599536, 
                "retailCardUri": "/retailcards/5550332046", 
                "status": "REDEEMED", 
                "userId": "1000145101343"
            }
            const output = PaymentFilterModalFooterHelper.formatRetailCard(input);            
            expect(output).toEqual(expectedOutput);
        });
    });

    describe('doReverse', function() {
        it('should call correct apex method', function() {
            PaymentFilterModalFooterHelper.doReverse(component);
            expect(component.get).toHaveBeenCalledWith('c.reverseRetailCard');
        });
        it('should send correct request parameters to apex method', function() {
            PaymentFilterModalFooterHelper.doReverse(component);            
            expect(action.setParams).toHaveBeenCalledWith({ billingAccountId: "987654", retailCardNumber: "9876542345" });           
        });
        it('should show loading', function() {
            PaymentFilterModalFooterHelper.doReverse(component);            
            expect($A.util.removeClass).toHaveBeenCalledWith("spinner", "slds-hide");
        });
        it('should hide loading', function() {
            PaymentFilterModalFooterHelper.doReverse(component);            
            expect($A.util.addClass).toHaveBeenCalledWith("spinner", "slds-hide");
        });
        it('should handle error', function() {
            PaymentFilterModalFooterHelper.doReverse(component);            
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
        it('should handle success', function() {
            responseState="SUCCESS";
            PaymentFilterModalFooterHelper.doReverse(component);            
            expect(Util.handleSuccess).toHaveBeenCalledWith(component, "response here");
        });
    });
 })

