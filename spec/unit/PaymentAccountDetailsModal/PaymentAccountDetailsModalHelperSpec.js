var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var PaymentAccountDetailsModalHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalHelper.js')), {$A: $A});

var PaymentAccountDetailsModalHelper = require('../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalHelper.js');

var PaymentAccountDetailsModalHelper = require('../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalHelper.js');

describe('PaymentAccountDetailsModalHelper', function() {
    var component, event, helper, module, callback, globalOptin,thirdPartyOptin;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['  updateCustomerFlag','saveAccountData','showSpinner','hideSpinner', 'showSocialSpinner', 'hideSocialSpinner']);
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
            fire: function() {}
        });
    });

    describe('populateWWCEObjects', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalHelper.populateWWCEObjects(component, event, helper);
        });
        it('should populate WWCE Objects', function() {
            expect(component.set.calls.count()).toEqual(3);
        });
    });

    describe('setupData', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalHelper.setupData(component, event, helper);
        });
        it('prepare data for form', function() {
            expect(component.set.calls.count()).toEqual(8);
        });
    });

    describe('handleCountryChange', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalHelper.handleCountryChange(component, event);
        });
        it('handle country change event', function() {
            expect(component.set.calls.count()).toEqual(1);
        });
    });



});

