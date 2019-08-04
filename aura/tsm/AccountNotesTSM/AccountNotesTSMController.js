({
    init: function(component, event, helper) {
        //TODO
    },

    handleChange: function(component, event, helper) {
        var noteText = component.find('accNote').get('v.value').trim();
        if(noteText.length>0){
            component.set("v.isDisabled","false");
        }else{
            component.set("v.isDisabled","true");
        }
    },
    
    getAccNotes: function(component, event, helper) {
        helper.getAccountNotes(component);
    },
    
    addAccNoteClick : function(component, event, helper) {
        if(component.get("v.accountMaskingList.AddAccountNote")){
            component.set('v.addAccountFlag', true);
        }
    },
    
    cancelAddNoteClick: function(component, event, helper) {
        component.set('v.addAccountFlag', false);
        component.set('v.isDisabled', true);		
    },
    
    saveAddNoteClick: function(component, event, helper) {
        var action = component.get("c.createAccountNotes");  
        var note = component.find('accNote').get('v.value').trim(),
            sticky = component.find('accNoteSticky').get('v.value'),
            spinner = component.find("spinner"),
            accountId = component.get("v.accountId");
        
        // validations
        let isInValid = false;
        
        // TSM-541: check for script tag like:  <script>alert("009")</script>        
        // isInValid = /<script[\s\S]*?>[\s\S]*?<\/script>/gm.test(note);      
        
        if (note && !isInValid) {
            //$A.util.toggleClass(spinner, "slds-hide");
            //To-Do set userId, userEmail for temp note 
            var tempNote = {noteText: note,
                            noteType: sticky ? 'ACCTSTICKYNOTE' : 'ACCTNOTE',
                            userId: accountId,
                            userEmail: 'uat6@outlook.com'
                           };           
            component.set('v.addAccountFlag', false);
            action.setParams({ "strNotesVO" : JSON.stringify(tempNote) });
            console.log(JSON.stringify(tempNote));
            $A.util.toggleClass(spinner, "slds-hide");
            action.setCallback(this, function(response) {
                $A.util.toggleClass(spinner, "slds-hide");
                var state = response.getState();                
                if (state === "SUCCESS") {
                    var notes = helper.addRelativeDate(response.getReturnValue());
                    component.set("v.accNotesList", notes); 
                    helper.sortNotes(component);
                    //$A.util.toggleClass(spinner, "slds-hide");
                    //component.set('v.isSaved', true);
                    component.set('v.isDisabled', true);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "message": 'New Account Note Saved',
                        type: 'success',						
                        duration:'5000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();                                        
                }else{
                    console.log("Failed with state: " + state);
                }
            });
            $A.enqueueAction(action);
        }else{
            console.log("Note validation failed");
        }
    },
    
    changeStickyClick: function(component, event, helper) {
        var accountId = component.get("v.accountId");
        var noteId = event.currentTarget.getAttribute('data-pk'),
            stickyFlag = !$A.util.hasClass(event.target, 'sticky'),
            noteType = stickyFlag ? 'ACCTSTICKYNOTE' : 'ACCTNOTE',
            action = component.get("c.updateStickyStatusofNote"),
            spinner = component.find("spinner");
        $A.util.toggleClass(spinner, "slds-hide");
        action.setParams({ "strNotesId" : noteId, "strNoteType": noteType, "strUserId": accountId});            
        action.setCallback(this, function(response) {
            $A.util.toggleClass(spinner, "slds-hide");
            var state = response.getState();             
            if (state === "SUCCESS") {
                var notes = helper.addRelativeDate(response.getReturnValue());
                component.set("v.accNotesList", notes);                
                //$A.util.toggleClass(spinner, "slds-hide");
            }else{
                //$A.util.toggleClass(spinner, "slds-hide");
                console.log("Failed with state: ", state);
                console.log("Failed Error msg: ", response.getError());                
            }
            helper.sortNotes(component);
        });
        $A.enqueueAction(action);  
        $A.util.toggleClass(event.target, 'sticky');
    },
    
    accNotesListChange: function(cmp, evt) {
        var list = evt.getParam("value");
        cmp.set("v.pinnedNoteCount", list.filter((l)=>l.noteType=='sticky').length);
    }
})