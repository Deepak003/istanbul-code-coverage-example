({
      doInit: function(component, event, helper) {
         helper.searchCaseData(component, event, helper);
         //Function used to close the sub tabs in the console
          setTimeout(function() { 
            helper.getEnclosingTabId(component, event, helper);
        }, 1500);
          
      },
})