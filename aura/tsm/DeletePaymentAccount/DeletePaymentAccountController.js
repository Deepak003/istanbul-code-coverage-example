({  
    loadDetails : function(component, event, helper) {
        var currentAccount = component.get("v.paymentAccount");
        var deleteButton = component.find("delete-button");
        if(currentAccount.deletable == false){
            deleteButton.set("v.disabled", true);
        }else{
            deleteButton.set("v.disabled", false);
        }
    },
    onDeleteClick : function(component, event, helper) {        
        helper.deleteAccount(component);
    },
    closeModel : function(component, event, helper) {
        helper.closeModel(component);
    }
})