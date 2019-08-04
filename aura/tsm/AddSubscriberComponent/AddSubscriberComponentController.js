({
    init : function(component, event, helper) {
        component.set("v.type", '');
        component.set("v.message", '');
        component.set("v.addSuccessful", false);
        component.set("v.objGDPRSubscriber",{'sobjectType':'GDPRSubscriber__c',
                                             'Name': '',
                                             'Alias__c': '',
                                             'Email__c': '',
                                             'Active__c': false});
    },
    
    closeModal: function(component, event, helper) {
        component.set("v.newSubscriberFlag", false);
    },
    
    handleButton: function(component, event, helper) {
        var name = component.get("v.objGDPRSubscriber.Name");
        var email = component.get("v.objGDPRSubscriber.Email__c");
        var alias = component.get("v.objGDPRSubscriber.Alias__c");
        if (name.includes('<') || name.includes('>')) {
            var str = name.replace(/</gi, '');
            str = str.replace(/>/gi, '');
            component.set("v.objGDPRSubscriber.Name", str);
            helper.showToast();
        }
        if (email.includes('<') || email.includes('>')) {
            var str = email.replace(/</gi, '');
            str = str.replace(/>/gi, '');
            component.set("v.objGDPRSubscriber.Email__c", str);
            helper.showToast();
        }
        if (alias.includes('<') || alias.includes('>')) {
            var str = alias.replace(/</gi, '');
            str = str.replace(/>/gi, '');
            component.set("v.objGDPRSubscriber.Alias__c", str);
            helper.showToast();
        }
        if (name && email) {
            component.set("v.disableButton", false);
        }
        else {
            component.set("v.disableButton", true);
        }
    },
    
    createSubscriber : function(component, event, helper) {
        var objSubscriber = component.get("v.objGDPRSubscriber");
        helper.createSubscriber(component, event, objSubscriber);
    },
    
})