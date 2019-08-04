({
	//Funciton used to search for the player account
    playerAccountSearch: function(component, event, searchType, searchVal) {
        var action = component.get('c.doAccountSearch');
        var workspaceAPI = component.find("workspace");
        var resultUrl ='/lightning/n/SearchResult';
        var strSearchVal = searchVal ? searchVal : component.get("v.searchVal");
        //component.set("v.issearching", true);
        //Reset the local storage
        
        action.setParams({
            strSearchValue : strSearchVal,
            strIDType : searchType,
            strNameSpace : component.get("v.selectNamespace")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.isLoading', false);
            
            if (state === "SUCCESS") {
                component.set("v.searchVal", ""); //Clearing the search term once success
                component.set("v.selectNamespace", ""); //Clearing the namespace once success
                var storeResponse = response.getReturnValue(); 
                //Check if the results han multiple accounts
                if (typeof storeResponse !== 'object') {
                    storeResponse = JSON.parse(storeResponse);
                }
                //Handling errors
                if(storeResponse != null && storeResponse.length === undefined){
                    resultUrl='/lightning/r/Account/'+storeResponse.strSFAccountId+'/view';
                }else{
                    window.localStorage.setItem('searchData', JSON.stringify(storeResponse));
                    resultUrl='/lightning/n/SearchResult';
                }            
                //Opening the tab using workspace API
                workspaceAPI.openTab({
                    url: resultUrl,
                    focus: true
                }).then(function(response) {
                    workspaceAPI.getTabInfo({
                        tabId: response
                    }).then(function(tabInfo) {
                        console.log("The recordId for this tab is: " + tabInfo.recordId);
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            }
            else {
                var toastEvent = $A.get("e.force:showToast");
                var errorMsg = response.getError()[0] ? response.getError()[0].message : 'Error occured, Please contact system adminstrator.';
                toastEvent.setParams({                    
                    "message": errorMsg,
                    "type": 'warning'
                });                
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
})