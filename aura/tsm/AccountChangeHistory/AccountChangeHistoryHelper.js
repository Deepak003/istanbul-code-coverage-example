({
    getColumnFields:function(cmp){
        var columns = [
            {label: 'TIME (GMT)', fieldName: 'createddate', type: 'date', sortable: false},
            {label: 'ACTIVITY', fieldName: 'activityDesc', type: 'text', sortable: false},
            {label: 'IP/LOCATION', fieldName: 'ipaddress', type: 'text', sortable: false}
          ];

        return columns;
    },
    getLoginTypes:function(cmp){
        var loginPicklistValues = [
            {'label': 'All Logins', 'value': 'All'},
            {'label': 'Successful', 'value': 'Successful'},
            {'label': 'Trusted', 'value': 'Trusted'},
            {'label': 'Suspicious', 'value': 'Suspicious'},
          ];
        return loginPicklistValues;
    },
    getChangeTypes:function(cmp){
        var changePicklistValues = [
            {'label': 'All Changes', 'value': 'All'},
            {'label': 'Email', 'value': 'Email'},
            {'label': 'TFA', 'value': 'TFA'},
            {'label': 'Primary Info', 'value': 'Primary_Info'},
          ];
        return changePicklistValues;
    },        
    getDurationTypes:function(cmp){
        var durationPicklistValues = [
            {'label': 'Last 30 days', 'value': 'ThirtyDays'},
            {'label': 'Last 14 days', 'value': 'FourteenDays'},
            {'label': 'Last 7 days', 'value': 'SevenDays'},
            {'label': 'Last 24 hours', 'value': 'TwentyFourHours'},
            {'label': 'Last 90 days', 'value': 'NinetyDays'}
          ];
        return durationPicklistValues;
    },
    getAccountLoginHistoryData:function(cmp){
        const action = cmp.get("c.getCustomerLoginHistory");
        const nucleusId = cmp.get("v.nucleusId");
        var duration1 = cmp.get("v.durationFilter");
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 90);
        
        var toDate = new Date();
        var stringFromDate = this.formatDate(fromDate);
        var stringToDate = this.formatDate(toDate);
        action.setParams({ strUserId : nucleusId,
                          strFromDate:stringFromDate,
                          strToDate:stringToDate});
        
        action.setCallback(this, (response)=> {
            const state = response.getState(); 
            cmp.set("v.isLoading",false);
            //var accountSpinner = cmp.find("accountChangeSpinner");
            //$A.util.toggleClass(accountSpinner, "slds-hide");
            
            if (state === "SUCCESS") {
                var duration2 = cmp.get("v.durationFilter");
                let loginHistoryData = response.getReturnValue();
                const formattedChangeResponse = this.formatResponse(loginHistoryData);
                this.getAccountChangeHistory(cmp,formattedChangeResponse);
            }
            else {
                console.log("Failed with state in getAccountLoginHistoryData: " + state);
            }
        });
        
        $A.enqueueAction(action);    
    },
    getAccountChangeHistory:function(cmp,loginHistoryResponse){
        //var accountSpinner = cmp.find("accountChangeSpinner");
        //$A.util.toggleClass(accountSpinner, "slds-hide");
        cmp.set("v.isLoading",true);

        const actionChange = cmp.get("c.getAccountChangeHistory");
        const nucleusId = cmp.get("v.nucleusId");
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 90);
        
        var toDate = new Date();
        var stringFromDate = this.formatDate(fromDate);
        var stringToDate = this.formatDate(toDate);
        actionChange.setParams({ strUserId : nucleusId,
                          strFromDate:stringFromDate,
                          strToDate:stringToDate});
        actionChange.setCallback(this, (response)=> {
            var duration3 = cmp.get("v.durationFilter");
            const state = response.getState();  
            //var accountSpinner = cmp.find("accountChangeSpinner");
            //$A.util.toggleClass(accountSpinner, "slds-hide");
            cmp.set("v.isLoading",false);
            if (state === "SUCCESS") {
                const accountChangeData = response.getReturnValue();
                const formattedChangeResponse = this.formatResponse(accountChangeData);
            
                const combineChangeResponse = [...loginHistoryResponse,...formattedChangeResponse];
                combineChangeResponse.sort(function(a,b){
                  return b.time - a.time;
                });
        
                var durationValue = cmp.get("v.durationFilter");
                const initialCombineChangeResponse = combineChangeResponse.filter((changeRec) => {
                    return this.applyDateFilter(durationValue,changeRec); 
                });
                
                
                
        
                cmp.set("v.caseUpdatesList",combineChangeResponse);
                cmp.set("v.caseUpdatesFilteredList",initialCombineChangeResponse);
                if(initialCombineChangeResponse.length<1){
                    let noResultsElemWithoutSearch = cmp.find("noResultsBlockWithoutSearch");
                    $A.util.removeClass(noResultsElemWithoutSearch,"slds-hide");
                    let noResultsElem = cmp.find("noResultsBlock");
                    $A.util.addClass(noResultsElem,"slds-hide");
                }
            }
            else {
                console.log("Failed with state in getAccountChangeHistory: " + state);
            }
        });
        
        $A.enqueueAction(actionChange);       
    },
    getAccountEmailHistoryData:function(cmp){
        const emailAction = cmp.get("c.getEmailAddressChanges");
        const nucleusId = cmp.get("v.nucleusId");
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 90);
       
        var toDate = new Date();
        emailAction.setParams({ strUserId : nucleusId,
                               strStartDate: '',  //strStartDate: fromDate,
                               strEndDate:''        //strEndDate:toDate
                              });
        emailAction.setCallback(this, (response)=> {
            const state = response.getState();           
            if (state === "SUCCESS") {
                const emailChangeHistory = response.getReturnValue();
                var emailSpinner = cmp.find("emailChangeSpinner");
                $A.util.toggleClass(emailSpinner, "slds-hide");
                cmp.set("v.emailData", this.formatEmailResponse(emailChangeHistory));
                cmp.set("v.emailFilteredData", this.formatEmailResponse(emailChangeHistory));
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(emailAction); 
    },
    formatResponse:function(respData){
        let constructData = [];
        respData.forEach((changeHistoryRec)=>{
            
            switch(changeHistoryRec.historyType) {
                
                case "LoginHistory":
                    let activityDesc;
                    let styleClass;
                    if(changeHistoryRec.result === "SUCCEEDED"){
                        activityDesc = "Successful login via ";
                        if(changeHistoryRec.clientId === "ORIGIN_PC"){
                            activityDesc+= "Origin/Web Browser";
                        }else{
                            activityDesc+=changeHistoryRec.clientId;
                        }
                        
                        if(changeHistoryRec.loginType === "Suspicious"){
                            styleClass = "suspiciousSuccessful";
                        }else{
                            styleClass = "regularSuccessful";    
                        }
                        
                    }else if(changeHistoryRec.result === "FAILED"){
                        activityDesc = "Failed login via ";
                        if(changeHistoryRec.clientId === "ORIGIN_PC"){
                            activityDesc+= "Origin/Web Browser";
                        }else{
                            activityDesc+=changeHistoryRec.clientId;
                        }
                        
                        if(changeHistoryRec.loginType === "Suspicious"){
                            styleClass = "suspiciousFailed";
                        }else{
                            styleClass = "regularSuccessful";    
                        }
                    }
                    
                    var changeObj = {
                        time: new Date(changeHistoryRec.timeStamp),
                        activity : activityDesc,
                        ip : changeHistoryRec.ip,
                        location : this.removePinCode(changeHistoryRec.ipGeolocation),
                        loginType:changeHistoryRec.loginType,
                        rowStyleClass:styleClass,
                        disableCheckbox:true,
                    }
                    constructData.push(Object.assign({},changeObj));
                    break;
                case "AccountHistory" :
                    let activityChangeDesc = "";
                    var changeStyleClass, changeObj = {}, accountData;
                    if(!changeHistoryRec.newValue && (changeHistoryRec.newValue === " " || changeHistoryRec.newValue === "" || changeHistoryRec.newValue === "null")){
                        changeHistoryRec.newValue = "-";        
                    }
                    if(changeHistoryRec.result === "SUCCEEDED") {
                        activityChangeDesc = "Successful to change ";
                    } else if(changeHistoryRec.result === "FAILED") {
                        activityChangeDesc = "Failed to change ";
                    }
                    if(changeHistoryRec.fieldChanged === "SpendingLimitSettings - microcontent"){
                        activityChangeDesc += "Spending limit for microcontent set to <strong>" + changeHistoryRec.microcontent + "</strong>";
                        if(accountData) {
                            activityChangeDesc += " for <strong>" + accountData.email + "</strong>";
                            changeObj.email = accountData.parentalEmail;
                        }
                    }
                    else if(changeHistoryRec.fieldChanged === "SpendingLimitSettings - non-microcontent"){
                        activityChangeDesc += "Spending limit for non microcontent set to <strong>" + changeHistoryRec.nonmicrocontent + "</strong>";
                        if(accountData) {
                            activityChangeDesc += " for <strong>" + accountData.email + "</strong>";                 
                            changeObj.email = accountData.parentalEmail;
                        }
                    }
                    else if(!changeHistoryRec.oldValue || changeHistoryRec.oldValue === " " || changeHistoryRec.oldValue ==="" || changeHistoryRec.oldValue ==="null"){
                        activityChangeDesc += this.capitalizeFirstLetter(changeHistoryRec.fieldChanged);
                        activityChangeDesc += " to <strong>";
                        activityChangeDesc += changeHistoryRec.newValue + "</strong>";
                    }else{
                        activityChangeDesc += this.capitalizeFirstLetter(changeHistoryRec.fieldChanged);
                        activityChangeDesc += " from <strong>"+ this.formatString(changeHistoryRec.oldValue,changeHistoryRec.fieldChanged);
                        activityChangeDesc += "</strong> to <strong>" + this.formatString(changeHistoryRec.newValue,changeHistoryRec.fieldChanged) + "</strong>";
                    }
                    
                    if(changeHistoryRec.ipGeolocation && changeHistoryRec.loginType === "Suspicious"){
                        changeStyleClass = "showSuspiciousIcon";
                    }
                    Object.assign(changeObj, {
                        time: new Date(changeHistoryRec.timeStamp),
                        fieldName:changeHistoryRec.fieldChanged,
                        activity : activityChangeDesc,
                        ip : "",
                        location : this.removePinCode(changeHistoryRec.ipGeolocation),
                        loginType:changeHistoryRec.loginType,
                        rowStyleClass:changeStyleClass,
                        disableCheckbox:false                       
                    })
                    constructData.push(Object.assign({},changeObj));
                    break; 
                    //TSM-3812 - Adding logic for AccountLinkingHistory
                case "AccountLinkingHistory" :
                    let accountlinkingChangeDesc = "Successful to change ";
                    var changeStyleClass;
                    if(!changeHistoryRec.newValue && (changeHistoryRec.newValue === " " || changeHistoryRec.newValue === "" || changeHistoryRec.newValue === "null")){
                        changeHistoryRec.newValue = "-";        
                    }

                    if(!changeHistoryRec.oldValue || changeHistoryRec.oldValue === " " || changeHistoryRec.oldValue ==="" || changeHistoryRec.oldValue ==="null"){
                        accountlinkingChangeDesc += this.capitalizeFirstLetter(changeHistoryRec.fieldChanged);
                        accountlinkingChangeDesc += " to <strong>";
                        accountlinkingChangeDesc += changeHistoryRec.newValue + "</strong>";
                    }else{
                        accountlinkingChangeDesc += this.capitalizeFirstLetter(changeHistoryRec.fieldChanged);
                        accountlinkingChangeDesc += " from <strong>"+ this.formatString(changeHistoryRec.oldValue,changeHistoryRec.fieldChanged);
                        accountlinkingChangeDesc += "</strong> to <strong>" + this.formatString(changeHistoryRec.newValue,changeHistoryRec.fieldChanged) + "</strong>";
                    }

                    //Adding condition to check the case number if undefined
                    if(changeHistoryRec.caseNumber != undefined){
                        accountlinkingChangeDesc = accountlinkingChangeDesc + " for Case Number : " + changeHistoryRec.caseNumber;
                    }

                    var changeObj = {
                        time: new Date(changeHistoryRec.timeStamp),
                        fieldName:changeHistoryRec.fieldChanged,
                        activity : accountlinkingChangeDesc,
                        ip : "",
                        location : this.removePinCode(changeHistoryRec.ipGeolocation),
                        loginType:changeHistoryRec.loginType,
                        rowStyleClass:changeStyleClass,
                        disableCheckbox:false,
                    }
                    constructData.push(Object.assign({},changeObj));
                    break;
                case "Debit" :
                    let debitChangeDesc;

                    debitChangeDesc = " Advisor debited player ";
					debitChangeDesc += changeHistoryRec.fieldChanged.toLowerCase() +" : <strong>";
                    debitChangeDesc += changeHistoryRec.newValue + "</strong>";
                    
                    var changeObj = {
                        time: new Date(changeHistoryRec.timeStamp),
                        fieldName:changeHistoryRec.fieldChanged,
                        activity : debitChangeDesc,
                        ip : "",
                        location : "",
                        loginType:"",
                        disableCheckbox:false,
                    }
                    constructData.push(Object.assign({},changeObj));
                    break;
				case "Credit" :
                    let creditChangeDesc;

                    creditChangeDesc = " Advisor credited player ";
					creditChangeDesc += changeHistoryRec.fieldChanged.toLowerCase() +" : <strong>";
                    creditChangeDesc += changeHistoryRec.newValue + "</strong>";
                    
                    var changeObj = {
                        time: new Date(changeHistoryRec.timeStamp),
                        fieldName:changeHistoryRec.fieldChanged,
                        activity : creditChangeDesc,
                        ip : "",
                        location : "",
                        loginType:"",
                        disableCheckbox:false,
                    }
                    constructData.push(Object.assign({},changeObj));
                    break; 
            }
            
            
        })
        return constructData;
    },
    formatEmailResponse:function(emailHistoryResponse){
        let formattedEmailResponse = [];
        emailHistoryResponse.forEach((emailHistoryRec)=>{
                    var emailChangeDate = new Date(emailHistoryRec.dateCreated);
                    var ninetyDaysBackDate = new Date();
                    ninetyDaysBackDate = ninetyDaysBackDate.setDate(ninetyDaysBackDate.getDate()-90);
                    if(emailChangeDate < ninetyDaysBackDate){
                        let emailActivityDesc;
                        emailActivityDesc = "Email changed from <strong>";
                        emailActivityDesc += emailHistoryRec.originalValue;
                        emailActivityDesc += "</strong> -to- <strong>" + emailHistoryRec.newValue+ "</strong>";
                        
                        var emailChangeObj = {
                            time: new Date(emailHistoryRec.dateCreated),
                            activity : emailActivityDesc,
                            ip : "",
                            location : "",
                            loginType:""
                        }
                        formattedEmailResponse.push(Object.assign({},emailChangeObj));
                    }
                    
        })
        formattedEmailResponse.sort(function(a,b){
            return b.time - a.time;
        });
        return formattedEmailResponse;
    },
    
    formatString: function(str,fieldName){
        // return original string if string is not a date string
        if(isNaN(new Date(str)) ) {
            return str;
        }
        if(!fieldName.toLowerCase().includes('date')){
            return str;
        }
        
        return Util.getFormattedDateTime(str, 'only-date');
        
    },
    
    applyFilters:function(cmp){
        this.pushFilterDataToPills(cmp);
        this.toggleFilterBox(cmp);
        this.filterDataOnPillConditions(cmp);        
    },
    toggleFilterBox:function(cmp){
        var filterBox = cmp.find("filterBox");
        $A.util.toggleClass(filterBox, "boxToggle");        
    },
    resetFiltersAsPills:function(cmp){
        let pillConditions = cmp.get("pillsFilterList"); 
        
    },
    removeFilter:function(cmp,event){
       
    },
    capitalizeFirstLetter:function(fieldName) {
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    },
    applyDateFilter:function(durationValue,historyRecord){
        var durationDate = new Date();
        if(durationValue === 'ThirtyDays'){
            durationDate= durationDate.setDate(durationDate.getDate()-30);
        }
        if(durationValue === 'FourteenDays'){
            durationDate= durationDate.setDate(durationDate.getDate()-14);
        } 
        if(durationValue === 'SevenDays'){
            durationDate= durationDate.setDate(durationDate.getDate()-7);
        }
        if(durationValue === 'NinetyDays'){
            durationDate= durationDate.setDate(durationDate.getDate()-90);
        }
        if(durationValue === 'TwentyFourHours'){
            durationDate= durationDate.setDate(durationDate.getDate()-1);
        }
        return durationDate<=historyRecord.time;
    },
    searchRecordsWithKeyword:function(cmp,event){
        let searchWord = cmp.get("v.SearchKeyWord");
        this.filterDataOnPillConditions(cmp);
        const pillFilterRecords = cmp.get("v.caseUpdatesFilteredList");
        const searchedRecords = pillFilterRecords.filter((record)=>{
            var searchSuccess=false;
            if(record.activity && record.activity.toLowerCase().indexOf(searchWord.toLowerCase()) > -1){
                searchSuccess = true;
            }
            if(record.ip && record.ip.toLowerCase().indexOf(searchWord.toLowerCase()) > -1){
                searchSuccess = true;
            } 
            if(record.location && record.location.toLowerCase().indexOf(searchWord.toLowerCase()) > -1){
                searchSuccess = true;
            } 
            return searchSuccess;
        });
        cmp.set("v.caseUpdatesFilteredList",searchedRecords);
        if(searchedRecords.length<1){
            if(searchWord){
                let noResultsElem = cmp.find("noResultsBlock");
                $A.util.removeClass(noResultsElem,"slds-hide");
                let noResultsElemWithoutSearch = cmp.find("noResultsBlockWithoutSearch");
                $A.util.addClass(noResultsElemWithoutSearch,"slds-hide");
            }else{
                let noResultsElemWithoutSearch = cmp.find("noResultsBlockWithoutSearch");
                $A.util.removeClass(noResultsElemWithoutSearch,"slds-hide");
                let noResultsElem = cmp.find("noResultsBlock");
                $A.util.addClass(noResultsElem,"slds-hide");
            }
        }else{
            let noResultsElem = cmp.find("noResultsBlock");
            $A.util.addClass(noResultsElem,"slds-hide");
            let noResultsElemWithoutSearch = cmp.find("noResultsBlockWithoutSearch");
            $A.util.addClass(noResultsElemWithoutSearch,"slds-hide");
        }
    },
    pillRemoveClick:function(cmp,event){
        var rmvId = event.target.getAttribute('data-id'),
            selectedRecords = cmp.get("v.pillsFilterList"),
            rmIndex = '',
            smRecValue = selectedRecords[rmvId].value;
        event.preventDefault();
        event.stopPropagation();
        if (rmvId > -1 && !(smRecValue.toLowerCase().indexOf("days")>-1 || smRecValue.toLowerCase().indexOf("hours")>-1)) {
            selectedRecords.splice(rmvId, 1);
            cmp.set("v.pillsFilterList", selectedRecords);
            cmp.set("v.pillLength", selectedRecords.length);
            var loginValue = cmp.get("v.loginFilter");
            var changeValue = cmp.get("v.changeFilter");
            var durationValue = cmp.get("v.durationFilter");
            if(loginValue == smRecValue){
                cmp.set("v.loginFilter",'All');     
            }
            if(changeValue == smRecValue){
                cmp.set("v.changeFilter",'All');        
            }
        }
        this.filterDataOnPillConditions(cmp);
    },
    pushFilterDataToPills:function(cmp){
        let pillsData = [];
        
        var durationValue = cmp.get("v.durationFilter");
        var loginValue = cmp.get("v.loginFilter");
        var changeValue = cmp.get("v.changeFilter");
        
        var durationObjValue;
        if(durationValue != null){
            durationObjValue = cmp.get("v.duration").find(function (obj) { return obj.value === durationValue; });    
            pillsData.push(durationObjValue);
        }
        
        
        var loginObjValue;
        if(loginValue != null && loginValue !="All"){
            loginObjValue = cmp.get("v.loginTypes").find(function (obj) { return obj.value === loginValue; });    
            pillsData.push(loginObjValue);
        }
        
        
        var changeObjValue;
        if(changeValue != null && changeValue !="All"){
            changeObjValue = cmp.get("v.changeTypes").find(function (obj) { return obj.value === changeValue; });    
            pillsData.push(changeObjValue);
        }
        
        
        cmp.set("v.pillsFilterList",pillsData);
        cmp.set("v.pillLength",pillsData.length);        
    },
    filterDataOnPillConditions:function(cmp){
        let changeData = cmp.get("v.caseUpdatesList");
        let emailData = cmp.get("v.emailData");
        var changeFilterData;
        
        var durationValue = cmp.get("v.durationFilter");
        var loginValue = cmp.get("v.loginFilter");
        var changeValue = cmp.get("v.changeFilter");
        
        changeFilterData = changeData.filter((el) => {
            var returnValue=false;
            
            if(loginValue){
                var loginFilterValue;
                if(loginValue === 'Suspicious'){
                    loginFilterValue = 'Suspicious';
                    if(el.loginType === loginFilterValue && el.activity.toLowerCase().indexOf("login") > -1){
                        returnValue=this.applyDateFilter(durationValue,el);
                    }
                }else if(loginValue === 'Trusted'){
                    loginFilterValue = 'Regular'
                    if(el.loginType === loginFilterValue){
                        returnValue=this.applyDateFilter(durationValue,el);
                    }
                }else if(loginValue === 'Successful'){
                    if(el.activity.toLowerCase().indexOf(loginValue.toLowerCase()) > -1){
                        returnValue=this.applyDateFilter(durationValue,el);
                    }
                }/*else if(loginValue === 'All'){
                    returnValue=this.applyDateFilter(durationValue,el);
                }*/
            }
            if(changeValue){
               var changeFilterValue;
                if(changeValue === 'Email'){
                    if(el.fieldName){
                        if(el.fieldName.toLowerCase().indexOf('oldsecondaryemail')>-1){
                            returnValue=this.applyDateFilter(durationValue,el);
                        }else if(el.fieldName.toLowerCase().indexOf('email')>-1){
                            returnValue=this.applyDateFilter(durationValue,el);
                        }else if(el.fieldName.toLowerCase().indexOf('newsecondaryemail')>-1){
                            returnValue=this.applyDateFilter(durationValue,el);
                        }else if(el.fieldName.toLowerCase().indexOf('parentalemail')>-1){
                            returnValue=this.applyDateFilter(durationValue,el);
                        }
                    }
                }
                if(changeValue === 'TFA'){
                    var tfaFieldValue = "twofactorType";
                    if(el.fieldName && el.fieldName.toLowerCase().indexOf(tfaFieldValue.toLowerCase()) > -1){
                        returnValue=this.applyDateFilter(durationValue,el);
                    }
                }
                /*if(changeValue === 'All'){
                    returnValue=this.applyDateFilter(durationValue,el);    
                }*/
                //TODO Primary Info check after clarification from Business
            }
            if(changeValue==='All'  && loginValue ==='All' && durationValue){
               returnValue=this.applyDateFilter(durationValue,el);
            }
            
            return returnValue;
        });
        
        cmp.set("v.caseUpdatesFilteredList",changeFilterData);        
    },
    formatDate:function(dt){
        
        var month = '' + (dt.getMonth() + 1),
                day = '' + dt.getDate(),
                year = dt.getFullYear(),
                hour = '' +dt.getHours(),
                minutes ='' +dt.getMinutes();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if(minutes.length<2) minutes ='0'+minutes;
        var strDateValue = [year, month, day].join('-');
        var strTimeValue=[hour,minutes].join(':')
        strTimeValue +='Z';
        var strDate = [strDateValue,strTimeValue].join('T'); 
        return strDate;
    },
    removePinCode:function(geoLocation){
        if(geoLocation) {
            return geoLocation.split('-',2).join('-');
        }
    }
  });