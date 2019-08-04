({
	init : function(component, event, helper) {		
        helper.getAHTPerformance(component);
        setInterval(function() {
        	helper.getAHTPerformance(component);
        }, 1000*15*60);
	},

	setPresenceStatus : function(component, event, helper){
        var omniAPI = component.find("omniToolkit"),
            statusName = event.getParam('statusName');
        component.set('v.presenceStatus', statusName);
        //Setting the status in global
        window.agentStatus = statusName;
        
    },
    
    onLogout : function(component, event, helper){
        component.set('v.presenceStatus', 'Offline');
    },
    omniDisconnectedToastHandler: function(component, event, helper) {
        if(event.getParams().message.includes('Omni-Channel')){
            component.set('v.presenceStatus', 'Offline');
        }
    }
})