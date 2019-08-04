({	doInit: function(component, event, helper) {
        const data = component.get('v.parentRow.data');
        try{            
        	const draftValue = data.find((d)=>d.label=='details').value.find((v)=>v.key.toLowerCase()=='draft type').value;
        	// setting dropdown value from parent row
            component.set("v.modeType", draftValue);
        }catch(err){
            console.log(err)
        }        
    },
    closeModal: function(component, event, helper) {
        helper.closeModal(component);
    },
    handleReset: function(component, event, helper) {
        helper.doReset(component);        
    }
})