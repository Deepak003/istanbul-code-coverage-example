({	
	displayMsg: function(type, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'pester',
            duration: '5000',
            "message": msg,
            "type": type
        });
        toastEvent.fire();
    },
})