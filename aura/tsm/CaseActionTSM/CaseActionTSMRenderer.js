({
	//after renderer method overrides go here for appending shared article into Case Action  
    afterRender: function (cmp, helper) {
        this.superAfterRender();
        var caseId = cmp.get("v.recordId"); 
        var  message;
        var articleId;
        var  storageObj;
        var  interval = window.setInterval(
            $A.getCallback(function() {
                if (!cmp.isValid()){
                    window.clearInterval(interval);
                    return;
                } else {
                    if (window.localStorage.getItem(caseId) != null) {
                        var articles = cmp.get('v.knowledgeArticles');
                        var articlesIdList = cmp.get('v.knowledgeArticlesId');
                        
                        storageObj = JSON.parse(window.localStorage.getItem(caseId));
                        message = storageObj.articles;
                        articleId = storageObj.articlesId;
                        
                        //Adding articles id
                        if(articleId != undefined){
                            if(articleId !== ''){
                                articlesIdList.push(articleId);
                                cmp.set("v.knowledgeArticlesId",articlesIdList);
                                storageObj.articlesId = '';
                                window.localStorage.setItem(caseId, JSON.stringify(storageObj));
                            }                               
                        }
                        
                        if(message !== undefined ){
                            if(storageObj.articles !== ''){
                                articles.push(message);
                                cmp.set("v.knowledgeArticles",articles);
                                storageObj.articles = '';
                                window.localStorage.setItem(caseId, JSON.stringify(storageObj));
                            }
                        }
                        
                    } 
                }
            }), 5000);
    }
})