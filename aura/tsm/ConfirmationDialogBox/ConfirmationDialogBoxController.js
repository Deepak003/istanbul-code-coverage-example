({
   closeModel: function(component, event, helper) {
      component.set("v.confirmStatus", "FALSE");
      component.set("v.isOpen", false);
   },
 
   likenClose: function(component, event, helper) {
      component.set("v.confirmStatus", "TRUE");
      component.set("v.isOpen", false);
   }
})