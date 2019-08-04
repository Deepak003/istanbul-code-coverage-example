({
	render: function(component, helper) {
        // render function in the parent component.
        var render = this.superRender();
        
        helper.setDirectionAuto(component);
        return render;
    }
})