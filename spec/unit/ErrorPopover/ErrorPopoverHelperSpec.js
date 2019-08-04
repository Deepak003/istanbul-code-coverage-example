const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'createComponent']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors']);

var ErrorPopoverHelper = require('../../../aura/tsm/ErrorPopover/ErrorPopoverHelper.js');

var ErrorPopoverHelper = require('../../../aura/tsm/ErrorPopover/ErrorPopoverHelper.js');

describe('ErrorPopoverHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
    });

    describe('closePopover', function() {
        it('should set state', function() {       
            ErrorPopoverHelper.closePopover(component, event, helper);
            expect(component.set).toHaveBeenCalledWith('v.state', false);
        });
    });

    describe('getDetails', ()=> {
        let action, state="SUCCESS", response, responseData;
        beforeEach(()=> {
            action = jasmine.createSpyObj('action', ['setCallback', 'setParams']);
            response = {
                getState : ()=> state,
                getReturnValue: ()=> responseData
            }

            action.setCallback = jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1(response);
                }
            })

            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if (arg == 'v.code') {
                    return '123456089';
                }else if (arg == 'c.fetchFailureReason') {
                    return action;
                }
            });
        });

        it('should use apex method fetchFailureReason', ()=> {
            ErrorPopoverHelper.getDetails(component);
            expect(component.get).toHaveBeenCalledWith("c.fetchFailureReason");
        });

        it('should use correct payload', ()=> {
            ErrorPopoverHelper.getDetails(component);
            expect(action.setParams).toHaveBeenCalledWith({
                failureReason : "123456089"
            });
        });

        it('should set description & recommendation to none', ()=> {
            responseData = undefined;
            ErrorPopoverHelper.getDetails(component);
            expect(component.set).toHaveBeenCalledWith("v.description", 'none');
            expect(component.set).toHaveBeenCalledWith("v.recommendation", 'none');
        });

        it('should set description & recommendation proper data', ()=> {
            responseData = { Error_Message__c: "abc", Recommendation__c: "XYZ" };
            ErrorPopoverHelper.getDetails(component);
            expect(component.set).toHaveBeenCalledWith("v.description", 'abc');
            expect(component.set).toHaveBeenCalledWith("v.recommendation", 'XYZ');
        });

        it('should call handleErrors on failure', ()=> {
            state = 'not-success';
            ErrorPopoverHelper.getDetails(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });            
    });
})

