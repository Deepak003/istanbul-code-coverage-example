({
	// Your renderer method overrides go here
	rerender : function(component, helper){
        
        this.superRerender();
        component.set('v.tpFlag', false);
        // do custom rerendering here
    }
})