({
    //Function to init the component - handled for bookmark
    doInit: function(component, event, helper) {
        component.set("v.isBookMarked" , false);
    },
    //Function used to bookmark the article
    bookmark: function(component, event, helper) {
        var index = event.getSource().get('v.value');
        component.set("v.selIndex" , index);
        component.set("v.selArticle" , event.getSource().get('v.name'));
        component.set("v.isOpen" , true);
    },
    //Function trigerred when bookmark action is trigerred
    handleAddBookMarkEvent: function(component, event, helper) {
        var index = event.getParam("selIndex");
        const items = component.get("v.allKnowledgeTabs");
        if(Array.isArray(items) && items[index]){
            items[index].isBookMarked = !items[index].isBookMarked;
            component.set("v.allKnowledgeTabs", items); 
            var appEvent = $A.get("e.c:RefreshBookmark");
            appEvent.fire();          
        }
    },
    
    //This function listnes to the modification of the JSON object - TSM-1723
    modifySelectedJSON: function(component, event, helper) {
        // Global variables for the function to get the bulk details
        var currentList = component.get("v.allKnowledgeTabs");
        var moreTabs = component.get("v.moreTabs");
        var selectedDetails = component.get("v.JSONResponse");
        //Having a found object to check if the Tab has been initilized earlier
        var found;

        //Adding condition for scope - scope is needed for displaying the articles
        if(component.get("v.selectedArticle").fields.scope == undefined){
            component.get("v.selectedArticle").fields.scope = selectedDetails.hit[0].fields.scope;
        }
        if(component.get("v.selectedArticle").fields.url == undefined){
            component.get("v.selectedArticle").fields.url = selectedDetails.hit[0].fields.url;
        }
        //Added if else to fetch summary view for selected Article cards in bookmarks tab
        if(component.get("v.selectedArticle").fields != undefined){
            found = currentList.find(function(element) {
                return element.id == component.get("v.selectedArticle").id;
            });
            component.set("v.title" , component.get("v.selectedArticle").fields.title);
        }
        else{
            found = currentList.find(function(element) {
                return element.id == component.get("v.selectedArticle").articleId;
            });
            component.set("v.selectedArticle.fields.title", component.get("v.selectedArticle").Name);
            component.set("v.title" , component.get("v.selectedArticle").Name);
        }
        
        //Performing operation based on the state of tab
        if(found == undefined){
            //Appending the container header details to the main object          
            component.get("v.selectedArticle").articleNumber = selectedDetails.hit[0].fields.article_no;
            component.get("v.selectedArticle").lastModified = selectedDetails.hit[0].fields.last_modified_at;           
            
            //Appending the article tags details to the main object 
            if(selectedDetails.hit[0].fields.article_content != undefined){
                if(JSON.parse(selectedDetails.hit[0].fields.article_content).keyword != undefined){
                    component.get("v.selectedArticle").articleTags = JSON.parse(selectedDetails.hit[0].fields.article_content).keyword.split(",");
                }
            }
            component.get("v.selectedArticle").localeLabel = helper.matchLanguages(component, event, selectedDetails.hit[0].fields.locale);
            //Setting limit of 6 more than that adds to MORE         
            if(currentList.length < 6){
                //Adding the new selected object to the list of tabs
                currentList = currentList.concat(component.get("v.selectedArticle"));
                component.set("v.allKnowledgeTabs", currentList);
                
                //Building the DOM for the selected object
                helper.setInitialFocus(component,event,currentList.length-1, component.get("v.JSONResponse").hit[0].fields);                 
                //closing more tab
                $A.util.addClass(component.find("moreTab"),'slds-hide');
            }else{         
                //Appending to the more if > 6
                moreTabs = moreTabs.concat(component.get("v.selectedArticle"));
                //TSM-2408 - Removing duplicates
                moreTabs = helper.removeDuplicates(moreTabs, 'id');
                component.set("v.moreTabs", moreTabs);
                $A.util.removeClass(component.find("moreTab"),"slds-hide");
                //TSM-2408 - Toggle latest
                helper.toggleMoreTabs(component, component.get("v.selectedArticle").id);
            }
        }else{
            //If Tab exists
            //Case 1: Check for locale change
            if(component.get("v.currentId").split("_")[0] == component.get("v.JSONResponse").hit[0].id.split("_")[0]){
                //If locale change get the index
                var currentIndex = currentList.findIndex(function(element) {
                    return element.id.split("_")[0] == component.get("v.JSONResponse").hit[0].id.split("_")[0];
                });
                
                //Update the index with the translated value
                currentList[currentIndex].fields.title = selectedDetails.hit[0].fields.title;
                if(selectedDetails.hit[0].fields.locale != undefined){
                    currentList[currentIndex].fields.locale = selectedDetails.hit[0].fields.locale;
                    currentList[currentIndex].localeLabel = helper.matchLanguages(component, event, selectedDetails.hit[0].fields.locale);
                }
                currentList[currentIndex].id = selectedDetails.hit[0].id;
                if(JSON.parse(selectedDetails.hit[0].fields.article_content).keyword != undefined){
                    currentList[currentIndex].articleTags = JSON.parse(selectedDetails.hit[0].fields.article_content).keyword.split(",");
                }
                //Build the DOM with new locale
                helper.setInitialFocus(component,event,currentIndex, component.get("v.JSONResponse").hit[0].fields);
                component.set("v.allKnowledgeTabs", currentList);
            }else{
                //If locale remains same just toggle to the old tab
                helper.toggleFocus(component, event,component.get("v.selectedArticle").id);
            }        
        }
        //Remove detail view (Home page view and go to the article view)
        $A.util.addClass(component.find("knowledge-details-view"),"slds-hide");
        $A.util.removeClass(component.find("knowledge-tabs-view"),"slds-hide");
    },
    
    //Action performed on close icon press - TSM-1723
    closeCurrentTab: function(component, event, helper) {
        //Getting the tab menu value   
        var targetTab = event.currentTarget;
        var targetValue = targetTab.dataset.value; 
        var currentList = component.get("v.allKnowledgeTabs");
        var moreTabs = component.get("v.moreTabs");
        
        //Removing current selected tab index
        currentList.splice(targetValue, 1);
        component.set("v.allKnowledgeTabs", currentList);
        //Checking for more tab
        if(moreTabs.length == 1){
            //If one more tab exists remove the mode container
            helper.setMoreTabOnClose(component, moreTabs[0].id);
            $A.util.addClass(component.find("moreTab"),"slds-hide");
        }else if(moreTabs.length > 1){
            //If multiple more tab then remove from the more list
            helper.setMoreTabOnClose(component, moreTabs[0].id);
        }else if(moreTabs.length == 0){
            //If no more tab and only regular tabs
            if(currentList.length == 0){
                //If only one tab show home on delete
                var homeTab = component.find("homeTab");
                var homeContent = component.find("homeContent");                  
                $A.util.addClass(homeTab, 'slds-active');
                $A.util.removeClass(homeContent, 'slds-hide');
            }else{
                setTimeout(function() {
                    //If more than one tab toggle focus to display the last element
                    component.set("v.selectedArticle",currentList[currentList.length-1]); //setting the selected article as the last tab
                    helper.getAWSResponse(component, event, currentList[currentList.length-1].fields,currentList[currentList.length-1].id);//generating the response for the article
                }, 10);
            }
        }
    },
    //If the focus is brought back to the opened tab - TSM-1723
    focusCurrentTab: function(component, event, helper) {
        //Getting the tab menu value   
        var targetId = event.currentTarget.dataset.value;
        //Get the labguage query
        var languageParameter = helper.constructLocaleParameter(component, event,component.get("v.selectedArticle"), targetId);
        helper.generateAWSResponse(component, event, languageParameter, 'localeResponse');
        //Toggle the focus
        helper.toggleFocus(component, event,targetId);
    },
    //If focus is brought to home tab - TSM-1723
    focusHomeTab : function(component, event, helper) {
        helper.toggleHomeFocus(component, event);
    },
    //If send button is pressed
    sendToPlayerAction : function(component, event, helper) {
        component.set("v.selArticle" , event.getSource().get('v.name'));
        component.set('v.showArticleSharing',true);
    },
    //Function to handle more tab selection - TSM-1723
    handleMoreTabSelect: function(component, event, helper) {
        helper.toggleMoreTabs(component, event.getParam("value"));
    },
    //Function to handle the menu selection - TSM-1723
    handleSelect: function (component, event, helper) {
        var selectedMenuItemValue = event.getParam("value");
        component.set("v.currentId", selectedMenuItemValue);
        console.log(selectedMenuItemValue);
        var currentList = component.get("v.allKnowledgeTabs");
        var found = currentList.find(function(element) {
            return element.id.split("_")[0] == selectedMenuItemValue.split("_")[0];
        });
        console.log(found.fields);
        //Getting the new locale response for both body and locale
        helper.getAWSResponse(component, event, found.fields, selectedMenuItemValue);
    },
    
    //Function to get the JSON on click of card - Handled from the Article Filter container - TSM-1723
    getContentJSON: function(component, event, helper) { 
        //Setting the id state of the object
        var selectedArticle = component.get("v.selectedArticle");
        component.set("v.currentId", selectedArticle.id);
        helper.getAWSResponse(component, event, selectedArticle.fields,selectedArticle.id);  
    },
    //Showing Alert message when clicking on send for article sharing
    showAlert : function(component, event, helper) {
        component.set('v.showAlert',true);
        setTimeout(function() {
            console.log('setTimeout');
            component.set('v.showAlert',false);
        }, 5000);
    },
    //hiding Alert message 
    hideAlert : function(component, event, helper) { 
        component.set('v.showAlert',false);
    },
    refactorLocale: function(component, event, helper) {
        var localeResponse = component.get("v.localeResponse");
        for(var eachEachLocale in localeResponse.hit){
            var currentLocale = localeResponse.hit[eachEachLocale].fields.locale;
            localeResponse.hit[eachEachLocale].fields.locale = helper.matchLanguages(component, event,currentLocale);
        }       
        component.set("v.refactoredLocaleResponse",localeResponse);
    },
    //TSM-2520 - Funciton to open the article in the new window
    handleArticleClick : function(component, event, helper) {
        var searchTerm = event.target.href; 
        if(event.target.tagName == "A"){
            if(searchTerm.search(window.location.hostname)>=0){
                searchTerm = searchTerm.replace(/^.*\/\/[^\/]+/, '');
                searchTerm = searchTerm.replace(/\/+/g,' ').trim();
                //Setting the id state of the object
                if(searchTerm.search("#") < 0){
                    if(searchTerm.search(".html") >=0){
                        searchTerm = searchTerm.split(".")[0];             
                    }
                    //Logic to send the url from the selected internal articles
                    var componentEvent = component.getEvent("sendUrlEvent");
                    componentEvent.setParam("url", searchTerm); 
                    componentEvent.fire();  
                    //Stopping further propogation of the event
                    event.stopPropagation();
                    event.preventDefault(); 
                }  
            }else{
                window.open(searchTerm, "_blank");
                event.stopPropagation();
                event.preventDefault();                
            }
        } 
    },
})