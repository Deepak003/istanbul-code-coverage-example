const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

var CaseUpdatesHelper = require('../../../aura/tsm/CaseUpdates/CaseUpdatesHelper.js');

var CaseUpdatesHelper = require('../../../aura/tsm/CaseUpdates/CaseUpdatesHelper.js');

describe('CaseUpdatesHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        // component.get = jasmine.createSpy('get').and.returnValue({
        //     setParams: ()=> {},
        //     setCallback: ()=> {}
        // });
    });


    describe('toggleState', ()=> {
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.caseUpdatesList') {
                    return [{ expanded : true }];
                }
            });

            event.getSource = jasmine.createSpy('getSource').and.returnValue({
                get: () => 0
            });
            CaseUpdatesHelper.toggleState(component, event, helper);
        });
        it('should set caseUpdatesList', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", [{ expanded : false }]);
        });
    });

    describe('toggleStateAll', ()=> {
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.caseUpdatesList') {
                    return [{ expanded : true }];
                }
            });

            event.getParam = jasmine.createSpy('getParam').and.callFake((arg)=> {
                if(arg == 'isExpanded'){
                    return true
                }
            })
            CaseUpdatesHelper.toggleStateAll(component, event, helper);
        });
        it('should set caseUpdatesList', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", [{ expanded : false }]);
        });
    });

    describe('handleFilterChange', ()=> {
        beforeEach(()=> {
            event.getParam = jasmine.createSpy('getParam').and.callFake((arg)=> {
                if(arg == 'type'){
                    return "something"
                }
            })
            CaseUpdatesHelper.handleFilterChange(component, event, helper);
        });
        it('should set the value', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.sortOrder", "something");
        });
    });

    describe('onSortOrderChange', ()=> {
        let list = [];

        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);        
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);


        list.push({ date : yesterday });
        list.push({ date : today });
        list.push({ date : tomorrow });        
        
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.sortOrder') {
                    return 'ASC';
                }else if(arg == 'v.caseUpdatesList') {
                    return list.slice(0)
                }
            });
            CaseUpdatesHelper.onSortOrderChange(component,event);
        });
        it('should sort ASC order', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", list);              
        });
    });

    describe('onSortOrderChange', ()=> {
        let list = [];

        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);        
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        list.push({ date : yesterday });
        list.push({ date : today });
        list.push({ date : tomorrow });        
        
        beforeEach(()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'v.sortOrder') {
                    return 'DESC';
                }else if(arg == 'v.caseUpdatesList') {
                    return list.slice(0)
                }
            });
            CaseUpdatesHelper.onSortOrderChange(component,event);
        });
        it('should sort DESC order', ()=> {
            expect(component.set).toHaveBeenCalledWith("v.caseUpdatesList", list.reverse());              
        });
    });

    // describe('doRefresh', ()=> {
    //     beforeEach(()=> {
    //         CaseUpdatesHelper.getCaseUpdates = jasmine.createSpy('getCaseUpdates');
    //         CaseUpdatesHelper.doRefresh(component,event);
    //     });
    //     it('should call getCaseUpdates', ()=> {
    //         expect(CaseUpdatesHelper.getCaseUpdates).toHaveBeenCalled();   
    //     });
    //     afterEach(()=> {            
    //         CaseUpdatesHelper.getCaseUpdates.calls.reset();
    //     })
    // });

    // describe('getNextPage', ()=> {
    //     beforeEach(()=> {
    //         CaseUpdatesHelper.getCaseUpdates = jasmine.createSpy('getCaseUpdates');
    //         CaseUpdatesHelper.getNextPage(component,event);
    //     });
    //     it('should call getCaseUpdates', ()=> {
    //         expect(CaseUpdatesHelper.getCaseUpdates).toHaveBeenCalled();   
    //     });
    //     afterEach(()=> {            
    //         CaseUpdatesHelper.getCaseUpdates.calls.reset();
    //     })
    // });


})

