({
    //Handling the expanded view of bookmarks section
    toggleRow: function(component, index) {
        const items = component.get("v.items");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;
            component.set("v.items", items);           
        }
    },
    //Funtion to handle the bookmarks and checking the saved articles count to display 
    AddBookmarks: function(component, event, helper, newVal) {
        console.log('AddBookmarks');
        var items = component.get("v.items");
        var isFolder = true;
        for(let i=0; i <items.length; i++){
            if(newVal.folderId == items[i].folderId){
                items[i].LinksCnt = items[i].LinksCnt+1 ;
                items[i].links.unshift(newVal);
                isFolder = false;
                break;
            }
        }
        if(isFolder){
            let folderVal = {};
            folderVal['NAME'] = newVal.Name;
            folderVal['expanded'] = false;
            if(newVal.links == undefined)
                folderVal['LinksCnt'] = 0;
            else
                folderVal['LinksCnt'] = newVal.links.length;
            folderVal['links'] = newVal.links;
            folderVal['folderId'] = newVal.id;
            items.unshift(folderVal);
        }
        component.set("v.items" , items);
    },
    //Function used to get the list of available bookmarks
    getBookmarks: function(component, event, helper) {
        var action = component.get("c.getBookMarks");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
                var folderOpts = [];
                for(let i=0; i <storeResponse.length; i++){
                    let folderVal = {};
                    folderVal['NAME'] = storeResponse[i].Name;
                    folderVal['expanded'] = false;
                    folderVal['LinksCnt'] = storeResponse[i].links.length;
                    folderVal['links'] = storeResponse[i].links.reverse();
                    folderVal['folderId'] = storeResponse[i].id;
                    folderVal['articleId'] = storeResponse[i].articleId;
                    folderOpts.push(folderVal);
                }
                component.set("v.items" , folderOpts);
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to delete bookmarks under the knowledge base bookmarks
    deleteBookmark: function(component, event, helper) {
        var action = component.get("c.deleteBookmarkFolder");
        var indx = component.get("v.delIndex");
        var items = component.get("v.items");
        action.setParams({ 
             folderId : items[indx].folderId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
            };
            items.splice(indx,1);
            component.set('v.items',items);
            
            component.set('v.delIndex','');
            component.set('v.openDeleteModal',false);
        });
        $A.enqueueAction(action);
    },
    //Function used to Edit the existing bookmarks folder name 
    saveEdits : function(component, event, helper){
        var indx = component.get("v.editIndex");
        var items = component.get("v.items");
        var action = component.get("c.updateBookmarkFolderName");
        action.setParams({ 
             oldFolderId : items[indx].folderId,
             newFolderName : component.find("newfolderName").get("v.value")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
            }
            component.set('v.editIndex','');
            component.set('v.openEditModal',false);
        });
        $A.enqueueAction(action);
    },
    //Function used to delete Links/Articles under the expanded view of folders
    deletLink : function(component, event, helper){
        var parentIndex = component.get('v.delLinkParentIndex');
        var index = component.get('v.delLinkIndex');
        var items = component.get("v.items");
        var action = component.get("c.deleteBookmarkItem");
        action.setParams({ 
             itemId : items[parentIndex].links[index].id
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                var storeResponse = response.getReturnValue();
            }
            items[parentIndex].links.splice(index,1);
            items[parentIndex].LinksCnt = items[parentIndex].LinksCnt - 1;
            component.set('v.items',items);
            component.set('v.delLinkIndex','');
            component.set('v.delLinkParentIndex','');
            component.set('v.openDeleteLinkModal',false);
        });
        $A.enqueueAction(action);
    }
})