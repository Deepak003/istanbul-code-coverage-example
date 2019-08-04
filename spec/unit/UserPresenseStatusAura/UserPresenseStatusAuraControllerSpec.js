var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

//var UserPresenseStatusAuraController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraController.js')), {$A: $A});

var UserPresenseStatusAuraController = require('../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraController.js');

var UserPresenseStatusAuraController = require('../../../aura/tsm/UserPresenseStatusAura/UserPresenseStatusAuraController.js');

describe('UserPresenseStatusAuraController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['switchPresenseStatus']);
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}});
    });


    describe('onStatusChanged', function() {
        beforeEach(function() {
            UserPresenseStatusAuraController.onStatusChanged(component, event, helper);
        });
        it('will call the helper method switchPresenseStatus', function() {       
            expect(helper.switchPresenseStatus).toHaveBeenCalled();        
        });
    });

});

