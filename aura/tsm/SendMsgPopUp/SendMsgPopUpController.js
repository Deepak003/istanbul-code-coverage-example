({
	closePopUp : function(component, event, helper) {
		component.set('v.isPopUp', false);
	},
    yesButtonClick: function(component, event, helper) {
        component.set('v.sendMsgPreviewFlg', true);
		component.set('v.isPopUp', false);
	}
})