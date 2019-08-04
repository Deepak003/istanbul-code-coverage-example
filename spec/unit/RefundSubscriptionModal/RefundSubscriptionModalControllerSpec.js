const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var RefundSubscriptionModalController = require('../../../aura/tsm/RefundSubscriptionModal/RefundSubscriptionModalController.js');

var RefundSubscriptionModalController = require('../../../aura/tsm/RefundSubscriptionModal/RefundSubscriptionModalController.js');

describe("RefundSubscriptionModalController", function() {
	let component, event, helper, defaultSelected;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['pullData','doProratedRefund','doFullRefund']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.defaultSelected') {
	                return defaultSelected;
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

        // spy $A methods
        Object.assign($A, {});
    });

    describe('init', function() {
        it('should call pullData helper method', function() {
            RefundSubscriptionModalController.init(component, event, helper);
            expect(helper.pullData).toHaveBeenCalledWith(component);
        });
    });

    describe('submit', function() {
        it('should call doProratedRefund helper method', function() {
            defaultSelected = '1';
            RefundSubscriptionModalController.submit(component, event, helper);
            expect(helper.doProratedRefund).toHaveBeenCalledWith(component);
        });
        it('should call doFullRefund helper method', function() {
            defaultSelected = '2';
            RefundSubscriptionModalController.submit(component, event, helper);
            expect(helper.doFullRefund).toHaveBeenCalledWith(component);
        });
    });
 })

