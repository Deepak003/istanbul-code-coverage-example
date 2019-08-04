({
    fetchEmergingIssues : function(component, event, helper) {
        //get query from Apex
        const action = component.get("c.getEmergingIssues");
        //Fetching New emerging Issues
        action.setParams({ strFetchType: 'NEW' });
        action.setCallback(this,function(response){
            const state = response.getState();
            if(JSON.parse(response.getReturnValue()) != null){
                if(JSON.parse(response.getReturnValue()).hits != null){
                    var result = JSON.parse(response.getReturnValue()).hits.hit;
                    console.log(result);
                    for(var i=0; i<result.length; i++){
                        result[i].fields.last_modified_at = Util.getFormattedDateTime(result[i].fields.last_modified_at);
                    }
                    component.set("v.newEmergingIssues" , result);
                    const recentAction = component.get("c.getEmergingIssues");
                    //fetching Recently Edited Emerging Issues
                    recentAction.setParams({ strFetchType: 'EDITED' });
                    recentAction.setCallback(this,function(response){
                        const state = response.getState();
                        var recentResult = JSON.parse(response.getReturnValue()).hits.hit;
                        for(var i=0; i<recentResult.length; i++){
                            recentResult[i].fields.last_modified_at = Util.getFormattedDateTime(recentResult[i].fields.last_modified_at);
                        }
                        console.log(recentResult);
                        component.set("v.recentEmergingIssues" , recentResult);
                        this.refreshEmergingIssues(component, event, helper);
                        component.set("v.isData",true);
                    });
                    $A.enqueueAction(recentAction);
                }
            }
        });
        $A.enqueueAction(action);
    },
    //Funtion for refreshing the issues
    refreshEmergingIssues : function(component, event, helper) {
        component.set("v.timeCount",0);
        component.set("v.loaded",true);
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