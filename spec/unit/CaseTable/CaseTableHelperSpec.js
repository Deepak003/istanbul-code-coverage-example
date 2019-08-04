const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);


var CaseTableHelper = require('../../../aura/tsm/CaseTable/CaseTableHelper.js');

var CaseTableHelper = require('../../../aura/tsm/CaseTable/CaseTableHelper.js');

describe("CaseTableHelper", function() {
	let component, event, helper, action, response, responseState, responseData, searchTerm, isDescending, isArchivedPulled, isNonArchivedPulled, pageNo, pageSize, selectedFilter;
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
	        	if (arg == 'v.searchTerm') {
                    return searchTerm;
                }else if(arg == 'v.nucleusId') {
                    return "56789";
                }else if(arg == 'v.accountId') {
                    return "12345";
                }else if (arg == 'v.cases') {
                    return ["This","is","to","say","hello","To","Every","One"];
                }else if (arg == 'v.selectedFilter') {
                    return selectedFilter;
                }else if (arg == 'v.isDescending') {
                    return isDescending;
                }else if (arg == 'v.isNonArchivedPulled') {
                    return isNonArchivedPulled;
                }else if (arg == 'v.isArchivedPulled') {
                    return isArchivedPulled;
                }else if (arg == 'v.pageNo') {
                    return pageNo;
                }else if (arg == 'v.pageSize') {
                    return pageSize;
                }else if(arg == 'c.fetchCasesByAccountId' || arg == 'c.proratedRefundOriginSubscription'){
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
                    arg1.call(CaseTableHelper, response);
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

    describe('getCaseList', function() {
        beforeEach(()=> {
            spyOn(CaseTableHelper, 'getSalesforceCases');
            spyOn(CaseTableHelper, 'getArchivedCases');
        });

        it('should call getSalesforceCases when isDescending true & isNonArchivedPulled false', ()=>{
            isDescending = true;
            isNonArchivedPulled = false;
            CaseTableHelper.getCaseList(component);
            expect(CaseTableHelper.getSalesforceCases).toHaveBeenCalledWith(component);
        });

        it('should call getSalesforceCases when isDescending false & isArchivedPulled true & isNonArchivedPulled false', ()=>{
            isDescending = false;
            isArchivedPulled = true;
            isNonArchivedPulled = false;
            CaseTableHelper.getCaseList(component);
            expect(CaseTableHelper.getSalesforceCases).toHaveBeenCalledWith(component);
        });

        it('should call getArchivedCases when isDescending true & isNonArchivedPulled true & isArchivedPulled false', ()=>{
            isDescending = true;
            isNonArchivedPulled = true;
            isArchivedPulled = false;
            CaseTableHelper.getCaseList(component);
            expect(CaseTableHelper.getArchivedCases).toHaveBeenCalledWith(component);
        });

        it('should call getArchivedCases when isDescending false & isArchivedPulled false', ()=>{
            isDescending = false;
            isArchivedPulled = false;
            CaseTableHelper.getCaseList(component);
            expect(CaseTableHelper.getArchivedCases).toHaveBeenCalledWith(component);
        });
    });

    describe('matcher', function() {
        it('should return true', function() {
            const output = CaseTableHelper.matcher("worl")({ caseNumber: "123", subject: "Hello World" });
            expect(output).toEqual(true);
        });   

        it('should return false', function() {
            const output = CaseTableHelper.matcher("worl")({ caseNumber: "456", subject: "Random Text" });
            expect(output).toEqual(false);
        });        
    });

    describe('search', ()=> {
        beforeEach(()=> {
            spyOn(CaseTableHelper, 'matcher').and.callFake(()=> ()=>true);
        });        

        it('should set tableRows', function() {
            searchTerm = "hello";
            CaseTableHelper.search(component);
            expect(component.set).toHaveBeenCalledWith('v.tableRows', ["This","is","to","say","hello","To","Every","One"]);
        });
    });

    describe('getSalesforceCases', ()=> {
        beforeEach(()=> {
            selectedFilter = "ALL";
            isDescending = false;
            pageNo = 1;
            pageSize = 20;
            responseState = "SUCCESS";
            responseData = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];            
            spyOn(CaseTableHelper, 'formatData').and.callFake((data)=> data);
        });

        it('should call apex methods with correct parameters', ()=>{
            CaseTableHelper.getSalesforceCases(component);
            expect(action.setParams).toHaveBeenCalledWith({
                nucleusId: "56789",
                accountId: "12345",
                pageNumber: 1,
                pageSize: 20,
                caseStatus: "",
                caseOrder: "ASC"
            });        
        });

        it('should show isLoadingCases spinner', ()=>{
            CaseTableHelper.getSalesforceCases(component);
            expect(component.set).toHaveBeenCalledWith('v.isLoadingCases', true);
        });

        it('should call setCallback', ()=>{
            CaseTableHelper.getSalesforceCases(component);
            expect(action.setCallback).toHaveBeenCalledWith(CaseTableHelper, jasmine.any(Function));
        });

        it('should hide isLoading & isLoadingCases spinner', ()=>{
            CaseTableHelper.getSalesforceCases(component);
            expect(component.set).toHaveBeenCalledWith('v.isLoadingCases', false);
            expect(component.set).toHaveBeenCalledWith('v.isLoading', false);
        });

        it('should merge response with existing cases', ()=>{
            CaseTableHelper.getSalesforceCases(component);
            expect(component.set).toHaveBeenCalledWith('v.cases', ["This","is","to","say","hello","To","Every","One", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"]);
        });

        it('should set isNonArchivedPulled to true when response array length is less than pageSize', ()=>{
            responseData = ["w","x","y","z"];
            CaseTableHelper.getSalesforceCases(component);
            expect(component.set).toHaveBeenCalledWith('v.cases', ["This","is","to","say","hello","To","Every","One","w","x","y","z"]);
            expect(component.set).toHaveBeenCalledWith("v.isNonArchivedPulled", true);
        });
    });
    
    describe('formatData', ()=> {
        it('should return formated data', ()=> {
            const output = CaseTableHelper.formatData({Id: '123',CaseNumber: '234',Status: '567',CreatedDate: '890',Subject: '765'});
            expect(output).toEqual({caseId: '123',caseNumber: '234',status: '567', createdDate: '890', subject:'765'});
        })
    });

    describe('formatArchivedData', ()=> {
        it('should return formated data', ()=> {
            const output = CaseTableHelper.formatArchivedData({Status: 'Closed'});
            expect(output).toEqual({_status: 'Closed', status: 'Archived'});
        })
    });

});

