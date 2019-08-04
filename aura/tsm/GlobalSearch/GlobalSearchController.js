({
    //Function initilized at the start
    init : function(component, event, helper) {
        //Getting the required search criteria
        var playerFilterOptions = [
            {'label': 'Case Number or Email' , 'value': 'Case Number or Email'},
            {'label': 'Nucleus ID' , 'value': 'nucleusId'},
            {'label': 'Persona ID' , 'value': 'PersonaId'},
            {'label': 'Persona Name' , 'value': 'PersonaNamespace'},
            {'label': 'BESL ID' , 'value': 'BESLId'},
            {'label': 'Facebook Id' , 'value': 'FacebookId'}
        ];
        component.set('v.filterOptions', playerFilterOptions);
        component.set('v.nameSpaceOptions', helper.loadNameSpace(component, event));
    },
    //Function used to hanbdle the filter select
    handleFilterSelect : function(component, event, helper) {
        //Getting the current selection
        var selectedMenuItemValue = event.getParam("value");
        var menuItems  = component.find("menu-items");
        component.set("v.searchVal", ""); //Clearing the search term on menu change
        menuItems.forEach(function (menuItem) {
            // For each menu item, if it was checked, un-check it. This ensures that only one
            // menu item is checked at a time
            if (menuItem.get("v.checked")) {
                menuItem.set("v.checked", false);
            }
            // Check the selected menu item
            if (menuItem.get("v.value") === selectedMenuItemValue) {
                menuItem.set("v.checked", true);
            }
        });
        component.set("v.filterSelection", selectedMenuItemValue); //Setting the filter option
        helper.checkPersonaName(component, event, selectedMenuItemValue); //Checking for PersonName
    },
    //Funciton used to hadnle the enter click
    keyPressController: function(component, event, helper) {
        var selectedType = component.get("v.filterSelection");
        //Restricting for only enter key code
        if (event.keyCode == 13 && helper.searchValidity(component, event)) {  
            //Checking for case or email
            if(selectedType == "Case Number or Email"){
                //Call respective back end for each search term
                if(helper.findIfCase(component, event)){  //helper.findIfEmail(component, event)
                    helper.caseSearch(component, event);
                }else if (component.get("v.searchVal").trim().length >= 5) {
                    helper.playerAccountSearch(component, event, "Email");
                 }else {
                       helper.showMessageforSearch(component, 'Search Email keyword must have at least 5 chars.', 'warning');                   	
                    }
            }else{
                helper.playerAccountSearch(component, event, selectedType); //If not case or email call player acount search
            }
        }
    },
})