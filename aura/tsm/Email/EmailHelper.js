({
	sendEmail : function(component, event, helper) {
	    var action = component.get("c.createOutboundEmailRecord");
        action.setParams({
            strEmailAddress : component.get("v.emailId"),
            outboundMessage : component.get("v.message"),
            caseId : component.get("v.caseId")
        });
        // Add callback behavior for when response is received
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
        $A.enqueueAction(action);
	},
    setDirectionAuto: function(component) {
        //var container = component.find("emailBody").getElement();
        //container.set("dir","auto");
        //container.setAttribute("dir", "auto");
		//var b = container.getElementsByClassName('slds-rich-text-editor__textarea');
		//b.setAttribute("dir", "auto")
		//
        //var richTextBox = document.getElementsByClassName('slds-rich-text-area__content');
        //richTextBox.setAttribute("dir", "auto");
    }
})