({
    afterRender: function (cmp, helper) {
        this.superAfterRender();
        
        helper.handleClick = $A.getCallback(function(e){            
            try{
                const isOpen = cmp.get('v.isModalOpen');
                
                if(cmp.isValid() && isOpen) {
                    const containers = cmp.find("dialog");
                    
                    // default condition for closing modal
                    let isValid = true;
                    // containers available check
                    isValid = isValid && containers;
                    // check if clickClose is enabled
                    isValid = isValid && cmp.get('v.clickClose');
                    // clicked element check
                    isValid = isValid && e.target;                    
                    // check if clicked outside
                    isValid = isValid && ![].concat(containers).some((c)=>c.getElement().contains(e.target));
                    
                    if(isValid){
                        $A.enqueueAction(cmp.get('v.onClose'));
                    }
                }
            }catch(err){
                // Silently ignore the error
                console.log(err);
            }
        });
        
        helper.handleKeyDown= $A.getCallback(function(evt) {           
            try{
                if (evt.keyCode == 27) {
                    if(cmp.get('v.escapeClose')) {
                        $A.enqueueAction(cmp.get('v.onClose'));
                    }
                }
            }catch(err){
                // Silently ignore the error
                console.warn(err);
            }
        });
        
        setTimeout(function(){
            document.addEventListener('click',helper.handleClick);
            document.addEventListener('keydown', helper.handleKeyDown);
        }, 800);     
    },
    unrender: function (cmp,helper) {
        this.superUnrender();
        document.removeEventListener('click',helper.handleClick);
        document.removeEventListener('keydown',helper.handleKeyDown);
    }
})