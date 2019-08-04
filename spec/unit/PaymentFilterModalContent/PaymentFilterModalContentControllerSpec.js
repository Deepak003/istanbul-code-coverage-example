const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var PaymentFilterModalContentController = require('../../../aura/tsm/PaymentFilterModalContent/PaymentFilterModalContentController.js');

var PaymentFilterModalContentController = require('../../../aura/tsm/PaymentFilterModalContent/PaymentFilterModalContentController.js');

describe("PaymentFilterModalContentController", function() {
	let component, event, helper, workspaceAPI;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        workspaceAPI = jasmine.createSpyObj('workspaceAPI', ['']);

        Object.assign(workspaceAPI, {
            getFocusedTabInfo: jasmine.createSpy('getFocusedTabInfo').and.returnValue(workspaceAPI),  
            then: jasmine.createSpy('then').and.callFake((arg)=> {
                arg.call(null, {tabId: "120"});
                return workspaceAPI;                
            }), 
            openSubtab: jasmine.createSpy('openSubtab').and.returnValue(workspaceAPI), 
            catch: jasmine.createSpy('catch').and.returnValue(workspaceAPI), 
        });
        

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.callFake((arg)=> {
                if(arg == 'workspace') {
                    return workspaceAPI;
                }
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.paymentAccount') {
	                return [{ sfAccountId: "123456789" }];
	            }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
            currentTarget : { dataset : { index : 0 } } 
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('openAccountWithSubtab', function() {
        it('should open subtab', function() {
            PaymentFilterModalContentController.openAccountWithSubtab(component, event, helper);            
            expect(workspaceAPI.getFocusedTabInfo).toHaveBeenCalled();
            expect(workspaceAPI.then).toHaveBeenCalledWith(jasmine.any(Function));
            expect(workspaceAPI.openSubtab).toHaveBeenCalledWith({
                parentTabId: '120',
                recordId: '123456789',
                focus: true
            });
        });
    });
 })

