({
	getAHTPerformance: function(component) {
		var action = component.get("c.getAverageHandleTime"),
			spinner = component.find('spinnerAHT'),
            i = '';
        if (spinner && spinner.length) {
            for(i in spinner) {
                $A.util.removeClass(spinner[i], 'slds-hide');
        		$A.util.removeClass(spinner[i], 'slds-hide');
            }            
        }       
        // Add callback behavior to update the note type
        if (action) {
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (spinner && spinner.length) {
                    for(i in spinner) {
                        $A.util.addClass(spinner[i], 'slds-hide');
                        $A.util.addClass(spinner[i], 'slds-hide');
                    } 
                }            
                if (state === "SUCCESS") {
                    var responseVal = response.getReturnValue(),
                        performToday = responseVal.PerformanceToday,
                        aht = responseVal.AHT;
                    
                    //performToday = performToday <= 1 ? performToday + ' Petition' : performToday + ' Petitions';
                    component.set('v.performToday', performToday);
                    component.set('v.aht', aht);                
                }
                else {
                    console.log("Failed with state: " + state);
                }
            });
            // Send action off to be executed
            $A.enqueueAction(action);
        }
	}
})