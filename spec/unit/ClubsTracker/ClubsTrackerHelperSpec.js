const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction', 'getCallback']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

const Util = jasmine.createSpyObj('Util', ['handleSuccess', 'handleErrors', 'repairDate']);

var ClubsTrackerHelper = require('../../../aura/tsm/ClubsTracker/ClubsTrackerHelper.js');

var ClubsTrackerHelper = require('../../../aura/tsm/ClubsTracker/ClubsTrackerHelper.js');

describe('ClubsTrackerHelper', ()=> {
	let component, event, helper, action, response, persona;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.get = jasmine.createSpy('get').and.callFake((arg)=> {
            if (arg == 'v.selectedPersona') {
                return persona;
            }
        });
    });

    describe('formatData', ()=> {
        beforeEach(()=> {
            // spy method           
            spyOn(ClubsTrackerHelper, 'formatClubsDate')
                .and.callFake((persona)=> {
                    persona.subEntities.forEach(function(c){            
                        c.dateCreated = 'Nov/19/18';
                    });
                    return persona;
                })
        })
        it('should clear the data', function() {
            component.get = jasmine.createSpy('get')
                .withArgs('v.selectedPersona').and.returnValue({ object : { subEntities : [] }})
                .withArgs('v.historyStats').and.returnValue({name : 'changeClubName'});

            ClubsTrackerHelper.formatData(component);

            expect(component.set).toHaveBeenCalledWith('v.persona', {});
            expect(component.set).toHaveBeenCalledWith('v.clubs', []);
            expect(component.set).toHaveBeenCalledWith('v.subClubs', []);
        })
        it('should set persona & clubs information', function() {
            component.get = jasmine.createSpy('get')
                .withArgs('v.selectedPersona').and.returnValue({ object : { subEntities : [{ dateCreated : '1542622034721' }] }})
                .withArgs('v.historyStats').and.returnValue([{fields : [{ newValue : "Thu Mar 22 06:29:12 UTC 2018" }]}])
                .withArgs('v.persona').and.returnValue({ subEntities : [{ idType : 'FUTClub', name: 'futClub1'  }, { idType : 'WCClub', name: 'Wcclub1' }] });

            ClubsTrackerHelper.formatData(component);

            expect(component.set).toHaveBeenCalledWith('v.persona', { subEntities : [ { dateCreated : 'Nov/19/18' } ]  });
            expect(component.set).toHaveBeenCalledWith('v.persona.isExpand', true);
            expect(component.set).toHaveBeenCalledWith('v.clubs', [{ idType : 'FUTClub', name: 'futClub1' }]);
            expect(component.set).toHaveBeenCalledWith('v.subClubs', [{ idType : 'WCClub', name: 'Wcclub1' }]);
            expect(component.set).toHaveBeenCalledWith('v.persona', {  subEntities : [{ idType : 'FUTClub', name: 'futClub1'  }, { idType : 'WCClub', name: 'Wcclub1' }] });
        })
        afterEach(()=> {
            // spy method reset
            ClubsTrackerHelper.formatClubsDate.calls.reset();
        })
    })

    // describe('formatClubData', ()=> {
    // 	beforeEach(()=> {
    // 		// spy method    		
    // 		spyOn(ClubsTrackerHelper, 'setDate');
    // 	})
    //     it('should set clubs to empty array', function() {
    //     	persona = undefined;
    //     	ClubsTrackerHelper.formatClubData(component);
    //         expect(component.set).toHaveBeenCalledWith('v.clubs', []);
    //     });
    //     it('should set personaId to undefined', function() {
    //     	persona = undefined;
    //     	ClubsTrackerHelper.formatClubData(component);
    //         expect(component.set).toHaveBeenCalledWith('v.personaId', undefined);
    //     });
    //     it('should set personaId', function() {
    //     	persona = {
    //     		object: { 
    //     			id: 1234
    //     		}
    //     	};
    //     	ClubsTrackerHelper.formatClubData(component);
    //         expect(component.set).toHaveBeenCalledWith('v.personaId', 1234);
    //     });
    //     afterEach(()=> {
    // 		// spy method reset
    // 		ClubsTrackerHelper.setDate.calls.reset();
    // 	})
    // })
});

