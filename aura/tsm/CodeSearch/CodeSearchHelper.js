({
    searchCode : function(component, event) {
        var isEnterKey = event.keyCode === 13;
        var resultContainer = component.find("resultContainer");
        var self = this;
        if (isEnterKey) {
            component.set("v.codeSearchResult",{});
            $A.util.addClass(resultContainer,"slds-hide");
            var queryTerm = component.find('search-input').get('v.value');
            component.set('v.isSearching', true);
            var code = component.get("v.code");
            var codeSearchData = component.get("v.codeSearchData");
            var action = component.get("c.getCode");
            action.setParams({
                codeString : code
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var data = response.getReturnValue();
                    var result = JSON.parse(data);
                    codeSearchData = result.response[0];
                    self.prepareDataForRender(component, event, result.response[0]);
                    $A.util.removeClass(resultContainer,"slds-hide");
                    component.set('v.noResults', false);
                    component.set('v.codeSearchData', codeSearchData);
                }
                else{
                    $A.util.removeClass(resultContainer,"slds-hide");
                    component.set('v.wrongCode', code);
                    component.set('v.noResults', true);
                    component.set('v.codeSearchData', {});
                }
                component.set('v.isSearching', false);
            });
            $A.enqueueAction(action);
        }
    },
    prepareDataForRender : function(component, event, data) {
        component.set("v.codeIsConsumed",false);
        component.set("v.codeNotConsumed",false);
        component.set("v.codeAllowdForMultipleUse",false);
        component.set("v.showAccountButton",false);
        component.set("v.showConsumeButton",false);

        if (data.multiUse && Number(data.multiUseCount) < Number(data.multiUseLimit)) {
            component.set("v.codeAllowdForMultipleUse",true);
            component.set("v.showConsumeButton",true);
        } else if (data.status !== 'USED') {
            component.set("v.codeNotConsumed",true);
            component.set("v.showConsumeButton",true);
        } else {
            component.set("v.codeIsConsumed",true);
            component.set("v.showAccountButton",true);
        }
        component.set("v.codeSearchResult",data);
    },
    openAccountTab : function(component, event, data) {
        var data = component.get("v.codeSearchResult");
        var accountId = data.sfAccountId;
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                recordId: accountId,
                focus: true
            }).catch(console.log);
            component.set("v.searchCodes", false);
        }).catch(console.log);
    }
})