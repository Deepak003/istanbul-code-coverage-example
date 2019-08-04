({
    fetchData : function(cmp) {
        const productName = cmp.get('v.selectedProduct.Url_Name__c');
        const nucleusId = cmp.get('v.nucleusId');
        
        const action = cmp.get('c.getSocialTrackerInformation');
        action.setParams({
            requestParams : {
                userId: nucleusId,
                days: "",
                size: "",
                crmProductName: productName
            }
        });
        action.setCallback(this, function(response){
            cmp.set('v.isLoading', false);
            if (response.getState() === "SUCCESS") {
                cmp.set('v.data', this.formatData(response.getReturnValue()));
            }else{
                Util.handleErrors(cmp, response);
            }
        });
        $A.enqueueAction(action);
    },
    formatData: function(list) {
        try{
        	return list.map((l)=>Object.assign({}, l,{ dateViewed: Util.getFormattedDateTime(l.dateViewed, 'only-date') }))    
        }catch(err){
            return list;
        }
    }
})