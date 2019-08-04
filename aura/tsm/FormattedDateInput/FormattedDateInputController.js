({
    doInit : function(component, event, helper) {
        const date = component.get("v.date");
        const format = component.get("v.format");
        if(date){
            component.set("v.formatted", Util.getFormattedDateTime(date, format));
        }
    }
})