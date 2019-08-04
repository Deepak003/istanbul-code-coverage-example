({
    // After Render to get all open cases tab info to display in article sharing
    afterRender: function (component, helper) {
        this.superAfterRender();
        var workspaceAPI = component.find("workspace");
        setTimeout(function(){
            if(workspaceAPI.getAllTabInfo() != undefined){
                workspaceAPI.getAllTabInfo().then(function(response) {
                    if(response){
                        var caseIds = '';
                        window.localStorage.clear();
                        for(var eachTab in response){
                            if(response[eachTab].recordId != null && response[eachTab].recordId.includes('500')){
                                if(caseIds){
                                    caseIds= caseIds + ',' + response[eachTab].recordId;
                                }else{
                                    caseIds= response[eachTab].recordId; 
                                }
                                window.localStorage.setItem(response[eachTab].recordId, JSON.stringify(response[eachTab]));
                            } else if (response[eachTab].subtabs && response[eachTab].subtabs.length) {
                                for (var x = 0; x < response[eachTab].subtabs.length; x++) {
                                    if(response[eachTab].subtabs[x].recordId != null && response[eachTab].subtabs[x].recordId.includes('500')){
                                        if(caseIds){
                                            caseIds= caseIds + ',' + response[eachTab].subtabs[x].recordId;
                                        }else{
                                            caseIds= response[eachTab].subtabs[x].recordId; 
                                        }
                                        window.localStorage.setItem(response[eachTab].subtabs[x].recordId, JSON.stringify(response[eachTab].subtabs[x]));
                                    }     
                                }
                            }
                        }
                        component.set('v.caseIds' , caseIds); 
                        if (window.knowledgeBase) window.knowledgeBase.postMessage("Refresh Case");
                    }
                })
                .catch(function(error) {
                });
            }
        }, 2000);
    },
    //Unrender to get info of closed cases and new cases in wrapper
    unrender: function (component, helper) {
        this.superUnrender();
        var oldCaseIds;
        if(component.get('v.caseIds') != undefined)
            oldCaseIds = component.get('v.caseIds').split(',');
        // do custom unrendering here
        var workspaceAPI = component.find("workspace"),
            knowledgeWindow = component.get('v.knowledgeWindow');
        if(workspaceAPI.getAllTabInfo() != undefined){
            workspaceAPI.getAllTabInfo().then(function(response) {
                    if(response){
                        var caseIds = '';
                        for(var eachTab in response){
                            if(response[eachTab].recordId != null && response[eachTab].recordId.includes('500')){
                                if(caseIds){
                                    caseIds= caseIds + ',' + response[eachTab].recordId;
                                }else{
                                    caseIds= response[eachTab].recordId; 
                                }
                            } else if (response[eachTab].subtabs && response[eachTab].subtabs.length) {
                                for (var x = 0; x < response[eachTab].subtabs.length; x++) {
                                    if(response[eachTab].subtabs[x].recordId != null && response[eachTab].subtabs[x].recordId.includes('500')){
                                        if(caseIds){
                                            caseIds= caseIds + ',' + response[eachTab].subtabs[x].recordId;
                                        }else{
                                            caseIds= response[eachTab].subtabs[x].recordId; 
                                        }
                                    }     
                                }
                            }
                        }
                        var difference =[];
                        var newcaseIds = caseIds.split(',');
                        //let difference = oldCaseIds.filter(x => !newcaseIds.includes(x));
                        for(var k=0; k< oldCaseIds.length; k++){
                            if(newcaseIds != null){
                                if(!newcaseIds.includes(oldCaseIds[k])){
                                    difference.push(oldCaseIds[k]);
                                }
                            }
                        }
                        for(var i=0; i<difference.length; i++){
                            window.localStorage.removeItem(difference[i]);
                        }
                        //alert('window.knowledgeBase : ' + window.knowledgeBase);
                        if (window.knowledgeBase) window.knowledgeBase.postMessage("Refresh Case");
                    }
            })
            .catch(function(error) {
            });
        }
    }
})