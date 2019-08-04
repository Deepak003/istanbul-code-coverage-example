({
    doInit:function(component,event,helper){
        let subscriptionType = component.get("v.subscriptionType");
        if(subscriptionType == "Origin"){
           component.set("v.openSection",true);
        }
        helper.fetchAllBillingAccountsByUserHelper(component,event,helper);
    },
    suppressExpandClick: function(component,event,helper) {
        event.stopPropagation();     
    },
    expandClick : function(component,event,helper) {       
        //const items = component.get("v.previousSubscriptions"),
        //index = event.getSource().get("v.value");
        //items[index].expanded = !items[index].expanded;
        //component.set("v.previousSubscriptions", items);
        const index = event.currentTarget.dataset.index;
        helper.toggleSubscriptionRow(component, index);
    },
    toggleExpand:function(component,event){
        ///let originSub = component.find("ishaq");
        component.set("v.openSection", !component.get("v.openSection"));
        ///$A.util.toggleClass(originSub,"slds-is-open");
    },
    handleSelect:function(component,event){
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
        switch(event.getParam("value")) {
            case 'Stop':
                component.set('v.stopSubscriptionObj', component.get("v.currentSubscription"));
                component.set('v.stopOrCancel', "Stop");                           
                component.set('v.stopSubscriptionModal.isOpen', true);   
                break;
            case 'Cancel':                
                component.set('v.stopSubscriptionObj', component.get("v.currentSubscription"));
                component.set('v.stopOrCancel', "Cancel");
                component.set('v.stopSubscriptionModal.isOpen', true);
                break;
            case 'Modify':                
                component.set('v.modifySubscriptionObj', component.get("v.currentSubscription"));
                component.set('v.modifySubscriptionModal.isOpen', true);
                break;                 
        }
    },
    handleSelectNuclues:function(component,event){
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
        switch(event.getParam("value")) {
            case 'Stop':
                component.set('v.stopSubscriptionObj', event.getSource().get("v.value"));                              
                component.set('v.stopOrCancel', "Stop");
                component.set('v.stopSubscriptionModal.isOpen', true);
                break;
            case 'Cancel':
                component.set('v.stopSubscriptionObj', event.getSource().get("v.value"));                           
                component.set('v.stopOrCancel', "Cancel");
                component.set('v.stopSubscriptionModal.isOpen', true);
                break;
        }
    },
    handleResetSubscriptionAccordian: function(component,event) {
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
        component.set('v.showAddSubscription',false);
    },
    handleRefundSubsComponentEvent: function(component,event) {
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
        component.set('v.showAddSubscription',false);
    }, 
    handleStackedSelect:function(component,event){
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
        
        switch(event.getParam("value")) {
            case 'Stop':
                component.set('v.stopSubscriptionObj', event.getSource().get("v.value"));
                component.set('v.stopOrCancel', "Stop");                           
                component.set('v.stopSubscriptionModal.isOpen', true);   
                break;
            case 'Cancel':                
                component.set('v.stopSubscriptionObj', event.getSource().get("v.value"));
                component.set('v.stopOrCancel', "Cancel");
                component.set('v.stopSubscriptionModal.isOpen', true);
                break;
            case 'Modify':                
                //component.set('v.modifySubscriptionObj', component.get("v.currentSubscription"));
                //component.set('v.modifySubscriptionModal.isOpen', true);
                break;                 
        }
    },
    openInvoices:function(component, event){
        const id = event.getSource().get("v.value");
        const currentSubscription = component.get('v.currentSubscription');
        const previousSubscriptions = component.get('v.previousSubscriptions');        
        const subscriptions = [].concat(previousSubscriptions, currentSubscription).filter(Boolean);
        const targetSubscription = subscriptions.find((s)=>s.subscriptionId == id);
        
        component.set('v.invoiceModal.isOpen', !component.get('v.invoiceModal.isOpen'));
        component.set('v.invoiceModal.subscription', targetSubscription);
    },
    addSubscription : function(component,event,helper){
        component.set('v.showAddSubscription',true);
    },
    closeModal : function(component,event,helper){
        component.set('v.showAddSubscription',false);
        component.set('v.stopSubscriptionModal.isOpen', false);
        component.set('v.modifySubscriptionModal.isOpen', false);
    },
    copy : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        var holdtxt = document.getElementById("holdtext");
        holdtxt.select();
        document.queryCommandSupported('copy');
        document.execCommand('copy');
        toastEvent.setParams({
            type: 'success',
            message: 'Secure Purchase Link Copied'
        });
        toastEvent.fire();
    }
})