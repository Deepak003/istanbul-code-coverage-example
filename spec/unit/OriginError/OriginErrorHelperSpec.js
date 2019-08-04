const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var OriginErrorHelper = require('../../../aura/tsm/OriginError/OriginErrorHelper.js');

var OriginErrorHelper = require('../../../aura/tsm/OriginError/OriginErrorHelper.js');

describe("OriginErrorHelper", function() {
	let component, event, helper, action, response, responseState, responseData;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);
        workspaceAPI = jasmine.createSpyObj('workspaceAPI', ['setTabLabel', 'setTabIcon']);

        Object.assign(workspaceAPI, {
            getFocusedTabInfo: jasmine.createSpy('getFocusedTabInfo').and.returnValue(workspaceAPI),  
            getEnclosingTabId: jasmine.createSpy('getEnclosingTabId').and.returnValue(workspaceAPI),  
            getTabInfo: jasmine.createSpy('getTabInfo').and.returnValue(workspaceAPI),  
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
                if(arg == 'c.getOERLogContent' || arg == 'c.getOERLogs'){
                    return action;
                }else if(arg == 'v.selectedLogValue') {
	                return "val";
	            }else if(arg == 'v.originId') {
                    return '1234567';
                }else if(arg == 'v.logs') {
                    return [{value: "val", label: "filename.txt"}];
                }else if(arg == 'v.trackingId') {
                    return "tracking-id-1";
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
                    arg1.call(OriginErrorHelper, response);
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

    describe('setTabDetails', function() {
        const data = { tabId: "abc", pageReference: { state: { tabTitle: "title-1", tabIcon: "some-icon" } } };
        it('should set tab title', function() {
            OriginErrorHelper.setTabDetails(component, data);
            expect(workspaceAPI.setTabLabel).toHaveBeenCalledWith({tabId: "abc", label: "title-1"});
        });
        it('should set tab icon', function() {
            OriginErrorHelper.setTabDetails(component, data);
            expect(workspaceAPI.setTabIcon).toHaveBeenCalledWith({tabId: "abc", icon: "some-icon"});
        });
    });

    describe('setTabInfo', function() {
        beforeEach(function() {
            spyOn(OriginErrorHelper, "setTabDetails");           
        });
        it('should set call setTabDetails', function() {
            OriginErrorHelper.setTabInfo(component);
            expect(OriginErrorHelper.setTabDetails).toHaveBeenCalledWith(component, { tabId: '120' });
        });
    });

    describe('fetch', function() {
        beforeEach(function() {
            responseData = '{\"breakdown\":{},\"logs\":{\"userData.txt\":\"https://xray.x.origin.com:8888/oer/getLog/0f753b9d700d6862/userData.txt\",\"Client_Log.txt\":\"https://xray.x.origin.com:8888/oer/getLog/0f753b9d700d6862/Client_Log.txt\"}}';            
        });
        it('should call apex method', function() {
            OriginErrorHelper.fetch(component);
            expect(component.get).toHaveBeenCalledWith("c.getOERLogs");
        });
        it('should set payload', function() {
            OriginErrorHelper.fetch(component);
            expect(action.setParams).toHaveBeenCalledWith({strOriginId: "1234567"});
        });
        it('should show loading', function() {
            OriginErrorHelper.fetch(component);
            expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
        it('should hide loading', function() {
            OriginErrorHelper.fetch(component);
            expect(component.set).toHaveBeenCalledWith("v.isLoading", false);
        });
        it('should set response on success', function() {
            responseState = "SUCCESS";
            OriginErrorHelper.fetch(component);
            expect(component.set).toHaveBeenCalledWith("v.logs", [
                  {
                    "value": "https://xray.x.origin.com:8888/oer/getLog/0f753b9d700d6862/userData.txt",
                    "label": "userData.txt"
                  },
                  {
                    "value": "https://xray.x.origin.com:8888/oer/getLog/0f753b9d700d6862/Client_Log.txt",
                    "label": "Client_Log.txt"
                  }
                ]
            );
            expect(component.set).toHaveBeenCalledWith("v.selectedLogValue", "https://xray.x.origin.com:8888/oer/getLog/0f753b9d700d6862/userData.txt");
        });
        it('should handle error', function() {
            responseState = "ERROR";
            OriginErrorHelper.fetch(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
    });

    describe('fetchContent', function() {
        it('should call apex method', function() {
            OriginErrorHelper.fetchContent(component);
            expect(component.get).toHaveBeenCalledWith("c.getOERLogContent");
        });
        it('should set payload', function() {
            OriginErrorHelper.fetchContent(component);
            expect(action.setParams).toHaveBeenCalledWith({strTrackingId: "tracking-id-1", strFileName: "filename.txt"});
        });
        it('should show loading', function() {
            OriginErrorHelper.fetchContent(component);
            expect(component.set).toHaveBeenCalledWith("v.isLoadingContent", true);
        });
        it('should hide loading', function() {
            OriginErrorHelper.fetchContent(component);
            expect(component.set).toHaveBeenCalledWith("v.isLoadingContent", false);
        });
        it('should set response on success', function() {
            responseState = "SUCCESS";
            responseData = "some-dummy-response";
            OriginErrorHelper.fetchContent(component);
            expect(component.set).toHaveBeenCalledWith("v.logDetails", "some-dummy-response");
        });
        it('should handle error', function() {
            responseState = "ERROR";
            OriginErrorHelper.fetchContent(component);
            expect(Util.handleErrors).toHaveBeenCalledWith(component, response);
        });
    });
});

