({
    afterRender: function (component, helper) {
        this.superAfterRender();
        const element = component.find("otherCaseActivity");
        
        // work arround for css (display: -webkit-box) since css is not appling with closed expandable section
        // opening & closing to make sure css will apply correctly
        window.setTimeout(
            $A.getCallback(function() {
                $A.util.removeClass(element, 'slds-is-open');    
            }), 2000
        );      
    }
})