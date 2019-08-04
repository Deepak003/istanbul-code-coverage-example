({
    afterRender : function( component, helper ) {
        this.superAfterRender();
        let didScrolled;
        let div = component.find('scroll_container');
        if(!$A.util.isEmpty(div)){
            div = div.getElement();
            div.onscroll = function(){
                didScrolled = true;
            };
            //Interval function to check if the user scrolled or if there is a scrollbar
            const intervalId = setInterval($A.getCallback(function(){
                if(didScrolled){
                    didScrolled = false;
                    //if(div.scrollTop === (div.scrollHeight - div.offsetHeight)){
                    if(div.scrollTop >= (div.scrollHeight - div.offsetHeight)){
                        helper.setNextPageNo(component);
                    }
                }
            }), 750);
            component.set('v.intervalId', intervalId);
        }
    },
    unrender: function( component) {
        this.superUnrender();
        const intervalId = component.get( 'v.intervalId' );
        if ( !$A.util.isUndefinedOrNull( intervalId ) ) {
            window.clearInterval( intervalId );
        }
    }
})