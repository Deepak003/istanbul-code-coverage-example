({   
    afterRender: function (component, helper) {
        component.set('v.filteredRows', component.get('v.rows'));
    }
})