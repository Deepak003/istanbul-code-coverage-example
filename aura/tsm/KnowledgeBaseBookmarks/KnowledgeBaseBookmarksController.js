({
    //Init function to get the list of bookmarks
    doInit : function(component, event, helper) {
        helper.getBookmarks(component, event, helper);
    },
    toggleExpand : function(component, event, helper) {
        var index = event.getSource().get('v.value');
        helper.toggleRow(component, index);
    },
    //Function to handle the Bookmark Modal
    openBookmarkModal :  function(component, event, helper){
        component.set('v.openBookMarkModal',true);
    },
    closeModal : function(component, event, helper){
        component.set('v.openBookMarkModal',false);
    },
    //Bookmark bubble event to handle the added bookmarks
    bubbleEvtModal : function(component, event, helper){
        component.set('v.openBookMarkModal',false);
        var newVal = event.getParam("result");
        helper.getBookmarks(component, event, helper);
        //helper.AddBookmarks(component, event, helper, newVal);
    },
    //Function to handle the delete bookmarks
    deleteBookMark : function(component, event, helper){
        var index = event.getSource().get('v.value');
        component.set('v.openEditModal',false);
        component.set('v.editIndex','');
        component.set('v.delIndex',index);
        component.set('v.openDeleteModal',true);
    },
    closeDeleteModal : function(component, event, helper){
        component.set('v.openDeleteModal',false);
        component.set('v.delIndex','');
    },
    //Function to handle the delete articles
    deleteArticle : function(component, event, helper){
        helper.deleteBookmark(component, event, helper);
    },
    //Function to handle the edit bookmarks
    editBookMark : function(component, event, helper){
        var index = event.getSource().get('v.value');
        var items = component.get("v.items");
        component.set('v.openDeleteModal',false);
        component.set('v.delIndex','');
        component.set("v.folderName", items[index].NAME);
        component.set('v.editIndex',index);
        component.set('v.openEditModal',true);
    },
    closeEditModal : function(component, event, helper){
        component.set('v.openEditModal',false);
        var index = component.get('v.editIndex');
        var items = component.get("v.items");
        items[index].NAME = component.get("v.folderName");
        component.set("v.items" , items);
        component.set('v.editIndex','');
    },
    saveEdits : function(component, event, helper){
        var folderName = component.find('newfolderName').get('v.value');
        var index = component.get('v.editIndex');
        var items = component.get("v.items");
        
        if(folderName != ""){
            helper.saveEdits(component, event, helper);
        }else{
            items[index].NAME = component.get("v.folderName");
            component.set("v.items", items);
            component.set('v.editIndex','');
            component.set('v.openEditModal',false);
        }
    },
    //Function to handle the delete popover for bookmarled links/articles
    deleteLinkModal : function(component, event, helper){
        component.set('v.openDeleteLinkModal',true);
        component.set("v.delLinkParentIndex", event.getSource().get('v.name'));
        component.set('v.delLinkIndex',event.getSource().get('v.value'));
    },
    //Function to handle the delete Links
    deletLink : function(component, event, helper){
        helper.deletLink(component, event, helper);
    },
    closeDeleteLinkModal : function(component, event, helper){
        component.set("v.openDeleteLinkModal" , false);
        component.set('v.delLinkIndex','');
        component.set("v.delLinkParentIndex", '');
    },
    //Select a particular card
    selectArticleCard: function(component, event, helper) {
       //Getting the Card menu value   
        var targetCard = event.currentTarget;
        var targetValue = targetCard.dataset.index;
        var parentIndx = targetCard.dataset.parentindex
        var currentArticleList = component.get("v.items");
        var publishData = currentArticleList[parentIndx].links[targetValue];
        publishData.fields = {};
        publishData.id = publishData.articleId;
        publishData.fields.id = publishData.articleId;
        publishData.fields.title = publishData.Name;
        if(currentArticleList[parentIndx].links[targetValue].articleNumber !== "addBookmarkLink"){
            //Publish the value
            var componentEvent = component.getEvent("articleSelectEvent");
            componentEvent.setParam("type", "ArticleSelection");
            componentEvent.setParam("currentSelection", publishData);
            componentEvent.fire(); 
        }
        else{
            window.open(currentArticleList[parentIndx].links[targetValue].linkUrl);
        }
    }
})