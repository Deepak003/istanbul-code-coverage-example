({
   
    afterRender: function (component, helper) {
        this.superAfterRender();
        component.getAccNotes(component);
    }
})