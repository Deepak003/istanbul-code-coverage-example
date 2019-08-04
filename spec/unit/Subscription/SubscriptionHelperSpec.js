var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'removeClass', 'addClass', 'slds-hide', 'isEmpty']),  enqueueAction: function() {}};
const rootPath = process.cwd();

//var SubscriptionHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/Subscription/SubscriptionHelper.js')), {$A: $A});
var SubscriptionHelper = require('../../../aura/tsm/Subscription/SubscriptionHelper.js');

var SubscriptionHelper = require('../../../aura/tsm/Subscription/SubscriptionHelper.js');

describe('SubscriptionHelper', () => {
    var component, event, responseObj = {};    
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
               
        component.find = jasmine.createSpy('find').and.returnValue({one: {}, two: {}});
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                f.call(s, {
                    getState:()=>{
                        return "SUCCESS"
                    },
                    getReturnValue:()=>{
                        return responseObj;
                    }
                });                
            }
        });        
        $A.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            fire: function() {}
        });        
    });
    
    describe('setOriginSubscriptions',function() {
        beforeEach(function() {
            responseObj = {};
            spyOn(SubscriptionHelper, "checkStackSubscription");
            SubscriptionHelper.setOriginSubscriptions(component, event);               
        });
        it('will call the controller function for checkStackSubscription', function() {      
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(3);
            expect(component.find.calls.count()).toEqual(2);
            expect(component.set).toHaveBeenCalledWith('v.subscriptionType','Origin');
        });     
    });

    describe('getActiveSubscription',function() {
        beforeEach(function() {
            let subsStartDate=new Date().setDate(new Date().getDate() -1);
            let subsEndDate = new Date().setDate(new Date().getDate() +10);
            responseObj = {'response': [{'status':'ENABLED', 'offerDetails':{'productName': '123'},'billingMode':'RECURRING', 'subsStart': subsStartDate, 'subsEnd':subsEndDate}]};            
            spyOn(SubscriptionHelper, "getActiveSubscription");
            SubscriptionHelper.getActiveSubscription(responseObj);
        });
        it('will get active subscription', function() {         
            expect(SubscriptionHelper.getActiveSubscription).toHaveBeenCalledWith(responseObj);   
        });     
    });

    describe('getPreviousSubscriptionList',function() {
        beforeEach(function() {
            let subsStartDate=new Date().setDate(new Date().getDate() -1);
            let subsEndDate = new Date().setDate(new Date().getDate() +10);
            let dateCreated = new Date();
            responseObj = {'response': [{'status':'ENABLED', 'offerDetails':{'productName': '123'},'billingMode':'RECURRING', 'subsStart': subsStartDate, 'subsEnd':subsEndDate, 'dateCreated': dateCreated, 'expanded': false}]};            
            spyOn(SubscriptionHelper, "getPreviousSubscriptionList");
            SubscriptionHelper.getPreviousSubscriptionList(responseObj);
        });
        it('will get previous subscription list', function() {         
            expect(SubscriptionHelper.getPreviousSubscriptionList).toHaveBeenCalledWith(responseObj);   
        });     
    });

    describe('getRecurringVal',function() {
        it('will get recurring subscription', function() {       
            billingMode = 'RECURRING'||true;           
            var data = SubscriptionHelper.getRecurringVal(billingMode);  
            expect(data).toEqual('Yes');   
        });     

        it('will get Non recurring subscription', function() {       
            billingMode = 'NONRECURRING'||false;           
            var data = SubscriptionHelper.getRecurringVal(billingMode);  
            expect(data).toEqual('No');   
        }); 
    });

    describe('getStatus',function() {
        it('will get status if enabled', function() {       
            statusVal = 'ENABLED';           
            var data = SubscriptionHelper.getStatus(statusVal);  
            expect(data).toEqual('ACTIVE');   
        });     

        it('will get status if null', function() {       
            statusVal = null;           
            var data = SubscriptionHelper.getStatus(statusVal);  
            expect(data).toEqual(null);   
        });
    });     
    
    describe('checkStackSubscription',function() {
        beforeEach(function() {
            responseObj = {'response': [{'status':'STACKED'}]};            
            spyOn(SubscriptionHelper, "checkStackSubscription");
            SubscriptionHelper.checkStackSubscription(responseObj);
        });
        it('will check stack subscriptions', function() {         
            expect(SubscriptionHelper.checkStackSubscription).toHaveBeenCalledWith(responseObj);      
        });     
    });

    describe('getStackActiveSubscription',function() {
        it('will get stack active subcription', function() {  
            responseObj = {'title': 'Origin Access', 'status':'STACK CARDS'};    
            subscriptionData = {'response': [{'status':'STACKED', 'offerDetails' : {}}]};        
            var data = SubscriptionHelper.getStackActiveSubscription(subscriptionData);  
            expect(data.title).toEqual("Origin Access");
            expect(data.status).toEqual("STACK CARDS");
        });     
    });

    describe('getStackPreviousSubscriptionList',function() {
        beforeEach(function() {
            responseObj = {'response': [{'status':'ENABLED', 'offerDetails':{'productName': '123'}}]};            
            spyOn(SubscriptionHelper, "getStackPreviousSubscriptionList");
            SubscriptionHelper.getStackPreviousSubscriptionList(responseObj);
        });
        it('will get stack previous subscription list', function() {         
            expect(SubscriptionHelper.getStackPreviousSubscriptionList).toHaveBeenCalledWith(responseObj);   
        });     
    });

    describe('setNucleusSubscriptions',function() {
        beforeEach(function() {
            responseObj = {};
            spyOn(SubscriptionHelper, "getActiveNucleusSubscription");
            SubscriptionHelper.setNucleusSubscriptions(component, event);               
        });
        it('will call the controller function for getActiveNucleusSubscription', function() {      
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(2);
            expect(component.find.calls.count()).toEqual(2);
            expect(component.set).toHaveBeenCalledWith('v.inactiveNucleusSubscriptions',[]);
        });     
    });

    describe('getActiveNucleusSubscription',function() {
        it('will get active nucleus subcription', function() {  
            responseObj = {'title': 'Nucleus Subscriptions'};    
            subscriptionData = {'response': [{'status':'STACKED'}]};        
            var data = SubscriptionHelper.getActiveNucleusSubscription(subscriptionData);  
            expect(data).toEqual(responseObj);        
        });     
    });

    describe('getPreviousNucleusSubscriptionList',function() {
        beforeEach(function() {
            let dateCreated = new Date();
            responseObj = {'response': [{'status':'ENABLED', 'offerDetails':{'productName': '123'}, 'dateCreated': dateCreated, 'recurring': 'RECURRING', 'duration':'', 'accountNumber': '123'}]};            
            spyOn(SubscriptionHelper, "getPreviousNucleusSubscriptionList");
            SubscriptionHelper.getPreviousNucleusSubscriptionList(responseObj);
        });
        it('will get previous subscription list', function() {         
            expect(SubscriptionHelper.getPreviousNucleusSubscriptionList).toHaveBeenCalledWith(responseObj);   
        });     
    });

    describe('setEAAccessSubscriptions',function() {
        beforeEach(function() {
            responseObj = {};
            spyOn(SubscriptionHelper, "getEAAccessSubscriptionList");
            SubscriptionHelper.setEAAccessSubscriptions(component, event);               
        });
        it('will call the controller function for getEAAccessSubscriptionList', function() {      
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(1);
            expect(component.find.calls.count()).toEqual(2);
            expect(component.set).toHaveBeenCalledWith('v.eaAccessSubscription',undefined);
        });     
    });

    describe('getEAAccessSubscriptionList',function() {
        beforeEach(function() {            
            responseObj = {'response': [{'title':'EA Access - Standard', 'eaaSubscriptionItems':[{'state':'ENABLED', 'productId': '123'}],'displayName':'Data', 'personaId': '456', 'recurring':'', 'duration': ''}]};            
            spyOn(SubscriptionHelper, "getEAAccessSubscriptionList");
            SubscriptionHelper.getEAAccessSubscriptionList(responseObj);
        });
        it('will get previous subscription list', function() {         
            expect(SubscriptionHelper.getEAAccessSubscriptionList).toHaveBeenCalledWith(responseObj);   
        });     
    });

    describe('getDuration',function() {
        it('will get duration', function() {  
            let subsStartDate = new Date().setDate(new Date().getDate() -1);
            let subsEndDate = new Date().setDate(new Date().getDate() +10);         
            var data = SubscriptionHelper.getDuration(subsEndDate, subsStartDate);  
            expect(data).toEqual('11 DAYS');   
        });     
    });

    describe('fetchOriginSubscriptionOption',function() {
        let action;
        beforeEach(()=>{
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if (arg == 'c.fetchOriginSubscriptionOptions') {
                    return action;
                }
            });
            action = jasmine.createSpyObj('action', ['setCallback', 'setParams']);
        })
        it('should call apex method', function() {  
            SubscriptionHelper.fetchOriginSubscriptionOption(component);  
            expect(component.get).toHaveBeenCalledWith('c.fetchOriginSubscriptionOptions'); 
        });     
    });

    describe('getUpcomingSubscriptionOfferId',function() {
        it('should return expected data', function() {
            const subscription = {
                scheduleOperations: [{
                    operationName: 'CONVERTED_FROM',
                    status: "ENABLED",
                    properties: [{
                        name: 'CONVERTSUBSPAYLOAD',
                        value: "{\"SubscriptionRequest\":{\"offerId\":\"Origin.OFR.50.0001171\"}}"
                    }]
                }]
            };

            const data = SubscriptionHelper.getUpcomingSubscriptionOfferId(subscription);
            expect(data).toEqual('Origin.OFR.50.0001171');   
        });     
    });
})

