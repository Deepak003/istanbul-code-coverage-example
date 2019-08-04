({
	getAccountNotes : function(component,event,helper) {
            var spinner = component.find("accountNSpinner"),
            notesList = [];
           if($A.util.hasClass(spinner, "slds-hide")){
                $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");
            }
            else{
                $A.util.addClass(spinner, "slds-hide");
                $A.util.removeClass(spinner, "slds-show");
            }
        
        var accountId = component.get("v.targetAccountID"),
            accountEmail = component.get("v.targetAccountEmail"),
            errorMessage = component.get("v.errorMsg");
        if(accountId != undefined || accountEmail != undefined){
            var action = component.get("c.getAllAccountNotesByUserIdOrEmail");
        action.setParams({strUserId : accountId , strUserEmail: accountEmail});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var noteResponse = this.addRelativeDate(response.getReturnValue());                
                component.set("v.accNotesList", noteResponse);      
                this.sortNotes(component);
            }
            else if(state === "ERROR"){
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            this.displayErrorMsg('error', errorMessage);
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        this.displayErrorMsg('error', errorMessage);
                    }
            }
            else{
                this.displayErrorMsg('error', errorMessage);
            }
            $A.util.addClass(spinner, "slds-hide");
			$A.util.removeClass(spinner, "slds-show");
        });
        // Send action off to be executed
        $A.enqueueAction(action);
      }
	},
    
    addAccNote: function(component) {
        var action = component.get("c.createAccountNotes"),
            tempNote = component.get('v.accNote');
        action.setParams({AccountNotesVO : tempNote});
        this.sortNotes(component, '', 'add');
    },
    
    changeNoteType: function(component, noteId, stickyFlag) {
        console.log('Note Id: '+ noteId + 'Type: '+ stickyFlag);
        this.sortNotes(component, noteId, '', stickyFlag);
        var action = component.get("c.updateStickyStatus");
        action.setParams({notesId: noteId, noteType: stickyFlag ? 'ACCTSTICKYNOTE' : 'ACCTNOTE'});
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
            if (notes[i].noteType && notes[i].noteType == 'sticky') {
                noteArrS.push(notes[i]);
            }
            else {
                noteArr.push(notes[i]);
            }
        }
        noteArrS.sort(this.sortByDate);
        noteArr.sort(this.sortByDate);
        noteArrS = noteArrS.concat(noteArr);
		 // Added below code for THOR-1071 and 708  
        noteArrS.map(function(item) { 
                          	item.noteDate = $A.localizationService.formatDateTimeUTC(item.noteDate)+" "+ "UTC";
                        });												   
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
        if (notes && notes != null && notes.length) {            
            for (var i=0; i<notes.length; i++) {
                if (notes[i].noteType && notes[i].noteType == "ACCTSTICKYNOTE") {
                    notes[i].noteType = 'sticky';
                }
                if (notes[i].noteDate)
                	notes[i].relativeDateTime = new Date(notes[i].noteDate);
                // Checking only for encode chars
                var regExp = new RegExp('%[1-9|A-Z]', 'g');
                if (notes[i].noteText && notes[i].noteText.match(regExp)) {
                    notes[i].noteText = decodeURIComponent(notes[i].noteText);
                }                
            }
        }    	
        return notes;
	},
    showSpinner: function(component, event, helper) {
        var spinner = component.find("disScreenSpinner");
        $A.util.toggleClass(spinner, "slds-show");
    },
    hideSpinner: function(component, event, helper) {
        var spinner = component.find("disScreenSpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    displayErrorMsg: function(type, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "message": msg,
            "type": type
        });
        toastEvent.fire();
    },
})