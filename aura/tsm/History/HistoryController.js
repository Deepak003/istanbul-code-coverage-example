({ 
        //Viewing the History filter with data                  
    doInit : function(component, event, helper) {
        helper.getItemPackDetails(component, event);
    },

    //Handeling the change of arraylist                 
    handleArrayListChange : function(component, event, helper) {
        var firedGrantType = event.getParam('type');
        //Checking for the event and setting to the array attribute
        if(firedGrantType == "arrayListChanged"){
            component.set('v.isMultiGrant', true);
            component.set("v.globalSelectionArray", event.getParam('selectedArray'));            
        }else if(firedGrantType == "individualGrantInitilized"){
            component.set('v.isMultiGrant', false);
            component.set("v.globalSelectionArray", event.getParam('selectedArray'));
            component.set('v.openHistoryGrant', true);            
        }
    },
    handleGrantPublish : function(component, event, helper) {
        var firedGrantType = event.getParam('type');
        //Checking for the event and setting to the array attribute
        if(firedGrantType == "historyPublishDataFired"){
            component.set("v.successData", event.getParam('successData'));
            component.set("v.failedData", event.getParam('failedData'));
            
            component.set("v.openHistoryGrant", false);
            component.set("v.openHistoryGrantResponse", true);
        }
    },
    
    //Viewing the History filter with data                  
    onClickViewHistory : function(component, event, helper) {
        //Getting respective components                
        var historyFilter = component.find('historyFilter');
        var historyTable = component.find('historyTable');
        //Toggle the show and hide                
        $A.util.addClass(historyTable, 'slds-hide');
        $A.util.removeClass(historyFilter, 'slds-hide');
        
        // TODO: set value to HistoryFilter
        const data = event.getParams('data');
        const fromDate = data.fromDate;
        const toDate = data.toDate;
        
        //Setting filter change to reset selection
        if(component.get('v.filterClick')){
           component.set('v.filterClick',false); 
        }else{
            component.set('v.filterClick',true);
        }
        
        component.set('v.filterInputData', {
            startDateTime: fromDate,
            endDateTime: toDate
        });
        //TSM-2813 Resetting the pagination number
        component.set("v.paginatedNumber", 0);
    },
    //Viewing the History filter
    showFilter : function(component, event, helper) {
        //Getting respective components                
        var historyFilter = component.find('historyFilter');
        var historyTable = component.find('historyTable');
        //Toggle the show and hide                
        $A.util.addClass(historyTable, 'slds-hide');
        $A.util.removeClass(historyFilter, 'slds-hide');
        //Removing filter change to reset selection as per TSM-3324
        //component.set('v.filterClick', !component.get('v.filterClick'));
        component.set("v.paginatedNumber", 0); //TSM-2813 - Resetting pagination number
        helper.getItemPackDetails(component, event);
    },                        
    //Viewing the History table                    
    onHistoryData : function(component, event, helper) {
        try{
            // sort asc by date
            event.getParam("historyData").sort(function(dataOne, dataTwo) {
                dataOne = new Date(dataOne.createdOn);
                dataTwo = new Date(dataTwo.createdOn);                   
                return dataOne<dataTwo ? -1 : dataOne>dataTwo ? 1 : 0;    
            });
        }catch(err){
            console.error(err);
        }        
        //Setting the data             
        component.set('v.historyData', event.getParam("historyData"));
        component.set('v.failedFilterData', event.getParam("failedData")); //TSM-1622
        //Getting respective components                
        var historyFilter = component.find('historyFilter');
        var historyTable = component.find('historyTable');
        
        //TSM-1622
        var filterData = event.getParam("filterData");
        //Getting the count
        var filterKeys = Object.keys(filterData);
        var filterCount = 0;
        for (var eachKey in filterKeys){
            if(filterKeys[eachKey] == 'transaction'){
                filterCount = filterCount + filterData['transaction'].length;
            }else if(filterKeys[eachKey] == 'login'){
                filterCount = filterCount + 1;
            }else if(filterKeys[eachKey] == 'mode'){
                var modeKeys = Object.keys(filterData['mode']);
                for (var eachMode in modeKeys){
                    if(modeKeys[eachMode] == 'draft'){
                        filterCount = filterCount + 1;
                    }else{
                    filterCount = filterCount + filterData['mode'][modeKeys[eachMode]].length;
                    }
                }
            }
        }
        var filterTitle = "Back to Filters (" + filterCount +")"; 
        component.set("v.filterDataCount",filterTitle);
        
        //Toggle the show and hide                
        $A.util.addClass(historyFilter, 'slds-hide');
        $A.util.removeClass(historyTable, 'slds-hide');
        // clearing search box
        component.find("historyHeader").setSearchTerm("");
        component.set('v.searchTerm', "");  
        component.set("v.globalSelectionArray", []); //TSM-2277 - Resetting the History grant data
    },
    // set searchTerm attribute when searchTerm change from search box
    onChangeSearchTerm : function(component, event, helper) {
        component.set('v.searchTerm', event.getParam("searchTerm"));
    },
    //TSM-2277 - Resetting the History grant data
    handleGrantReset: function(component, event, helper) {
        component.set("v.globalSelectionArray", []);
    },
    //TSM-2813 - On click logic for pagination
    onClickPagination: function(component, event, helper) {
        var lastData = event.getParam("lastData");
        component.set("v.paginationData", lastData);
    },
})