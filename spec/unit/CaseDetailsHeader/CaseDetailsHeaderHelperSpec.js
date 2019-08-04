var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var CaseDetailsHeaderHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderHelper.js')), {$A: $A});
var CaseDetailsHeaderHelper = require('../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderHelper.js');


var CaseDetailsHeaderHelper = require('../../../aura/tsm/CaseDetailsHeader/CaseDetailsHeaderHelper.js');

describe('CaseDetailsHeaderHelper', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['helperFun']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"response":[""]}'}}
                f(response);
            }
        });
    });

    describe('searchCaseData', function() {
        beforeEach(function() {
            CaseDetailsHeaderHelper.searchCaseData(component, event);
        });
        it('should call the backend method searchCaseData and set necessary variables', function() {
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(1);
        });
    });

});
