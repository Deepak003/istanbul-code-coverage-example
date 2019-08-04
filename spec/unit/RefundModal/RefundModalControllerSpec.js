var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};
//var JSON = {parse: null};
//JSON.parse = jasmine.createSpy('parse').and.returnValue({response: [{}]});

//var RefundModalController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/RefundModal/RefundModalController.js')), {$A: $A});

var RefundModalController = require('../../../aura/tsm/RefundModal/RefundModalController.js');

var RefundModalController = require('../../../aura/tsm/RefundModal/RefundModalController.js');

describe('RefundModalController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getRefundReasons','confirmRefund','getInvoiceDetailsById','itemRowClicked','refundAmountTypeChange','reasonChange','refundAmountChange','updateTotal','updateItemTotal','validateItem']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('doInit', function() {
        beforeEach(function() {
            RefundModalController.doInit(component, event, helper);
        });
        it('will call the helper method getRefundReasons', function() {
            expect(helper.getRefundReasons).toHaveBeenCalled();
        });
    });

    describe('closeRefundModal', function() {
        beforeEach(function() {
            RefundModalController.closeRefundModal(component, event, helper);
        });
        it('will hide the modal', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
    });

    describe('enableConfirmButton', function() {
        beforeEach(function() {
            RefundModalController.enableConfirmButton(component, event, helper);
        });
        it('will enable confirm button', function() {
            expect(component.set.calls.count()).toEqual(1);
        });
    });

    describe('confirmRefund', function() {
        beforeEach(function() {
            RefundModalController.confirmRefund(component, event, helper);
        });
        it('will call the helper method confirmRefund', function() {
            expect(helper.confirmRefund).toHaveBeenCalled();
        });
    });

    describe('rowClicked', function() {
        beforeEach(function() {
            RefundModalController.rowClicked(component, event, helper);
        });
        it('will call the helper method itemRowClicked', function() {
            expect(helper.itemRowClicked).toHaveBeenCalled();
        });
    });

    describe('handleRefundAmountTypeChange', function() {
        beforeEach(function() {
            RefundModalController.handleRefundAmountTypeChange(component, event, helper);
        });
        it('will call the helper method refundAmountTypeChange', function() {
            expect(helper.refundAmountTypeChange).toHaveBeenCalled();
        });
    });

    describe('handleReasonChange', function() {
        beforeEach(function() {
            RefundModalController.handleReasonChange(component, event, helper);
        });
        it('will call the helper method reasonChange', function() {
            expect(helper.reasonChange).toHaveBeenCalled();
        });
    });

    describe('handleRefundAmoundChange', function() {
        beforeEach(function() {
            RefundModalController.handleRefundAmoundChange(component, event, helper);
        });
        it('will call the helper method refundAmountChange', function() {
            expect(helper.refundAmountChange).toHaveBeenCalled();
        });
    });

});

