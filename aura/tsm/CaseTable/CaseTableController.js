({
    doInit: function(component, event, helper) {
        component.set("v.selectedFilter", "ALL");        
        var pageRef = component.get("v.pageReference");
        var archivedCaseId = component.get("v.archivedCaseId");
        if(archivedCaseId){
            component.set("v.pageSize", 1000);
        }
    },
    onChangePage: function(component, event, helper) {
        if(component.get("v.pageNo")) {
            helper.getCaseList(component);
        }        
    },
    doRefresh: function(component, event, helper) {
        // force reload full component
        component.set("v.isVisible", false);
        component.set("v.isVisible", true);
        //$A.get('e.force:refreshView').fire();
    },
    onChangeSearchTerm : function(component, event, helper) {
        let timer = component.get('v.timer');
        clearTimeout(timer);
        
        component.set('v.timer', setTimeout($A.getCallback(function(){        
            //console.log("search changed!!");
            helper.search(component);
            clearTimeout(timer);
            component.set('v.timer', null);
        }), 200));
    },
    expandClick: function(component, event, helper) {
        const items = component.get("v.tableRows"), 
            index = event.currentTarget.dataset.index;
        items[index].expanded = !items[index].expanded;
        component.set("v.tableRows", items);
    },
    stopPropagation: function(component, event, helper) {
        event.stopPropagation();
    },
    onLoadCase: function(component, event, helper) {
        const oldValue = event.getParam("oldValue");
        const currentValue = event.getParam("value");
        const searchTerm = component.get('v.searchTerm');
        
        
        let rows = currentValue.filter(function(cv){
            return !oldValue.some(function(ov) {
                return ov.caseNumber == cv.caseNumber && ov.status == cv.status;
            });
        });
        
        // if searchTerm available then filter
        if(searchTerm) {
            rows = rows.filter(helper.matcher(searchTerm));
        }
        
        // clear tableRows when no cases available
        if( $A.util.isEmpty(currentValue) ) {
            component.set("v.tableRows", []);
        }

        const isDescending = component.get("v.isDescending");
        const allCases = component.get("v.tableRows").concat(rows);

        // sort case list
        allCases.sort((a,b)=>isDescending ? new Date(b.date)-new Date(a.date) : new Date(a.date)-new Date(b.date));
        
        var archivedCaseId = component.get("v.archivedCaseId");
        if(archivedCaseId){
            var archivedCaseIndex = helper.searchCaseIndex(allCases, archivedCaseId);
            if(typeof allCases[archivedCaseIndex] !== 'undefined') {
                allCases[archivedCaseIndex].expanded = true;
                helper.caseScrollIntoView(component, event, archivedCaseIndex);
            }
        }
        
        component.set("v.tableRows", allCases);
    },
    sortByDate: function(component, event, helper) {
        component.set("v.isDescending", !component.get("v.isDescending"));
    },
    refreshCaseList: function(component, event, helper) {
        component.set("v.isNonArchivedPulled", false);
        component.set("v.isArchivedPulled", false);
        component.set("v.cases", []);
        
        //force reload
        component.set("v.pageNo", 0);
        component.set("v.pageNo", 1);
    },
    onChangeSource: function(component, event, helper) {
        const currentValue = event.getParam("value");
        
        if(currentValue) {
            //force reload
            component.set("v.pageNo", 0);
            component.set("v.pageNo", 1);
        }
    }    
})