({
    keyCheck: function(component, event, helper) {
        if (event.which == 13) {
            var pageNumber = parseInt(component.get("v.pageNumber"));
            component.set("v.pageNumber",pageNumber);
            helper.checkValidation(component, event, helper, pageNumber);
            helper.loadPageData(component, event, helper, pageNumber);
            component.set("v.shouldGetPageData", false);
        }
    },
    changePageNumber: function(component, event, helper) {
        component.set("v.shouldGetPageData", true);
    },
    blurPageNumber:function(component, event, helper) {
        var pageNumber = parseInt(component.get("v.pageNumber"));
        component.set("v.pageNumber",pageNumber);
        helper.checkValidation(component, event, helper, pageNumber);
        var isPageNumberChanged = component.get("v.shouldGetPageData");
        if (isPageNumberChanged == false) {
            return;
        }
        component.set("v.shouldGetPageData", false);
        helper.loadPageData(component, event, helper, pageNumber);
        
    },
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        var whichBtn = event.getSource().get("v.name");
        var pageNumber = parseInt(component.get("v.pageNumber"));
        component.set("v.pageNumber",pageNumber);
        if (whichBtn == 'next') {
            component.set("v.pageNumber", pageNumber + 1);
        } else if (whichBtn == 'previous') {
            component.set("v.pageNumber", pageNumber - 1);
        }
        helper.checkValidation(component, event, helper, pageNumber);
        helper.loadPageData(component, event, helper, pageNumber);
        component.set("v.shouldGetPageData", false);
    },

    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        component.set("v.isOpen", false);
        component.set("v.pageNumber", 1);
        var fraudDataList = [];
        component.set('v.fraudDataList', fraudDataList);

    },
    onChangeLocale: function(component, event, helper) {
        var selectedLocale = event.getSource().get("v.value"),
            indexValue = component.get('v.index');
        var items = component.get("v.fraudDataList");
        items[indexValue].changedLocale = selectedLocale;
        component.set("v.fraudDataList", items);

    },
    toggle: function(component, event, helper) {
        var items = component.get("v.fraudDataList"),
            index = event.getSource().get("v.value");
        component.set("v.index", index);
        items[index].expanded = !items[index].expanded;
        items[index].changedLocale = items[index].OriginalChangedLocale;
        component.set("v.fraudDataList", items);
    },
    // this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true);
    },

    // this function automatic call by aura:doneWaiting event 
    hideSpinner: function(component, event, helper) {
        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);
    }
})