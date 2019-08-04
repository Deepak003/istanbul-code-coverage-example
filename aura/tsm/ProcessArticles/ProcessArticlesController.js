({
    doInit : function(component, event, helper) {
        helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_EDITED"));
        helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_NEW"));
        
        window.setInterval(
            $A.getCallback(function() {
                var count=component.get("v.timeCount");
                component.set("v.timeCount",count+1);
            }), 60000
        );
        window.setInterval(
            $A.getCallback(function() {
                helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_EDITED"));
        		helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_NEW"));
                component.set("v.timeCount",0);
            }), 900000
        );
    },
    
    openKnowledgeBaseArticles: function (component, event, helper) {
        helper.loadKnowledgeBaseWindow(component, event, "");
    },
    
    onRefresh : function(component, event, helper) {
        component.set("v.timeCount",0);
        helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_EDITED"));
        helper.constructArticleParameter(component, event, $A.get("$Label.c.KNOWLEDGE_ARTICLE_PROCESS_NEW"));
    
    },
    
    //setting the current selected article card
    selectRecentUpdated: function (component, event, helper) {
        var articleList = component.get("v.articaleUpdatedList");
        console.log(event.target.dataset.value);
        var currentArticleNumber = articleList[event.target.dataset.value]; 
        if(currentArticleNumber != undefined){
           helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
        }  
    },
    
    //setting the current selected article card
    selectRecentAdded: function (component, event, helper) {
        var articleList = component.get("v.articaleCreatedList");
        console.log(event.target.dataset.value);
        var currentArticleNumber = articleList[event.target.dataset.value]; 
        if(currentArticleNumber != undefined){
           helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
        }  
    },    
})