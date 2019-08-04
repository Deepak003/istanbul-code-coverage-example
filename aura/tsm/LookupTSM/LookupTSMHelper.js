({
    closeLookup: function(component, event, helper) {
      var lookupDiv = component.find("lookup-div");     
      var isClickedOnLookup = this.isClickedOnLookup(event, 'slds-combobox_container');
      var listItem = component.find("lookup-id");
      var currentId = component.get("v.fieldName");
      //Closing the current lookup when clicked outside
        if(event.target != null){
          if(event.target.id != currentId){
            $A.util.removeClass(lookupDiv, 'slds-is-open');
            component.set("v.focusIndex",0); 
            var searchInput = component.find("lookup-input");
           }
        }
    },
    isClickedOnLookup: function(event, selectorClass) {
        var currentElement = event.target;
        if(currentElement !=null){
            while (currentElement.className != selectorClass) {
                currentElement = currentElement.parentNode;
                if (!currentElement) {
                    return false;
                }
            }
        }
        return true;
    },
    //Adding validation to check special characters
    isValidString: function (currentString){
        if (currentString.search(/[\[\]?*+|{}\\()@.\n\r]/) != -1) {
            return false;
        }else{
            return true;
        }
    },
})