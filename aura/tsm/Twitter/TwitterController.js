({
	onRefresh : function(component, event, helper) {
        var timer;
        timer = component.get("v.timer");
        component.set("v.timeCount",0);
        var twitterList = component.get("v.twitterList");

        var iframeSrc = $A.get('$Resource.twitter_app');
        var timestamp = new Date().getTime()
        iframeSrc = iframeSrc+'?list='+ twitterList +'&timestamp='+timestamp;
		component.set("v.twitterAppSrc", iframeSrc);
        
        var handler = $A.getCallback(function(result) {
            var timeSpent = component.get("v.timeCount");
            timeSpent = Number(timeSpent) + 1;
			component.set("v.timeCount", timeSpent);
        });
        
        clearInterval(timer);
        timer = setInterval(handler, 60000);
        component.set("v.timer", timer);
    }
})