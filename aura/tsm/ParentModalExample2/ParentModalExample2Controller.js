({
    handleClick : function (cmp, event, helper) {
        alert("Clicked!!");
    },
    openModal2 : function (cmp, event, helper) {
        cmp.set('v.isOpen', true);
    },
    handleSuccessClick : function (cmp, event, helper) {
        alert("Clicked Action-1");        
        cmp.set('v.isLoading', true);
        setTimeout($A.getCallback(function(){
            cmp.set('v.isLoading', false);
        }), 2000);
    },
    handleCancelClick : function (cmp, event, helper) {
        alert("Clicked Action-2");        
    },
    handleCloseClick : function (cmp, event, helper) {
        alert("Closing");        
        cmp.set('v.isOpen', false);
    }
})