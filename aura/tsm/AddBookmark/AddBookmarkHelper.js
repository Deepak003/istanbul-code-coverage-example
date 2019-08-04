({
    //Initializing the dropdown values for available bookmark folders
    doInit: function(component, event, helper) {
        var action = component.get("c.getBookMarks");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
                var folderOpts = [];
                for(let i=0; i <storeResponse.length; i++){
                    let folderVal = {};
                    folderVal['label'] = storeResponse[i].Name;
                    folderVal['value'] = storeResponse[i].id;
                    folderOpts.push(folderVal);
                }
                let folderVal = {};
                folderVal['label'] = 'New Folder';
                folderVal['value'] = 'new';
                folderOpts.push(folderVal);
                if(folderOpts.length > 0){
                    component.set("v.selFolder", folderOpts[0].value);
                    helper.validateHelper(component, event, helper);
                }
                component.set("v.options" , folderOpts);
            }
        });
        $A.enqueueAction(action);
    },
    //Adding bookmarking from the KNowledgesummary View component
    addBookmark : function(component, event, helper) {
        var action = component.get("c.addBookmarkItem");
        var requestMap = {};
        var selArticle = component.get("v.selectedArticle");
        requestMap["articleNumber"] = selArticle.articleNumber;
        requestMap["folderId"] = component.find("folderOptions").get("v.value");
        if(component.get("v.isNewFolder")){
            requestMap["folderName"] = component.find("newFolderText").get("v.value");
        }
        requestMap["itemName"] = selArticle.fields.title;
        requestMap["linkOrArticleId"] = selArticle.id;
        action.setParams({
            mapRequestParam : requestMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
            }
            component.set("v.isOpen", false);
            var appEvent = $A.get("e.c:AddBookMarkEvt");
            appEvent.setParams({
                "selIndex" : component.get("v.selIndex") });
            appEvent.fire();
        });
        $A.enqueueAction(action);
    },
    validateHelper : function(component, event, helper) {
        var folderName = component.find("folderOptions").get("v.value");
        var isNewFolder = component.get('v.isNewFolder');
        
        if(!isNewFolder && folderName != ""){
            component.set('v.isSuccessDisable',false);
        }
        else if(isNewFolder && folderName != "" && component.find("newFolderText").get("v.value") != ""){
            component.set('v.isSuccessDisable',false);
        }
        else{
            component.set('v.isSuccessDisable',true);
        }
    }
})