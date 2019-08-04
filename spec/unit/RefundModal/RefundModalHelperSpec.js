var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var RefundModalHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/RefundModal/RefundModalHelper.js')), {$A: $A});

var RefundModalHelper = require('../../../aura/tsm/RefundModal/RefundModalHelper.js');

var RefundModalHelper = require('../../../aura/tsm/RefundModal/RefundModalHelper.js');

describe('RefundModalHelper', function() {
    var component, event, helper, module, callback, globalOptin,thirdPartyOptin;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);
        helper = jasmine.createSpyObj('helper', ['getRefundReasons','confirmRefund','getInvoiceDetailsById','itemRowClicked','refundAmountTypeChange','reasonChange','refundAmountChange','updateTotal','updateItemTotal','validateItem']);
        component.find = jasmine.createSpy('find').and.returnValue({one: {}, two: {}});
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"response":[{"Language":"test", "Countries":"test","language":"test_test"}]}'}}
                f(response);
            },
            language: function(){},
            currentCountry: function(){},
            currentLanguage: function(){},
            country: function(){},
            Countries: function(){},
            Languages: function(){},
            id : function(){},
            userValue : function(){},
            email : function(){}
        });
        $A.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: ()=> {},
            fire: function() {}
        });
    });

    describe('getRefundReasons', function() {
        beforeEach(function() {
            RefundModalHelper.getRefundReasons(component, event, helper);
        });
        it('should populate Refund Reasons', function() {
            expect(component.set.calls.count()).toEqual(1);
        });
    });

    describe('updateItemTotal', function() {
        var data = {};
        data.lineItems = [{"formItemRefundTotal": 0, "listSubtotal": 12}];
        beforeEach(function() {
            RefundModalHelper.updateItemTotal(component, data,  0, 10, "currency");
        });
        it('handle updateItemTotal', function() {
            expect(data.lineItems[0].formItemRefundTotal).toEqual('10.00');
        });
    });
});

