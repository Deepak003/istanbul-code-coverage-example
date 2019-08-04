({
    getCaseHistoryData : function(component) {
        
        
        const accountId = component.get('v.accountId'),
            caseId = component.get('v.caseId'),
            pageNo = component.get('v.pageNo');
        
            //searchTerm = component.get("v.searchTerm"),
            //spinner = component.find('spinner');
  
        
        
        // creating action for backend
        const action = component.get("c.fetchOtherCases");
        action.setParams({ caseId : caseId, accountId : accountId });
        
        //$A.util.toggleClass(spinner, "slds-hide");
        
        action.setCallback(this, (response)=> {
            const state = response.getState();
            //$A.util.toggleClass(spinner, "slds-hide");            
            if (state === "SUCCESS") {
                const data = response.getReturnValue();
                component.set("v.historyData", data);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
 		$A.enqueueAction(action);        
        
        
        
        /*
        var caseHistory = [{
            subject: 'This guy called me a dootie head and you should banned his account', 
            Id: '500q000000AlJNu', 
            caseNumber: '40687224',
            date: '2018-05-22T21:12:15.000Z', 
            type: 'Missing Content',
            status: 'Open' 
        },{
            subject: 'This guy is not cool lorem', 
            caseNumber: '40687074', 
            Id: '500q000000Ak26y',     
            date: '2018-05-18T21:12:15.000Z',
            type: 'Manage Account',
            status: 'Closed' 
        },{
            subject: 'This guy called me a dootie head and you should banned his account', 
            Id: '500q000000AlJNu', 
            caseNumber: '40687224',
            date: '2018-05-22T21:12:15.000Z', 
            type: 'Missing Content',
            status: 'Open' 
        },{
            subject: 'This guy is not cool lorem', 
            caseNumber: '40687074', 
            Id: '500q000000Ak26y',     
            date: '2018-05-18T21:12:15.000Z',
            type: 'Manage Account',
            status: 'Closed' 
        },{
            subject: 'This guy called me a dootie head and you should banned his account', 
            Id: '500q000000AlJNu', 
            caseNumber: '40687224',
            date: '2018-05-22T21:12:15.000Z', 
            type: 'Missing Content',
            status: 'Open' 
        },{
            subject: 'This guy is not cool lorem', 
            caseNumber: '40687074', 
            Id: '500q000000Ak26y',     
            date: '2018-05-18T21:12:15.000Z',
            type: 'Manage Account',
            status: 'Closed' 
        },{
            subject: 'This guy called me a dootie head and you should banned his account', 
            Id: '500q000000AlJNu', 
            caseNumber: '40687224',
            date: '2018-05-22T21:12:15.000Z', 
            type: 'Missing Content',
            status: 'Open' 
        },{
            subject: 'This guy is not cool lorem', 
            caseNumber: '40687074', 
            Id: '500q000000Ak26y',     
            date: '2018-05-18T21:12:15.000Z',
            type: 'Manage Account',
            status: 'Closed' 
        }];

        //caseHistory = [];
        
        component.set("v.historyData", caseHistory);
        
        */
        
    }
})