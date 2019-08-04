({    
    setSelectedRow : function(component,target) {
        var oldRow = component.get('v.selectedRow');
        if (oldRow && $A.util.hasClass(oldRow,'slds-is-selected')) {
            $A.util.removeClass(oldRow,'slds-is-selected');
        }
        setTimeout(function() {            
            try {
            	if(document.getElementsByClassName("slds-is-selected") && document.getElementsByClassName("slds-is-selected").length == 0){
                $A.util.addClass(target, 'slds-is-selected');
                console.log("Class Added");
            	}
            }
            catch (error) {}
            var pPreview = document.getElementById('preview-container');
            if (pPreview) {
                pPreview.scrollTop = 10;
            }             
        }, 400);
        if (target.parentElement.nodeName.toLocaleLowerCase() == 'tr') {
            target = target.parentElement;
        }
        if(document.getElementsByClassName("slds-is-selected") && document.getElementsByClassName("slds-is-selected").length == 1){
            $A.util.removeClass(document.getElementsByClassName("slds-is-selected")[0], 'slds-is-selected');
            $A.util.addClass(target, 'slds-is-selected');
            component.set('v.selectedRow',target);
        }
    },
	
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
    
    fireMassActionEvent: function(component, event, params) {
		var selectedCaseIds = component.get('v.checkedItems');
        //Case IDs on which mass action to be taken
        if(selectedCaseIds<=1){
            var allRows = component.find("datarow");
            for (var i = 0; i < allRows.length; i++) {
                allRows[i].getElement().setAttribute('class','slds-hint-parent');
            }
        } 
        var appEvent = $A.get("e.c:CaseMassActionTrigger");
        if (appEvent != undefined) {
            appEvent.setParams({
                massIds : selectedCaseIds,
                eventType: "caseMassAction"
            });
            appEvent.fire();// Application Event Fire to perform case mass action
        }
    },
    
    filterRows: function(component, event, params) {
        var rows = component.get('v.rows');
        var activeFilterCateg = params.category,
            activeFilterProd = params.product,
            activeFilterPersona = params.persona,
            type = params.type,
            filteredRows = rows,
            filterCateg = [],
            filterProd = [],
            filterPersona = [];
        if (activeFilterCateg || activeFilterProd || activeFilterPersona) {
            component.set('v.filterFlag', true);
        }
        else {
            component.set('v.filterFlag', false);
        }
        if (activeFilterCateg != undefined && activeFilterCateg != "") {
            filterCateg = filteredRows.filter(function (row) {
                return activeFilterCateg === row.data[1].value;
            });
            filteredRows = filterCateg;
        }
        
        if (activeFilterProd != undefined && activeFilterProd != "" && filteredRows.length) {            
            filterProd = filteredRows.filter(function (row) {
               return activeFilterProd === row.data[4].value;
            });
            filteredRows = filterProd;
        }        
        
        if ( activeFilterPersona != undefined && activeFilterPersona != "" && filteredRows.length) {
            filterPersona = filteredRows.filter(function (row) {
                return activeFilterPersona === row.data[2].value;
            });
            filteredRows = filterPersona;
        }        
        
        //if (filteredRows.length) { // TODO
        component.set('v.filteredRows', filteredRows);
        //}
        //else {
        //     component.set('v.filteredRows', rows);
        // }
        var filterDataListEvent = $A.get("e.c:FilterDataListEvt"),
            dataType = component.get('v.cmpName');
        if (filterDataListEvent) {
            filterDataListEvent.setParams({
                listData : filteredRows,
                listDataType : dataType
            });
            filterDataListEvent.fire();   
        }
    }
})