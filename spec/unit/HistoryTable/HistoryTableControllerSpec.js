const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var HistoryTableController = require('../../../aura/tsm/HistoryTable/HistoryTableController.js');

var HistoryTableController = require('../../../aura/tsm/HistoryTable/HistoryTableController.js');

describe("HistoryTableController", function() {
	let component, event, helper;

    beforeEach(function() {
    	event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
    	helper = jasmine.createSpyObj('helper', ["setPaginatedData"]);

    	component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.get = jasmine.createSpy('get').and.callFake((arg)=> {
            if (arg == 'v.caseId') {
                return "1234";
            }else if (arg == 'v.nucleusId') {
                return "11111";
            }else if (arg == 'v.selectedProduct') {
                return "Some product";
            }else if (arg == 'v.selectedPersona') {
                return "Persona Here";
            }else if (arg == 'v.itemList') {
                return "itemList Here";
            }else if (arg == 'v.packList') {
                return "packList Here";
            }
        });
    })

	describe('doInit', function() {
		it('should set pageNumber, externalData & call setPaginatedData helper method', function() {
			HistoryTableController.doInit(component, event, helper);
			expect(component.set).toHaveBeenCalledWith('v.pageNumber', 1);
			expect(component.set).toHaveBeenCalledWith('v.externalData', {
	            selectedProduct : "Some product",
	            selectedPersona : "Persona Here",
	            itemList : "itemList Here",
	            packList : "packList Here"
			});
			expect(helper.setPaginatedData).toHaveBeenCalledWith(component);					
		})
	})

	describe('handlePageChange', function() {
		it('should call setPaginatedData helepr method', function() {
			HistoryTableController.handlePageChange(component, event, helper);
			expect(helper.setPaginatedData).toHaveBeenCalledWith(component);								
		})
	})

	describe('handleSearchTermChange', function() {
		it('should call setPaginatedData helepr method & set pageNumber to 1', function() {
			HistoryTableController.handleSearchTermChange(component, event, helper);
			expect(component.set).toHaveBeenCalledWith('v.pageNumber', 1);
			expect(helper.setPaginatedData).toHaveBeenCalledWith(component);								
		})
	})
});

