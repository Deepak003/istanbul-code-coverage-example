const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var SocialAccountsHelper = require('../../../aura/tsm/SocialAccounts/SocialAccountsHelper.js');

var SocialAccountsHelper = require('../../../aura/tsm/SocialAccounts/SocialAccountsHelper.js');

describe("SocialAccountsHelper", function() {
	let component, event, helper, action, response, responseState, responseData;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.nucleusId') {
                    return "12345";
                }else if(arg == 'v.selectedRow') {
	                return { referenceId: "1234567", referenceType: "FACEBOOK" };
	            }else if(arg == 'c.getExternalReferences' || arg == 'c.deleteExternalReference'){
                    return action;
                }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
            setCallback: jasmine.createSpy('setCallback').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

        // syp action methods
        Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(SocialAccountsHelper, response);
                }
            })
        });

        Object.assign(response, {
            getState: ()=> responseState,
            getReturnValue: ()=> responseData
        });

        // spy $A methods
        Object.assign($A, {
            get: jasmine.createSpy('get').and.returnValue($A),
            fire: jasmine.createSpy('fire').and.returnValue($A)
        });
    });

    describe('getExternalReferences', function() {
        it('should send correct playload', function() {
            SocialAccountsHelper.getExternalReferences(component);
            expect(action.setParams).toHaveBeenCalledWith({
                strUserId: "12345"
            });
        });

        it('should set socialData', function() {
            responseState = "SUCCESS";
            responseData = "Success message";
            SocialAccountsHelper.getExternalReferences(component);
            expect(component.set).toHaveBeenCalledWith('v.socialData', responseData);
        });

        it('should show error message', function() {
            responseState = "ERROR";
            SocialAccountsHelper.getExternalReferences(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
    });

    describe('removeReference', function() {
        it('should send correct playload', function() {
            SocialAccountsHelper.removeReference(component);
            expect(action.setParams).toHaveBeenCalledWith({
                strUserId: "12345",
                strReferenceId: "1234567",
                strReferenceType: "FACEBOOK",
                strCaseId: undefined
            });
        });

        it('should show success message', function() {
            responseState = "SUCCESS";
            responseData = "Success message";
            SocialAccountsHelper.removeReference(component);
            expect(Util.handleSuccess).toHaveBeenCalledWith(component, responseData);
        });

        it('should show error message', function() {
            responseState = "ERROR";
            SocialAccountsHelper.removeReference(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
    });
});

