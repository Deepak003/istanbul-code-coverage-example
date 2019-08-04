const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass', 'removeClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var HistoryController = require('../../../aura/tsm/History/HistoryController.js');

var HistoryController = require('../../../aura/tsm/History/HistoryController.js');

describe("HistoryController", function() {
	let component, event, helper;

    beforeEach(function() {
    	event = jasmine.createSpyObj('event', ['getSource', 'getParam', 'getParams']);
    	helper = jasmine.createSpyObj('helper', [""]);
    	component = jasmine.createSpyObj('component', ['set', 'get', 'getElement']);

    	component.find = jasmine.createSpy('find').and.callFake((arg)=> {
            if (arg == 'historyFilter') {
                return "historyFilterCmp";
            }else if (arg == 'historyTable') {
                return "historyTableCmp";
            }else if (arg == 'historyHeader') {
                return { setSearchTerm : ()=>{} };
            }
        })

    	event.getParams = event.getParam = jasmine.createSpy('getParams').and.callFake((arg)=> {
            if (arg == 'data') {
                return { fromDate : "123", toDate : "436" };
            }else if (arg == 'searchTerm') {
                return "Hello";
            }else if (arg == 'historyData') {
                return [{ createdOn: "2019-01-05T14:08:54.301Z" }];
            }
        });
	})

	describe('onClickViewHistory', function() {
		it('should hide historyTable & show historyFilter', function() {
			HistoryController.onClickViewHistory(component, event, helper);
			expect($A.util.addClass).toHaveBeenCalledWith("historyTableCmp", 'slds-hide');
			expect($A.util.removeClass).toHaveBeenCalledWith("historyFilterCmp", 'slds-hide');
		});

		it('should set filterInputData', function() {
			HistoryController.onClickViewHistory(component, event, helper);
			expect(component.set).toHaveBeenCalledWith("v.filterInputData", { startDateTime : "123", endDateTime : "436" });
		})
	});

	describe('showFilter', function() {
		it('should hide historyTable & show historyFilter', function() {
			HistoryController.showFilter(component, event, helper);
			expect($A.util.addClass).toHaveBeenCalledWith("historyTableCmp", 'slds-hide');
			expect($A.util.removeClass).toHaveBeenCalledWith("historyFilterCmp", 'slds-hide');
		});
	});

	describe('onChangeSearchTerm', function() {
		it('should set searchTerm', function() {
			HistoryController.onChangeSearchTerm(component, event, helper);
			expect(component.set).toHaveBeenCalledWith('v.searchTerm', 'Hello');
		});
	});

	describe('onHistoryData', function() {
		it('should set historyData, hide historyFilter, show historyTable & clear searchTerm', function() {
			HistoryController.onHistoryData(component, event, helper);
			expect(component.set).toHaveBeenCalledWith('v.historyData', [{ createdOn: "2019-01-05T14:08:54.301Z" }]);
			expect($A.util.removeClass).toHaveBeenCalledWith("historyTableCmp", 'slds-hide');
			expect($A.util.addClass).toHaveBeenCalledWith("historyFilterCmp", 'slds-hide');
			expect(component.set).toHaveBeenCalledWith('v.searchTerm', "");
		});
	});
})

