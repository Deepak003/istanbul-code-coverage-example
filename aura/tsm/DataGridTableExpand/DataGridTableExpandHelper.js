({
	sortRows: function(component, event, order) {
        var rows = component.get('v.filteredRows'),
            target = event.currentTarget,
            sibling = order == 'desc' ? target.nextSibling : target.previousSibling,
            index = target.getAttribute('data-index'),
            orderFlag = order == 'desc' ? -1 : 1;
        $A.util.toggleClass(target, 'slds-hide');
        $A.util.toggleClass(sibling, 'slds-hide');
        rows.sort(function (a, b) {
            var labelA = a.data[index].value.toUpperCase(),
                labelB = b.data[index].value.toUpperCase(),
                comparison = 0;
            if (labelA > labelB) {
                comparison = 1;
            } else if (labelA < labelB) {
                comparison = -1;
            }
            return comparison * orderFlag;
        });
        component.set('v.filteredRows', rows);
    },
    scrollDiv: function(component) {
        var dataRows = component.get('v.rows'),
            rows = component.get('v.filteredRows'),
            pageNumber = component.get('v.pageNumber'),
            allRows = '',
            displayCaseNo = 0;
        pageNumber += 1;
        allRows = dataRows.slice(0);
        displayCaseNo = allRows.length < 20*pageNumber ? allRows.length : 20*pageNumber;
        component.set('v.casesOfPage', displayCaseNo);
        if (allRows && allRows.length && (allRows.length - pageNumber*20 + 20) >=0) {
            rows = allRows.splice(0, pageNumber*20);
            component.set('v.filteredRows', rows);
            component.set('v.pageNumber', pageNumber);
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
    getCaseDetail : function(component, caseId) {
        var casePetitionData,
         	casePetitionAction = component.get("c.getCaseByCaseIdorCaseNumber");  
        
        casePetitionAction.setParams({"strFilter": "Id",  "strFilterVal" :caseId });
        casePetitionAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                casePetitionData = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:PetitionDetail",
                    componentAttributes: {
                        simpleCase : casePetitionData,
                        searchCaseFlg : true,
                        readModeCase: true
                    }                        
                });
                evt.fire();
            }
        });
    	$A.enqueueAction(casePetitionAction);
    },
})