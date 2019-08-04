({
    init: function (component, event, helper) {
	    helper.pullData(component);
    },
    submit: function(component, event, helper) {
        const defaultSelected= component.get('v.defaultSelected');
        
        if(defaultSelected==1) {
            helper.doProratedRefund(component);
        }else if(defaultSelected==2) {
            helper.doFullRefund(component);
        }
    }
})