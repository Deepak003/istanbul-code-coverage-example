({
    //Function initilized when the component is loaded
    doInit : function(component, event, helper) {
        helper.getFeaturedProducts(component);      
    },
    //Change of product is tracked
    toggleProductChange: function(component, event, helper) {
        component.set("v.currentSelectionId", event.target.id);
        component.set("v.currentSelectionValue", event.target.value);
        component.set("v.isArticleLoading", true);
        //Removing loaded list as per UX request
        component.set("v.relatedList", []);
        component.set("v.lastUpdatedList", []);
        helper.constructArticleParameter(component, event, event.target.value);
    },
    //Building the DOM of the Page
    articleDOMBuilder: function(component, event, helper) {
        helper.articleDOMBuilder(component, event, component.get("v.articleList"));
    },
    //Loading related articles on new tab
    selectRelatedArticleCard: function(component, event, helper) {
        //Getting the Card menu value   
        var currentArticleList = component.get("v.relatedList");
        helper.publishRequest(component, event, currentArticleList);
    },
    //Loading latest article on new tab
    selectLatestArticleCard: function(component, event, helper) {
        //Getting the Card menu value   
        var currentArticleList = component.get("v.lastUpdatedList");
        helper.publishRequest(component, event, currentArticleList);
    },
    //sharing the selected Article 
    sendToPlayerAction : function(component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        component.set("v.selectedArticle",event.getSource().get("v.value"));
        component.set('v.showArticleSharing',true);
    },
})