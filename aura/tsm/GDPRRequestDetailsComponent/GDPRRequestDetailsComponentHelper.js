({
    getGDPRRequest : function(component, event, id) {        
        var Id;
        var userDate = new Date();
        var primaryIdType;
        var getGDPRRequestAction = component.get("c.getGDPRRequest");
        var self = this;
        this.showSpinner(component);
        getGDPRRequestAction.setParams({
            "id": id
        });
        getGDPRRequestAction.setCallback(this, function(a){
            var state = a.getState();
            
            if (state === "SUCCESS") {
                var result = a.getReturnValue();
                Id = id;
                primaryIdType = result.PrimaryIdType__c;
                component.set("v.requestId", Id);
                component.set("v.primaryIdType", primaryIdType);
                var getGDPRSecondIdAction = component.get("c.getGDPRRequestSeconaryIds");
                getGDPRSecondIdAction.setParams({
                    "Id": Id
                });
                getGDPRSecondIdAction.setCallback(this, function(b) {
                    
                    var state = a.getState();
                    if (state === "SUCCESS") {
                        var secondIds = b.getReturnValue();
                        if(secondIds.length >= 1) {
                            component.set("v.secondaryIds", secondIds);
                        };
                        
                        var getSubscriberStatusAction = component.get("c.getGDPRRequestSubscriberStatus");
                        getSubscriberStatusAction.setParams({
                            "Id": Id
                        });
                        getSubscriberStatusAction.setCallback(this, function(c) {
                            component.set("v.spinner", true);
                            var state = c.getState();
                            if (state === "SUCCESS") {
                                var rows = c.getReturnValue();
                                if (rows && Array.isArray(rows)) {
                                    for (var i = 0; i < rows.length; i++) {
                                        var row = rows[i];
                                        if (row.Status__c.toLowerCase() === "error" || 
                                            ((row.Status__c.toLowerCase() === "inprogress" || row.Status__c.toLowerCase() === "new" || row.Status__c.toLowerCase() === "acknowledged") 
                                             && userDate.getTime() > new Date(row.DueDateEOD__c).getTime())) {
                                            component.set("v.resendFlag", true);
                                        }
                                        if (row.Status__c.toLowerCase() == "affirmative with data attachment") {
                                            component.set("v.downloadFlag", true);
                                        }
                                        if (row.GDPRSubscriber__r) row.SubscriberName = row.GDPRSubscriber__r.Name;
                                    }
                                    component.set("v.total", rows.length);
                                }
                                
                                this.hideSpinner(component);
                                component.set('v.data', rows);
                                
                            }
                            else if (state === "ERROR") {
                                this.hideSpinner(component);
                                var errors = c.getError();
                                this.handleErrors();
                            }
                        });
                        $A.enqueueAction(getSubscriberStatusAction);
                        
                    }
                    else if (state === "ERROR") {
						this.hideSpinner(component);
                        var errors = b.getError();
                        this.handleErrors(errors);
                    }
                });
                $A.enqueueAction(getGDPRSecondIdAction);
            }
            else if (state === "ERROR") {
                this.hideSpinner();
                var errors = a.getError();
                this.handleErrors();
                
            }
        });
        $A.enqueueAction(getGDPRRequestAction);
    },
    
    getDownloadURL: function(component, event) {
        this.showSpinner(component);
        var action = component.get("c.getDownloadURL");
        var Id = component.get("v.requestId");
        action.setParams({
            "Id": Id
        });
        action.setCallback(this, function(a){
            var state = a.getState();
            if (state === "SUCCESS") {
                var msg = a.getReturnValue();
                if (typeof msg !== 'object') {
                    msg = JSON.parse(msg);
                }
                //var msg = JSON.parse(result);
                console.log(JSON.stringify(msg));
                if (msg["status"] === "ERROR"){
                    let toastParams = {
                        title: "Error",
                        message: msg["message"],
                        type: "error"
                    };
                    let toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams(toastParams);
                    toastEvent.fire();
                } 
                else if (msg["status"] === "SUCCESS"){
                    var message = msg["message"];
                    //var urls = [];
                    //if (message && Array.isArray(message)) {
                        //for (var i=0; i < message.length; i++) {
                            //if ( message[i]["url"] && Array.isArray(message[i]["url"])) {
                                //for(var j=0; j < message[i]["url"].length; j++) {
                                    //urls.push(message[i]["url"][j]);
                                //}
                            //}
                        //}
                    //}
                    if (message && Array.isArray(message) && message.length >= 0) {
                        if (message.length === 1 && message[0].clientName === "All") {
                            message[0].clientName = "All Clients";
                        }
                        component.set("v.dataAvailable", true);
                        component.set("v.downloadUrls", message);
                    }
                    
                }
                this.hideSpinner(component);
                
            }
            else if (state === "ERROR") {
                var errors = a.getError();
                this.hideSpinner(component);
                this.handleErrors();
            } else {
                this.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
        
    },
    
    resendRequest: function(component, event, Id) {
        this.showSpinner(component);
        var dueDate = component.get("v.dueDateResend");
        var resendAction = component.get("c.resendFailedRequestWithNewTransactionId");
        var Id = Id;
        resendAction.setParams({
            "Id": Id,
            "newDueDate": dueDate
        });
        resendAction.setCallback(this, function(a){
            try {
            var type = '';
            var message = '';
            var state = a.getState();
            if (state === "SUCCESS") {
                var objResult = a.getReturnValue();
                    console.log(objResult);
                var processResendActionClient = component.get("c.processResendRequestClients");
                var secondaryIds = objResult.secondaryIds;
                var playerRequest = objResult.playerRequest;
                    var retryClient = objResult.retryClient;
                processResendActionClient.setParams({
                    "gdprRequest": playerRequest,
                    "gdprRequestSecondaryIdList": secondaryIds,
                    "retryClient": retryClient
                });
                processResendActionClient.setCallback(this, function(response) {
                    let state = response.getState();
                    if (state === "SUCCESS") {
                        var newRequest = response.getReturnValue();
                        if (typeof newRequest !== 'object') {
                            newRequest = JSON.parse(newRequest);
                        }
                        this.hideSpinner(component);
                        if (newRequest && newRequest.requestId) {
                            message = "Request sent successfully. New transaction id: "+newRequest.requestId;
                            let toastParams = {
                                message: message,
                                duration: '50000',
                                type: "success",
                                mode: 'dismissible'
                            };
                            let toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams(toastParams);
                            toastEvent.fire();
                        } else {
                            this.handleErrors();
                        }
                        
                    } else if (state === "ERROR") {
                        this.hideSpinner(component);
                        this.handleErrors();
                    }
                });
                $A.enqueueAction(processResendActionClient);
                
                
            }
            else if (state === "ERROR") {
                this.hideSpinner(component);
                this.handleErrors();
            } else {
                this.hideSpinner(component);
            }
            } catch(e) {
                console.error(e);
                this.hideSpinner(component);
                this.handleErrors();
            }
            
        });
        $A.enqueueAction(resendAction);
    },
    
    handleErrors : function(errors) {
        let toastParams = {
            title: "Error",
            message: "An error occured while processing request", // Default error message
            type: "error"
        };
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    },
    hideSpinner: function(component, event) {
        component.set("v.spinner", false);
    },
    showSpinner: function(component, event) {
        component.set("v.spinner", true);
    },
    
})