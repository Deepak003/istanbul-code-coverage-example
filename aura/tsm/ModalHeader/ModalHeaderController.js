({
    roleQueueAppEvtSubs: function(component, event, helper) {
        var param = event.getParam('roleQueue');
        if (param == 'roleSelect') {
            component.set('v.headerText', 'Fill Your Queue')
        }
        if (param == 'changeRole') {
            component.set('v.headerText', 'Choose Your Role')
        }
    }
})