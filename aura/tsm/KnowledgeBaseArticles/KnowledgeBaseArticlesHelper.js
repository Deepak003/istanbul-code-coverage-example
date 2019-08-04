({
    //gets all products function used for lookup - Product
    getAllProduct: function (component, event) {
        var action = component.get("c.getAllProducts"); 
        var self = this;
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var allProducts = response.getReturnValue();            
                component.set("v.allProducts", allProducts);
            }
        });
        $A.enqueueAction(action);
    },
    //gets all platforms function used for lookup - Platform
    getPlatformsByProduct: function (component) {
        var action = component.get("c.getPlatformsByProduct"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            strProductId: caseObject.productId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responsePlatfrom = response.getReturnValue();            
                component.set("v.platformData", responsePlatfrom);
                console.log(responsePlatfrom);
                component.set("v.platformDisable",false);
                component.set("v.isLoading", false);
                
            }
        });
        $A.enqueueAction(action);
    },
    //gets all platforms function used for lookup - Platform
    getCategoriesForProduct: function (component) {
        var action = component.get("c.getCategoriesForProduct"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            strProductId: caseObject.productId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responseCategory = response.getReturnValue();            
                component.set("v.categoryData", responseCategory);
                console.log(responseCategory);
                component.set("v.categoryDisable",false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    //gets all sub categories function used for lookup - Platform
    getSubCategoriesForCategory: function (component) {
        var action = component.get("c.getSubCategoriesForCategory"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            categoryId: caseObject.categoryId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responseSubCategory = response.getReturnValue();            
                component.set("v.issueData", responseSubCategory);
                console.log(responseSubCategory);
                component.set("v.issueDisable",false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to reset the filter
    resetFilter: function (component) {
        //Create empty string
        var simpleCase = {};
        simpleCase.product = "";
        simpleCase.platform = "";
        simpleCase.category = "";
        simpleCase.subCategory = "";
        simpleCase.productId = "";
        
        component.set("v.platformDisable",true);
        component.set("v.platformData",[]);
        
        component.set("v.categoryData",[]);
        component.set("v.categoryDisable",true);
        
        component.set("v.issueData",[]);
        component.set("v.issueDisable",true);
        
        component.find("action-checkbox").set("v.value", "notification");
        component.find("last-updated-combo").set("v.value", "all");
        
        component.find("locale-selector").set("v.value", "en_US");
        component.find("scope-selector").set("v.value", "all");
        component.find("content-type-combo").set("v.value", "all");
        
        component.set("v.currentParam",{});
        
        component.set("v.filterText", "Filters (1)"); //TSM-2413 Adding filter count
        component.set("v.case",simpleCase);
    },
    //Function to save the filter values - and get the results
    saveFilterValues: function (component, event) {
        var param = this.getParameters(component, event);
        var endPoint = this.constructArticleParameter(component, event, param);
        var actionCheckBox = component.find("action-checkbox");
        
        //Checking for notification
        if(actionCheckBox.get("v.value").indexOf("notification") >= 0){
            //this.generateNotification(component, event, endPoint);
            this.generateAWSResponse(component, event, endPoint,{});
        }else{
            this.generateAWSResponse(component, event, endPoint,{});
        }
        
        //Toggle between different pannels
        var filterPannel = component.find('filter-pannel');
        var artilcesPannel = component.find('artilces-pannel');
        
        this.generateFilterCount(component, event); //TSM - 2413 - Adding filter count
        
        $A.util.addClass(filterPannel, 'slds-hide');
        $A.util.removeClass(artilcesPannel, 'slds-hide'); 
    },
    //Function used to generate parameters
    getParameters: function (component, event) {
        var param = {};
        var lookupSelection = component.get("v.case");
        var actionCheckBox = component.find("action-checkbox");
        var lastUpdatedCombo = component.find("last-updated-combo");
 
        param['category'] = lookupSelection.category;        
        param['platform'] = lookupSelection.platform;       
        param['product'] = lookupSelection.product;        
        param['subCategory'] = lookupSelection.subCategory;
        param['last_modified_at']  = lastUpdatedCombo.get("v.value");      
        param['locale'] = component.find("locale-selector").get("v.value").toLowerCase().replace(/_/g,"-");
        param['scope'] = component.find("scope-selector").get("v.value");
        param['title'] = component.get("v.searchString");
        param['content_type'] = component.find("content-type-combo").get("v.value");
        
        if(actionCheckBox.get("v.value").indexOf("archived") >= 0 ){
            param['is_archived'] = "true";
        }else{
            param['is_archived'] = "false";
        }
        component.set("v.currentParam", param);
        return param;
    },
    //Function used to create request params for the articles from filter articles
    constructArticleParameter : function(component, event, params){
        //Defining the parser
        var paramsSolr = {};
        var fq = {}; //For the inner query attributes
        var today = new Date();
        var lastThirtyDay = new Date(new Date().setMonth(today.getMonth() -1));
        var lastSixMonth = new Date(new Date().setMonth(today.getMonth() -6));
        var lastOneYear = new Date(new Date().setMonth(today.getMonth() -12));
        
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
        
        //Defining the options     
        if (params['title'] != undefined && params['title'].match(/^\d+$/) && params['title'].match(/^\d+$/).length) {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content","article_no"]}';//Should have in a WWCE object
        }else {
            paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content"]}';
        }
        
        //Returning all the fields for view - return value can be increased based on the requirement
        paramsSolr.return="title,summary,locale,scope,is_archived,url,_score,total_votes,helpfulness_percent,helpful_votes,last_modified_at";
        //Sorting the result
        paramsSolr.sort = "_score desc, rank1 desc, rank2 desc";
        paramsSolr.size = "200"; //Put in WWCE Object
     
        //Generating for lookup fields
        if(params.category != ""){
            fq['category'] = "(and category :'"+params.category +"')";
        }else{
            fq['category'] = "";
        }
        
        if(params.platform != ""){
            fq['platform'] = "(and platform :'"+params.platform +"')";
        }else{
            fq['platform'] = "";
        }
        
        if(params.product != ""){
            fq['product'] = "(or product:'"+params.product +"')";
        }else{
            fq['product'] = "";
        }
        
        if(params.subCategory != ""){
            fq['subcategory'] = "(and subcategory:'"+params.subCategory+"')";
        }else{
            fq['subcategory'] = "";
        }
        
        //Adding content_type
        if(params['content_type'] != 'all'){
            fq['content_type'] = "(and content_type:'"+params.content_type+"')";
        }else{
            fq['content_type'] = "";
        }
        
        //Getting archived value
        if(params['is_archived'] == "true"){
            fq['is_archived'] = "";
        }else{
            fq['is_archived'] = "(not is_archived:'true')";
        }
        
        //Generating date parameter fq if any
        switch(params['last_modified_at']){
            case "30DAY":
                fq["last_modified_at"] = "(and last_modified_at:{'"+lastThirtyDay.getFullYear()+"-"+(lastThirtyDay.getMonth()+1)+"-"+lastThirtyDay.getDate()+"T00:00:00.000Z','"+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+(today.getDate()+1)+"T00:00:00.000Z'])";
                break;
            case "180DAY":
                fq["last_modified_at"] = "(and last_modified_at:{'"+lastSixMonth.getFullYear()+"-"+(lastSixMonth.getMonth()+1)+"-"+lastSixMonth.getDate()+"T00:00:00.000Z','"+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+(today.getDate()+1)+"T00:00:00.000Z'])";
                break;
            case "365DAY":
                fq["last_modified_at"] = "(and last_modified_at:{'"+lastOneYear.getFullYear()+"-"+(lastOneYear.getMonth()+1)+"-"+lastOneYear.getDate()+"T00:00:00.000Z','"+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+(today.getDate()+1)+"T00:00:00.000Z'])";
                break;  
            default:
                fq["last_modified_at"] = "";
                break;
        }
      
        //Generating date parameter fq if any
        switch(params['scope']){
            case "all":
                fq["scope"] = "(or (and scope:'external' (or locale:'"+ params['locale'] +"')) (and scope:'internal' (or locale:'"+ params['locale'] +"')))";
                break;
            case "internal":
                fq["scope"] = "(and scope:'internal' (or locale:'" + params['locale'] + "'))";
                break;
            case "external":
                fq["scope"] = "(and scope:'external' (or locale:'" + params['locale'] + "'))";
                break;   
            default:
                fq["scope"] ="";
                break;
        }
        
        var query;
        //Generating the search parameter
        if(params['title'] == ""){
            query = '*';
        }else{
            query = params['title'];
        }
        
        paramsSolr.q = "(" + query + ")";
        
        paramsSolr.fq = "(and "+ fq['product'] + fq['platform'] + fq['category'] + fq['subcategory'] + fq['content_type'] + fq['is_archived'] +
                        fq["last_modified_at"] + fq["scope"] +")";
        
        //Generating the request
        return this.encodingMapToParam(paramsSolr);
    },
    //Function to generate the notification request
    generateNotification: function(component, event, endPoint){
        var action = component.get("c.getNotifications"); 
        var self = this;
        action.setParams({
            searchTerm: component.get("v.searchString")
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var allContent = response.getReturnValue(); 
                this.generateAWSResponse(component, event, endPoint,{});
            }
        });
        $A.enqueueAction(action);        
    },
    //Function used to create an encoded request to send to AWS - TSM-1723
    encodingMapToParam : function(endPoint){
        var queryString = Object.keys(endPoint).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(endPoint[key])
        }).join('&');
        return queryString;
    },
    //Function to generate https request for getting AWS Response - TSM-1723
    generateAWSResponse : function(component, event, endPoint, notificationMap){
        var xmlHttp = new XMLHttpRequest();
        var returnValue="";
        var url = $A.get("$Label.c.TSM_KB_QA_URL")+endPoint; //Must store end point in WWCE
        xmlHttp.open( "GET", url, true );
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.responseType = 'text';
        xmlHttp.onload = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    //var articleList = notificationMap.concat(JSON.parse(xmlHttp.response))
                    component.set("v.articleJSONResponse", JSON.parse(xmlHttp.response));
                }
            }
        };
        xmlHttp.send( null );
    },
    //Build the relavent article DOM
    articleDOMBuilder: function (component, event, articleResult) {
        var articleCountPannel = component.find("article-count-pannel");
        component.set("v.articleCount",articleResult.hits.found + ' ARTICLES FOUND');
        //Toggle display
        if(articleResult.hits.found > 0){
            $A.util.removeClass(articleCountPannel, 'slds-hide');
        }else{
            $A.util.addClass(articleCountPannel, 'slds-hide');       
        }
        //Adding the list
        var articleList = articleResult.hits.hit;
       // var sortedList = articleList.sort(this.sortedByRelevant); //Sorting most relevant
        component.set("v.articleList", articleList);
    },
    //Sort by votes
    sortedByHelpfulVotes: function (firstObject, secondObject) {           
        var firstElement = 0;
        var secondElement = 0;
        
        if(firstObject.fields.helpful_votes != undefined){
            firstElement = parseInt(firstObject.fields.helpful_votes);
        }
        
        if(secondObject.fields.helpful_votes != undefined){
            secondElement = parseInt(secondObject.fields.helpful_votes);
        }
        
        if (firstElement > secondElement)
            return -1;
        if (firstElement < secondElement)
            return 1;
        return 0;
    },
    
    //Function to sort by date time
    sortedByDateTime: function (firstObject, secondObject) {   
        if (new Date(firstObject.fields.last_modified_at) > new Date(secondObject.fields.last_modified_at))
            return -1;
        if (new Date(firstObject.fields.last_modified_at) < new Date(secondObject.fields.last_modified_at))
            return 1;
        return 0;
    },
    
    //Function to get the AEM content types                                                                                  
    getAEMContent: function (component, event) {
        var action = component.get("c.getAemContentType"); 
        var self = this;
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var allContent = response.getReturnValue();            
                component.set("v.contentTypeList", allContent.response);
            }
        });
        $A.enqueueAction(action);
    },
    
    //Function to generate filter count - TSM-2413
    generateFilterCount: function (component, event) {
        var count = 1;
        var lookupSelection = component.get("v.case");
        
        if(lookupSelection.category != ""){
            count = count + 1;
        }
        
        if(lookupSelection.platform != ""){
            count = count + 1;
        }
        
        if(lookupSelection.product != ""){
            count = count + 1;
        }
        
        if(lookupSelection.subCategory != ""){
            count = count + 1;
        }
        
        if(component.find("last-updated-combo").get("v.value") != "all"){
            count = count + 1;
        }  
        
        if(component.find("scope-selector").get("v.value") != "all"){
            count = count + 1;
        }
        
        if(component.find("content-type-combo").get("v.value") != "all"){
            count = count + 1;
        }

        var filterText = "Filters ("+count+")";
        component.set("v.filterText", filterText);   
    },
    
    //Getting all the email languages and generating the list
    getEmailLanguages: function (component, event) {
        var EmailLanguages = {'ar_SA':'Arabic-SA', 'cs_CZ':'Czech', 'da_DK':'Danish', 'nl_NL':'Dutch', 'en_US':'English-US', 'en_GB':'English-UK', 'fi_FI':'Finnish', 'fr_FR':'French', 'de_DE':'German', 'hu_HU':'Hungarian', 'it_IT':'Italian', 'ja_JP':'Japanese', 'ko_KR':'Korean', 'nb_NO':'Norwegian', 'pl_PL':'Polish', 'ru_RU':'Russian', 'es_ES':'Spanish', 'sv_SE':'Swedish', 'pt_PT':'Portuguese', 'pt_BR':'Portuguese-BR', 'fr_CA':'French-CA', 'zh_CN':'Chinese', 'th_TH':'Thai', 'au_AU':'English-AU', 'en_CA':'English-CA', 'en_IN':'English-IN', 'en_NZ':'English-NZ', 'en_ZA':'English-SA', 'tr_TR':'English-TR', 'es_MX':'Spanish-MX', 'zh_HK':'Chinese-HK', 'zh_SG':'Chinese-SG', 'zh_TW':'Chinese-TW'};
        var foramtterList = Object.entries(EmailLanguages).map(([value, label]) => ({value,label}));    
        component.set("v.languageList", foramtterList);                                                                             
    },
                                                                             
})