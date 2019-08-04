({
    /**
     * Initialize component
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    doInit : function (component, event, helper) {
        helper.getStatusCodes(component);
    },
    /**
     * Close modal on click on close action
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    closeSelectStateModal : function (component, event, helper) {
        component.set("v.showSelectStateModal",false);
    },
    /**
     * Fire save event once new status is selected
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    saveStatus : function (component, event, helper) {
        var selectedStatus = component.get("v.selectedStatus");
        var presenceStatusEvt = component.getEvent("presenceStatusEvt"); 
        presenceStatusEvt.setParams({"selectedStatus" : selectedStatus}); 
        presenceStatusEvt.fire(); 
        component.set('v.showSelectStateModal', false);
    },
})