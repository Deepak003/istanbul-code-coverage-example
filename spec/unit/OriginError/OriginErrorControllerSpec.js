const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var OriginErrorController = require('../../../aura/tsm/OriginError/OriginErrorController.js');

var OriginErrorController = require('../../../aura/tsm/OriginError/OriginErrorController.js');

describe("OriginErrorController", function() {
	let component, event, helper;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['setTabInfo', 'fetch', 'fetchContent']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.pageReference') {
	                return { state: { originId : "123456" } };
	            }
                else if(arg == 'v.trackingId') {
                    return '1234'
                }                
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should call helper setTabInfo', function() {
            OriginErrorController.doInit(component, event, helper);
            expect(helper.setTabInfo).toHaveBeenCalledWith(component);
        });
        it('should set originId', function() {
            OriginErrorController.doInit(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.originId", "123456");
        });
    });

    describe('fetchLogs', function() {
        it('should call helper fetch', function() {
            OriginErrorController.fetchLogs(component, event, helper);
            expect(helper.fetch).toHaveBeenCalledWith(component);
        });
    });

    describe('fetchLogContent', function() {
        it('should call helper fetchContent', function() {
            OriginErrorController.fetchLogContent(component, event, helper);
            expect(helper.fetchContent).toHaveBeenCalledWith(component);
        });
    });
 })

