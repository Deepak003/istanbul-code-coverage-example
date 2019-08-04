({
    setOriginSubscriptions : function(component,event) {
        let subSpinner = component.find("subscriptionSpinner");
        $A.util.removeClass(subSpinner,"slds-hide");
        const originAction = component.get("c.getOriginSubscriptions");
        originAction.setParams({userId:component.get("v.nucleusId")});
        originAction.setCallback(this,function(response){
            let subSpinner = component.find("subscriptionSpinner");
            $A.util.addClass(subSpinner,"slds-hide");
            const state = response.getState();
            if (state === "SUCCESS") {
                const subscriptionData = response.getReturnValue();
                let activeSubscription={};
                let previousSubs =[];
                let isStackedSubscription = this.checkStackSubscription(subscriptionData);
                if(isStackedSubscription){
                    activeSubscription = this.getStackActiveSubscription(subscriptionData);
                    previousSubs = this.getStackPreviousSubscriptionList(subscriptionData);
                    component.set("v.activeSubscription",activeSubscription);
                    component.set("v.inactiveSubscriptions",previousSubs);
                    component.set("v.subscriptionType","Stacked");
                }else{
                    activeSubscription = this.getActiveSubscription(component, subscriptionData);
                    previousSubs = this.getPreviousSubscriptionList(subscriptionData);
                    /* commenting : Since we will show only ACTIVE subscription as part of Accordian title                     
                    if($A.util.isEmpty(activeSubscription)){
                        if(!($A.util.isEmpty(previousSubs))){
                            activeSubscription = previousSubs[0];   
                            previousSubs = previousSubs.slice(1);
                        }    
                    }
                    */
                    component.set("v.activeSubscription",activeSubscription);
                    component.set("v.inactiveSubscriptions",previousSubs);
                    component.set("v.subscriptionType","Origin");
                }
                if($A.util.isEmpty(activeSubscription) && $A.util.isEmpty(previousSubs)){
                    let noSubcription = component.find("originEmptyState");
                    $A.util.removeClass(noSubcription,"slds-hide");
                }
                
            }
            else {
                Util.handleErrors(component, response);
            }    
        });
        $A.enqueueAction(originAction);
    },
    getActiveSubscription:function(component, subscriptionData){
        let activeSubscription={};
        let subscriptionList = subscriptionData.response;
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            for (let i = 0; i < subscriptionList.length; i++) {
                if (subscriptionList[i].status == 'ENABLED' || subscriptionList[i].status == 'PENDINGEXPIRED'){                    
                    activeSubscription={ 
                        title:"Origin Access",
                        nextBillingDate: new Date(subscriptionList[i].nextBillingDate),
                        cancelEffectiveDate : this.getCancelEffectiveDate(subscriptionList[i].scheduleOperations),
                        status:this.getStatus(subscriptionList[i].status),
                        productName:subscriptionList[i].offerDetails.productName,
                        startDate:new Date(subscriptionList[i].subsStart),
                        endDate:new Date(subscriptionList[i].subsEnd),
                        recurring:this.getRecurringVal(subscriptionList[i].billingMode),
                        userId:component.get("v.nucleusId"),
                        ofbItemTitle:subscriptionList[i].offerDetails.ofbItemTitle,
                        offerId:subscriptionList[i].offerId,
                        billingAccountId:subscriptionList[i].billingAccountId,
                        subscriptionId:subscriptionList[i].subscriptionId,
                        invoices: subscriptionList[i].invoices,
                        userId: subscriptionList[i].userId,
                        upcomingSubsOfferId: this.getUpcomingSubscriptionOfferId(subscriptionList[i])
                    };
                                      
                    break;
                } 
            }
        }
        return activeSubscription;
    },
    getUpcomingSubscriptionOfferId: function(subscription) {
        try{
            return JSON.parse(subscription.scheduleOperations.find((so)=>so.operationName=='CONVERTED_FROM' && so.status !='CANCELLED').properties.find((p)=>p.name=='CONVERTSUBSPAYLOAD').value).SubscriptionRequest.offerId;    
        }catch(err){
            return '';
        }        
    },
    fetchOriginSubscriptionOption: function(component) {
        const action = component.get("c.fetchOriginSubscriptionOptions");         
        action.setCallback(this, function(response) {
            var state = response.getState();                        
            if (state === "SUCCESS") {
                component.set("v.originSubscriptionOptions", response.getReturnValue() || []);
            }else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    getPreviousSubscriptionList:function(subscriptionData){
        let previousSubscriptions = [];
        let subscriptionList = subscriptionData.response;
        
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            for (let i = 0; i < subscriptionList.length; i++) {
                if (subscriptionList[i].status != 'ENABLED' && subscriptionList[i].status != 'PENDINGEXPIRED'){                   
                    let subscription={
                        title:"Origin Access",
                        nextBillingDate: new Date(subscriptionList[i].subsEnd),
                        status:subscriptionList[i].status,
                        productName:subscriptionList[i].offerDetails.productName,
                        startDate:new Date(subscriptionList[i].subsStart),
                        endDate:new Date(subscriptionList[i].subsEnd),
                        recurring:this.getRecurringVal(subscriptionList[i].billingMode),
                        dateCreated:new Date(subscriptionList[i].dateCreated),
                        expanded:false,
                        subscriptionId:subscriptionList[i].subscriptionId,
                        invoices: subscriptionList[i].invoices,
                        userId: subscriptionList[i].userId,
                    };
                    previousSubscriptions.push(subscription);
                } 
            }
        }
        return previousSubscriptions;
    },
    getRecurringVal:function(billingMode){
        if(billingMode == "RECURRING" || billingMode == "true"){
            return "Yes";
        }else if(billingMode == "NONRECURRING" || billingMode == "false"){
            return "No";
        }
    },
    getStatus:function(statusVal){
        if(statusVal == "ENABLED"){
            return "ACTIVE";    
        }else{
            return statusVal;
        }
    },
    checkStackSubscription:function(subscriptionData){
        let isStackedSubscription = false;
        let subscriptionList = subscriptionData.response;
        
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            for (let i = 0; i < subscriptionList.length; i++) {
                if (subscriptionList[i].status == 'STACKED'){                    
                    isStackedSubscription =true;
                    break;
                } 
            }
        }
        return isStackedSubscription;
    },
    getStackActiveSubscription:function(subscriptionData){
        let activeSubscription={};
        let subscriptionList = subscriptionData.response;
        
        if(subscriptionList){            
            subscriptionList.sort(this.sortByDate);        
            let stackedSubscription = subscriptionList.find((s)=>s.status == 'STACKED') || {};
            
            activeSubscription={ 
                title:"Origin Access",
                status:"STACK CARDS",
                nextBillingDate: new Date(stackedSubscription.nextBillingDate),
                productName:stackedSubscription.offerDetails.productName,
                startDate:new Date(stackedSubscription.subsStart),
                endDate:new Date(stackedSubscription.subsEnd),
                recurring:this.getRecurringVal(stackedSubscription.billingMode),                
                ofbItemTitle:stackedSubscription.offerDetails.ofbItemTitle,
                offerId:stackedSubscription.offerId,
                billingAccountId:stackedSubscription.billingAccountId,
                subscriptionId:stackedSubscription.subscriptionId,
                invoices: stackedSubscription.invoices,
                userId: stackedSubscription.userId
            };
        } 
        return activeSubscription;
    },
    getStackPreviousSubscriptionList:function(subscriptionData){
        let previousSubscriptions = [];
        let subscriptionList = subscriptionData.response;
        
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            let firstStackedIndex = subscriptionList.findIndex((s)=>s.status == 'STACKED');
            
            for (let i = 0; i < subscriptionList.length; i++) {
                if(i == firstStackedIndex) continue;
                
                let subscription={
                    status:this.getStatus(subscriptionList[i].status),
                    productName:subscriptionList[i].offerDetails.productName,
                    subscriptionId:subscriptionList[i].subscriptionId,
                    title:"Origin Access", 
                    nextBillingDate: new Date(subscriptionList[i].subsEnd),
                    startDate:new Date(subscriptionList[i].subsStart),
                    endDate:new Date(subscriptionList[i].subsEnd),
                    recurring:this.getRecurringVal(subscriptionList[i].billingMode),
                    dateCreated:new Date(subscriptionList[i].dateCreated),
                    expanded:false,
                    invoices: subscriptionList[i].invoices,
                    userId: subscriptionList[i].userId,
                    subscriptionType: "Stacked"
                };
                previousSubscriptions.push(subscription);
            } 
        }
        return previousSubscriptions;
    },
    setNucleusSubscriptions : function(component,event) {
        let nucleusSubSpinner = component.find("nucleusSubscriptionSpinner");
        $A.util.removeClass(nucleusSubSpinner,"slds-hide");
        const nucleusAction = component.get("c.getSubscriptions");
        nucleusAction.setParams({customerId:component.get("v.nucleusId")});
        nucleusAction.setCallback(this,function(response){
            let subSpinner = component.find("nucleusSubscriptionSpinner");
            $A.util.addClass(subSpinner,"slds-hide");
            const state = response.getState();
            if (state === "SUCCESS") {
                const subscriptionData = response.getReturnValue();
                let activeSubscription={};
                let previousSubs =[];
                //let isStackedSubscription = this.checkStackSubscription(subscriptionData);
                //if(isStackedSubscription){
                //  activeSubscription = this.getStackActiveSubscription(subscriptionData);
                //    previousSubs = this.getStackPreviousSubscriptionList(subscriptionData);
                //    component.set("v.activeSubscription",activeSubscription);
               //     component.set("v.inactiveSubscriptions",previousSubs);
                 //   component.set("v.subscriptionType","Stacked");
               // }else{
                    activeSubscription = this.getActiveNucleusSubscription(subscriptionData);
                    previousSubs = this.getPreviousNucleusSubscriptionList(subscriptionData);
                    //if($A.util.isEmpty(activeSubscription)){
                        //if(!($A.util.isEmpty(previousSubs))){
                         //   activeSubscription = previousSubs[0]; 
                          //  previousSubs = previousSubs.slice(1);
                        //}    
                   // }
                    component.set("v.activeNucleusSubscription",activeSubscription);
                    component.set("v.inactiveNucleusSubscriptions",previousSubs);
                    //component.set("v.subscriptionType","N");
                //}
                //$A.util.isEmpty(activeSubscription) &&
                if($A.util.isEmpty(previousSubs)){
                    let noSub = component.find("nucleusEmptyState");
                    $A.util.removeClass(noSub,"slds-hide");
                }
                
            }
            else {
                Util.handleErrors(component, response);
            }    
        });
        $A.enqueueAction(nucleusAction);
    },
    getActiveNucleusSubscription:function(subscriptionData){
        let activeSubscription={};
        let subscriptionList = subscriptionData.response;
        
        if(subscriptionList){
            activeSubscription={
                title:"Nucleus Subscriptions",
            };
        }
       return activeSubscription;
    },
    getPreviousNucleusSubscriptionList:function(subscriptionData){
        let previousSubscriptions = [];
        let subscriptionList = subscriptionData.response;
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            for (let i = 0; i < subscriptionList.length; i++) {                 
                    let subscription={
                        title:"Nucleus Subscriptions",
                        //nextBillingDate: new Date(subscriptionList[i].subsEnd),
                        status:this.getStatus(subscriptionList[i].status),
                        productName:subscriptionList[i].productName,
                        //startDate:new Date(subscriptionList[i].subsStart),
                        //endDate:new Date(subscriptionList[i].subsEnd),
                        dateCreated:new Date(subscriptionList[i].dateCreated),
                        recurring:this.getRecurringVal(subscriptionList[i].recurring),
                        duration: [subscriptionList[i].durationValue,subscriptionList[i].durationType].filter(Boolean).join(" "),
                        accountNumber: subscriptionList[i].creditCard ? subscriptionList[i].creditCard.cardNumber +" ("+subscriptionList[i].creditCard.cardType+")" : "",
                        subscriptionId:subscriptionList[i].subscriptionId,
                        invoices: subscriptionList[i].grantedTickets[0].invoiceDetails,
                        userId: subscriptionList[i].userId                 
                    };
                    previousSubscriptions.push(subscription);
            }
        }
        return previousSubscriptions;
    },
    setEAAccessSubscriptions:function(component,event) {
        let eaSubSpinner = component.find("eaAccessSubscriptionSpinner");
        $A.util.removeClass(eaSubSpinner,"slds-hide");
        const eaAccessAction = component.get("c.getEAASubscriptions");
        eaAccessAction.setParams({userId:component.get("v.nucleusId")});
        eaAccessAction.setCallback(this,function(response){
            let eaSubSpinner = component.find("eaAccessSubscriptionSpinner");
            $A.util.addClass(eaSubSpinner,"slds-hide");
            const state = response.getState();
            if (state === "SUCCESS") {
                const subscriptionData = response.getReturnValue();
                let eaAccessSubs = [];
                eaAccessSubs = this.getEAAccessSubscriptionList(subscriptionData);
                component.set("v.eaAccessSubscription",eaAccessSubs);
                if($A.util.isEmpty(eaAccessSubs)){
                    let eaAccessEmptyState = component.find("eaAccessEmptyState");
                    $A.util.removeClass(eaAccessEmptyState,"slds-hide");
                }
                
            }
            else {
                Util.handleErrors(component, response);
            }    
        });
        $A.enqueueAction(eaAccessAction);    
    },
    getEAAccessSubscriptionList:function(subscriptionData){
        let eaAccessSubscriptions = [];
        let subscriptionList = subscriptionData;
        
        if(subscriptionList){
            subscriptionList.sort(this.sortByDate);
            for (let i = 0; i < subscriptionList.length; i++) {                 
                    let subscription={
                        title:"EA Access - Standard",
                        status:subscriptionList[i].eaaSubscriptionItems[0].state,
                        displayName:subscriptionList[i].personaName,
                        personaId:subscriptionList[i].personaId,
                        productId:subscriptionList[i].eaaSubscriptionItems[0].productId,
                        recurring:'',
                        duration:this.getDuration(subscriptionList[i].eaaSubscriptionItems[0].endDate,subscriptionList[i].eaaSubscriptionItems[0].beginDate),
                        subscriptionId:subscriptionList[i].subscriptionId
                    };
                    eaAccessSubscriptions.push(subscription);
            }
        }
        return eaAccessSubscriptions;
    },
    getDuration:function(endDate,beginDate){
        let dt1 = new Date(beginDate);
        let dt2 = new Date(endDate);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24)) + ' DAYS';
    },
    fetchAllBillingAccountsByUserHelper: function(component, event, helper) {
        var billingAccountAction = component.get("c.fetchAllBillingAccountsByUser"); 
        billingAccountAction.setParams({userId:component.get("v.nucleusId")});
        billingAccountAction.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if (state === "SUCCESS") {
                if(storeResponse == null || storeResponse.length==0){
                    component.set('v.showSubscriptionButton',false);
                }else{
                    component.set('v.showSubscriptionButton',true);
                    component.set('v.billingAccList',storeResponse)
                }
            }
        });
        $A.enqueueAction(billingAccountAction);
    },
    sortByDate: function(a,b) {
        try{
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        }catch(err){
            return 0;   
        }
    },
    
    getCancelEffectiveDate : function(scheduleOperations){
        console.log('scheduleOperations==>',scheduleOperations);
        let cancelEffectiveDate;
        let scheduleOperationList = scheduleOperations;
        if(scheduleOperationList){
            for(let i=0; i < scheduleOperationList.length; i++){
                if(scheduleOperationList[i].operationName == 'CANCELLED')
                    cancelEffectiveDate = new Date(scheduleOperationList[i].scheduleDate);                
            }
        }
        return cancelEffectiveDate;
    }
})