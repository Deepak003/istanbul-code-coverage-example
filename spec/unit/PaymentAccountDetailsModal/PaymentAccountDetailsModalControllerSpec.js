var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};
//var JSON = {parse: null};
//JSON.parse = jasmine.createSpy('parse').and.returnValue({response: [{}]});

//var PaymentAccountDetailsModalController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalController.js')), {$A: $A});

var PaymentAccountDetailsModalController = require('../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalController.js');

var PaymentAccountDetailsModalController = require('../../../aura/tsm/PaymentAccountDetailsModal/PaymentAccountDetailsModalController.js');

describe('PaymentAccountDetailsModalController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['populateWWCEObjects','setupData','applyPersona','removePersona','handleCountryChange','handleAutomaticAccountUpdateStatus', 'handleSaveData', 'handleCancelSaveData']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('doInit', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.doInit(component, event, helper);
        });
        it('will call the helper method setup data', function() {
            expect(helper.populateWWCEObjects).toHaveBeenCalled();
            expect(helper.setupData).toHaveBeenCalled();
        });
    });

    describe('openEditView', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.openEditView(component, event, helper);
        });
        it('will call the helper method openEditView', function() {
            expect(helper.setupData).toHaveBeenCalled();
        });
    });

    describe('applyPersona', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.applyPersona(component, event, helper);
        });
        it('will call the helper method applyPersona', function() {
            expect(helper.applyPersona).toHaveBeenCalled();
        });
    });

    describe('removePersona', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.removePersona(component, event, helper);
        });
        it('will call the helper method removePersona', function() {
            expect(helper.removePersona).toHaveBeenCalled();
        });
    });

    describe('handleCountryChange', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.handleCountryChange(component, event, helper);
        });
        it('will call the helper method handleCountryChange', function() {
            expect(helper.handleCountryChange).toHaveBeenCalled();
        });
    });

    describe('handleCancelUpdate', function() {
        beforeEach(function() {
            PaymentAccountDetailsModalController.handleCancelUpdate(component, event, helper);
        });
        it('will call the helper method handleCancelSaveData', function() {
            expect(helper.handleCancelSaveData).toHaveBeenCalled();
        });
    });
});

