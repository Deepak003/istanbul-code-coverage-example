({
    //Getting featured products from backend
    getFeaturedProducts : function(component) {
        var action = component.get("c.getFeaturedProducts");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();                   
                var topProduct = JSON.parse(storeResponse).response.slice(0,6);
                component.set("v.featuredProduct", topProduct);
                component.set("v.currentSelectionId", topProduct[0].urlName);
                component.set("v.currentSelectionValue", topProduct[0].name);
                this.constructArticleParameter(component,event,topProduct[0].name); 
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to create params for the articles - Same as KnowlwdgeArticles but everything is defaulted
    constructArticleParameter : function(component, event, name){
        //Defining the parser
        var paramsSolr = {};
        var fq = {}; //For the inner query attributes
        
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
        
        paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content"]}';
        
        //Returning all the fields for view
        paramsSolr.return="title,summary,locale,scope,is_archived,url,_score,total_votes,helpfulness_percent,helpful_votes,last_modified_at";
        
        //Sorting the result
        paramsSolr.sort = "_score desc, rank1 desc, rank2 desc";
        paramsSolr.size = "200";
        fq['category'] = "";
        fq['platform'] = "";
        fq['product'] = "";
        fq['subcategory'] = "";
        fq['is_archived'] = "(not is_archived:'true')";
        fq["last_modified_at"] = "";
        fq["scope"] ="(or (and scope:'external' (or locale:'en-us')) (and scope:'internal' (or locale:'en-us')))";
        var query = name;        
        paramsSolr.q = "(" + query + ")";        
        paramsSolr.fq = "(and "+ fq['product'] + fq['platform'] + fq['category'] + fq['subcategory'] + fq['is_archived'] +
            fq["last_modified_at"] + fq["scope"] +")";
        
        //Generating the request
        var endPoint = this.encodingMapToParam(paramsSolr);
        this.generateAWSResponse(component, event, endPoint);
    },
    //Function used to create an encoded request to send to AWS
    encodingMapToParam : function(endPoint){
        var queryString = Object.keys(endPoint).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(endPoint[key])
        }).join('&');
        return queryString;
    },
    //Function to generate https request for getting AWS Response
    generateAWSResponse : function(component, event, endPoint){
        var xmlHttp = new XMLHttpRequest();
        var returnValue="";
        var url = $A.get("$Label.c.TSM_KB_QA_URL")+endPoint; //Must store end point in WWCE
        xmlHttp.open( "GET", url, true );
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.responseType = 'text';
        xmlHttp.onload = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    var articleResult = JSON.parse(xmlHttp.response);
                    if(articleResult.hits != undefined){
                        component.set("v.isArticleLoading", false);
                        if(articleResult.hits.found > 0){
                            component.set("v.isData", true);
                            component.set("v.articleList", articleResult);
                        }else{
                            component.set("v.isData", false);      
                        }
                    }else{
                        component.set("v.isArticleLoading", false);
                        component.set("v.isData", false);      
                    }
                }
            }
        };
        xmlHttp.send( null );
    },
    //Build the relavent article DOM
    articleDOMBuilder: function (component, event, articleResult) {
        var articleList = articleResult.hits.hit;
        component.set("v.relatedList", articleList); 
        var sortedDateList = articleList.sort(this.sortedByDateTime);
        component.set("v.lastUpdatedList", sortedDateList); 
    },
    //Function to sort by date time
    sortedByDateTime: function (firstObject, secondObject) {   
        if (new Date(firstObject.fields.last_modified_at) > new Date(secondObject.fields.last_modified_at))
            return -1;
        if (new Date(firstObject.fields.last_modified_at) < new Date(secondObject.fields.last_modified_at))
            return 1;
        return 0;
    },
    //Function used to publish the event when article is selected
    publishRequest: function(component, event, currentArticleList){
        var targetCard = event.currentTarget;
        var targetValue = targetCard.dataset.value;
        //Publish the value
        var componentEvent = component.getEvent("articleSelectEvent");
        componentEvent.setParam("type", "ArticleSelection");
        componentEvent.setParam("currentSelection", currentArticleList[targetValue]);
        componentEvent.fire(); 
    },
})