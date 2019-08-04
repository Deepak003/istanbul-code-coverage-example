({
    doInit:function(cmp, event, helper){
    	cmp.set('v.columns', helper.getColumnFields());
        cmp.set('v.loginTypes',helper.getLoginTypes());
        cmp.set('v.changeTypes',helper.getChangeTypes());
        cmp.set('v.duration',helper.getDurationTypes());
        var durationObj = cmp.get("v.pillsFilterList");
        cmp.set('v.durationFilter',durationObj[0].value);
        cmp.set('v.loginFilter','All');
        cmp.set('v.changeFilter','All');
        //cmp.set('v.durationFilter','ThirtyDays');
        cmp.set('v.pillLength',1);
       	helper.getAccountLoginHistoryData(cmp);
        if(!cmp.get('v.isOverview')){
        	helper.getAccountEmailHistoryData(cmp); 	   
        }
    },
    toggleFilterBox:function(cmp, event, helper){
        //helper.resetFiltersAsPills(cmp);
        helper.toggleFilterBox(cmp);
    },
    applyFilters:function(cmp, event, helper){
    	helper.applyFilters(cmp);
	},
    removeFilter:function(cmp, event, helper){
        helper.removeFilter(cmp,event);
    },
    
    keyPressController:function(cmp, event, helper){
        helper.searchRecordsWithKeyword(cmp,event);
    },
    
    pillClick:function(cmp, event, helper){
        helper.pillRemoveClick(cmp, event);
	}
    
})