var vm = require('vm');var fs = require('fs');var path = require('path');

//var transactionLogController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TransactionLog/TransactionLogController.js')));

var TransactionLogController = require('../../../aura/tsm/TransactionLog/TransactionLogController.js');

var TransactionLogController = require('../../../aura/tsm/TransactionLog/TransactionLogController.js');

describe('transactionLogController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        helper = jasmine.createSpyObj('helper', ['getTransactionLogs']);
    });
	
	//Spec for doInit
	describe('doInit', function() {
		beforeEach(function() {
            TransactionLogController.doInit(component, event, helper);
        });
        it('Helper Method Invocation', function() {
			expect(helper.getTransactionLogs).toHaveBeenCalled();
        });
    });
	
	//Spec for closeTransactionLog
	describe('closeTransactionLog', function() {
		beforeEach(function() {
            TransactionLogController.closeTransactionLog(component, event, helper);
        });
        it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalled();
        });
		it('Setter Method Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.openTransactionLogs',false);
        });
    });
});

