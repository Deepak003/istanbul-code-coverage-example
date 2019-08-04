var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};


//var CodeSearchController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CodeSearch/CodeSearchController.js')), {$A: $A});

var CodeSearchController = require('../../../aura/tsm/CodeSearch/CodeSearchController.js');

var CodeSearchController = require('../../../aura/tsm/CodeSearch/CodeSearchController.js');

describe('CodeSearchController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['openAccountTab', 'searchCode']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('closeSearchCodes', function() {
        beforeEach(function() {
            CodeSearchController.closeSearchCodes(component, event, helper);
        });
        it('will  close modal', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
    });

    describe('handleOpenAccount', function() {
        beforeEach(function() {
            CodeSearchController.handleOpenAccount(component, event, helper);
        });
        it('will open account tab for user', function() {
            expect(helper.openAccountTab).toHaveBeenCalled();
        });
    });

    describe('handleSearch', function() {
        beforeEach(function() {
            CodeSearchController.handleSearch(component, event, helper);
        });
        it('will call search code api', function() {
            expect(helper.searchCode).toHaveBeenCalled();
        });
    });

    describe('handleConsumeCode', function() {
        beforeEach(function() {
            CodeSearchController.handleConsumeCode(component, event, helper);
        });
        it('open consume code modal', function() {
            expect(component.set.calls.count()).toEqual(2);
        });
    });

});

