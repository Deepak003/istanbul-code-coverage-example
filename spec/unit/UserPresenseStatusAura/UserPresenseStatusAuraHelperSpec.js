var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
//var UserPresenseStatusAuraHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraHelper.js')), {$A: $A});

var UserPresenseStatusAuraHelper = require('../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraHelper.js');

var UserPresenseStatusAuraHelper = require('../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraHelper.js');

describe('UserPresenseStatusAuraHelper', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['helperFun']);
        component.find = function(s) {
            if (s == 'helperFun') return {one: {}, two: {}};
            return '';
        }
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"response":[""]}'}}
                f(response);
            }
        });
    });

    describe('switchPresenseStatus', function() {
        beforeEach(function() {
            UserPresenseStatusAuraHelper.switchPresenseStatus(component, event);
        });
        it('should call the backend method switchPresenseStatus and set necessary variables', function() {
            expect(component.get.calls.count()).toEqual(1);
        });
    });


});

