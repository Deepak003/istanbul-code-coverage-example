const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback', 'get']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var ClubsTrackerController = require('../../../aura/tsm/ClubsTracker/ClubsTrackerController.js');

var ClubsTrackerController = require('../../../aura/tsm/ClubsTracker/ClubsTrackerController.js');

describe("ClubsTrackerController", function() {
	let component, event, helper;
    beforeEach(function() {
    	component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
    	event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
    	helper = jasmine.createSpyObj('helper', ["formatData","getRowActions","loadBackgroundData","resetClubLimit", "doServerRequest", "restoreClub", "closeModal"]);
    })
	describe('handleRefresh', function() {
        beforeEach(function() {
            ClubsTrackerController.handleRefresh(component, event, helper);
        });
        it('should call the helper method formatData', function() {
            expect(helper.formatData).toHaveBeenCalledWith(component);
        });
    });
    describe('doInit', function() {
        beforeEach(function() {
            ClubsTrackerController.doInit(component, event, helper);
        });
        it('should call the helper method formatData & loadBackgroundData', function() {
            expect(helper.formatData).toHaveBeenCalledWith(component);
            expect(helper.loadBackgroundData).toHaveBeenCalledWith(component);
        });
        it('should set datatable columns', function() {
            expect(component.set).toHaveBeenCalledWith('v.columns', [
                { label: 'CLUB NAME', fieldName: 'name', type: 'text', cellAttributes: {  
                    class: 'tsm-table-row'
                }},
                { label: 'STATUS', fieldName: 'status', type: 'text', cellAttributes: {  
                    class:{
                        fieldName:"status"
                    }
                }
                },
                { label: 'CREATION DATE', fieldName: 'dateCreated', type: 'text' },
                { type: 'action', typeAttributes: { rowActions: jasmine.any(Function) } }
            ])
        });
    });
    describe('openResetClubLimitModal', function() {
        beforeEach(function() {
            ClubsTrackerController.openResetClubLimitModal(component, event, helper);
        });
        it('should open the modal', function() {
            expect(component.set).toHaveBeenCalledWith('v.resetClubLimitModal.isOpen', true);
        });
    });

    describe('onClickUnlock', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickUnlock(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.doServerRequest).toHaveBeenCalledWith(component, 'unlock-persona');
        });
    });
    describe('onClickRestore', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickRestore(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.restoreClub).toHaveBeenCalledWith(component);
        });
    });
    describe('onClickReset', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickReset(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.doServerRequest).toHaveBeenCalledWith(component, 'reset-club-limit');
        });
    });    
    describe('onClickChangeClubNameSave', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickChangeClubNameSave(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.doServerRequest).toHaveBeenCalledWith(component, 'change-club-name');
        });
    });
    describe('onClickDeactivate', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickDeactivate(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.doServerRequest).toHaveBeenCalledWith(component, 'deactivate-persona');
        });
    });
    describe('onClickActivate', function() {
        beforeEach(function() {
            ClubsTrackerController.onClickActivate(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.doServerRequest).toHaveBeenCalledWith(component, 'activate-persona');
        });
    });
    describe('closeModal', function() {
        beforeEach(function() {
            ClubsTrackerController.closeModal(component, event, helper);
        });
        it('should call helper method', function() {
            expect(helper.closeModal).toHaveBeenCalledWith(component);
        });
    });
    describe('handleSubClubChange', function() {
        const random = Math.random();
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(random);
            ClubsTrackerController.handleSubClubChange(component, event, helper);
        });
        it('should set value to attribute', function() {
            expect(component.set).toHaveBeenCalledWith('v.restoreClubModal.subClub', random);
        });
    });
    describe('handleReasonChangeForRestoreClub', function() {
        const random = Math.random();
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(random);
            ClubsTrackerController.handleReasonChangeForRestoreClub(component, event, helper);
        });
        it('should set value to attribute', function() {
            expect(component.set).toHaveBeenCalledWith('v.restoreClubModal.reason', random);
        });
    });
    
    describe('handleReasonChangeForActivePersona', function() {
        const random = Math.random();
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(random);
            ClubsTrackerController.handleReasonChangeForActivePersona(component, event, helper);
        });
        it('should set value to attribute', function() {
            expect(component.set).toHaveBeenCalledWith('v.activatePersonaModal.reason', random);
        });
    });
    
    describe('handleReasonChangeForDeactivatePersona', function() {
        const random = Math.random();
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue(random);
            ClubsTrackerController.handleReasonChangeForDeactivatePersona(component, event, helper);
        });
        it('should set value to attribute', function() {
            expect(component.set).toHaveBeenCalledWith('v.deAtivePersonaModal.reason', random);
        });
    });

    describe('toggleExpand', function() {
        beforeEach(function() {
            component.get = jasmine.createSpy('get').and.returnValue(true);
            ClubsTrackerController.toggleExpand(component, event, helper);
        });
        it('should set value to attribute', function() {
            expect(component.set).toHaveBeenCalledWith('v.persona.isExpand', false);
        });
    });

    describe('handleActionMenuSelect', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue('deactivate');
            ClubsTrackerController.handleActionMenuSelect(component, event, helper);
        });
        it('should set value to deAtivePersonaModal', function() {
            expect(component.set).toHaveBeenCalledWith('v.deAtivePersonaModal.isOpen', true);
        });
    });

    describe('handleActionMenuSelect', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue('activate');
            ClubsTrackerController.handleActionMenuSelect(component, event, helper);
        });
        it('should set value to activatePersonaModal', function() {
            expect(component.set).toHaveBeenCalledWith('v.activatePersonaModal.isOpen', true);
        });
    });

    describe('handleActionMenuSelect', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam').and.returnValue('unlock');
            ClubsTrackerController.handleActionMenuSelect(component, event, helper);
        });
        it('should set value to unlockPersonaModal', function() {
            expect(component.set).toHaveBeenCalledWith('v.unlockPersonaModal.isOpen', true);
        });
    });

    describe('handleRowAction', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam')
                .withArgs('action').and.returnValue({name : 'changeClubName'})
                .withArgs('row').and.returnValue({ col1 : 'val1' });

            component.get = jasmine.createSpy('get')
                .withArgs('v.subClubs').and.returnValue([{status : 'deleted', name: 'name1', id: 123}]);

            ClubsTrackerController.handleRowAction(component, event, helper);
        });
        it('should set value to changeClubNameModal', function() {
            expect(component.set).toHaveBeenCalledWith('v.changeClubNameModal.isOpen', true);
        });
    });

    describe('handleRowAction', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam')
                .withArgs('action').and.returnValue({name : 'restore'})
                .withArgs('row').and.returnValue({ col1 : 'val1' });

            component.get = jasmine.createSpy('get')
                .withArgs('v.subClubs').and.returnValue([{status : 'deleted', name: 'name1', id: 123}]);

            ClubsTrackerController.handleRowAction(component, event, helper);
        });
        it('should set value to restoreClubModal', function() {
            expect(component.set).toHaveBeenCalledWith('v.restoreClubModal.isOpen', true);
        });
    });

    describe('handleRowAction', function() {
        beforeEach(function() {
            event.getParam = jasmine.createSpy('getParam')
                .withArgs('action').and.returnValue({name : 'restore'})
                .withArgs('row').and.returnValue({ col1 : 'val1' });

            component.get = jasmine.createSpy('get')
                .withArgs('v.subClubs').and.returnValue([{status : 'deleted', name: 'name1', id: 123}, {status : 'active', name: 'name2', id: 1234}]);

            ClubsTrackerController.handleRowAction(component, event, helper);
        });
        it('should set value to targetClub', function() {
            expect(component.set).toHaveBeenCalledWith('v.targetClub', JSON.parse(JSON.stringify({ col1 : 'val1' })));
        });
        it('should set value to subClubsDropdown', function() {
            expect(component.set).toHaveBeenCalledWith('v.restoreClubModal.subClubsDropdown', [{label : 'name1', value: 123}]);
        });
    });



})

