({
    toggleRow: function(component, index) {
        const items = component.get("v.formattedRows");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;
            component.set("v.formattedRows", items);          
        }      
    },
    setHelperData: function(component, rows) {
        if(!Array.isArray(rows)){
            return [];
        }

        //Getting external Data
        var externalData = component.get("v.externalData");
        const clonedData = JSON.parse(JSON.stringify(rows));
        clonedData.forEach(function(row) {
            const data = row.data;
            
            //setting status
            row.status = data.find((d)=>d.label == 'STATUS').value;

            // Skills: clearing value when all inner values are empty so that will hide header in component
            const skills = (data.find((d)=>d.label == 'skills') || {}).value || [];
            const values = skills.map((o)=>o.value).filter(Boolean);
            if($A.util.isEmpty(values)){
                data.find((d)=>d.label == 'skills').value = [];
            }
            
            //setting checked
            var rewardArrays = data.find((d)=>d.label == 'rewards').value;
            for(var eachReward in rewardArrays){
                for(var eachItem in externalData["itemList"]){
                    if(rewardArrays[eachReward].itemType == externalData["itemList"][eachItem].key){
                        if(window.permissionsList  && window.permissionsList.includes('grant item') && component.get("v.externalData").grantPermission){
                            component.set('v.hasGrantPermission', true);
                        }
                        //Checking the permission TSM-2577
                        if(externalData["grantPermission"]){
                            row.isChecked = true;
                        }else{
                            row.isChecked = false;
                        }                        
                        row.subject = "Items";
                    }
                }
                
                for(var eachPack in externalData["packList"]){
                    if(rewardArrays[eachReward].itemType == externalData["packList"][eachPack].value){
                        if(window.permissionsList && window.permissionsList.includes('grant pack') && component.get("v.externalData").grantPermission){
                            component.set('v.hasGrantPermission', true);
                        } 
                        //Checking the permission TSM-2577
                        if(externalData["grantPermission"]){
                            row.isChecked = true;
                        }else{
                            row.isChecked = false;
                        }  
                        row.subject = "Packs";
                    }
                }
                
            }
            
            // setting login history specific info
            const isSuspicious = data.find((d)=>d.label == 'isSuspicious');
            row.isSuspicious = isSuspicious && isSuspicious.value == true;
            
            const isLoginSuccess = data.find((d)=>d.label == 'STATUS');
            row.isLoginSuccess = isLoginSuccess && isLoginSuccess.value == 'Successful';            
            
            const dateLabels = ["Last Game Completed", "Draft Started", "Draft Ended"];
            
            data.forEach(function(d) {
                // details section data formating
                if (["details"].includes(d.label) && Array.isArray(d.value)) {                        
                    d.value.forEach(function(detail){
                        const isValidDateLabel = detail.key.toLowerCase().endsWith('date') || dateLabels.includes(detail.key);
                        const isValidDateValue = detail.value && (new Date(detail.value) !== "Invalid Date");
                        // format date & time
                        if(isValidDateValue && isValidDateLabel) {
                            detail.value = Util.getFormattedDateTime(detail.value);
                        }  
                    })
                }
                // rewards & trades section data formating
                else if(['rewards', 'trades'].includes(d.label) && Array.isArray(d.value) ) {
                    d.value.forEach(function(v){
                        if(!v.status)
                            v.status = 'n/a';
                    })                   
                }                
            }) 
        });
        return clonedData;
    }
})