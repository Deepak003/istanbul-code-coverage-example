var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'removeClass', 'addClass', 'slds-hide', 'isEmpty']),  enqueueAction: function() {}};
//var SubscriptionAccordionController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionController.js')), {$A: $A});

var SubscriptionAccordionController = require('../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionController.js');

var SubscriptionAccordionController = require('../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionController.js');

describe("SubscriptionAccordionController", function() {
    var component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
         get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return {"v.subscriptionType":"Origin"}}}
                f(response);
            }
        });
        helper = jasmine.createSpyObj('helper', ['toggleSubscriptionRow']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam','currentTarget']);
        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['dataset']);
        event.currentTarget.dataset.index=0;
    });

    describe('doInit', function() {
        beforeEach(function() {
            component.get = jasmine.createSpy('component.get').and.returnValue('Origin');
            component.set = jasmine.createSpy('component.set').and.returnValue(true);
            SubscriptionAccordionController.doInit(component, event);
        });
        it('should get the subscriptionType attribute', function() {       
            expect(component.get).toHaveBeenCalledWith('v.subscriptionType');
        });

        it('should set the openSection attribute with subscriptionType', ()=> {
        	expect(component.set).toHaveBeenCalledWith('v.openSection',true);
        });
    });
    
    describe('expandClick', function() {
        beforeEach(function() {
            SubscriptionAccordionController.expandClick(component, event, helper);
        });
        it('will call the expand click', function() {    
            expect(helper.toggleSubscriptionRow).toHaveBeenCalled();             
        });
    });

    describe('toggleExpand', function() {
        beforeEach(function() {
            SubscriptionAccordionController.toggleExpand(component, event);
        });
        it('should get the openSection attribute', function() {       
            expect(component.set).toHaveBeenCalledWith('v.openSection',false);
        });
    });

    describe('openInvoices', function() {
        beforeEach(function() {
            event.getSource = jasmine.createSpy('getSource').and.returnValue({get:()=>'12345'});
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.currentSubscription') {
                    return { subscriptionId : '1234'};
                } else if (arg == 'v.previousSubscriptions') {
                    return [{ subscriptionId : '12345' }, { subscriptionId : '123456' }];
                } else if (arg == 'v.invoiceModal.isOpen') {
                    return false;
                }
            });
        });
        it('should open invoice modal', function() {
            SubscriptionAccordionController.openInvoices(component, event, helper);
            expect(component.set).toHaveBeenCalledWith('v.invoiceModal.isOpen', true);
            expect(component.set).toHaveBeenCalledWith('v.invoiceModal.subscription', { subscriptionId : '12345' });
        });
    });    
});

