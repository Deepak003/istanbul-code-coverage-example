({
    doInit : function(cmp, event, helper) {
        helper.setDate(cmp);
    },
    setDate: function(cmp, event, helper) {
        if(event.getParam("value")) {
            helper.setDate(cmp);
        }        
    },
    handleClickApply: function (cmp, event, helper) {
        const startDate = cmp.get("v.start");
        const endDate = cmp.get("v.end");

        if(startDate > endDate){
            Util.handleErrors(cmp, {
                getError:()=>[{message: 'The end date must be after the start date to be valid'}]                
            });
            return;
        }

        cmp.getEvent("searchByDate").setParams({ 
            value : {startDate: startDate, endDate:endDate} 
        }).fire();
        cmp.set("v.showFilter", false);
    },
    handleClickReset: function (cmp, event, helper) {
        helper.setDate(cmp);
        cmp.set("v.selectedOption", "7");
    }
})