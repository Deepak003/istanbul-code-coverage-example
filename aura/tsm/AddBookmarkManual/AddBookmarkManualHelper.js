({
    //Initializing the dropdown values for available bookmark folders
    doInitHelper : function(component, event, helper) {
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
                folderVal['value'] = 'New';
                folderOpts.push(folderVal);
                if(folderOpts.length > 0){
                    component.set("v.selFolder", folderOpts[0].value);
                }
                component.set("v.options" , folderOpts);
            }
        });
        $A.enqueueAction(action);
    },
    //Adding Bookmarks Mannually to the knowledge base bookmarks tab
    AddBookmarkstoFolder : function(component, event, helper) {
        var action = component.get("c.addBookmarkFolder");
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            folderName : component.find("folderName").get("v.value")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse;
            if(state === 'SUCCESS'){
                storeResponse = response.getReturnValue();
            }
            //fire event to parent
            var appEvent = $A.get("e.c:BookMarkBubbleEvent");
            appEvent.setParams({
                "result" : storeResponse
            });
            appEvent.fire();
            component.set("v.isOpen",false);
        });
        $A.enqueueAction(action);
    },
    //Adding Links Mannually to the folders
    AddBookmarkstoLink : function(component, event, helper) {
        var action = component.get("c.addBookmarkItem");
        var requestMap = {};
        requestMap["articleNumber"] = 'addBookmarkLink';
        requestMap["folderId"] = component.find("folders").get("v.value");
        if(component.get("v.askFolderName")){
            requestMap["folderName"] = component.find("folderName1").get("v.value");
        }
        requestMap["itemName"] = component.find("title").get("v.value");
        requestMap["linkOrArticleId"] = component.find("url").get("v.value");
        action.setParams({
            mapRequestParam : requestMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse;
            if(state === 'SUCCESS'){
                storeResponse = response.getReturnValue();
            }
            //fire event to parent
            var appEvent = $A.get("e.c:BookMarkBubbleEvent");
            appEvent.setParams({
                "result" : storeResponse
            });
            appEvent.fire();
            component.set("v.isOpen",false);
        });
        $A.enqueueAction(action);
   },
    validateHelper : function(component, event, helper) {
        var folderName = component.find("folderName").get("v.value");
        if(folderName != ""){
            component.set('v.isSuccessDisable',false);
        }
        else{
            component.set('v.isSuccessDisable',true);
        }
    },
    validateLinkDataHelper : function(component, event, helper) {
        var validurl = false;
        var mode = component.find('folders').get('v.value');
        var title = component.find('title').get('v.value');
        var url = component.find('url').get('v.value');
        var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        
        if(url != undefined && url != ''){
            validurl = urlregex.test(url);
        }
        console.log('validurl :: '+ validurl);
        if(mode != ''){
            if(mode != 'New' && title != ''  && url != '' && validurl){
                component.set('v.isSuccessDisable',false);
            }
            else if(mode == 'New' && title != ''  && url != '' && folderName != '' && validurl){
                var folderName = component.find('folderName1').get('v.value');
                component.set('v.isSuccessDisable',false);
            }
                else{
                    component.set('v.isSuccessDisable',true); 
                }
        }
        else{
            component.set('v.isSuccessDisable',true);
        }
    }
})