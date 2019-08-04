({
	// Your renderer method overrides go here
    afterRender: function(component) {
        this.superAfterRender();
        setTimeout(function() { 
            component.set('v.TwigTranslator', TwigTranslator()); 
        }, 1000);
    }
})