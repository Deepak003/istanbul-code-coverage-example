const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

var CaseUpdatesController = require('../../../aura/tsm/CaseUpdates/CaseUpdatesController.js');

var CaseUpdatesController = require('../../../aura/tsm/CaseUpdates/CaseUpdatesController.js');

describe("CaseUpdatesController", function() {
    let component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        

        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);

        helper = jasmine.createSpyObj('helper', ["getCaseUpdates", "toggleState", "toggleStateAll", "handleFilterChange", "doRefresh", "onSortOrderChange", "getNextPage"]); 
    });

    // describe('getCaseUpdates', function() {
    //     beforeEach(function() {
    //         CaseUpdatesController.getCaseUpdates(component, event, helper);
    //     });
    //     it('should call the helper method getCaseUpdates', function() {       
    //         expect(helper.getCaseUpdates).toHaveBeenCalledWith(component, event);          
    //     });
    // });

    describe('toggleState', function() {
        beforeEach(function() {
            CaseUpdatesController.toggleState(component, event, helper);
        });
        it('should call the helper method toggleState', function() {       
            expect(helper.toggleState).toHaveBeenCalledWith(component, event);          
        });
    });

    describe('toggleStateAll', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(['targetComponent']);
            component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

            CaseUpdatesController.toggleStateAll(component, event, helper);
        });

        it('should call the helper method toggleStateAll', function() {       
            expect(helper.toggleStateAll).toHaveBeenCalledWith(component, event);          
        });
    });

    describe('toggleStateAll', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(['Some-name-targetComponent']);
            component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

            CaseUpdatesController.toggleStateAll(component, event, helper);
        });

        it('should not call the helper method toggleStateAll', function() {       
            expect(helper.toggleStateAll).not.toHaveBeenCalled();         
        });
    });

    describe('handleFilterChange', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(['targetComponent']);
            component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

            CaseUpdatesController.handleFilterChange(component, event, helper);
        });

        it('should call the helper method handleFilterChange', function() {       
            expect(helper.handleFilterChange).toHaveBeenCalledWith(component, event);          
        });
    });

    describe('handleFilterChange', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(['Some-name-targetComponent']);
            component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

            CaseUpdatesController.handleFilterChange(component, event, helper);
        });

        it('should not call the helper method handleFilterChange', function() {       
            expect(helper.handleFilterChange).not.toHaveBeenCalled();         
        });
    });

    // describe('doRefresh', function() {
    //     beforeEach(function() {
    //         event.getParam = jasmine.createSpy('getParam').and.returnValue('targetComponent');
    //         component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

    //         CaseUpdatesController.doRefresh(component, event, helper);
    //     });

    //     it('should call the helper method doRefresh', function() {       
    //         expect(helper.doRefresh).toHaveBeenCalledWith(component, event);          
    //     });
    // });

    // describe('doRefresh', function() {
    //     beforeEach(function() {
    //         event.getParam = jasmine.createSpy('getParam').and.returnValue('Some-name-targetComponent');
    //         component.getName = jasmine.createSpy('getParam').and.returnValue('targetComponent');

    //         CaseUpdatesController.doRefresh(component, event, helper);
    //     });

    //     it('should not call the helper method doRefresh', function() {       
    //         expect(helper.doRefresh).not.toHaveBeenCalled();         
    //     });
    // });


    describe('onSortOrderChange', function() {
        beforeEach(function() {
            CaseUpdatesController.onSortOrderChange(component, event, helper);
        });
        it('should call the helper method onSortOrderChange', function() {       
            expect(helper.onSortOrderChange).toHaveBeenCalledWith(component, event);          
        });
    });

    // describe('onPageNoChange', function() {
    //     beforeEach(function() {
    //         CaseUpdatesController.onPageNoChange(component, event, helper);
    //     });
    //     it('should call the helper method toggleExpand', function() {       
    //         expect(helper.getNextPage).toHaveBeenCalledWith(component, event);          
    //     });
    // });
});

