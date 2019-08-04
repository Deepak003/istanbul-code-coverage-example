({
	playerAccountSearch: function(component, event) {
         var searchAction = component.get('c.doAccountSearch'),
             plSearchSpinner = component.find('plSearchSpinner'),
             filterType = component.get('v.filterSelection'),
             searchVal = component.get('v.searchVal');
         
        if (searchVal) {
            searchVal = searchVal.trim();
        }
        //Check if the strType is EMAIL and its a partial search
        if (filterType == 'Email' && searchVal && searchVal.indexOf('@') < 0) {
            searchVal = searchVal +'*';
        }
        var openTabsInfo = window.localStorage.getItem('openTabsInfo'),
            tabId = '';
        openTabsInfo = JSON.parse(openTabsInfo);
        if (openTabsInfo) {
            for(var item of openTabsInfo) {
                if (item.tabNo == searchVal) {
                    tabId = item.tabId;
                    break;
                }
            }
        }
        if (tabId) {
            var workspaceAPI = component.find("workspace");
            if (workspaceAPI) {
                workspaceAPI.focusTab({tabId : tabId});
            }
            return;
        }
        //Spinner
        $A.util.removeClass(plSearchSpinner, 'slds-hide');
        var gameName = component.get('v.gameName');
       //  gameName = 'madden-nfl-overdrive';
        //filterType = 'MaddenMobileId';
        if (gameName) {
            //doGamerDetailsSearch(String strID, String strIDType)
            searchAction = component.get('c.doGamerDetailsSearch');
            searchAction.setParams({"strID": searchVal, "strProductName":gameName});
        }
        else if (filterType == 'CaseNumber' || filterType == 'Id' || filterType == 'PetitionUUID') {
            searchAction = component.get('c.getCaseByCaseIdorCaseNumber');
            if (filterType == 'PetitionUUID') {
                filterType = 'Petition_Details__r.PetitionUUID__c';
            }
            searchAction.setParams({"strFilter": filterType,  "strFilterVal" :searchVal });
        }        
        else {
            searchAction.setParams({
            "strSearchValue": searchVal,
            "strIDType": filterType,
            "strNameSpace":null});
        }
        
        //CallBack 
        component.set('v.searchVal', '');
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.addClass(plSearchSpinner, 'slds-hide');
            if (state === "SUCCESS") {
            	var data = response.getReturnValue();
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                } 
                // If the Filter Type is Petition UUID and response is Null, do a search for account in OMNI
                /*if (filterType === "Petition_Details__r.PetitionUUID__c" && data === null) {
                    this.getTargetAccountOMNI(component);
                    return;
                }*/ 
                // Disabled the auto Complete
                if (document.getElementById('playersearchInput')) {
                    document.getElementById('playersearchInput').setAttribute('autocomplete', 'off');
                }
                if (document.getElementById('playerfilter')) {
                    document.getElementById('playerfilter').setAttribute('autocomplete', 'off');
                }
                if (filterType == 'CaseNumber' && !data) {
                    this.getArchivedCaseDetail(component, searchVal);
                    return;
                }
                if (!data) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                if (data.length) {
                    var dataToDisplay = [];
                    if (filterType === 'gameId') {
                        window.localStorage.setItem('gamerSearchData', JSON.stringify(data));
                    }
                    for(var item of data ) {
                        if (filterType === 'Email') {
                            dataToDisplay.push({'label': item.email, value: item.id});
                        }
                        else if(filterType === 'gameId' && item.id !== null) {
                            dataToDisplay.push({'label': item.id + ' ' + item.idType, value: item.id});
                        }
                    }
                    if (dataToDisplay.length) {
                        component.set('v.searchDataList', dataToDisplay);
                        var searchResutlsDropDown = component.find('searchResutlsDropDown');
                        $A.util.addClass(searchResutlsDropDown, 'slds-is-open');
                    }
                    else {
                        this.displayToastMsg('error', 'No records found for your search criteria.');
                        return;
                    }
                }
                else {
                    if ((data.response && !data.response.length) || (data.status && data.status.toLowerCase() == 'error')) {
                        this.displayToastMsg('error', 'No records found for your search criteria.');
                        return;
                    }
                    var workspaceAPI = component.find("workspace");
                    
                    var evt = $A.get("e.force:navigateToComponent");
                    if (filterType == 'CaseNumber' || filterType == 'Id' || filterType == 'Petition_Details__r.PetitionUUID__c') {
                        evt.setParams({
                            componentDef : "c:PetitionDetail",
                            componentAttributes: {
                                simpleCase : data,
                                searchCaseFlg : true
                            }                        
                        });                        
                    }
                    else {
                        evt.setParams({
                            componentDef : "c:Account",
                            componentAttributes: {
                                simpleRecord : data,
                                accountSearch : true
                            }                        
                        });
                    }                    
                    
                    evt.fire();
                }
            }
            else if(state == 'ERROR') {
                this.displayToastMsg('error', 'No records found for your search criteria.');                 
    			console.log('ERROR PS:'+response.getError()[0].message);
            }            
        });
        $A.enqueueAction(searchAction);
    },
    loadGamerAccout: function(component, event, idType) {
        var searchAction = component.get('c.getGamerAccountFromSF'),
            plSearchSpinner = component.find('plSearchSpinner'),
            filterType = component.get('v.filterSelection'),
            searchVal = component.get('v.searchVal');
        //getGamerAccountFromSF('100007', 'MaddenMobileId'));
        searchAction.setParams({"strID": searchVal, "strIDType":idType});
        //CallBack
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.addClass(plSearchSpinner, 'slds-hide');
            if (state === "SUCCESS") {
            	var data = response.getReturnValue();
                var gamerData = window.localStorage.getItem('gamerSearchData');
                gamerData = JSON.parse(gamerData);
                for(var gameData of gamerData) {
                    if(gameData.id == searchVal) break;
                }
                gameData.strSFAccountId = data
                //if (typeof data !== 'object') {
                //    data = JSON.parse(data);
                //} 
                // Disabled the auto Complete
                if (document.getElementById('playersearchInput')) {
                    document.getElementById('playersearchInput').setAttribute('autocomplete', 'off');
                }
                if (document.getElementById('playerfilter')) {
                    document.getElementById('playerfilter').setAttribute('autocomplete', 'off');
                }
                if (!data) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                if ((data.response && !data.response.length) || (data.status && data.status.toLowerCase() == 'error')) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                var workspaceAPI = component.find("workspace");               
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:Account",
                    componentAttributes: {
                        simpleRecord : gameData,
                        accountSearch : true,
                        gamerDataFlag : true
                    }                        
                });
                evt.fire();
            }
        });
        $A.enqueueAction(searchAction);
    },
    windowClicked: function(component, event) {
        //console.log('Window Clicked');
        event.stopPropagation();
        if (event.target && !event.target.closest('.plsearch-wrapper')) {
            var playerFilterLB = component.find('playerFilterListBox');
            $A.util.removeClass(playerFilterLB, 'slds-is-open');
            var searchResutlsDropDown = component.find('searchResutlsDropDown');
            $A.util.removeClass(searchResutlsDropDown, 'slds-is-open');
        }        
    },
    autoCompForceOff: function(component) {
      // Making AutoComplete Off  plfilterInput plSearchInput
      var playersearchInput = window.document.getElementById('playersearchInput'),
          playerfilter = window.document.getElementById('playerfilter'),
          plSearchbyNameList = window.document.getElementsByName('plSearchInput'),
          plFilterByNameList = window.document.getElementsByName('plfilterInput');
       if (plSearchbyNameList && plSearchbyNameList.length) {
            for(var item of plSearchbyNameList) {
                item.setAttribute('autocomplete', 'off');
            }
       }
       if (plFilterByNameList && plFilterByNameList.length) {
            for(var item of plFilterByNameList) {
                item.setAttribute('autocomplete', 'off');
            }
       }
       if (playersearchInput && playersearchInput.getAttribute('autocomplete') !== 'off') {
            playersearchInput.setAttribute('autocomplete', 'off');
       }
       if (playerfilter && playerfilter.getAttribute('autocomplete') != 'off') {
            playerfilter.setAttribute('autocomplete', 'off');
       }  
    },
    displayToastMsg: function(type, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "message": msg,
            "type": type
        });
        toastEvent.fire();
    },
    getfilterOptions: function(component) {
        /*var searchAction = component.get('c.getPlayerSearchValues');
        searchAction.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") {
            	var data = response.getReturnValue(),
                    playerFilterOptions = [];
                if (typeof data === "object") {
                    window.searchFilterOptions = data;
                    for (var item in data) {                        
                        playerFilterOptions.push({'label': item, 'value': item})
                    }
                }
                if (playerFilterOptions && playerFilterOptions.length) {
                    //component.set('v.filterOptions', playerFilterOptions);
                }
                console.log(data);
            }
            else {
                console.log('Error');
            }
        });
        $A.enqueueAction(searchAction);*/
    },
    getGamerProducts: function(component) {
        var mobileTiles = component.get('c.getProductsForGamerID');
        mobileTiles.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") {
                var data = response.getReturnValue(),
                    playerFilterOptions = [];
                if (typeof data === "object") {
                    var dataToDisplay = [];
                    for(var item in data ) {
                        dataToDisplay.push({'label': item, value: data[item]});
                    }
                    //Sorting the fields
                    dataToDisplay.sort(this.sortByField('label', 'asc'));
                                        
                    component.set('v.gamerDataList', dataToDisplay);                    
                } 
                console.log('Sucess');
            }
            else {
                console.log('Error');
            }
        });
        $A.enqueueAction(mobileTiles);
    },
    searchGamerIdentityProduts: function(component, gamerIdType) {
        var searchAction = component.get('c.getProductsForGamerID');
        searchAction.setParams({"strGamerIdentityType" :gamerIdType});
        searchAction.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") {
            	var data = response.getReturnValue(),
                    playerFilterOptions = [];
                if (typeof data === "object") {
                    var dataToDisplay = [];
                    for(var item in data ) {
                        dataToDisplay.push({'label': item, value: data[item]});
                    }
                    component.set('v.gamerDataList', dataToDisplay);
                    if (dataToDisplay && dataToDisplay.length)
                    	component.set('v.gameName', dataToDisplay[0].value);
                	var gamerDropdown = component.find('gamerDropdownOuter');                    
                    $A.util.removeClass(gamerDropdown, 'slds-hide');
                }              
                //console.log(data);
            }
            else {
                console.log('Error');
            }
        });
        $A.enqueueAction(searchAction);
    },
    getTargetAccountOMNI : function(component) {		
        var mergedPetiAction = component.get("c.getPetitionRequestsByUUID"),
            petitionUuid = component.get('v.searchVal');
			mergedPetiAction.setParams({strPetitionUUId : petitionUuid});
			mergedPetiAction.setCallback(this, function(response) {
            var state = response.getState();   
            if (state === "SUCCESS") {  
				var data = response.getReturnValue();
                if (data && data.length) {
                    component.set('v.filterSelection', nucleusId),
             		component.set('v.searchVal', data[0].targetUserId);
                    this.playerAccountSearch(component);
                }
				component.set("v.mergedpetList", data);                
            }
            else {
                console.log("Getting mergedPetiAction failed with state: " + state);
            }
        });
        $A.enqueueAction(mergedPetiAction);
	},
    sortByField: function(fieldName, order) {
        return function(a, b) {
            if(!a.hasOwnProperty(fieldName) || !b.hasOwnProperty(fieldName)) {
                // property doesn't exist on either object
                return 0; 
            }
            var compFlag = 0;
            if (a[fieldName] > b[fieldName])
            compFlag = -1;
            if (a[fieldName] < b[fieldName])
            compFlag = 1;
            return (
                (order == 'asc') ? (compFlag * -1) : compFlag
            );
        }		
     },
    //Archived Petition Case
    getArchivedCaseDetail: function(component, searchVal) {
        var searchAction = component.get('c.getCaseByCaseNumber'),            
            filterType = 'CaseNumber',
            plSearchSpinner = component.find('plSearchSpinner'),
            searchVal = searchVal;
        
        $A.util.removeClass(plSearchSpinner, 'slds-hide');
        searchAction.setParams({"strFilter": filterType,  "strFilterVal" :searchVal });
        
        searchAction.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.addClass(plSearchSpinner, 'slds-hide');
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                } 
                if (!data) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                if (typeof data === 'object' && !data.caseNumber) {
                    this.displayToastMsg('error', 'No records found for your search criteria.');
                    return;
                }
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:PetitionDetail",
                    componentAttributes: {
                        simpleCase : data,
                        searchCaseFlg : true,
                        petitionArchivedFlag : true
                    }                        
                });
                evt.fire();
            }
        });
        $A.enqueueAction(searchAction);
    }
})