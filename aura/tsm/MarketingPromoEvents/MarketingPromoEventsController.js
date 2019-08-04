({
    doInit : function(component, event, helper) {
        helper.getMarketingPromoEvents(component,event,helper,'month');
        window.setInterval(
            $A.getCallback(function() {
                var count=component.get("v.timeCount");
                component.set("v.timeCount",count+1);
            }), 60000
        );
        
    },
    //setting the current selected article card
    selectArticleCard: function (component, event, helper) {
        var articleList = component.get("v.filteredEventsList");
        if(articleList[event.target.dataset.value] != undefined){
            var currentArticleNumber = articleList[event.target.dataset.value]; 
            if(currentArticleNumber != undefined){
                helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
            }  
        }
        
    },
    //Searching the knowledge base articles
    searchPromoEvents: function(component, event, helper) {
        var selComboVal = component.find("lastModifiedVal").get("v.value");
        var timer = component.get('v.keyPressTimer');
        //Hard limit of 3 is place to sync with omega
        if (component.get("v.searchString").length > 3){
            helper.fetchFilteredData(component, event, helper,component.get("v.searchString"),selComboVal);
            event.stopPropagation();
            event.preventDefault();
        }
        else{
            if (component.get("v.searchString").length == 0){
                helper.getMarketingPromoEvents(component,event,helper,selComboVal);
            }
        }
    },
    changeSortByValue: function(component, event, helper) {
        var timer = component.get('v.keyPressTimer');
        var selectedValue = event.getParam("value");
        helper.fetchFilteredData(component, event, helper,'',selectedValue);
        event.stopPropagation();
        event.preventDefault();
    },
    refreshEmergingIssues : function(component, event, helper) {
        var selComboVal = component.find("lastModifiedVal").get("v.value");
        //component.set("v.searchString",'');
        helper.getMarketingPromoEvents(component, event, helper,selComboVal);
        helper.refreshEmergingIssues(component, event, helper);
    }, 
})