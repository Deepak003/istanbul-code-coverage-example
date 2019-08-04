({
    searchHelper : function(component,event,getInputkeyWord) {    
        // call the apex class method         
        var ObjectName = component.get("v.objectAPIName"),
            action = '',
            allRecords = component.get("v.listOfSearchRecordsLast"),
            evType = component.get("v.eventType");
        try {
            action = component.get("c."+ObjectName);
        }
        catch (error) {
            //console.log(error);
        }
        if (allRecords.length ==0) {            
            allRecords = component.get("v.listOfSearchRecords");
            component.set("v.listOfSearchRecordsLast", allRecords);
        }
        
        // set param to method  
        /*action.setParams({
            'searchKeyWord': getInputkeyWord,
            'ObjectName' : component.get("v.objectAPIName")
        });*/
        // set a callBack    
        if (allRecords.length) {           
            var searchRecords = this.searchRecords(allRecords, getInputkeyWord);
            if (searchRecords.length) {
                component.set("v.listOfSearchRecords", searchRecords);
                component.set("v.Message", '');
            }
            else {
                component.set("v.Message", 'No Result Found...');
                component.set("v.listOfSearchRecords", []);
            }
            if (!getInputkeyWord) {
                component.set("v.listOfSearchRecords", allRecords);
                component.set("v.Message", '');
            }
        }
        else {
            if (action) {
                if (evType == 'platform' || evType == 'category') {
                    var prodName = component.get("v.sRecord");
                    if (prodName != undefined) {
                        action.setParams({
                            'productId': prodName.Id,
                            'categType': window.createCaseOption?window.createCaseOption:''
                        });
                    }  
                    else {
                        console.log('Select a product');
                    }
                }

                if (evType == 'subCategory') {
                    var categoryName = component.get("v.sRecord");
                    if (categoryName != undefined) {
                        action.setParams({
                            'categoryId': categoryName.Id,
                            'categType': window.createCaseOption?window.createCaseOption:''
                        });
                    }  
                    else {
                        console.log('Select a Category');
                    }
                }
                
                $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
                
                action.setCallback(this, function(response) {
                    $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
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
                    }
                    
                });
                // enqueue the Action  
                $A.enqueueAction(action);
            }            
        }        
    },
    
    searchRecords: function(records, getInputkeyWord) {
        /*
        var searchRecords = [];
        for(var i=0; i<records.length;i++) {
            if (getInputkeyWord && records[i].Name.toLowerCase().indexOf(getInputkeyWord.toLowerCase()) >=0) {
                searchRecords.push(records[i]);
            }
        }
        return searchRecords;
        */
        
        if(getInputkeyWord) {
            // one time "toLowerCase"
            const getInputkeyWordInLowerCase = getInputkeyWord.toLowerCase();
            return records.filter( (record)=> record.Name.toLowerCase().startsWith( getInputkeyWordInLowerCase ) );
        }        
        return [];
    },
    
    triggerEvent: function(component, event, evType, selRecord, clearObjFlag) {
        if (evType == 'product' || evType == 'productAccStatus' /* || evType == 'category' */) {
            var appProdEvent = $A.get("e.c:ProductSelectEventApp");
            if (appProdEvent != undefined) {                
                appProdEvent.setParams({
                    productObj : selRecord,
                    clearObjFlag: clearObjFlag,
                    evType: evType
                });
                appProdEvent.fire();                
            }            
        }
    }
})