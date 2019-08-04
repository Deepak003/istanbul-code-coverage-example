({
	getCaseHistoryData : function(component) {       
        
    },
    //getAllCasesBySearchCriteria
    getAllCasesByAccIdSF: function(component) {
        var caseAllAction = component.get('c.getAllCasesForCustomerFromSF'),
            accountIdSF = component.get('v.accountIdSF'),
            pageNumber = component.get('v.pageNumber'),
            pageLimit = component.get('v.pageLimit'),
            pageNumberSF = pageNumber -1,
            caseListAll = component.get('v.historyData');//component.get('c.getAllCasesBySearchCriteria');
        /*caseAllAction.setParams({
                "strValue": component.get('v.accountIdSF'),                
            });*/
        if (pageNumberSF == 0) {
            caseListAll = [];
            component.set('v.historyData', []);
        }
        if (accountIdSF) {
            component.set('v.showSpinner', true);
            caseAllAction.setParams({
                "strAccountId": accountIdSF,
                "pageNumber": pageNumberSF.toString(),
                "pageLimit": pageLimit.toString()                
            });
            caseAllAction.setCallback(this, function(response) {
                var state = response.getState(),
                    caseList = response.getReturnValue(),
                    allRows = '',
                    displayCases = '',
                    pageNumber = component.get('v.pageNumber');
                //component.set('v.showSpinner', false);
                window.caseHistoryArchiveSF = true;
                if (caseList && caseList.length < 20) {
                    window.caseHistoryArchiveSF = false;
                    window.caseHistoryArchive = true;    
                    component.set('v.pageNumberArch', component.get('v.pageNumberArch')+1);
                    this.getCasesFromOmicron(component);
                }                
                if (state === "SUCCESS") {
                    allRows = caseList.slice(0);
                    if (caseListAll && caseListAll.length) {
                        caseList = caseListAll.concat(caseList);
                    }
                    //displayCases = allRows.splice(0, pageNumber*20);
                    component.set('v.historyData', caseList);
                    //component.set('v.historyData', displayCases);
                }
                else {
                    component.set('v.showSpinner', false);
                    console.log('Error');
                }
            });
            $A.enqueueAction(caseAllAction);
        }        
    },
    getCasesFromOmicron : function(component) {
        var caseAllAction = component.get('c.getArchivedCasesForCustomer'),
            accountIdSF = component.get('v.accountIdSF'),
            pageNumber = component.get('v.pageNumberArch'),
            accountIdNucleus = component.get('v.accountIdNucleus');
        //accountIdNucleus= '1000041153957'; //TODO , remove the hard code ID
        if (accountIdSF) {
            component.set('v.showSpinner', true);
            caseAllAction.setParams({
                "strAccountId": accountIdSF, 
                "strNucleusId": accountIdNucleus,
                "pageNumber": pageNumber,
                "pageSize": 20
            });
            //string strAccountId, string strNucleusId, Integer pageNumber,Integer pageSize
            caseAllAction.setCallback(this, function(response) {
                var state = response.getState(),
                    caseList = response.getReturnValue(),
                    allRows = '',
                    displayCases = '',
                    pageNumber = component.get('v.pageNumber'),
                    caseListAll = component.get('v.historyData');
                ///component.set('v.showSpinner', false);
                if (state === "SUCCESS") {
                    if (caseList && caseList.length < 20) {
                        window.caseHistoryArchive = false;
                    }
                    //allRows = caseList.slice(0);
                    if (caseListAll && caseListAll.length) {
                        displayCases = caseListAll.concat(caseList);
                    }
                    //displayCases = caseListAll.concat(caseList);
                    
                    //component.set('v.historyDataAll', displayCases);
                    component.set('v.historyData', displayCases);
                }
                else {
                    component.set('v.showSpinner', false);
                    console.log('Error');
                }
            });
            $A.enqueueAction(caseAllAction);
        }
    },
    scrollDiv: function(component) {
        var dataRows = component.get('v.historyDataAll'),
            rows = component.get('v.historyData'),
            pageNumber = component.get('v.pageNumber'),
            pageNumberArch = component.get('v.pageNumberArch'),
            allRows = '',
            displayCaseNo = 0;
        pageNumber += 1;
        allRows = dataRows.slice(0);
        displayCaseNo = allRows.length < 20*pageNumber ? allRows.length : 20*pageNumber;
        component.set('v.casesOfPage', displayCaseNo);
        //if (allRows && allRows.length && (allRows.length - (pageNumber*20 + pageNumberArch*20) + 20) >=0) {
        if (window.caseHistoryArchiveSF) {
            component.set('v.showSpinner', true);
            //rows = allRows.splice(0, pageNumber*20);
            //component.set('v.historyData', rows);
            component.set('v.pageNumber', pageNumber);
            this.getAllCasesByAccIdSF(component);
        }
        else {
            if (window.caseHistoryArchive) {
                component.set('v.pageNumberArch', pageNumberArch+1);
                this.getCasesFromOmicron(component);            	
            }            	
        }
    },
    getDocHeight: function(component) {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    },
})