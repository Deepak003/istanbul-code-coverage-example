({
    //Function used to find if the search term is a email
    findIfEmail: function(component, event, searchType) {
        return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(component.get("v.searchVal"));
    },
    //Function used to find if the search term is a case
    findIfCase: function(component, event, searchType) {
        return /^[0-9]*$/.test(component.get("v.searchVal").trim());
    },
    //Funciton used to search for the player account
    playerAccountSearch: function(component, event, searchType, searchVal) {
        var action = component.get('c.doAccountSearch');
        var workspaceAPI = component.find("workspace");
        var resultUrl ='/lightning/n/GlobalSearchResult';
        var strSearchVal = searchVal ? searchVal : component.get("v.searchVal").trim();
        component.set("v.issearching", true);
        //Reset the local storage
        window.localStorage.setItem('searchData', []);
        if (searchType === 'Email' && !this.findIfEmail(component, event)) {
            strSearchVal = strSearchVal + '*';
        }
		if(searchType == "PersonaNamespace") {
            strSearchVal = encodeURIComponent(strSearchVal);
        } 
        action.setParams({
            strSearchValue : strSearchVal,
            strIDType : searchType,
            strNameSpace : component.get("v.selectNamespace")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.issearching", false);
            if (state === "SUCCESS") {
                window.localStorage.setItem('searchDataVal', component.get("v.searchVal").trim());
                component.set("v.searchVal", ""); //Clearing the search term once success
                component.set("v.selectNamespace", ""); //Clearing the namespace once success
                var storeResponse = response.getReturnValue(), 
                	emailHistory = [],
                    searchResults = [];
                //Check if the results han multiple accounts
                if (typeof storeResponse !== 'object') {
                    storeResponse = JSON.parse(storeResponse);
                }
                //Check if the results has email history
                if (storeResponse != null && storeResponse.emailAccountHistoryList && storeResponse.emailAccountHistoryList.length) {
                    emailHistory = storeResponse.emailAccountHistoryList;
                }
                if (storeResponse != null && (!storeResponse.strSFAccountId || !storeResponse.customerId) && emailHistory.length) {
                    for(var i=0; i<emailHistory.length; i++) {
                        var searchObj = {'fullName': emailHistory[i].name,
                                         'email': emailHistory[i].email,
                                         'priorEmail': emailHistory[i].formerEmail,
                                         'id': emailHistory[i].id,
                                         'country': emailHistory[i].country,
                                         'dob': '',
                                         'type': 'Nucleus'
                                        };
                        searchResults.push(searchObj);
                    }
                    window.localStorage.setItem('searchData', JSON.stringify(searchResults));
                    resultUrl='/lightning/n/GlobalSearchResult';
                }
                //Handling errors
                else if(storeResponse != null && storeResponse.length === undefined && storeResponse.strSFAccountId){
                    resultUrl='/lightning/r/Account/'+storeResponse.strSFAccountId+'/view';
                }else if(storeResponse != null && storeResponse.length !== 0){                    
                    var resultLength = storeResponse.length > 20 ? 20 : storeResponse.length;
                    for(var i=0; i<resultLength; i++) {
                        var fullname = storeResponse[i].firstName + ' ' + storeResponse[i].lastName;
                        if (!fullname.trim()) {
                            fullname = 'UNKNOWN'; //storeResponse[i].persona;
                        }
                        var emailPrior = storeResponse[i].emailAccountHistoryList ? storeResponse[i].emailAccountHistoryList[0].email : '';
                        var searchObj = {'fullName': fullname,
                                         'email': storeResponse[i].email,
                                         'priorEmail': emailPrior,
                                         'id': storeResponse[i].id,
                                         'country': storeResponse[i].country,
                                         'dob': storeResponse[i].dob,
                                         'type': 'Nucleus'
                                        };
                        searchResults.push(searchObj);
                    }
                    window.localStorage.setItem('searchData', JSON.stringify(searchResults));
                    resultUrl='/lightning/n/GlobalSearchResult';
                }           
                
            }
			else {
                window.localStorage.setItem('searchData', '');                
            }
            //Opening the tab using workspace API
            workspaceAPI.openTab({
                url: resultUrl,
                focus: true
            }).then(function(response) {
                if (resultUrl.indexOf('GlobalSearchResult') >=0) {
                    workspaceAPI.setTabLabel({
                        tabId: response,
                        label: 'Search Results'
                    });
                    //tab icon
                    workspaceAPI.setTabIcon({
                        tabId: response,
                        icon: "standard:search",
                        iconAlt: 'search result'
                    });
                    workspaceAPI.refreshTab({
                        tabId: response
                    });
                }                
                
            }).catch(function(error) {
                console.log(error);
            });
        });
        $A.enqueueAction(action);
    },
    //Funciton used to search for the case
    caseSearch: function(component, event) {
        var action = component.get('c.doCaseSearch');
        var workspaceAPI = component.find("workspace");
        var resultUrl = '/lightning/n/GlobalSearchResult';
        component.set("v.issearching", true);
        action.setParams({
            strSearchValue : component.get("v.searchVal").trim()
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.issearching", false);
            if (state === "SUCCESS") {
                component.set("v.searchVal", ""); //Clearing search if success
                var storeResponse = response.getReturnValue();   
                //Handling errors
                if (storeResponse.IsArchived == "true") {
                    var caseData=JSON.parse(storeResponse.CaseNumber);
                    
                    workspaceAPI.openTab({
                        focus: true,
                        pageReference: {
                            "type": "standard__component",
                            "attributes": {
                                "componentName":"c__TSMAccountWrapper"
                            },                          
                            "state": Object.assign({}, {
                                c__archivedCaseId: caseData.strCaseNumber,
                                c__sfAccountId: caseData.strAccountId
                            })
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                } else {
                    if(storeResponse != null) {
                        resultUrl='/lightning/r/Case/'+storeResponse.Id+'/view';
                    } else {
                        resultUrl='/lightning/n/GlobalSearchResult';
                    }
                    //Funciton used to open the tab using workspace api
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
            }
			else {
                window.localStorage.setItem('searchData', '');
            
                //Opening the tab using workspace API
                workspaceAPI.openTab({
                    url: resultUrl,
                    focus: true
                }).then(function(response) {
                    if (resultUrl.indexOf('GlobalSearchResult') >=0) {
                        workspaceAPI.setTabLabel({
                            tabId: response,
                            label: 'Search Results'
                        });
                        //tab icon
                        workspaceAPI.setTabIcon({
                            tabId: response,
                            icon: "standard:search",
                            iconAlt: 'search result'
                        });
                        workspaceAPI.refreshTab({
                            tabId: response
                        });
                    }                
                    
                }).catch(function(error) {
                    console.log(error);
                });
            }

        });
        $A.enqueueAction(action);        
    },
    //Funciton used to check for search type if Persona Name
    checkPersonaName: function(component, event, selectedMenuItemValue) {
        //Toggle the name space combobox based on the type
        if(selectedMenuItemValue == 'PersonaNamespace'){
            $A.util.removeClass(component.find("select-namespace"), 'slds-hide');
        }else{
            $A.util.addClass(component.find("select-namespace"), 'slds-hide'); 
        }
    },
    //Funciton used t validate the search criteria
    searchValidity: function(component, event) {
        var searchCriteria = component.get("v.filterSelection");
        var personaNameSpace = component.get("v.selectNamespace");
        var returnValue = true;
        //Checking for search criteria if persona and has a namesapce else prevent the search
        if(searchCriteria == "PersonaNamespace" && personaNameSpace == ""){
            returnValue = false;
			this.showMessageforSearch(component, 'Please select a persona namespace.', 'warning');
        }
        return returnValue; //Returns true if all the criteria meets
    },
    loadNameSpace: function(component, event){
        var namespaceList = ['cem_ea_id','All','Anonymous','agc','assault','assault_closed','assault_web','assault_web_closed','basemsg','battlefield','battleforge','battleforgeint','bfbc2_iphone','bfheroes','bfheroes_closed','bfheroes_closed_web','bfheroes_web','bioware','charmgirlsclub','chillingo_temp','cnc','cnc4','cnc_live','cnc_ra3_epd','cnc_web','cncweb','cncweb-anonymous','cncweb-worlds','coderedeem','description','dragonage','ds2','dungeonkeeper','ea2d','eacreate','eadm-ebisu','eadp_originc','eagl-dragonage2d','eagl-mirrorsedge2d','eamobile','eap_reckoning','easw','ebisu','facebook','facebook-tw','facebook_eacom','fifa11_iphone','fifa_online','fifa_online_west','fifamanager','fifaworld','fussballfan','lordofultima','lordofultima-worlds','lotr_conquest','lpso','lpso_eu','masseffect','moh','moha2','msf.nfsw.tw','msona','mysims','mythic','namespace2','nfs','nfs-iphone','nfs_web','nfsw-cb2','nfsw-cb3','nfsw-cb4','nfsw-cb5','nfsw-cb6','nfsw-live','nfsw-ob','nfsw-ob2','nfsw-ob3','p4f_central_victory','pogo','pogo_cem_ea_id_prod','pogo_prod','pqrs','ps3','psp','rockband','rockband_android','rupture','simcity','sims_macg','simsolympus','simsweb','spore','sporelabs','sporemobile','thesims','tiberium','tigermobile','trvp','twitter','virtual_me','warhammer','wii','wiiu','xbox','nx'];
        var reformattedArray = namespaceList.map(object =>{ 
            var retrunObject = {};
            retrunObject["label"] = object; 
            retrunObject["value"] = object;
            return retrunObject;
        });
        return reformattedArray;
    },
	showMessageforSearch: function (component, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({                    
            "message": message,
            "type": type
        });                
        toastEvent.fire();
    },
})