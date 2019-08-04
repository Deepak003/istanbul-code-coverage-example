const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var InvoiceFilterHelper = require('../../../aura/tsm/InvoiceFilter/InvoiceFilterHelper.js');

var InvoiceFilterHelper = require('../../../aura/tsm/InvoiceFilter/InvoiceFilterHelper.js');

describe("InvoiceFilterHelper", function() {
	let component, event, helper, action, response, responseState, responseData;
    beforeEach(function() {
    	component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);

        Object.assign(component, {
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.selectedOption') {
	                return "5";
	            }
	        })
	    });
    });

    describe('setDate', function() {
        it('should set correct date', function() {
            InvoiceFilterHelper.setDate(component);
            expect(component.set).toHaveBeenCalledWith("v.isVisibleDatePicker", false);
            expect(component.set).toHaveBeenCalledWith("v.isVisibleDatePicker", true);

            const today = new Date().toJSON().split('T')[0];
            const previousDate = new Date(new Date().setDate(new Date().getDate()-5)).toJSON().split('T')[0];

            expect(component.set).toHaveBeenCalledWith("v.today", today);
            expect(component.set).toHaveBeenCalledWith("v.end", today);
            expect(component.set).toHaveBeenCalledWith("v.start", previousDate);
        });
    });
});

