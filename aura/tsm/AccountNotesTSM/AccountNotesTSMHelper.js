({
	getAccountNotes : function(component) {
        var spinner = component.find("spinner"),
            notesList = [];
        $A.util.toggleClass(spinner, "slds-hide");
        var action = component.get("c.getAllAccountNotesByUserIdOrEmail"),
            accountId = component.get("v.accountId");
        action.setParams({"strUserId" : accountId, "strUserEmail":'null'});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isFetched", true);
            $A.util.toggleClass(spinner, "slds-hide");
            if (state === "SUCCESS") {
                var noteResponse = this.addRelativeDate(response.getReturnValue());                
                //console.log('acountNotesList'+ response.getReturnValue());
                component.set("v.accNotesList", noteResponse);
                this.sortNotes(component);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
	},
    
    addAccNote: function(component) {
        var action = component.get("c.createAccountNotes"),
            tempNote = component.get('v.accNote');
        action.setParams({strNotesVO : tempNote});
        this.sortNotes(component, '', 'add');
    },
    
    changeNoteType: function(component, noteId, stickyFlag) {
        console.log('Note Id: '+ noteId + 'Type: '+ stickyFlag);
        this.sortNotes(component, noteId, '', stickyFlag);
        var action = component.get("c.updateStickyStatus");
        action.setParams({"strNotesId": noteId, "strNoteType": stickyFlag ? 'ACCTSTICKYNOTE' : 'ACCTNOTE'});
        // Add callback behavior to update the note type
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                 console.log("Success with state: " + state);
            }
            else {
                 console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        //$A.enqueueAction(action);
    },
    
    sortNotes: function(component, noteId, addFlag, noteType) {
        var noteArrS = [],
            noteArr = [],
            notes = component.get('v.accNotesList'),
            tempNote = component.get('v.accNote');
        if (addFlag != '' && tempNote && tempNote != null) {
            if (tempNote.noteType == 'ACCTSTICKYNOTE') {
                noteArrS.push(tempNote);
            }
            else {
                noteArr.push(tempNote);
            }
        }        
        for(var i =0; i<notes.length; i++) {
            if (noteId && noteId != '' && notes[i].noteId == noteId) {
                notes[i].noteType = noteType ? 'sticky' : 'ACCTNOTE';
            }
            if (notes[i].noteType == 'sticky') {
                noteArrS.push(notes[i]);
            }
            else {
                noteArr.push(notes[i]);
            }
        }
        noteArrS.sort(this.sortByDate);
        noteArr.sort(this.sortByDate);
        noteArrS = noteArrS.concat(noteArr);
        component.set('v.accNotesList', noteArrS);
        component.set('v.addAccountFlag', false);
	},
    
    sortByDate: function (a, b) {
        if (a.noteDate > b.noteDate)
            return -1;
        if (a.noteDate < b.noteDate)
            return 1;
        return 0;
    },
    addRelativeDate: function (notes) {
        if (notes.length) {
            for (var i=0; i<notes.length; i++) {
                if (notes[i].noteType == "ACCTSTICKYNOTE") {
                    notes[i].noteType = 'sticky';
                }                    
                notes[i].relativeDateTime = new Date(notes[i].noteDate);
            }
        }    	
        return notes;
	}
})