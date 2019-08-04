({
    doInit : function(component, event, helper) {        
        const date = component.get("v.value");
        const format = component.get("v.format");
        const alternative = component.get("v.alternative");
        
        const formattedDate = Util.getFormattedDateTime(date, format);
        
        if(formattedDate) {
            component.set('v.formattedString', formattedDate);
        }else if(alternative) {
            component.set('v.formattedString', Util.getFormattedDateTime(alternative, format) || alternative);
        }else {
            component.set('v.formattedString', "");
        }
        
    }
})