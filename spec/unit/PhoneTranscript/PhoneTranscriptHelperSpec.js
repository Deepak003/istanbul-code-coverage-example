const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var PhoneTranscriptHelper = require('../../../aura/tsm/PhoneTranscript/PhoneTranscriptHelper.js');

var PhoneTranscriptHelper = require('../../../aura/tsm/PhoneTranscript/PhoneTranscriptHelper.js');

describe("PhoneTranscriptHelper", function() {
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
	        	if(arg == 'v.caseId') {
	                return "12345";
                }else if(arg == 'v.caseNumber') {
                    return '12';
                }else if(arg == 'c.fetchPhoneRecordsByCaseId'){
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
                    arg1.call(PhoneTranscriptHelper, response);
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

    describe('pullTranscripts', function() {
        it('should call correct apex method', function() {
            PhoneTranscriptHelper.pullTranscripts(component);
            expect(component.get).toHaveBeenCalledWith('c.fetchPhoneRecordsByCaseId');
            expect(action.setParams).toHaveBeenCalledWith({ caseId: "12345", caseNumber: "12" });
        });

        it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = [{"advisorName":"Siba Dash","phoneDetails":[{"key":"Call Type","value":"IVR"},{"key":"Call Duration","value":"34"},{"key":"CallId","value":"fd7a97f8-3766-4ec1-85bb-8cb70f5d43da"}]}];

            PhoneTranscriptHelper.pullTranscripts(component);

            expect(component.set).toHaveBeenCalledWith("v.isLoading", false);
            expect(component.set).toHaveBeenCalledWith("v.transcripts", [{"advisorName":"Siba Dash","phoneDetails":[{"key":"Call Type","value":"IVR"},{"key":"Call Duration","value":"34seconds","_value":"34"},{"key":"CallId","value":"fd7a97f8-3766-4ec1-85bb-8cb70f5d43da"}]}]);
        });

        it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";

            PhoneTranscriptHelper.pullTranscripts(component);            

            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
            expect(component.set).toHaveBeenCalledWith("v.isLoading", false);
        });
    });

 })

