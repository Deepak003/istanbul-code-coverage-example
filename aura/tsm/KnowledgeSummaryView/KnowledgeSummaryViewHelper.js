({
    //Function to set initial focus (Done when DOM is built) - TSM-1723
    setInitialFocus : function(component, event, targetIndex, JSONValue) {
        var articleTabs = component.find("articleTabs"); //Getting list of article tabs
        var homeTab = component.find("homeTab");
        var articleMasterContainer = component.find("articleMasterContainer"); //Master container containing the article
        var articleContent = component.find("articleContent");
        var homeContent = component.find("homeContent");
        var selectedArticle = component.get('v.selectedArticle');
        var articleRendererDiv = component.find("articleRendererDiv"); //Seperate div for the renderer
        
        //Close the home tab
        $A.util.removeClass(homeTab, 'slds-active');
        $A.util.addClass(homeContent, 'slds-hide');
        
        //Adding the JSON obtained from card click event
        var currentJson = JSONValue;      
        //Handling condition for single tab vs multiple tabs
        if(articleTabs.length == undefined){
            $A.util.addClass(articleTabs, 'slds-active');
            $A.util.removeClass(articleMasterContainer, 'slds-hide');
            $A.util.removeClass(articleContent, 'slds-hide');
            
            //Generating twig for current article
            this.generateTwig(component, currentJson, articleContent);
        }else{
            for(var eachTab in articleTabs){
                $A.util.removeClass(articleTabs[eachTab], 'slds-active');
                //Remove the content
                $A.util.addClass(articleMasterContainer[eachTab], 'slds-hide'); 
                $A.util.addClass(articleContent[eachTab], 'slds-hide');   
                
            }
            //Generating twig for current article
            this.generateTwig(component, currentJson, articleContent[targetIndex]);
            //Adding the focus to the current selection
            $A.util.addClass(articleTabs[targetIndex], 'slds-active');
            $A.util.removeClass(articleMasterContainer[targetIndex], 'slds-hide');
            $A.util.removeClass(articleContent[targetIndex], 'slds-hide');
            
        }       
    },    
    //Function to toggle different focus - TSM-1723
    toggleFocus : function(component, event, targetId) {
        var articleTabs = component.find("articleTabs");
        var homeTab = component.find("homeTab");        
        var articleContent = component.find("articleContent");
        var homeContent = component.find("homeContent");
        var articleMasterContainer = component.find("articleMasterContainer"); //Master container containing the article
        
        //Close the home tab
        $A.util.removeClass(homeTab, 'slds-active');
        $A.util.addClass(homeContent, 'slds-hide');
        
        //Close other tabs
        if(articleTabs.length == undefined){
            $A.util.addClass(articleTabs, 'slds-active');
            $A.util.removeClass(articleContent, 'slds-hide');
            $A.util.removeClass(articleMasterContainer, 'slds-hide');
        }else{
            for(var eachTab in articleTabs){
                if(articleTabs[eachTab].getElement().id == targetId){
                    $A.util.addClass(articleTabs[eachTab], 'slds-active');
                    //Displaying the content
                    $A.util.removeClass(articleMasterContainer[eachTab], 'slds-hide');
                    $A.util.removeClass(articleContent[eachTab], 'slds-hide');
                }else{
                    $A.util.removeClass(articleTabs[eachTab], 'slds-active');
                    //Remove the content
                    $A.util.addClass(articleMasterContainer[eachTab], 'slds-hide');
                    $A.util.addClass(articleContent[eachTab], 'slds-hide');
                }        
            }
        }       
    },
    //Funciton used to handle if the home tab is clicked - TSM-1723
    toggleHomeFocus : function(component, event) {
        var articleTabs = component.find("articleTabs");
        var homeTab = component.find("homeTab");        
        var articleContent = component.find("articleContent");
        var homeContent = component.find("homeContent");  
        var articleMasterContainer = component.find("articleMasterContainer"); //Master container containing the article
        
        //Open the home tab
        $A.util.addClass(homeTab, 'slds-active');
        $A.util.removeClass(homeContent, 'slds-hide');
        
        //Close other tabs
        if(articleTabs != undefined){
            if(articleTabs.length == undefined){
                $A.util.removeClass(articleTabs, 'slds-active');
                $A.util.addClass(articleContent, 'slds-hide');
                $A.util.addClass(articleMasterContainer, 'slds-hide');
            }else{
                for(var eachTab in articleTabs){
                    $A.util.removeClass(articleTabs[eachTab], 'slds-active');
                    //Remove the content
                    $A.util.addClass(articleContent[eachTab], 'slds-hide');
                    $A.util.addClass(articleMasterContainer[eachTab], 'slds-hide');
                }        
            }
        }
    },
    //Function to set more tab on close button click
    setMoreTabOnClose: function(component, selectedMenuItemValue) {
        var moreTabs = component.get("v.moreTabs");
        var currentElement = this.getCurrentElement(selectedMenuItemValue, moreTabs);
        var updateMoreTab = this.removeSelectedElement(moreTabs, selectedMenuItemValue);
        var allKnowledgeTab = component.get("v.allKnowledgeTabs");
        
        //Adding the current element into the all Knowledge tab
        allKnowledgeTab = allKnowledgeTab.concat(currentElement);
        component.set("v.allKnowledgeTabs",allKnowledgeTab);
        component.set("v.moreTabs",updateMoreTab);
        //Setting the component
        this.generateHiddenFocus(component, event, component.get("v.JSONResponse").hit[0].fields);
    },
    //Function to toggle more tabs from the menu - TSM-1723
    toggleMoreTabs : function(component, selectedMenuItemValue) {
        var moreTabs = component.get("v.moreTabs");
        var allKnowledgeTab = component.get("v.allKnowledgeTabs");      
        //Getting the last tab in the queue
        var lastElement = allKnowledgeTab[5];
        //Getting the current element from more tab
        var currentElement = this.getCurrentElement(selectedMenuItemValue, moreTabs);
        //Removing the current element from the more tab
        var updateMoreTab = this.removeSelectedElement(moreTabs, selectedMenuItemValue);
        //Removing the last element from all Knowlwedge Tab
        var updateKnowledgeTab = this.removeSelectedElement(allKnowledgeTab, lastElement.id);
        //Adding the current element into the all Knowledge tab
        updateKnowledgeTab = updateKnowledgeTab.concat(currentElement);
        //Adding the last element to the more tab
        updateMoreTab = updateMoreTab.concat(lastElement);
        
        //Logic to get the locale list
        var languageParameter = this.constructLocaleParameter(component, event,component.get("v.selectedArticle"), currentElement.id);
        this.generateAWSResponse(component, event, languageParameter, 'localeResponse');
        
        //Setting the final result
        component.set("v.moreTabs",updateMoreTab);
        component.set("v.allKnowledgeTabs",updateKnowledgeTab);
        //Setting the component
        this.generateHiddenFocus(component, event, component.get("v.JSONResponse").hit[0].fields);
    },
    
    //Function to generate DOM for hidden focus - TSM-1723
    generateHiddenFocus: function(component, event, JSONResponse) {
        var articleTabs = component.find("articleTabs");
        var articleMasterContainer = component.find("articleMasterContainer"); //Master container containing the article
        var articleContent = component.find("articleContent");
        
        //Adding the JSON
        var currentJson = JSONResponse; 
        //Generating twig for current article but this is kept hidden
        this.generateTwig(component, currentJson, articleContent[6]);
        
        //Adding the focus to the current selection
        for(var eachTab in articleTabs){
            $A.util.removeClass(articleTabs[eachTab], 'slds-active');
            //Remove the content
            $A.util.addClass(articleMasterContainer[eachTab], 'slds-hide');
            $A.util.addClass(articleContent[eachTab], 'slds-hide');
        }       
        // 6 is hardcoded since the limit we place for max tabs is '6' (Must store tab count in WWCE)
        $A.util.addClass(articleTabs[6], 'slds-active');
        $A.util.removeClass(articleMasterContainer[6], 'slds-hide');
        $A.util.removeClass(articleContent[6], 'slds-hide');        
    },
    
    //Function to find the current element - TSM-1723
    getCurrentElement: function(selectedMenuItemValue, moreTabs) {
        var found = moreTabs.find(function(element) {
            return element.id == selectedMenuItemValue;
        });
        return found;
    },
    
    //Function to remove selected element - TSM-1723
    removeSelectedElement: function (myArr, prop) {
        const result = myArr.filter(myArr => myArr.id != prop);
        return result;
    },
    
    //Function to generate twigs - TSM-1723
    generateTwig : function(component, jsonValue, currentTargetElement) {
        var twigGenerator = component.get('v.TwigTranslator');      
        //Setting time out so the article is loaded
        setTimeout(function() {
            //Removing the child if the element exists
            if(currentTargetElement.getElement() != null){
                while (currentTargetElement.getElement().firstChild) {
                    currentTargetElement.getElement().removeChild(currentTargetElement.getElement().firstChild);
                }
            }
            jsonValue.agent = {};
            jsonValue.agent.id = $A.get("$SObjectType.CurrentUser.Id");
            jsonValue.id = component.get("v.currentId");
            //Using TwigGenerator to create NDS components - target elemet is sent so the twig-translator appends the result
            var returnJSON = twigGenerator.renderComponents(jsonValue, currentTargetElement.getElement());
        }, 100);
    },
    
    //Function to generate https request for getting AWS Response - TSM-1723
    generateAWSResponse : function(component, event, endPoint, responseStorage){
        var xmlHttp = new XMLHttpRequest();
        var returnValue="";
        var url = $A.get("$Label.c.TSM_KB_QA_URL")+endPoint; //Must store end point in WWCE
        xmlHttp.open( "GET", url, true );
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.responseType = 'text';
        xmlHttp.onload = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    component.set("v."+responseStorage, JSON.parse(xmlHttp.response).hits)
                }
            }
        };
        xmlHttp.send( null );
    },
    
    //Function used to bundle up all the request parameters - TSM-1723
    getAWSResponse : function(component, event, params, id){
        var getArticleDetailEndPoint = this.constructDisplayParameter(component, event, params, id);
        var getLocaleEndPoint = this.constructLocaleParameter(component, event, params, id);
        this.generateAWSResponse(component, event, getArticleDetailEndPoint, 'JSONResponse');
        this.generateAWSResponse(component, event, getLocaleEndPoint, 'localeResponse');
    },
    
    //Function used to create the parameters for the body - TSM-1723
    constructDisplayParameter : function(component, event, params, id){
        //Defining the parser
        var paramsSolr={};
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
        //Defining the options    
        if (params['title'] != undefined && params['title'].match(/^\d+$/) && params['title'].match(/^\d+$/).length) {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content","article_no"]}';//Should have in a WWCE object
        }
        else {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content"]}';
        }
        //Defining the option if url is undefined
        if (params['url'] == undefined) {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["url","old_url"]}';
        }
        //Returning all the fields for view
        paramsSolr.return="_all_fields,_score";
        //Sorting the result
        paramsSolr.sort = "_score desc, rank1 desc, rank2 desc";
        //Sending the id as parameter
        paramsSolr.q = '_id:'+id;
        return this.encodingMapToParam(paramsSolr);
    },
    
    //Function used to create params for the locale - TSM-1723
    constructLocaleParameter : function(component, event, params, id){
        //Defining the parser        
        var paramsSolr={};
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
                            
        //Defining the options    
        if (params['title'] != undefined && params['title'].match(/^\d+$/) && params['title'].match(/^\d+$/).length) {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content","article_no"]}';//Should have in a WWCE object
        }
        else {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content"]}';
        }
        //Defining the option if url is undefined
        if (params['url'] == undefined) {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["url","old_url"]}';
        }
        //Returning all the fields for view
        paramsSolr.return="locale";
        //Sorting the result
        paramsSolr.sort = "_score desc, rank1 desc, rank2 desc";
        paramsSolr.size = "35";
        //Sending the id as parameter
        paramsSolr.q = 'article_no:'+id.split('_')[0];//Sending the article number
        return this.encodingMapToParam(paramsSolr);
    },
    //Function used to create an encoded request to send to AWS - TSM-1723
    encodingMapToParam : function(endPoint){
        var queryString = Object.keys(endPoint).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(endPoint[key])
        }).join('&');
        return queryString;
    },
    //Function to remove duplicates - TSM-2408
    removeDuplicates : function (myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    },
    //Getting all the email languages and generating the list
    matchLanguages: function (component, event, locale) {
        var EmailLanguages = component.get("v.languageLocales");
        return EmailLanguages[locale];                                                                   
    },
})