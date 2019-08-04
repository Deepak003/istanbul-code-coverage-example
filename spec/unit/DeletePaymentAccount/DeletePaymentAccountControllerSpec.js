const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

var DeletePaymentAccountController = require('../../../aura/tsm/DeletePaymentAccount/DeletePaymentAccountController.js');

var DeletePaymentAccountController = require('../../../aura/tsm/DeletePaymentAccount/DeletePaymentAccountController.js');

describe("DeletePaymentAccountController", function() {
	let component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        

        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);

        helper = jasmine.createSpyObj('helper', ["getPendingCharges", "deleteAccount"]); 
    });

    describe('doInit', function() {
        beforeEach(function() {
            DeletePaymentAccountController.doInit(component, event, helper);
        });
        it('should call the helper method getPendingCharges', function() {       
            expect(helper.getPendingCharges).toHaveBeenCalledWith(component);
        });
    });

    describe('onDeleteClick', function() {
        beforeEach(function() {
            DeletePaymentAccountController.onDeleteClick(component, event, helper);
        });
        it('should call the helper method deleteAccount', function() {       
            expect(helper.deleteAccount).toHaveBeenCalledWith(component);
        });
    });

    describe('closeModel', function() {
        beforeEach(function() {
			DeletePaymentAccountController.closeModel(component, event, helper);
        });
        it('should set the value', function() {       
            expect(component.set).toHaveBeenCalled();
        });
    });
})

