({
    setupExpandableSection : function(component, index) {
        const cmpName = component.get("v.cmpName"),
            rowData = component.get("v.rows")[index].rowData,
             container = [].concat(component.find("container")).find((c)=> $A.util.hasClass(c, 'container-'+index));
		
		var externalData = component.get("v.externalData");
        
        let isValidForExpandableComponent = container && container.isValid();
        
        //TSM-3993 - Adding logic to remove the component if open
        if($A.util.hasClass(container, "has-expandable")){
            container.set("v.body", []);
        }

        if(isValidForExpandableComponent) {
            $A.createComponent(
                cmpName, 
                {data: rowData, externalData: externalData},
                function(newCmp,status,errorMessage) {
                    if(status == "ERROR") {
                        console.log('Error Message--',errorMessage);
                    } else {
                        const body = container.get("v.body");
                        body.push(newCmp);
                        container.set("v.body", body);
                        $A.util.addClass(container, "has-expandable");
                    }
                }
            )                
        }else {
            // skipping expandable since, this has already setup expandable section
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
            var labelA = typeof a.data[index].type == 'string' ? a.data[index].value : a.data[index].value.toUpperCase(),
                labelB = typeof b.data[index].type == 'string' ? b.data[index].value : b.data[index].value.toUpperCase(),
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
    formatData: function(component, event, order) {
        const rows = component.get('v.rows');
        // format status
        rows.forEach(function(r){            
            r.data.forEach(function(d){                
                if(d.label == "STATUS") {
                    d.values = d.value.split(",")
                }                
            })            
        })
        component.set('v.filteredRows', rows);
        
        // isSortable
        const cols = component.get("v.cols");
        cols.forEach(function(col) {
            col.isSortable = col.class.includes('slds-is-sortable');
        });
        component.set("v.cols", cols);
    },
    toggleRow: function(component, index) {
        const items = component.get("v.rows");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;
            component.set("v.rows", items);
            
            if(items[index].expanded) {
                this.setupExpandableSection(component, index);
            }
        }        
    } 
})