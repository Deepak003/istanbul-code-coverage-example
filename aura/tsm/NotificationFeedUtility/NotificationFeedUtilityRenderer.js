({
    afterRender: function (cmp,helper) {
        this.superAfterRender();
        helper.windowClick = $A.getCallback(function(event){
            if(cmp.isValid()){
                helper.closeNotification(cmp,event,helper);//Close notification is called on every on click
            }
        });
        document.addEventListener('click',helper.windowClick);      

    },
    unrender: function (cmp,helper) {
        this.superUnrender();
        document.removeEventListener('click',helper.windowClick);        
    }
})