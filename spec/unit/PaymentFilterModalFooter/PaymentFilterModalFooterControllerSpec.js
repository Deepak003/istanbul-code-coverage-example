const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var PaymentFilterModalFooterController = require('../../../aura/tsm/PaymentFilterModalFooter/PaymentFilterModalFooterController.js');

var PaymentFilterModalFooterController = require('../../../aura/tsm/PaymentFilterModalFooter/PaymentFilterModalFooterController.js');

describe("PaymentFilterModalFooterController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['doReverse','doRedeem']);

        // syp component methods
        Object.assign(component, {});

        // syp event methods
        Object.assign(event, {});

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doReverse', function() {
        it('should call helper doReverse', function() {
            PaymentFilterModalFooterController.doReverse(component, event, helper);
            expect(helper.doReverse).toHaveBeenCalledWith(component);
        });
    });

    describe('doRedeem', function() {
        it('should call helper doRedeem', function() {
            PaymentFilterModalFooterController.doRedeem(component, event, helper);
            expect(helper.doRedeem).toHaveBeenCalledWith(component);
        });
    });
 })

