({
    //Funciton used to initlize the KB articles
    doInit : function(component, event, helper) {
        //Listner for the post message on the current window
        window.addEventListener("message", function(event) { 
            //If the data is empty - Generic view
            if(event.data != "" && event.data != "Refresh Case"){
                //Open the article if the data exists
                component.set("v.selectedArticle", event.data);
            }  
        }, false);
    },
    //Function used to handle the url emit from Summary View
    handleArticleSelect : function(component,event,helper){
        var currentUrl = event.getParam("url");
        helper.constructArticleParameter(component,event,currentUrl);
    }
})