var vm = require('vm');var fs = require('fs');var path = require('path');

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);

//var viewcodesHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/viewcodes/viewcodesHelper.js')), {$A: $A});

var viewcodesHelper = require('../../../aura/tsm/viewcodes/viewcodesHelper.js');

var viewcodesHelper = require('../../../aura/tsm/viewcodes/viewcodesHelper.js');

describe('viewcodesHelper', function() {
    var component, event, helper, clubList;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['initHelper']);
        
        component.get = jasmine.createSpy('get').withArgs('c.getCodesForCustomer').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
                getReturnValue:function(){return ''}}
               // var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"grantDate":"123456"}'}}
                //{"response":[""]}
                f(response);
            }
        })
        .withArgs('v.selectedProduct').and.returnValue("dummyProductName")
        .withArgs('v.nucleusId').and.returnValue("dummyNucleusId");
        });
    
    //Spec for initHelper
    describe('initHelper', function() {
        beforeEach(function() {
            viewcodesHelper.initHelper(component, event, helper);
        });
        it('Controller Method Invocation', function() {
            expect(component.get).toHaveBeenCalledWith('v.nucleusId');
            expect(component.get).toHaveBeenCalledWith('v.selectedProduct');
        });
        it('Controller Method Invocation', function() {
            expect(component.set).toHaveBeenCalledWith('v.isViewCode',false);
            expect(component.set).not.toHaveBeenCalledWith('v.items','{"response":[""]}');
        });
        it('Controller Method Invocation', function() {
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
});

