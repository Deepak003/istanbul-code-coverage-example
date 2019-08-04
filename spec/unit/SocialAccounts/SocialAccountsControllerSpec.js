const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var SocialAccountsController = require('../../../aura/tsm/SocialAccounts/SocialAccountsController.js');

var SocialAccountsController = require('../../../aura/tsm/SocialAccounts/SocialAccountsController.js');

describe("SocialAccountsController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['getExternalReferences', 'removeReference']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.data') {
	                return {};
	            }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.callFake((arg)=> {
                if(arg == 'row') {
                    return { referenceType: "FACEBOOK" };
                }else if(arg == 'action') {
                    return { name: "remove_reference" };
                }
            })
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should set datable columns', function() {
            SocialAccountsController.doInit(component, event, helper);
            
            expect(component.set).toHaveBeenCalledWith('v.socialColumns', [
                { label: 'TYPE', fieldName: 'referenceType', type: 'text' },
                { label: 'ID', fieldName: 'referenceId', type: 'text' },
                { label: 'VALUE', fieldName: 'referenceValue', type: 'text' },
                { label: 'BESL SCREENNAME', fieldName: 'beslScreenName', type: 'text' },
                { type: 'action', typeAttributes: { rowActions: [
                    { label: 'Remove External Referencce', name: 'remove_reference' }
                ] } }
            ]);
        });

        it('should call helper getExternalReferences', function() {
            SocialAccountsController.doInit(component, event, helper);
            expect(helper.getExternalReferences).toHaveBeenCalledWith(component);
        });
    });

    describe('handleRemoveClick', function() {
        it('should call helper removeReference', function() {
            SocialAccountsController.handleRemoveClick(component, event, helper);
            expect(helper.removeReference).toHaveBeenCalledWith(component);
        });
    });

    describe('handleRowAction', function() {
        it('should open modal', function() {
            SocialAccountsController.handleRowAction(component, event, helper);
            expect(component.set).toHaveBeenCalledWith('v.isOpen', true);
        });
    });
 })

