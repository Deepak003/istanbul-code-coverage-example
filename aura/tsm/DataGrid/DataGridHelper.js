({
    onInit : function(component) {
        var obj = this.parseBody(component);
        component.set("v.cols", obj.cols);
        component.set("v.rows", obj.rows);
    },
    
    parseBody: function(component,colItems) {
        // insert code here
        var body = component.get("v.body");
        colItems = colItems || [];
        var thisTag, result;
        
        if (body) {
            for (var i = 0; i < body.length; i++) {
                thisTag = body[i];
                if (thisTag.isInstanceOf('c:DataGridColumn')) {
                    colItems.push({
                        label : thisTag.get('v.label'),
                        fieldName: thisTag.get('v.fieldName'),
                        type :  thisTag.get('v.type'),
                        link : thisTag.get('v.link'),
                        class: thisTag.get('v.class') + " " +  
                        (thisTag.get('v.hidden') ? "hiddenColumn" : "")
                    });
                }
            }
        }        
        
        // reformat data
        var rowData = component.get('v.data');
        var rowItems = [];
        var pkField = component.get('v.pkField');
        
        if (rowData && rowData.length && rowData[0] != undefined) {
            for (var i = 0; i < rowData.length; i++) {
                if (rowData[i] != undefined) {
                    var rowDataItems = [];
                    for (var j=0; j<colItems.length; j++) {
                        if (colItems[j].fieldName && colItems[j].fieldName.indexOf('.') >=0) {
                            var separateFields = colItems[j].fieldName.split('.');
                            try {
                                rowDataItems.push({
                                    value: rowData[i][separateFields[0]][separateFields[1]],
                                    label: colItems[j].label,
                                    type: colItems[j].type,
                                    class: colItems[j].class
                                });
                            }
                            catch (error) {
                                rowDataItems.push({
                                    value: '',
                                    label: colItems[j].label,
                                    type: colItems[j].type,
                                    class: colItems[j].class
                                });
                            }
                            
                        }
                        else {
                            try {
                                rowDataItems.push({
                                    value: rowData[i][colItems[j].fieldName],
                                    label: colItems[j].label,
                                    type: colItems[j].type,
                                    class: colItems[j].class
                                });
                            }
                            catch (error) {
                                rowDataItems.push({
                                    value: '',
                                    label: colItems[j].label,
                                    type: colItems[j].type,
                                    class: colItems[j].class
                                });
                            }
                        }
                         
                    }
                    rowItems.push({
                        data: rowDataItems,
                        pk: rowData[i][pkField],
                        rowData: rowData[i]
                    });  
                }
            }
        }        
     
        return {
            cols: colItems,
            rows: rowItems
        }
        
    }
}) 