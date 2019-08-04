({
    getMarketingPromoEvents: function(component, event, helper,selComboVal){
            const action = component.get("c.getMarketingPromoEvents");

            action.setCallback(this,function(response){
                const state = response.getState();
                if(JSON.parse(response.getReturnValue()) != null){
                    if(JSON.parse(response.getReturnValue()).hits != null){
                        var result = JSON.parse(response.getReturnValue()).hits.hit;
                        for(var i=0; i<result.length; i++){
                            result[i].fields.last_modified_at = Util.getFormattedDateTime(result[i].fields.last_modified_at);
                        }
                        component.set("v.articaleUpdatedList" , result);
                        this.fetchFilteredData(component, event, helper,'',selComboVal);
                    }
                }
            });
            $A.enqueueAction(action);
    },
    fetchFilteredData: function(component, event, helper, searchText, dateFilter){
        var today = new Date();
        var thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        var thisMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var thisWeekStart = new Date(new Date().setDate(today.getDate() -today.getDay()));
        var thisWeekEnd = new Date(new Date().setDate(today.getDate() -(today.getDay()-6)));
        var toMonth;
        var fromMonth;
        var toDate;
        var fromDate;
        var fromlastmodifiedat;
        var Tolastmodifiedat;
        
        switch(dateFilter){
            case "week":
                toMonth = (thisWeekEnd.getMonth()+1) < 10 ? '0'+ (thisWeekEnd.getMonth() + 1) : '' + (thisWeekEnd.getMonth() + 1);
                fromMonth = (thisWeekStart.getMonth()+1) < 10 ? '0'+ (thisWeekStart.getMonth() + 1) : '' + (thisWeekStart.getMonth() + 1);
                toDate = (thisWeekEnd.getDate()) < 10 ? '0' + (thisWeekEnd.getDate()): '' + (thisWeekEnd.getDate());
                fromDate = (thisWeekStart.getDate()) < 10 ? '0'+(thisWeekStart.getDate()) : '' + (thisWeekStart.getDate());
                fromlastmodifiedat = thisWeekStart.getFullYear()+"-"+fromMonth+"-"+fromDate+"T00:00:00.000Z";
                Tolastmodifiedat = thisWeekEnd.getFullYear()+"-"+toMonth+"-"+toDate+"T00:00:00.000Z";
                console.log(fromlastmodifiedat);
                console.log(Tolastmodifiedat);
                break;
            case "day":
                fromMonth = (today.getMonth()+1) < 10 ? '0'+ (today.getMonth() + 1) : '' + (today.getMonth() + 1);
                fromDate = (today.getDate()) < 10 ? '0'+(today.getDate()) : '' + (today.getDate());
                fromlastmodifiedat = today.getFullYear()+"-"+fromMonth+"-"+fromDate+"T00:00:00.000Z";
                Tolastmodifiedat = today.getFullYear()+"-"+fromMonth+"-"+fromDate+"T23:59:59.999Z";
                console.log(fromlastmodifiedat);
                break;  
            default:
                toMonth = (today.getMonth()+1) < 10 ? '0'+ (today.getMonth() +1) : '' + (today.getMonth() +1);
                fromMonth = toMonth;
                fromDate = (thisMonthStart.getDate()) < 10 ? '0' + (thisMonthStart.getDate()): '' + (thisMonthStart.getDate());
                toDate  = (thisMonth.getDate()) < 10 ? '0'+(thisMonth.getDate()) : '' + (thisMonth.getDate());
                fromlastmodifiedat = thisMonth.getFullYear()+"-"+fromMonth+"-"+fromDate+"T00:00:00.000Z";
                Tolastmodifiedat = today.getFullYear()+"-"+toMonth+"-"+toDate+"T00:00:00.000Z";
                break;
        }
        
        var filteredLst = [];
        var articleList = component.get("v.articaleUpdatedList");
        console.log(Util.getFormattedDateTime(fromlastmodifiedat));
        console.log(Util.getFormattedDateTime(Tolastmodifiedat));
        for(var i=0; i<articleList.length; i++){
            if(articleList[i].fields.last_modified_at >= Util.getFormattedDateTime(fromlastmodifiedat) && 
               articleList[i].fields.last_modified_at <= Util.getFormattedDateTime(Tolastmodifiedat)){
                filteredLst.push(articleList[i]);
            }
        }
        if(searchText != ''){
            var searchFilters = [];
            for(var i=0; i<filteredLst.length; i++){
                if(filteredLst[i].fields.title.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1){
                    searchFilters.push(filteredLst[i]);
                }
            }
            filteredLst = searchFilters;
        }
        component.set("v.filteredEventsList",filteredLst);
        component.set("v.isData",true);
    },
    refreshEmergingIssues : function(component, event, helper) {
        component.set("v.timeCount",0);
    }, 
     loadKnowledgeBaseWindow : function(component, event, searchTerm){       
        if (!window.knowledgeBase || window.knowledgeBase.closed) {
            window.knowledgeBase =  window.open("/c/KnowledgeBaseApplication.app","knowledgebaseArticles","toolbar=yes,scrollbars=yes,resizable=yes");
            //Setting timeout for initial load
            setTimeout(function() {
                window.knowledgeBase.postMessage(searchTerm);
            }, 1500);        
        }else{
            //Focusing the opened wnidow
            window.knowledgeBase.focus();
            window.knowledgeBase.postMessage(searchTerm);//Posting the selected article
        }
    },
})