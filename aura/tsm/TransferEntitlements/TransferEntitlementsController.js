({
    doInit : function(component, event, helper) {
        if(component.get("v.PCSelected")){
            var parentEmail = (component.get("v.accountSummary")).parentalEmail;
            if(parentEmail){
                component.set("v.parentStatus",true);
                helper.getAccount(component, event, helper);
            }
            else{
                component.set("v.parentStatus",false);
                component.set("v.searchAccount",true);
            }
        }        
    },
    
    handleChangeChk : function(component, event, helper) {
        var checkCmp = component.find("deleteAccount");
        var result = checkCmp.get("v.check");
        component.set("v.deleteAccount",result);
    },
    
    handleChangeRadio : function(component, event, helper) {
        var checkCmp = component.find("selectAccount");
        var result = checkCmp.get("v.value");
        if(result == "searchAccount"){
            component.set("v.searchAccount",true);
            component.set("v.showDelete",false);
            component.set("v.isSuccessDisable",true);
        }else{
            component.set("v.searchAccount",false);
            component.set("v.showTable",false);
            component.set("v.showDelete",true);
            component.set("v.isSuccessDisable",false);
        }                                                    
        component.set("v.searchEmail",result);
    },
    
    keyPressController: function(component, event, helper) {
        var selectedType = component.get("v.filterSelection");
        var emailValidity = component.find("accountSearch").get("v.validity");
        var searchEmail = component.get("v.searchEmail");
        var accEmail = (component.get("v.accountSummary")).email;
        
        //Restricting for only enter key code
        if (event.keyCode == 13) {
            if(!emailValidity.valid){
                component.set("v.isSuccessDisable",true);
                component.set("v.showTable",false);
                component.set("v.isEmailError", true);                
            }else{
                component.set("v.isEmailError", false);
                if(searchEmail == "searchAccount")
                    searchEmail = component.get("v.searchString").trim();
                
                if(accEmail.toUpperCase() !== searchEmail.toUpperCase())
                    helper.searchAccount(component, event, helper, searchEmail);
                else{
                    component.set("v.showTable",true);
                    component.set("v.noRecords",true);
                }       
            }
                
        }
    }
})