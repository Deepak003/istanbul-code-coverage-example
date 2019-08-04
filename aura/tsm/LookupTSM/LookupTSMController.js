({
    doInit: function(component, event, helper) {  
    component.set("v.tempSearchString",component.get("v.selectedName"));
    },
    
  lookupSearchKeyUp : function(component, event, helper) {
        var listItem = component.find("lookup-id");
        var currentIndex = component.get("v.focusIndex");
        //Getting the div
        var lookupDiv = component.find("lookup-div");
        if(listItem != null){
          //Enter key press  
            if (event.keyCode == 13 || (event.keyCode == 9 && $A.util.hasClass(lookupDiv, 'slds-is-open'))){
              var searchString = component.get("v.selectedName");
              //if(event.target.className != "slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right") {
                var componentEvent = component.getEvent("lookupActionEvent");
                componentEvent.setParam("type", component.get('v.fieldName'));
                //Setting value on enter press
                var searchInput = component.find("lookup-input");
                //Setting name and id
                 if(listItem.length == null){
                    searchInput.set("v.value",listItem.getElement().innerText);
                  searchInput.set("v.name",listItem.getElement().id);
                    componentEvent.setParam("Name", listItem.getElement().innerText);
                    componentEvent.setParam("Id", listItem.getElement().id);
                 }else{
                    searchInput.set("v.value",listItem[currentIndex - 1].getElement().innerText);
                  searchInput.set("v.name",listItem[currentIndex - 1].getElement().id);  
                    componentEvent.setParam("Name", listItem[currentIndex - 1].getElement().innerText);
                    componentEvent.setParam("Id", listItem[currentIndex - 1].getElement().id);
                 }

                //closing the drop down and removing the existing focus
                $A.util.removeClass(lookupDiv, 'slds-is-open');
                //Setting index to zero
                component.set("v.focusIndex",1);
                //Fire component event
                componentEvent.setParam("isEmpty", false);
                componentEvent.fire(); 
              
                event.stopPropagation();
                event.preventDefault();
          //down key press    
        }else if(event.keyCode === 40){
            //Removing the end click event
            var searchString = component.get("v.selectedName");
            if((currentIndex +1) <= listItem.length){
                //Removing dummy focus
                $A.util.removeClass(listItem[0], 'custom-focus');
                listItem[currentIndex].getElement().focus();
                currentIndex = currentIndex + 1;
                component.set("v.focusIndex",currentIndex);  
                event.stopPropagation();
                event.preventDefault();
            }else{
                if(listItem.length == null){
                    listItem.getElement().focus();
                }else{
                   listItem[0].getElement().focus();         
                }
                component.set("v.focusIndex",1); 
            }
          //up key press  
        }else if(event.keyCode === 38){            
            //Removing the start click event
                currentIndex = currentIndex - 1;
                if(currentIndex > 0){
                    //Removing dummy focus
                    $A.util.removeClass(listItem[0], 'custom-focus');

                    //Removing the focus style
                    component.set("v.inititalFocusStyle", false);
                    listItem[currentIndex - 1].getElement().focus();
                    component.set("v.focusIndex",currentIndex);
                    event.stopPropagation();
                    event.preventDefault();
                }else{
                    if(listItem.length != null){
                        $A.util.removeClass(listItem[0], 'custom-focus');
                        listItem[listItem.length - 1].getElement().focus();
                        component.set("v.focusIndex",listItem.length);  
                    }
                }
          //Escape key press  
        }else if(event.keyCode === 27){
             var lookupDiv = component.find("lookup-div");
             var searchInput = component.find("lookup-input");
             component.set("v.focusIndex",1);
             if($A.util.hasClass(lookupDiv, "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open")){
                searchInput.set("v.value","");
              searchInput.set("v.name","");
                var componentEvent = component.getEvent("lookupActionEvent");
                componentEvent.setParam("type", component.get('v.fieldName'));
                componentEvent.setParam("isEmpty", true);
                componentEvent.fire(); 
             }
             //searchInput.set("v.value",component.get("v.tempSearchString"));
             //searchInput.set("v.name",component.get("v.selectedURL"));
             $A.util.removeClass(lookupDiv, 'slds-is-open');
             event.stopPropagation();
             event.preventDefault();
        }else if(event.keyCode == 9 && event.target.className == "slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right") {
            component.set("v.focusIndex",1);
            if(event.shiftKey){
                var lookupDiv = component.find("lookup-div");
                var searchInput = component.find("lookup-input");
              component.set("v.focusIndex",1);
              if($A.util.hasClass(lookupDiv, "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open")){
                    //searchInput.set("v.value","");
                    //searchInput.set("v.name","");
                    $A.util.removeClass(lookupDiv, 'slds-is-open');
              }
            }
        }
        }else{
            if(event.keyCode === 27){
                 var lookupDiv = component.find("lookup-div");
                 var searchInput = component.find("lookup-input");
                 component.set("v.focusIndex",1);
                 searchInput.set("v.value",component.get("v.tempSearchString"));
                 searchInput.set("v.name",component.get("v.selectedURL"));
                 $A.util.removeClass(lookupDiv, 'slds-is-open');
                 event.stopPropagation();
                 event.preventDefault();
            }
        }

  },
    resetFocus :function(component, event, helper){
        //Setting the focus to zero when clicked
        component.set("v.focusIndex",1);
        var lookupDiv = component.find("lookup-div"); 
        var searchString = component.get("v.selectedName");
        if(searchString ==""){
            component.set("v.changeLoad",true);
            component.set("v.searchData", component.get("v.lookupData")); 
            $A.util.addClass(lookupDiv, 'slds-is-open');
        }
    },
    closeFocus :function(component, event, helper){
        //Setting the focus to zero when clicked
    helper.closeLookup(component, event, helper);
    },
    searchProduct :function(component, event, helper){
        var listItem = component.find("lookup-id");
        var currentIndex = component.get("v.focusIndex");
        var lookupDiv = component.find("lookup-div");
        component.set("v.focusIndex",1);
        //Getting all the products information based on the search string
        var searchRecords=[];
        //Setting the data to null at first
        component.set("v.searchData", searchRecords); 
        //Searching for the string
        var searchString = component.get("v.selectedName");
        var allProducts = component.get("v.lookupData");
        var timer = component.get('v.keyPressTimer');
        
        clearTimeout(timer);
        timer = setTimeout(function() {
            //Looping through products to get the specific result
            if(helper.isValidString(searchString)){    
                    if(searchString == ""){
                           searchRecords = component.get("v.lookupData");
                    }else{
                      for(var eachProduct in allProducts){
                        //loading the search based on entered value  for all products
                        if (allProducts[eachProduct].Name.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                            searchRecords.push(allProducts[eachProduct]);
                        }
                         else if(allProducts[eachProduct].Nickname__c != null){
                            if(allProducts[eachProduct].Nickname__c.toLowerCase().search(searchString.toLowerCase()) >= 0){
                                searchRecords.push(allProducts[eachProduct]);
                            }
                        }
                         else if(allProducts[eachProduct].InternalName__c != null){
                             if(allProducts[eachProduct].InternalName__c.toLowerCase().search(searchString.toLowerCase()) >= 0){
                                searchRecords.push(allProducts[eachProduct]);
                            }
                        }
                    }
                  }
                }
             clearTimeout(timer);
             component.set('v.keyPressTimer', 0);
             component.set("v.searchData", searchRecords);   
            if(searchString ==""){
                  var componentEvent = component.getEvent("lookupActionEvent");
                  componentEvent.setParam("type", component.get('v.fieldName'));
                  componentEvent.setParam("isEmpty", true);
                  componentEvent.fire(); 
            }else{
                /*var listItem = component.find("lookup-id");
                if(listItem != null){
                    if(listItem.length > 1){
                        $A.util.addClass(listItem[0], 'custom-focus');
                        //listItem[0].getElement().focus();
                    }else{
                        $A.util.addClass(listItem, 'custom-focus');
                        //listItem.getElement().focus();
                    }
                }   */   
            }
        }, 50);
        component.set('v.keyPressTimer', timer);
        event.stopPropagation();
        event.preventDefault();
        component.set("v.changeLoad",true);
        $A.util.addClass(lookupDiv, 'slds-is-open');
    },
    selectOption :function(component, event, helper){ 
        if(event.target.id !=""&& event.target.id !="listbox-id-3"){
            var lookupDiv = component.find("lookup-div");  
            //Setting value on enter press
            var searchInput = component.find("lookup-input");
            //Setting name and id
            searchInput.set("v.value",event.target.innerText);
            searchInput.set("v.name",event.target.id); 
            //closing the drop down and removing the existing focus
            $A.util.removeClass(lookupDiv, 'slds-is-open');
            //Setting index to zero
            component.set("v.focusIndex",1);
            //Fire component event
            var componentEvent = component.getEvent("lookupActionEvent");
            componentEvent.setParam("type", component.get('v.fieldName'));
            componentEvent.setParam("Name", event.target.innerText);
            componentEvent.setParam("Id", event.target.id);
            componentEvent.setParam("isEmpty", false);
            componentEvent.fire();
        }
    },
      captureClose :function(component, event, helper){ 
              var searchString = component.get("v.selectedName");
              //Fire component event
              if(searchString ==""){
                  var componentEvent = component.getEvent("lookupActionEvent");
                  componentEvent.setParam("type", component.get('v.fieldName'));
                  componentEvent.setParam("isEmpty", true);
                  componentEvent.fire();  
              }
    },
    /*start: TSM-3233*/
    onLookupActionEvent: function(component, event, helper){
        const isEmpty = event.getParam("isEmpty");
        if(isEmpty) return;
        
        // clearing error from input
        const inputCmp = component.find("lookup-input");
        inputCmp.setCustomValidity("");
        inputCmp.reportValidity();
    }
    /*end: TSM-3233*/
})