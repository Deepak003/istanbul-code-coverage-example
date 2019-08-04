const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass', 'isEmpty']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);


var CaseTableController = require('../../../aura/tsm/CaseTable/CaseTableController.js');

var CaseTableController = require('../../../aura/tsm/CaseTable/CaseTableController.js');

describe("CaseTableController", function() {
	let component, event, helper, pageNo, tableRows, isDescending, oldValue, getParamValue, searchTerm;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam', 'stopPropagation']);        
        helper = jasmine.createSpyObj('helper', ['getCaseList', 'search', 'matcher']);

        // syp component methods
        Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	        get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg == 'v.pageNo') {
                    return pageNo;
                }else if(arg == 'v.tableRows') {
                    return tableRows;
                }else if(arg == 'v.isDescending') {
                    return isDescending;
                }else if(arg == 'v.searchTerm') {
	                return searchTerm;
	            }
	        }),
	        getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        fire: jasmine.createSpy('fire').and.returnValue(component),
        });

        // syp event methods
        Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.callFake((arg)=> {
                if(arg == 'value') {
                    return getParamValue;
                }else if(arg == 'oldValue') {
                    return oldValue;
                }
            }),
            currentTarget : { dataset: { index : 0 } }
        });

        // syp helper methods
        Object.assign(helper, {});

        // spy $A methods
        Object.assign($A, {});
    });

    describe('doInit', function() {
        it('should call set selectedFilter value as ALL', function() {
            CaseTableController.doInit(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.selectedFilter", "ALL");
        });
    });
    
    describe('onChangePage', function() {
        it('should not call helper getCaseList', function() {
            pageNo = 0;
            CaseTableController.onChangePage(component, event, helper);
            expect(helper.getCaseList).not.toHaveBeenCalled();
        });
        it('should call helper getCaseList', function() {
            pageNo = 1;
            CaseTableController.onChangePage(component, event, helper);
            expect(helper.getCaseList).toHaveBeenCalledWith(component);
        });
    });

    describe('doRefresh', function() {
        it('should hide & show the component', function() {
            CaseTableController.doRefresh(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.isVisible", false);
            expect(component.set).toHaveBeenCalledWith("v.isVisible", true);
        });
    });

    describe('expandClick', function() {
        it('should set expanded true to row', function() {
            tableRows = [{}];
            CaseTableController.expandClick(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.tableRows", [{expanded: true}]);
        });
        it('should set expanded false to row', function() {
            tableRows = [{expanded: true}, {expanded: true}];
            CaseTableController.expandClick(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.tableRows", [{expanded: false},{expanded: true}]);
        });
    });

    describe('stopPropagation', function() {
        it('should call event.stopPropagation method', function() {
            CaseTableController.stopPropagation(component, event, helper);
            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });

    describe('onLoadCase', function() {
        it('should set tableRows value', function() {
            debugger;
            oldValue = [{caseNumber: '123'}];
            getParamValue = [{caseNumber: '123'},{caseNumber: '1234'}];
            tableRows = [{caseNumber: '1'}];

            CaseTableController.onLoadCase(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.tableRows", [{caseNumber: '1'},{caseNumber: '1234'}]);
        });
    });

    describe('sortByDate', function() {
        it('should set isDescending value to false', function() {
            isDescending = true;
            CaseTableController.sortByDate(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.isDescending", false);           
        });
        it('should set isDescending value to true', function() {
            isDescending = false;
            CaseTableController.sortByDate(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.isDescending", true);           
        });
    });

    describe('refreshCaseList', function() {
        it('should set values', function() {
            CaseTableController.refreshCaseList(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.isNonArchivedPulled", false);
            expect(component.set).toHaveBeenCalledWith("v.isArchivedPulled", false);
            expect(component.set).toHaveBeenCalledWith("v.cases", []);
            expect(component.set).toHaveBeenCalledWith("v.pageNo", 0);
            expect(component.set).toHaveBeenCalledWith("v.pageNo", 1);
        });
    });

    describe('onChangeSource', function() {
        it('should set values', function() {
            getParamValue = true;
            CaseTableController.onChangeSource(component, event, helper);
            expect(component.set).toHaveBeenCalledWith("v.pageNo", 0);
            expect(component.set).toHaveBeenCalledWith("v.pageNo", 1);
        });
    });
 })


