({
   openModel: function(component, event, helper) {
      var checkDifferenceEvent = component.getEvent("checkDifferenceEvent");
      checkDifferenceEvent.fire();
   },
 
   closeModel: function(component, event, helper) {
      component.set("v.isOpen", false);
       component.set("v.accountType", false);
       component.set("v.locationType", false);
       component.set("v.contactType", false);
       component.set("v.fifaType", false);
       component.set("v.masterType", false);
       
   },
    submitClicked: function(component,event,helper){
       // component.set("v.isOpen", false);
        var compEVT = component.getEvent("cmpEvent");
        compEVT.fire();
        component.set("v.isOpen", false);
    }
})