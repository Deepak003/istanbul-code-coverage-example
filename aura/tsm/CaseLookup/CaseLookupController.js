({
    onfocus : function(component,event,helper) {
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes"),
            getInputkeyWord = component.get("v.SearchKeyWord");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC  
        helper.searchHelper(component,event,getInputkeyWord);
    },
    onblur : function(component,event,helper){       
        //component.set("v.listOfSearchRecords", null );
        /*var forclose = component.find("searchRes"),
            selRecord = component.get("v.oRecord"),
            searchWord = component.get("v.SearchKeyWord"),
            selRecordsAll = component.get("v.listOfSearchRecords");
        if (selRecordsAll.length && searchWord) {            
            var searchRecords = helper.searchRecords(selRecordsAll, searchWord);  
            if (!searchRecords.length) {
                component.set("v.SearchKeyWord", '');
            }
        }
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');*/

        const forclose = component.find("searchRes");
        $A.util.removeClass(forclose, 'slds-is-open');
        $A.util.addClass(forclose, 'slds-is-close');
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord"),
            tpFlag = component.get('v.tpFlag');
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 2 && !tpFlag){
            component.set('v.tpFlag', true);
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
            //component.set("v.listOfSearchRecords", null ); 
            $A.util.toggleClass(component.find('searchIcon'), 'slds-hide');
        	$A.util.toggleClass(component.find('closeIcon'), 'slds-hide');
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
             //var appProdEvent = $A.get("e.c:ProductSelectEventApp");
            //if (appProdEvent != undefined) { 
            //    appProdEvent.fire();                
            //}
           
        }
    },   
    // function for clear the Record Selection 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );   
    },    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        // get the selected Account record from the COMPONETN event 	 
        //var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        //component.set("v.selectedRecord" , selectedAccountGetFromEvent); 
        
        var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
        
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
        var lookUpTarget = component.find("lookupField");
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');  
        
    },  
    selectRecord : function(component, event, helper){      
        // get the selected record from list  
        var recordsAll = component.get("v.listOfSearchRecords"),
            recordId = event.currentTarget.getAttribute('data-id'),
            evType = component.get("v.eventType");
        component.set('v.SearchKeyWord', event.currentTarget.innerText);
        //$A.util.toggleClass(component.find('searchIcon'), 'slds-hide');
        //$A.util.toggleClass(component.find('closeIcon'), 'slds-hide');
        var getSelectRecord = component.get("v.oRecord"),
            oldSeletedRec = getSelectRecord,
            clearObjFlag = false;
        for(var i =0; i< recordsAll.length; i++) { 
            if (recordsAll[i].Id == recordId) {
                getSelectRecord = recordsAll[i];
                break;                
            }
        }
        clearObjFlag = oldSeletedRec != getSelectRecord ? true : clearObjFlag;
        component.set("v.oRecord", getSelectRecord);
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
        // call the event
        helper.triggerEvent(component, event, evType, getSelectRecord, clearObjFlag);
        
    },
    productSelectEvent: function(component, event, helper) {       
        var evType = component.get("v.eventType"),
            clearObjFlag = event.getParam("clearObjFlag"),
            dependentEVType = component.get("v.dependentEVType");
        if (clearObjFlag && evType != 'product' && evType != 'productAccStatus' ) {            
            component.set("v.listOfSearchRecordsLast", []);
            component.set("v.listOfSearchRecords", []);
        }
        if (dependentEVType) {
            component.set('v.SearchKeyWord', '');
        }
        if (evType == 'platform' || evType == 'category') {
            component.set("v.sRecord", event.getParam("productObj"));           
        }

        // if(event.getParam("evType") == dependentEVType) {
        //     component.set("v.sRecord", event.getParam("productObj"));
        // }


    },
    closeIconClick: function(component, event, helper) {
        component.set("v.SearchKeyWord", '');
        component.set("v.oRecord", {});
        $A.util.toggleClass(component.find('searchIcon'), 'slds-hide');
        $A.util.toggleClass(component.find('closeIcon'), 'slds-hide');
    },
    searchIconClick: function(component, event, helper) {
	
	},
    updateListOfSearchRecordsOrderByLastViewedDate:  function(component, event, helper) {
        const list = component.get("v.listOfSearchRecords");
        let sortedList = [];
        
        if(component.get('v.eventType')=="product"){
            sortedList = list.slice().filter((l)=>l.LastViewedDate).sort((a,b)=> new Date(a.LastViewedDate) - new Date(b.LastViewedDate));
        }

        // if sortedList is empty then set list value
        component.set("v.listOfLastViewed", sortedList.length ? sortedList.splice(0,5) : list);
    },
    handleEmpty : function(component, event, helper) {
        if(!event.getParam("value")){
            component.set("v.oRecord", '');    
        }        
    }
})