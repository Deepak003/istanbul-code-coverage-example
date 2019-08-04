({
    //Init function to call the list of products
    doInit : function(component, event, helper) {
        helper.getAllProduct(component, event);//To get all the products for the lookup
        //Create empty string
        var simpleCase = {};
        simpleCase.product = "";
        simpleCase.platform = "";
        simpleCase.category = "";
        simpleCase.subCategory = "";
        component.set("v.case",simpleCase);
        helper.getEmailLanguages(component, event);//To get all the languages
        helper.getAEMContent(component, event);//To get all the AEM content
    },
    //Function to open the article view retaining the results
    cancelFilter: function (component, event, helper) {
        //Toggle between different pannels
        var filterPannel = component.find('filter-pannel');
        var artilcesPannel = component.find('artilces-pannel');
        
        $A.util.addClass(filterPannel, 'slds-hide');
        $A.util.removeClass(artilcesPannel, 'slds-hide');       
    },
    //Clearing the filter param selected
    clearAllFilter: function (component, event, helper) {
        //Resetting the filter container
        helper.resetFilter(component, event);
    }, 
    //Function to go to filter view
    openFilter: function (component, event, helper) {
        var filterPannel = component.find('filter-pannel');
        var artilcesPannel = component.find('artilces-pannel');
        
        $A.util.removeClass(filterPannel, 'slds-hide');
        $A.util.addClass(artilcesPannel, 'slds-hide');       
    },
    //Function to save the filter and go back to the articles view
    saveFilter: function (component, event, helper) {
        helper.saveFilterValues(component, event);
    },
    //Handling bubbling for the lookup component
    handleBubbling : function(component, event, helper) {
        var firedLookupType = event.getParam('type');
        var simpleCase = component.get("v.case");
        if(firedLookupType == "Product"){
            //Closing platform
            simpleCase.productId = event.getParam('Id');
            
            simpleCase.platform = "";
            component.set("v.platformDisable",true);
            component.set("v.platformData",[]);
            
            simpleCase.category = "";
            component.set("v.categoryData",[]);
            component.set("v.categoryDisable",true);
            
            simpleCase.subCategory = "";
            component.set("v.issueData",[]);
            component.set("v.issueDisable",true);
            
            component.set("v.case", simpleCase);
            if(!event.getParam('isEmpty')){  
                helper.getPlatformsByProduct(component);
                helper.getCategoriesForProduct(component);  
            }
        }else if(firedLookupType == "Platform"){
            simpleCase.platformId = event.getParam('Id');
            component.set("v.case", simpleCase);
            
        }else if(firedLookupType == "Category"){
            simpleCase.subCategory = "";
            component.set("v.issueData",[]);
            component.set("v.issueDisable",true);
            
            simpleCase.categoryId = event.getParam('Id');
            component.set("v.case", simpleCase);
            if(!event.getParam('isEmpty')){
                helper.getSubCategoriesForCategory(component);
            }
        }else if(firedLookupType == "Issue"){            
            simpleCase.issueId = event.getParam('Id');
            component.set("v.case", simpleCase);
        }
        
    },
    //Select a particular card
    selectArticleCard: function(component, event, helper) {
       //Getting the Card menu value   
        var targetCard = event.currentTarget;
        var targetValue = targetCard.dataset.value;
        var currentArticleList = component.get("v.articleList");
        
        //Publish the value
        var componentEvent = component.getEvent("articleSelectEvent");
        componentEvent.setParam("type", "ArticleSelection");
        componentEvent.setParam("currentSelection", currentArticleList[targetValue]);
        componentEvent.fire(); 
    },
    //Send article to player
    sendToPlayerAction : function(component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        console.log('event',event.getSource());     
        component.set("v.selectedArticle", event.getSource().get("v.value"));
        component.set("v.showArticleSharing",true);
    },
    //Building the articles
    articleBuilder: function(component, event, helper) {
        if(component.get("v.articleJSONResponse").hits != undefined){
            if(component.get("v.articleJSONResponse").hits.hit.length > 0){
                component.set("v.isDataNull", false);
                component.set("v.isDataLoad", true);
                helper.articleDOMBuilder(component, event, component.get("v.articleJSONResponse"));
            }else{
                component.set("v.isDataNull", true);
                component.set("v.isDataLoad", false);
            }    
        }
    },
    //Handling the sort value
    changeSortByValue: function(component, event, helper) {
        var selectedValue = event.getParam("value");
        var articleList = component.get("v.articleList");
        var sortedList;
        if(articleList.length > 0){
            if(selectedValue == 'lastUpdated'){
                 sortedList = articleList.sort(helper.sortedByDateTime);
            }else{
                 sortedList = articleList.sort(helper.sortedByHelpfulVotes);     
            }
            component.set("v.articleList", sortedList);
        } 
    },
    //Searching the knowledge base articles
    searchKnowledgeArtciles: function(component, event, helper) {
        var timer = component.get('v.keyPressTimer');
        var searchString = component.get("v.searchString");
        var currentParam = helper.getParameters(component, event);
        var endPoint = helper.constructArticleParameter(component, event, currentParam);
        clearTimeout(timer);
        timer = setTimeout(function() {
            helper.generateAWSResponse(component, event, endPoint);
            clearTimeout(timer);
            component.set('v.keyPressTimer', 0);
        }, 5);
        component.set('v.keyPressTimer', timer);
        event.stopPropagation();
        event.preventDefault();
    },
})