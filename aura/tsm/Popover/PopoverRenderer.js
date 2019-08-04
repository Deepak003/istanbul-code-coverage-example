({
    afterRender: function (cmp, helper) {
        this.superAfterRender();
        
        helper.handleOutSideClick = $A.getCallback(function(e){
            const isPopOverOpen = cmp.get('v.state');
            const popover = cmp.find("container");
            const isValid = cmp.isValid() && popover && popover.getElement() && !popover.getElement().contains(e.target);
            if(isPopOverOpen && isValid) {
                $A.enqueueAction(cmp.get('v.onClose'));
            }
        });
        
        helper.handleKeyDown= $A.getCallback(function(evt) {           
            try{
            	if (evt.keyCode == 27) {
                	$A.enqueueAction(cmp.get('v.onClose'));
                }
            }catch(err){
                // Silently ignore the error
                console.warn(err);
            }
        });
        
        setTimeout(()=>{
        	document.addEventListener('click',helper.handleOutSideClick);
            document.addEventListener('keydown', helper.handleKeyDown);
        }, 800);    
    },
    unrender: function (cmp,helper) {
        this.superUnrender();
        document.removeEventListener('click',helper.handleClick);
        document.removeEventListener('keydown',helper.handleKeyDown);
    }
})