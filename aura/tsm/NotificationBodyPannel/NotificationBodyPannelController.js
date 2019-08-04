({
    init : function(component, event, helper) {
    },
    getKnowledgeBaseArticles: function(component, event, helper) {
        //Checking for article id from the article link id
        if(event.target.className == "article-link" && event.target.id != ""){
            helper.constructArticleParameter(component, event, event.target.id, helper);
        }else if(event.target.tagName == "A"){
            var searchTerm = event.target.href;
            //Setting the id state of the object
            if(searchTerm.search("#") < 0 && searchTerm.search(".html") >=0){
                window.open(searchTerm, "_blank");
                event.stopPropagation();
                event.preventDefault();
            }
        }
    },
})