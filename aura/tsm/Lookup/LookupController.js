({
    onclick: function(component,event,helper) {
        var forOpen = component.find("searchRes"),
            getInputkeyWord = component.get("v.SearchKeyWord"),
            listBox = component.find('listbox'),
            dependentEVType = component.get('v.dependentEVType'),
            sRecord = component.get('v.sRecord'),
            listOfSearchRecords = component.get('v.listOfSearchRecords'),
            searchRecs = component.find("selections");
		component.set("v.Message", '');
        if(component.get('v.eventType')=='entitlementSelect'){
            var cmpEvent = component.getEvent("cmpEntitlement");
            cmpEvent.fire();
        }
        component.set('v.keypadEvent', false);
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        component.set("v.traverseIndx", 0);
        setTimeout( function() { listBox.getElement().scrollTop = 0; }, 500);     
        if (dependentEVType && sRecord && Object.keys(sRecord).length) {
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close'); 
        } else if (!dependentEVType) {
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        }
    },
    onfocus : function(component,event,helper) {
        component.set('v.keypadEvent', false);
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes"),
            getInputkeyWord = component.get("v.SearchKeyWord"),
            listBox = component.find('listbox'),
            dependentEVType = component.get('v.dependentEVType'),
            sRecord = component.get('v.sRecord'),
            searchRecs = component.find("selections");
        component.set("v.traverseIndx", 0);
        setTimeout( function() { listBox.getElement().scrollTop = 0; }, 500);
        $A.get("e.c:LookupFocusEvt").fire();
        if (dependentEVType && sRecord && Object.keys(sRecord).length) {
            helper.searchHelper(component,event,getInputkeyWord);
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        } else if (!dependentEVType) {
            helper.searchHelper(component,event,getInputkeyWord);
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        }
    },
    reset: function(component, event, helper) {
        var forclose = component.find("searchRes"),
            selRecord = component.get("v.oRecord");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        component.set('v.isMouseOver', false);
        component.set('v.keypadEvent', false);
        if(!selRecord) {
            //component.set("v.SearchKeyWord", "");
        }
    },
    onblur : function(component,event,helper){       
        helper.onBlur(component, event, helper);
    },
    onMouseOver: function(component, event, helper) {
        component.set('v.isMouseOver', true);
    },
    onMouseOut: function(component, event, helper) {
        component.set('v.isMouseOver', false);
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = event.currentTarget.value,
            tpFlag = component.get('v.tpFlag'),
            keyCode = event.getParams ? event.getParams().keyCode : event.keyCode,        
            searchRes = component.find("searchRes"),
            searchRecs = component.find("selections"),
            traverseIndx = component.get("v.traverseIndx"),
            input = component.find("inputText"),
            listBox = component.find('listbox'),
            dependentEVType = component.get('v.dependentEVType'),
            sRecord = component.get('v.sRecord'),
            evType = component.get("v.eventType"),
            timer = component.get('v.keyPressTimer');
        component.set('v.SearchKeyWord', getInputkeyWord);
        clearTimeout(timer);
        timer = setTimeout(function() {
            if (searchRecs && searchRecs.sort && (keyCode == 9 || keyCode == 13 || keyCode == 38 || keyCode == 40)) {
                searchRecs.sort(function(a,b) {
                    if(a.getElement() && b.getElement()){
                        return a.getElement().getAttribute('data-index') - b.getElement().getAttribute('data-index'); 
                    }                                                
                });
            }
            component.set('v.keypadEvent', true);
            // check if getInputKeyWord size id more then 0 then open the lookup result List and 
            // call the helper 
            // else close the lookup result List part.  
            // on press escape
            if (keyCode == 27) {
                $A.util.addClass(searchRes, 'slds-is-close');
                $A.util.removeClass(searchRes, 'slds-is-open');
                getInputkeyWord = '';
                component.set("v.SearchKeyWord", getInputkeyWord);
                component.set('v.selectedRecord', {});
                component.set('v.oRecord', {});
                helper.searchHelper(component, event, getInputkeyWord);
                console.log('calling at 123');
                helper.triggerEvent(component, event, evType, false, true);
            } 
            // on press enter/tab
            else if ((keyCode == 9 || keyCode == 13) && ((traverseIndx && searchRecs[traverseIndx - 1])
                                                         || typeof searchRecs != "undefined"  && typeof searchRecs.length == "undefined")){
                console.log('keycode tabbed one searchRecs');
                if(typeof searchRecs.length == "undefined" && searchRecs.getElement) searchRecs.getElement().click();
                else searchRecs[traverseIndx - 1].getElement().click();
                $A.util.addClass(searchRes, 'slds-is-close');
                $A.util.removeClass(searchRes, 'slds-is-open');
                component.set("v.traverseIndx", 0);
                setTimeout($A.getCallback(function() {
                    input.getElement().focus();
                    var lElements = document.querySelectorAll('.slds-form-element__control');
                    for (var x = 0; x < lElements.length; x++) {
                        if (lElements[x].querySelector('input') == component.getElement().querySelector('input')) {
                            if (lElements[x+1] && lElements[x+1].offsetWidth != 0 && lElements[x+1].offsetHeight != 0) {
                                lElements[x+1].querySelector('input').focus();
                            } else {
                                input.getElement().blur();
                                helper.onBlur(component,event,helper);
                            }
                            break;
                        }
                    }
                }), 100);
            } 
            // on press up
            else if (keyCode == 38 ) {
                if (dependentEVType && sRecord && Object.keys(sRecord).length) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close');          
                } else if (!dependentEVType) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close');
                }
                if (traverseIndx > 1) {
                    traverseIndx--;
                    component.set("v.traverseIndx", traverseIndx);            
                    if (searchRecs[traverseIndx - 1]) searchRecs[traverseIndx - 1].getElement().focus();
                }
            } 
            //on press down
            else if (keyCode == 40) {
                console.log(searchRecs);
                console.log(sRecord);
                if (dependentEVType && sRecord && Object.keys(sRecord).length) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close');          
                } else if (!dependentEVType) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close');
                }
                if (searchRecs && traverseIndx < searchRecs.length) {
                    traverseIndx++;
                    console.log('iffff');
                    component.set("v.traverseIndx", traverseIndx);
                    if (searchRecs[traverseIndx - 1]) searchRecs[traverseIndx - 1].getElement().focus();
                }
                else if(typeof searchRecs != "undefined"){
                    searchRecs.getElement().focus(); 
                }
            }
            else if(!tpFlag){
                component.set('v.tpFlag', true);
                if (dependentEVType && sRecord && Object.keys(sRecord).length) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close'); 
                    helper.searchHelper(component,event,getInputkeyWord);
                } else if (!dependentEVType) {
                    $A.util.addClass(searchRes, 'slds-is-open');
                    $A.util.removeClass(searchRes, 'slds-is-close');
                    helper.searchHelper(component,event,getInputkeyWord);
                }
                if (getInputkeyWord.length === 0) {
                    component.set('v.oRecord', undefined);
                    component.set('v.selectedRecord', {});
                    if (keyCode == 8 || keyCode == 46) {
                        console.log('calling at 179');
                        helper.triggerEvent(component, event, evType, false, true);
                    }
                }
            }
            else { 
                var forclose = component.find("searchRes");
                $A.util.addClass(forclose, 'slds-is-close');
                $A.util.removeClass(forclose, 'slds-is-open');
                if (getInputkeyWord.length === 0) {
                    component.set('v.oRecord', undefined);
                    component.set('v.selectedRecord', {});
                } 
            }
            clearTimeout(timer);
            component.set('v.keyPressTimer', 0);
        }, 0);
        component.set('v.keyPressTimer', timer);
        event.stopPropagation();
        event.preventDefault();
    },   
    // function for clear the Record Selection 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} ); 
        component.set("v.traverseIndx", 0);
    },    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        var forclose = component.find("lookup-pill"),
            lookUpTarget = component.find("lookupField");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
        forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');  
        
    },  

    selectRecord : function(component, event, helper) {      
        // get the selected record from list  
        var recordsAll = component.get("v.listOfSearchRecords"),
            recordId = event.currentTarget.getAttribute('data-id'),
            evType = component.get("v.eventType");
        component.set('v.SearchKeyWord', event.currentTarget.innerText);
        $A.util.addClass(component.find('searchIcon1'), 'slds-hide');
        $A.util.addClass(component.find('closeIcon'), 'slds-show');
        var getSelectRecord = component.get("v.oRecord"),
            oldSeletedRec = getSelectRecord,
            clearObjFlag = false;
        
        getSelectRecord = recordsAll.find(function(pData, pindex) {
             if (pData.Id == recordId) {                 
                 return pData;
             }
        });
        clearObjFlag = oldSeletedRec != getSelectRecord ? true : clearObjFlag;
        component.set("v.oRecord", getSelectRecord);
        if (component.get("v.multipleSelect")) {
            var selectedRecords = component.get("v.listOfSelectedRecords");
            var recordExists = selectedRecords.find(function(pData, pindex) {
                 if (pData.Id == getSelectRecord.Id) {                 
                     return pData;
                 }
            });
            if (!recordExists) {
                selectedRecords.push(getSelectRecord);
                if (selectedRecords.length > 1) {
                    var selectLabel = selectedRecords.length + ' ' + component.get("v.selectLabel") + ' Selected';
                    component.set('v.SearchKeyWord', selectLabel);
                }
            	component.set("v.listOfSelectedRecords", selectedRecords);
            }  
            clearObjFlag = false;
        }
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        component.set("v.traverseIndx", 0);
        // call the event
        helper.triggerEvent(component, event, evType, getSelectRecord, clearObjFlag);
        
    },
    productSelectEvent: function(component, event, helper) {       
        var evType = component.get("v.eventType"),
            eventEVType = event.getParam('evType'),
            clearObjFlag = event.getParam("clearObjFlag"),
            dependentEVType = component.get("v.dependentEVType"),
            secondaryEVType = component.get("v.secondaryEVType"),
			eventTypeFrmEvent=event.getParam('evType');
        if (eventEVType == 'product' || eventEVType == 'productAccStatus') {
            if (clearObjFlag && evType != 'product' && evType != 'productAccStatus') {            
                if (clearObjFlag && eventTypeFrmEvent != 'productAccStatus') {
                    component.set("v.listOfSearchRecordsLast", []);
                    component.set("v.listOfSearchRecords", []);
                }
            }
            if (dependentEVType && eventTypeFrmEvent!='productAccStatus') {
                component.set('v.SearchKeyWord', '');
            }
            if ((evType == 'platform' || evType == 'category') && event.getParam('productObj')) {
                component.set("v.sRecord", event.getParam("productObj")); 
                helper.searchHelper(component,event,event.getParam("productObj").Name);
            }     
        } else if ((eventEVType == dependentEVType || eventEVType == secondaryEVType) && clearObjFlag) {
            component.set("v.listOfSearchRecordsLast", []);
            component.set("v.listOfSearchRecords", []);
            component.set('v.SearchKeyWord', '');
        }
    },
    closeIconClick: function(component, event, helper) {
        var evType = component.get("v.eventType"),
            searchRes = component.find("searchRes");
        component.set("v.SearchKeyWord", '');
        component.set("v.traverseIndx", 0);
        component.set('v.selectedRecord', {});
        component.set('v.oRecord', {});
        $A.util.removeClass(component.find('searchIcon1'), 'slds-hide');
        $A.util.addClass(component.find('closeIcon'), 'slds-hide');
        $A.util.addClass(searchRes, 'slds-is-close');
        $A.util.removeClass(searchRes, 'slds-is-open');
        helper.searchHelper(component, event, '');
        helper.triggerEvent(component, event, evType, false, true);
    },
    searchIconClick: function(component, event, helper) {
		console.log('Click for Remove Icon')
	},
    removeSelectedItem: function(component, event, helper) {
		//TODO in future
	},
    clickSelectedItem: function(component, event, helper) {
        var rmvId = event.target.getAttribute('data-id'),
            selectedRecords = component.get("v.listOfSelectedRecords"),
            rmIndex = '';
        event.preventDefault();
        event.stopPropagation();
        component.set("v.traverseIndx", 0);
        selectedRecords.find(function(pData, pindex) {
            if (pData.Id == rmvId) { 
                rmIndex = pindex;
                return pData;
            }
        });
        if (rmIndex > -1) {
            selectedRecords.splice(rmIndex, 1);
            component.set("v.listOfSelectedRecords", selectedRecords);
            if (selectedRecords.length > 1) {
                var selectLabel = selectedRecords.length + ' ' + component.get("v.selectLabel") + ' Selected';
                component.set('v.SearchKeyWord', selectLabel);
            }
            else if(selectedRecords.length == 1) {
                component.set('v.SearchKeyWord', selectedRecords[0].Name);
            }
            else {
                component.set('v.SearchKeyWord', '');
                $A.util.removeClass(component.find('searchIcon1'), 'slds-hide');
        		$A.util.addClass(component.find('closeIcon'), 'slds-hide');
            }
        }
	}, 
    updateORecord: function(component, event, helper) {
        var sRecord = component.get('v.sRecord'),
            oRecord = component.get('v.oRecord');
        
        if (sRecord && Object.keys(sRecord).length === 0) {
            component.set('v.oRecord', {});
        }
    }
})