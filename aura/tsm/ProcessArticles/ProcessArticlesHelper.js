({
	constructArticleParameter : function(component, event, sortBy){
        //console.log('sortBy==>',sortBy);
        var action = component.get("c.getProcessArticles");  
        //TSM-3748 - Component error for Action
        if (action) {
            action.setParams({
				strFetchType : sortBy
		    });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = JSON.parse(response.getReturnValue());          
                    //console.log('storeResponse==>',response.getReturnValue());
                    //console.log('storeResponse.hits==>',storeResponse.hits);
                    var articleList;
					if(storeResponse.hits != undefined){
						if(storeResponse.hits.found > 0){
							component.set("v.isDataUpdated", true);
							//console.log("articleList==>",(storeResponse.hits.hit));
							articleList = storeResponse.hits.hit;
							
							for(var i=0; i<10; i++){
								articleList[i].fields.last_modified_at = new Date((articleList[i].fields.last_modified_at));
								articleList[i].fields.first_created_at = new Date((articleList[i].fields.first_created_at));
							}
						}
					}
					if(articleList != null){
						if(sortBy === 'EDITED'){
							component.set("v.articaleUpdatedList",articleList);
							component.set("v.isDataUpdated", true);
						}
						if(sortBy === 'NEW'){
							component.set("v.articaleCreatedList",articleList);
							component.set("v.isDataAdded", true);
						}
					}
                }
            });
            $A.enqueueAction(action);
        }
    },
	
	loadKnowledgeBaseWindow : function(component, event, searchTerm){       
        if (!window.knowledgeBase || window.knowledgeBase.closed) {
            window.knowledgeBase =  window.open("/c/KnowledgeBaseApplication.app","knowledgebaseArticles","toolbar=yes,scrollbars=yes,resizable=yes");
            setTimeout(function() {
                window.knowledgeBase.postMessage(searchTerm);
            }, 2500);        
        }else{
            window.knowledgeBase.focus();
            window.knowledgeBase.postMessage(searchTerm);
        }
    },    
})