({
	doInit : function(component, event, helper) {
        helper.getCaseUpdates(component);
              
        
		/*
        component.set("v.summaryList", [{
            date : "Mar/24/2018 12:10AM GMT",
            caseAction : "Close",
            advisorName : "Paul Bond",
            note : {
                title : "Actions performed:",
            	actions : [
                    'Account verified, and SQA updated', 
                    'Reviewed game transaction history',
                    'Asked the player to provide receipt on the purchase. Change the case status to waiting on customer.'
                ]
            },
            links : [{
                label : "Chat transcript",
                href : ""
            },{
                label : "Message sent to player",
                href : ""
            }]
        },{
            date : "Mar/23/2018 12:10AM GMT",
            caseAction : "Close",
            advisorName : "Paul Bond",
            note : {
                title : "",
            	actions : [
                    'Reviewed the receipts copy provided by the player and validated the purchase.',
                    'Compensated the player for the lost content.',
                    'Marked the case as resolved.'
                ]
            },
            links : [{
                label : "Chat transcript"
            },{
                label : "Attachments (2)"
            },{
                label : "Message sent to player"
            }]
        }])
        */
	},
    onLinkClick : function(component, event, helper) {
        helper.onLinkClick(component, event);
    }
})