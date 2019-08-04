var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'removeClass', 'addClass'])};

const rootPath = process.cwd();

var SubscriptionController = require('../../../aura/tsm/Subscription/SubscriptionController.js');

var SubscriptionController = require('../../../aura/tsm/Subscription/SubscriptionController.js');

describe("SubscriptionController", function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['setOriginSubscriptions', 'setNucleusSubscriptions', 'setEAAccessSubscriptions', 'fetchOriginSubscriptionOption', 'fetchAllBillingAccountsByUserHelper']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getParam = jasmine.createSpy('getParam').and.returnValue(true);
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');

        // syp component methods
        Object.assign(component, {
            get: jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.activeSubscription') {
                    return { id: '1234', offerId: '1234' };
                }else if(arg == 'v.originSubscriptionOptions') {
                    return [{offerId: '1234', productName: 'product-1'}];
                }
            })
        });
    });

    describe('doInit', function() {
        beforeEach(function() {
            SubscriptionController.doInit(component, event, helper);
        });
        it('should call the helper methods', function() {                   
            expect(helper.setOriginSubscriptions).toHaveBeenCalledWith(component, event);
            expect(helper.setNucleusSubscriptions).toHaveBeenCalledWith(component, event);
            expect(helper.setEAAccessSubscriptions).toHaveBeenCalledWith(component, event);
            expect(helper.fetchOriginSubscriptionOption).toHaveBeenCalledWith(component);
        });
    });
    describe('setUpcomingSubscriptionOption', function() {
        beforeEach(function() {
            SubscriptionController.setUpcomingSubscriptionOption(component);
        });
        it('should set activeSubscription', function() {                   
            expect(component.set).toHaveBeenCalledWith('v.activeSubscription', {id: '1234', offerId: '1234', upcomingSubscriptionOption: {offerId: '1234', productName: 'product-1'}});
        });
    });    
});

