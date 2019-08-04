var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var TSMChatWrapperHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/TSMChatWrapper/TSMChatWrapperHelper.js')), {$A: $A});

var TSMChatWrapperHelper = require('../../../aura/tsm/TSMChatWrapper/TSMChatWrapperHelper.js');

var TSMChatWrapperHelper = require('../../../aura/tsm/TSMChatWrapper/TSMChatWrapperHelper.js');

describe('TSMChatWrapperHelper', function() {
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

    describe('searchDetails', function() {
        beforeEach(function() {
            TSMChatWrapperHelper.searchDetails(component, event);
        });
        it('should call the backend method searchDetails and set necessary variables', function() {
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(4);
        });
    });

});

