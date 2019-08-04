({
    doInit : function(component, event, helper) {
        helper.fetchEmergingIssues(component, event, helper);
        //Function used to get the resfreshed count
        window.setInterval(
            $A.getCallback(function() {
                var count=component.get("v.timeCount");
                component.set("v.timeCount",count+1);
            }), 60000
        );
    },  
    //Funtion used to open the knowledge base home page window
    openKnowledgeBaseArticles: function (component, event, helper) {
        helper.loadKnowledgeBaseWindow(component, event, "");
    },
    //setting the current selected article card
    selectArticleCard: function (component, event, helper) {
        var articleList = component.get("v.newEmergingIssues");
        var currentArticleNumber = articleList[event.target.dataset.value]; 
         if(currentArticleNumber != undefined){
           helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
        } 
    },
    //setting the current selected article card
    selectRecentIssues: function (component, event, helper) {
        var articleList = component.get("v.recentEmergingIssues");
        var currentArticleNumber = articleList[event.target.dataset.value]; 
        if(currentArticleNumber != undefined){
           helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
        } 
    },
    //Fething emerging issues after hitting on refersh
    refreshEmergingIssues : function(component, event, helper) {
        component.set("v.loaded",false);
        helper.fetchEmergingIssues(component, event, helper);
        helper.refreshEmergingIssues(component, event, helper);
    }, 
})