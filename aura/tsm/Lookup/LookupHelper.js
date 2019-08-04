({
    searchHelper : function(component,event,getInputkeyWord,isInit) {        
        // call the apex class method         
        var ObjectName = component.get("v.objectAPIName"),
            action = '',
            allRecords = component.get("v.listOfSearchRecordsLast"),
            evType = component.get("v.eventType"),
			keypadEvent = component.get("v.keypadEvent"),
            searchKeyWord = component.get("v.SearchKeyWord"),
            getSelectRecord,
            dependentId = component.get('v.dependentId');
        component.set("v.Message", '');
        try {
            action = component.get("c."+ObjectName);
        }
        catch (error) {
            console.log(error);
            component.set("v.Message", 'No Result Found...');
        }      
        if (allRecords && allRecords.length ==0) {            
            allRecords = component.get("v.listOfSearchRecords");
            component.set("v.listOfSearchRecordsLast", allRecords);
        }        
        if (allRecords && allRecords.length) {           
            var searchRecords = this.searchRecords(allRecords, getInputkeyWord);
            if (searchRecords.length) {
                component.set("v.listOfSearchRecords", searchRecords);
                component.set("v.Message", '');
            }
            else {
				if(keypadEvent){
                    component.set("v.listOfSearchRecords", []);
                    component.set("v.Message", 'No Result Found...');
                }												
            }
            if (!getInputkeyWord) {
                component.set("v.listOfSearchRecords", allRecords);
                component.set("v.Message", '');
            }
        }
        else {
            if (action) {
                // set param to method
                if (evType == 'platform' || evType == 'category') {
                    var prodName = component.get("v.sRecord");
                    if (prodName != undefined) {
                        action.setParams({
                            'strProductId': prodName.Id
                        });
                    }  
                    else {
                        if (dependentId) {
                            action.setParams({
                                'strProductId': dependentId
                            });    
                        }
                        console.log('Select a product');
                    }
                }
                else if (evType == 'subCategory') {
                    const record= component.get("v.sRecord");
                    action.setParams({
                        'categoryId': record ? record.Id : ''
                    });
                }
                // set a callBack
                action.setCallback(this, function(response) {
                    $A.util.removeClass(component.find("mySpinner"), "slds-show");
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var storeResponse = response.getReturnValue();
                        // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                        if (storeResponse.length == 0) {
                            component.set("v.Message", 'No Result Found...');
                        } else {
                            component.set("v.Message", '');
                        }
                        // set searchResult list with return value from server.
                        if (evType == 'contentType') {
                            var CTRecords = [];
                            for(var i =0; i<storeResponse.length; i++) {
                                CTRecords.push({Id: storeResponse[i], Name: storeResponse[i]});
                            }
                            component.set("v.listOfSearchRecords", CTRecords);
                        }
                        else {
                            component.set("v.listOfSearchRecords", storeResponse);
                        }
                        if (isInit) {
                            var recordsAll = component.get("v.listOfSearchRecords");
                            getSelectRecord = recordsAll.find(function(pData, pindex) {
                                if (pData.Name == searchKeyWord) {                 
                                    return pData;
                                }
                            });
                            component.set("v.oRecord", getSelectRecord);
                        }
                    }
                    
                });
                // enqueue the Action  
                $A.enqueueAction(action);
            }            
        }        
    },
    
    searchRecords: function(records, getInputkeyWord) {
        var searchRecords = [];
        for(var i=0; i<records.length;i++) {
            if (getInputkeyWord && records[i].Name.toLowerCase().indexOf(getInputkeyWord.toLowerCase()) == 0) {
                searchRecords.push(records[i]);
            }
        }
        return searchRecords;
    },
    
    triggerEvent: function(component, event, evType, selRecord, clearObjFlag) {
        var appProdEvent = $A.get("e.c:ProductSelectEventApp");
        if (appProdEvent != undefined) {                
            appProdEvent.setParams({
                productObj : selRecord,
                clearObjFlag: clearObjFlag,
                evType: evType
            });
            appProdEvent.fire();                
        }
		var compEvent = component.getEvent("cmpProduct");
             if (compEvent != undefined) {                
                compEvent.setParams({
                    productObj : selRecord,
                    clearObjFlag: clearObjFlag,
                    evType: evType
                });
                compEvent.fire();                
            }
    },
    
    onBlur: function(component, event, helper) {
        var forclose = component.find("searchRes"),
            selRecord = component.get("v.oRecord"),
            searchWord = component.get("v.SearchKeyWord"),
            selRecordsAll = component.get("v.listOfSearchRecords"),
            isMouseOver = component.get('v.isMouseOver'),
            keypadEvent = component.get('v.keypadEvent');
        if (isMouseOver === false && keypadEvent === false) {
            if (selRecordsAll && selRecordsAll.length && searchWord) {            
                var searchRecords = helper.searchRecords(selRecordsAll, searchWord);  
                if (!searchRecords.length && !component.get("v.multipleSelect")) {
                    component.set("v.SearchKeyWord", '');
                }
            }
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
            component.set('v.isMouseOver', false);
            component.set('v.keypadEvent', false);
        }
    }
})