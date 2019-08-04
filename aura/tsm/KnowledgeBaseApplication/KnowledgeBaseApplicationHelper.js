({
    //Function used to create params for the articles - KnowlwdgeArticles with default params
    constructArticleParameter : function(component, event, selectedUrl){
        //Defining the parser
        var paramsSolr = {};
        var fq = {}; //For the inner query attributes
        
        paramsSolr['partial'] = true;
        paramsSolr['q.parser'] = 'lucene';
        paramsSolr['start'] = 0;
        
        //Defaulting the options
        paramsSolr['q.options'] = '{"defaultOperator":"and",fields:["url"]}';
        
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
        var query = selectedUrl;        
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
        var url = $A.get("$Label.c.TSM_KB_QA_URL")+endPoint;
        xmlHttp.open( "GET", url, true );
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.responseType = 'text';
        xmlHttp.onload = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    var articleResult = JSON.parse(xmlHttp.response);
                    if(articleResult.hits != undefined){
                        if(articleResult.hits.found > 0){
                            component.set("v.selectedArticle",articleResult.hits.hit[0]);//Setting the first result in the selected article to open the tab in sub tab
                        }
                    }
                }
            }
        };
        xmlHttp.send( null );
    },
})