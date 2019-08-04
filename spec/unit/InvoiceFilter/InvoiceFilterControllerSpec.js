const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var InvoiceFilterController = require('../../../aura/tsm/InvoiceFilter/InvoiceFilterController.js');

var InvoiceFilterController = require('../../../aura/tsm/InvoiceFilter/InvoiceFilterController.js');

describe("InvoiceFilterController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['setDate']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.start') {
                    return "1234";
                }
                if(arg == 'v.end') {
	                return "12345";
	            }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(1),
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should call helper setDate', function() {
            InvoiceFilterController.doInit(component, event, helper);
            expect(helper.setDate).toHaveBeenCalledWith(component);
        });
    });

    describe('setDate', function() {
        it('should call helper setDate', function() {
            InvoiceFilterController.doInit(component, event, helper);
            expect(helper.setDate).toHaveBeenCalledWith(component);
        });
    });

    describe('handleClickApply', function() {
        it('should set state', function() {
            InvoiceFilterController.handleClickApply(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.state", false);
        });

        it('should fire searchByDate event', function() {
            InvoiceFilterController.handleClickApply(component, event, helper);
            expect(component.getEvent).toHaveBeenCalledWith("searchByDate");
            expect(component.setParams).toHaveBeenCalledWith({ 
                value : {startDate: "1234", endDate: "12345"}
            });
        });
    });

    describe('handleClickReset', function() {
        it('should set state', function() {
            InvoiceFilterController.handleClickReset(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.state", false);
            expect(component.set).toHaveBeenCalledWith("v.state", true);
        });
    });
 })

