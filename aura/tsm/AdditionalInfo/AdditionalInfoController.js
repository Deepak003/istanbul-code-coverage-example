({
	doinit : function(component, event, helper) {      
        component.set('v.showClubs', false);
        helper.clubHistoryData(component);
        helper.modifyAdditionalInfoUI(component);
	},
    changeConfigUILayout:  function(component, event, helper) {
        helper.modifyAdditionalInfoUI(component);
    },
})