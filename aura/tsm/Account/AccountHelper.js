({
	getUserEntitlemnts : function(component) {
		var action = component.get("c.getProductsByAccount"),
            spinner = component.find('accDetailSpinner'),
            prodObj = {}, 
            prodList = [],
            franchiseList =[],
            prodKeys;;
        action.setParams({
            "strNucleusId": component.get('v.simpleRecord').id,
            "sNoCache": false,
        });
        window.productsToDisplay = [];
        // Here we are receiving response from Apex Aura Enabled method.
        $A.util.removeClass(spinner, "slds-hide");
        action.setCallback(this, function(response) {
            //alert(response.getState());
            $A.util.addClass(spinner, "slds-hide");
            var state = response.getState();
            if (state === "SUCCESS") {
               var data = JSON.parse(response.getReturnValue()),
                prodKeys = Object.keys(data);
                for (var i=0; i<prodKeys.length; i++) 
                {	//manipulating and storing the product data
                    var prodName = data[prodKeys[i]].displayName?data[prodKeys[i]].displayName:data[prodKeys[i]].name,
                        prodId = data[prodKeys[i]].name;                    
                    prodObj = {Id: prodId, Name: prodName};
                    prodList.push(prodObj);
                }
				prodObj = {Id:'defaultCRMProduct', Name:'Other'};
                    prodList.push(prodObj);
				var franchiseForProducts = {Id:null,Name:'FIFA'};
                component.set("v.productList",prodList);
                component.set("v.franchiseList",franchiseForProducts);
                //window.productsToDisplay = prodList;
                //window.franchiseForProducts = {Id:null,Name:'FIFA'};                
            }
            else
            {                
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
         
        $A.enqueueAction(action);
	},
    // calculates total time (in years) spent as a customer 
    getAgeAt: function (durationAsEAMember) {
        if (!durationAsEAMember) {
            return;
        }
        var today = new Date(),
            birthDate = new Date(durationAsEAMember.replace('T', ' ')),
            todayTime = today.getTime(),
            birthDateTime = birthDate.getTime(),
            timeDiffDate = todayTime - birthDateTime,
            timeDaysinMs = 1000*60*60*24,
            daysInMs = '',
            yearsAge = '',
            daysAge = '';
        
        if (timeDiffDate) {
            daysInMs = timeDiffDate/timeDaysinMs;
        }
        if (daysInMs) {
            yearsAge = Math.floor(daysInMs/365) + ' years';
        }
        // Calculate the days
        daysAge = Math.floor(daysInMs%365) + ' days';
        
        return yearsAge + ' ' + daysAge;
    },
    
    focusTab: function(component, tabId) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.focusTab({tabId : tabId});
    },
    focusTabtoQueue: function(component) {
        var workspaceAPI = component.find("workspace"),
            item = '';
        workspaceAPI.getAllTabInfo().then(function(responseAll) {
            for (item of responseAll) {                    
                if (item && item.pageReference.attributes.apiName ) {
                    workspaceAPI.focusTab({tabId : item.tabId});
                }
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
})