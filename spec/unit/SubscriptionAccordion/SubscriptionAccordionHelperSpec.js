var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'removeClass', 'addClass', 'slds-hide', 'isEmpty']),  enqueueAction: function() {}};
//var SubscriptionAccordionHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionHelper.js')), {$A: $A});

var SubscriptionAccordionHelper = require('../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionHelper.js');

var SubscriptionAccordionHelper = require('../../../aura/tsm/SubscriptionAccordion/SubscriptionAccordionHelper.js');

describe('SubscriptionAccordionHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['toggleSubscriptionRow']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
    });

    describe('toggleSubscriptionRow', ()=> {        
        it('should set previousSubscriptions', ()=> {
            let index = 0;
            SubscriptionAccordionHelper.toggleSubscriptionRow(component, index);
            expect(component.get).toHaveBeenCalledWith('v.previousSubscriptions');
        });
    });
})

