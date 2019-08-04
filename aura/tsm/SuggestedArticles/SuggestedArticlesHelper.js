({
    //Function used to create params for the articles - KnowlwdgeArticles with default params
    constructArticleParameter : function(component, event){
        //Defining the parser
        var paramsSolr = {};
        var fq = {}; //For the inner query attributes
        
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
        
        //Defaulting the options
        paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["title","metadescription","keyword","summary","distilled_content"]}';
        
        //Returning all the fields for view
        paramsSolr.return="article_no,title,summary,locale,scope,is_archived,url,_score,total_votes,helpfulness_percent,helpful_votes,last_modified_at";
        
        //Sorting the result
        paramsSolr.sort = "_score desc, rank1 desc, rank2 desc";
        paramsSolr.size = "200";
        //Setting the filter values to null
        fq['category'] ="";
        fq['platform'] = "";
        fq['product'] = "";
        fq['subcategory'] = "";
        fq['is_archived'] = "(not is_archived:'true')";
        fq["last_modified_at"] = "";
        fq["scope"] ="(or (and scope:'external' (or locale:'en-us')) (and scope:'internal' (or locale:'en-us')))";
        var query = component.get("v.selectedProduct").Name;        
        paramsSolr.q = "(" + query + ")";        
        paramsSolr.fq = "(and "+ fq['product'] + fq['platform'] + fq['category'] + fq['subcategory'] + fq['is_archived'] +
            fq["last_modified_at"] + fq["scope"] +")";
        
        //Encoding the parameter
        var endPoint = this.encodingMapToParam(paramsSolr);
        //Generating the request
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
                            component.set("v.isData", true);//Data exists
                            //Restricting data upto 5
                            if(articleResult.hits.hit.length > 5){
                                articleResult = articleResult.hits.hit.slice(0,5);
                            }else{
                                articleResult =  articleResult.hits.hit;
                            }    
                            component.set("v.articleList", articleResult);
                        }else{
                            component.set("v.isData", false);//No data   
                        }
                    }else{
                        component.set("v.isData", false);      
                    }
                }
            }
        };
        xmlHttp.send( null );
    },
    //Funciton used to load the knowledge base window holding the session values
    loadKnowledgeBaseWindow : function(component, event, searchTerm){       
        if (!window.knowledgeBase || window.knowledgeBase.closed) {
            window.knowledgeBase =  window.open("/c/KnowledgeBaseApplication.app","knowledgebaseArticles","toolbar=yes,scrollbars=yes,resizable=yes");
            //Setting timeout for initial load
            setTimeout(function() {
                window.knowledgeBase.postMessage(searchTerm);
            }, 2500);//Should always be 1.5 sec
        }else{
            //Focusing the opened wnidow
            window.knowledgeBase.focus();
            window.knowledgeBase.postMessage(searchTerm);//Posting the selected article
        }
    },
})