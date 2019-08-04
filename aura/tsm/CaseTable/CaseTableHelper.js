({
    getCaseList: function(component) {
        const selectedFilter = component.get("v.selectedFilter");
        const isDescending = component.get("v.isDescending");
        const isArchivedPulled = component.get("v.isArchivedPulled");
        const isNonArchivedPulled = component.get("v.isNonArchivedPulled");        
        
        //console.log(`selectedFilter: ${selectedFilter}, isDescending: ${isDescending}, isArchivedPulled: ${isArchivedPulled}, isNonArchivedPulled: ${isNonArchivedPulled}`);
        
        if(isDescending) {
            if(!isNonArchivedPulled) {
                this.getSalesforceCases(component);
            }else if(!isArchivedPulled) {
                this.getArchivedCases(component);
            }        
        }else {            
            if(!isArchivedPulled) {
                this.getArchivedCases(component);
            }else if(!isNonArchivedPulled) {
                this.getSalesforceCases(component);
            }
        }
    },    
    matcher: function(str) {
        const strLowerCase = str.toString().toLowerCase();
        return function (obj) {
            const values = [obj.caseNumber, obj.subject];
            
            return values.some(function(value, index){
                return value && value.toString().toLowerCase().includes(strLowerCase);    
            });
        }
    },
    search: function(component) {
        const searchTerm = component.get('v.searchTerm');
        let rows = component.get('v.cases');
        
        // default set array if undefined/not an array
        if(!Array.isArray(rows)) {
            rows = [];
        }
        
        // if searchTerm available
        if(searchTerm) {
            rows = rows.filter(this.matcher(searchTerm));
        }
        
        component.set('v.tableRows', rows);
    },
    getSalesforceCases: function(component) {
        const selectedFilter = component.get("v.selectedFilter");
        const order = component.get("v.isDescending") ? "DESC" : "ASC";
        const pageNo = component.get("v.pageNo");
        const pageSize = component.get("v.pageSize");
                
        const action = component.get("c.fetchCasesByAccountId");
        action.setParams({
            nucleusId: component.get("v.nucleusId"),
            accountId: component.get("v.accountId"),
            pageNumber: pageNo,
            pageSize: pageSize,
            caseStatus: selectedFilter == "ALL" ? "" : selectedFilter,
            caseOrder: order
        });
        component.set('v.isLoadingCases', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            component.set('v.isLoadingCases', false);
            
            const state = response.getState();
            if (state === "SUCCESS") {
                const storeResponse = response.getReturnValue().map(this.formatData);
                component.set("v.cases", component.get("v.cases").concat(storeResponse));
                
                if(storeResponse.length < pageSize) {
                    component.set("v.isNonArchivedPulled", true);
                }
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    getArchivedCases: function(component) {
        const selectedFilter = component.get("v.selectedFilter");
        
        // return if selectedFilter is not Closed (or) ALL
        if(!['Closed','ALL'].includes(selectedFilter)) {      
            component.set("v.isArchivedPulled", true);
            return;
        }
        
        const order = component.get("v.isDescending") ? "DESC" : "ASC";
        const pageNo = component.get("v.pageNo");
        const pageSize = component.get("v.pageSize");
       
        const action = component.get("c.fetchArchiveCasesByAccountId");
        action.setParams({
            nucleusId: component.get("v.nucleusId"),
            accountId: component.get("v.accountId"),
            pageNumber: pageNo,
            pageSize: pageSize,
            caseOrder: order
        });
        component.set('v.isLoadingCases', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            component.set('v.isLoadingCases', false); 
            
            const state = response.getState();
            if (state === "SUCCESS") {
                const storeResponse = response.getReturnValue().map(this.formatArchivedData);
                component.set("v.cases", component.get("v.cases").concat(storeResponse));
                
                if(storeResponse.length < pageSize) {
                    component.set("v.isArchivedPulled", true);
                }
            }else {
                component.set("v.isArchivedPulled", true); // TSM-4066
				//Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    formatData: function(data) {
        return Object.assign({}, {
            caseId: data.Id,
            caseNumber: data.CaseNumber,
            status: data.Status,
            date: data.LastModifiedDate,
            subject: data.Subject
        });
    },
    formatArchivedData: function(data) {
        const status = data.status;
        delete data.status;
        return Object.assign({}, data, {            
            _status: status,
            status: "Archived",
            caseId: data.id,
            date: data.lastModifiedDate
        });
    },
    searchCaseIndex: function(allCases, archivedCaseId) {
        for (var i=0; i < allCases.length; i++) {
            if (allCases[i].caseNumber === archivedCaseId) {
                return i;
            }
        }
    },
    caseScrollIntoView: function(component, event, archivedCaseIndex) {
        setTimeout(function(){ 
            var caseRows = component.find('case-row');
            if (archivedCaseIndex <= caseRows.length) {
                var caseRow = caseRows[archivedCaseIndex].getElement();
                caseRow.scrollIntoView(true);
            }
        }, 3000);
    }
})