({
	doInit : function(component, event, helper) {        
		const str = helper.getIconString(component.get("v.type"));
        component.set("v.iconString", str);
	}
})