({
    //Init funciton for the component
    doInit: function(component, event, helper) {
        //Funciton to construct the article parameter
        component.set("v.isArticleLoading", true);
        if(component.get("v.selectedProduct") != null){
            helper.constructArticleParameter(component, event);            
        }
    },
    openKnowledgeBaseArticles: function (component, event, helper) {
        //Funciton to load the knowledgebase window for generic load
        helper.loadKnowledgeBaseWindow(component, event, "");
    },
    //Funciton to load the selected article to knowledgebase
    selectArticleCard: function (component, event, helper) {
       var articleList = component.get("v.articleList"); 
       var currentArticleNumber = articleList[event.currentTarget.dataset.value];  
        if(currentArticleNumber != undefined){
           helper.loadKnowledgeBaseWindow(component, event, currentArticleNumber);
        }  
    },
    //TSM-3745 - Funciton to handle article sharing
    handleShareButtonClick: function(component, event, helper){ 
        event.preventDefault();
        event.stopPropagation();   
        var currentCaseIndex;
        var data = {};       
        for (var i in window.localStorage) {
            if(window.localStorage.getItem(i) != null && !isNaN(i)){ 
                try{
                    parseJSON =  JSON.parse(window.localStorage.getItem(i));
                    if(parseJSON.recordId == component.get("v.caseId")){
                        data =  JSON.parse(window.localStorage.getItem(i));
                        currentCaseIndex = i;
                    }
                }catch(err){
                    
                }
            }
            else{
                continue;
            }    
        }
        //Adding local storage only if the data is present
        if(data != {}){
            data.articles = event.getSource().get("v.value").fields.url;
            data.articlesId = event.getSource().get("v.value").id.split("_")[0] + '@' + event.getSource().get("v.value").fields.title;
            
            window.localStorage.setItem(currentCaseIndex, JSON.stringify(data));
        }
    },
})