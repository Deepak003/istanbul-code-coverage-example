({
    rerender : function( component, helper ) {
        this.superRerender();
        /*
        console.log('INSIDE Re-Renderer');
        helper.handleDropdown= function(e) {            
            try{
            	let dropdown = component.find("dropdown").find((c)=>$A.util.hasClass(c, 'slds-is-open'));                
                const isValid = !dropdown.getElement().contains(e.target);
                if(isValid) {
                    helper.closeDropdown(component);
                }    
            }catch(err){
                // Silently ignore the error
                console.warn(err);
            }
        }
        document.removeEventListener('click', helper.handleDropdown);
        document.addEventListener('click', helper.handleDropdown);
                
        helper.handleKeyDown= function(evt) {           
            try{
            	if (evt.keyCode == 27) {
                	helper.closeDropdown(component);
                }
            }catch(err){
                // Silently ignore the error
                console.warn(err);
            }
        }
        document.removeEventListener('keydown', helper.handleKeyDown);
        document.addEventListener('keydown', helper.handleKeyDown);
        */
    }
})