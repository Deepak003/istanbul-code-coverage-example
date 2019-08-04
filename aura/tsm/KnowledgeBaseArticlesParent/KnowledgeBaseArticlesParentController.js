({
    //Function to handle bubbling of the selected article
    handleBubbling : function(component, event, helper) {
        var firedArticleValue = event.getParam('currentSelection');
        component.set("v.selectedArticle", firedArticleValue);
    },
    //Function used to initilize the parent container
     doInit : function(component, event, helper) {
        var onLoad = true;
        if(onLoad){
            var result =[];
            for (var i in window.localStorage) {
                var resArr={};
                if(window.localStorage.getItem(i) != null && !isNaN(i)){
                    try{
                        var parseJSON =  JSON.parse(window.localStorage.getItem(i));
                        resArr['label'] = 'Case ' + parseJSON.title;
                        resArr['value'] = ''+i+'';
                        result.push(resArr);
                    }catch(err){
                        console.log("Parse error.."+err);
                    }
                }
                else{
                    continue;
                }    
            }
            component.set("v.localStorage" , result);
        }  
        
        window.addEventListener("message", function(event) { 
            //If the data is empty - Generic view
            if(event.data == "Refresh Case"){
                var result =[];
                for (var i in window.localStorage) {
                    var resArr={};
                    if(window.localStorage.getItem(i) != null && !isNaN(i)){
                        try{
                            var parseJSON =  JSON.parse(window.localStorage.getItem(i));
                            resArr['label'] = 'Case ' + parseJSON.title;
                            resArr['value'] = ''+i+'';
                            result.push(resArr);
                        }catch(err){
                            console.log("Parse error.."+err);
                        }
                    }
                    else{
                        continue;
                    }    
                }
                component.set("v.localStorage" , result);
            }  
        }, false);
         
         //Listening for Helpfulness
         window.addEventListener("setHelpfulnessArticle", function(event) { 
             console.log(event.detail);
             helper.recordCallOutEvent(component, event, "setHelpfulnessArticle");
         }, false);
         //Listening for Feedback
         window.addEventListener("setFeedbackArticle", function(event) { 
             console.log(event.detail);
             helper.recordCallOutEvent(component, event, "setFeedbackArticle");
         }, false);
         
        console.log(window.addEventListener);
        ////Function to load the languages
        helper.loadLanguages(component, event);
    },
    handlePostMessage : function(component, event, helper) {
        console.log('handlePostMessage');
        var data = JSON.parse(window.localStorage.getItem(event.getParam("selectedCaseIndex")));
        data.articles = event.getParam("URL");
        data.articlesId = event.getParam("ID");
        window.localStorage.setItem(event.getParam("selectedCaseIndex"), JSON.stringify(data));
    }
})