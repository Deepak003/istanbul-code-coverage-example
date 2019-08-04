const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var HistoryTableHelper = require('../../../aura/tsm/HistoryTable/HistoryTableHelper.js');

var HistoryTableHelper = require('../../../aura/tsm/HistoryTable/HistoryTableHelper.js');

describe('HistoryTableHelper', ()=> {
	let component, searchTerm;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.get = jasmine.createSpy('get').and.callFake((arg)=> {
            if (arg == 'v.perPage') {
                return 2;
            }else if (arg == 'v.pageNumber') {
                return 2;
            }else if (arg == 'v.searchTerm') {
                return searchTerm;
            }else if (arg == 'v.data') {
                return ["This","is","to","say","hello","To","Every","One"];
            }
        });
    });

    describe('matcher', ()=> {
    	it('should return true', function() {
    		const matcher = HistoryTableHelper.matcher('ll');
    		const isExist = matcher({ status: 'hello' });

    		expect(isExist).toBe(true);
    	})
        it('should return false', function() {
            const matcher = HistoryTableHelper.matcher('lle');
            const isExist = matcher({ status: 'hello' });

            expect(isExist).toBe(false);
        })
    });
    
    describe('setPaginatedData', ()=> {
        beforeEach(()=> {
            spyOn(HistoryTableHelper, 'matcher').and.callFake(()=> ()=>true);
        });        

    	it('should set pagination data', function() {
            searchTerm = "something";
    		HistoryTableHelper.setPaginatedData(component);
    		expect(component.set).toHaveBeenCalledWith('v.totalPageNumber', 8);
            expect(component.set).toHaveBeenCalledWith('v.paginatedRows', ["to","say"]);
    	});
    });
    
    describe('setPaginatedData', ()=> {
        beforeEach(()=> {
            spyOn(HistoryTableHelper, 'matcher').and.callFake(()=> ()=>false);
        });        

        it('should set empty data', function() {
            searchTerm = "something";
            HistoryTableHelper.setPaginatedData(component);
            expect(component.set).toHaveBeenCalledWith('v.totalPageNumber', 0);
            expect(component.set).toHaveBeenCalledWith('v.paginatedRows', []);
        });        
    });
})


