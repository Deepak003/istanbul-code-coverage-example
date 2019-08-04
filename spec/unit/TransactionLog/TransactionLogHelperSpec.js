var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);

//var transactionLogHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TransactionLog/TransactionLogHelper.js')), {$A: $A});

var TransactionLogHelper = require('../../../aura/tsm/TransactionLog/TransactionLogHelper.js');

var TransactionLogHelper = require('../../../aura/tsm/TransactionLog/TransactionLogHelper.js');

describe('transactionLogHelper', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getTransactionLogs']);
        
        component.get = jasmine.createSpy('get').withArgs('c.getTransactionLogsByInvoiceId').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
                getReturnValue:function(){return ''}}               
                f(response);
            }
        })
        .withArgs('v.invoiceId').and.returnValue("1234567890");       
        });
    
    //Spec for getTransactionLogs
    describe('getTransactionLogs', function() {
        beforeEach(function() {
            TransactionLogHelper.getTransactionLogs(component, event, helper);
        });
        it('Getter Method Invocation', function() {
            expect(component.get).toHaveBeenCalledWith('v.invoiceId');
        });
        it('Setter Method Invocation', function() {            
            expect(component.set).not.toHaveBeenCalledWith('v.transactionLogList','{"response":[""]}');
        });
        it('Apex Method Invocation', function() {
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
});

