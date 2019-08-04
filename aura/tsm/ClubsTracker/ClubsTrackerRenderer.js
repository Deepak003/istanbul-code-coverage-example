({
    rerender : function( component, helper ) {
        this.superRerender();
        
        //handle esc key 
        helper.handleKeyDown= function(evt) {           
            try{
                if (evt.keyCode == 27) {
                    helper.closeModal(component);
                }
            }catch(err){
                // Silently ignore the error
                console.warn(err);
            }
        }        
        
        //handle click outside        
        helper.handleClick= function(e) {
            const target = component.find("dialog");            
            if(target) {
                const isValid = target.getElement() && !target.getElement().contains(e.target);
                if(isValid) {
                    helper.closeModal(component);
                }    
            }            
        }
        
        // remove event handler before        
        document.removeEventListener('keydown', $A.getCallback(helper.handleKeyDown), false);
        document.removeEventListener('click', $A.getCallback(helper.handleClick), false); 
        
        if(component.find("dialog")){
        	//document.addEventListener('keydown', $A.getCallback(helper.handleKeyDown), false);
        	//document.addEventListener('click', $A.getCallback(helper.handleClick), false);    
        }
    }
})