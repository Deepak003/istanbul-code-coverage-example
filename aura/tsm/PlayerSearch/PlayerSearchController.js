({
    init : function(component, event, helper) {
        var playerFilterOptions = [
            					{'label': 'Case Number' , 'value': 'CaseNumber'},
            					{'label': 'PetitionUUID' , 'value': 'PetitionUUID'},
            					{'label': 'Nucleus ID' , 'value': 'nucleusId'},
            					{'label': 'Persona ID' , 'value': 'PersonaId'},
            					{'label': 'Persona Name' , 'value': 'Persona'},            					
            					{'label': 'Email' , 'value': 'Email'},
            					{'label': 'BESL Id' , 'value': 'BESLId'},
            					{'label': 'Facebook Id' , 'value': 'FacebookId'},
            					{'label': 'Twitter Id' , 'value': 'TwitterId'},
            					{'label': 'Phone' , 'value': 'phoneNumber'},            					
            					{'label': 'Game Id' , 'value': 'gameId'},  
                                ];
        component.set('v.filterOptions', playerFilterOptions);
        //Get the filter options from SF
        helper.getfilterOptions(component);
        window.addEventListener("click", function(event) {
            helper.windowClicked(component, event);
		});
        helper.autoCompForceOff(component);
    },
	playerFilterClick : function(component, event, helper) {
		var playerFilterLB = component.find('playerFilterListBox');
        $A.util.addClass(playerFilterLB, 'slds-is-open');
        helper.autoCompForceOff(component);
	},
    selectPlayerFilterType: function(component, event, helper) {     	
        var playerFilter = component.find('playerFilter'),
            playerFilterLB = component.find('playerFilterListBox'),
            selDom = event.target,
            selVal = '',
            selLabel = event.target.innerText;
            
        component.set('v.gameName', '');
        component.set('v.gamerDataList', []);
        if (!$A.util.hasClass(selDom, 'slds-listbox__item')) {
            selDom = selDom.closest('li');
        }
        // Check if the filter associated with Gamer identity search
        var filterData = window.searchFilterOptions ? window.searchFilterOptions : '',
            filterLabelVal = '';
        
    	if (selLabel === 'Game Id') {
    		$A.util.addClass(component.find('searchResutlsDropDown'), 'searchResutlsDropDown');
            $A.util.removeClass(component.find('gamerDropdownOuter'), 'slds-hide')
            helper.getGamerProducts(component);
		}
        else {
            $A.util.removeClass(component.find('searchResutlsDropDown'), 'searchResutlsDropDown');
            $A.util.addClass(component.find('gamerDropdownOuter'), 'slds-hide')
        }
        selVal = selDom.getAttribute('data-model');
            
        component.set('v.filterSelection', selVal);
        component.set('v.filterKeyWord', selLabel);
        $A.util.removeClass(playerFilterLB, 'slds-is-open');
    },
    keyPressController: function(component, event, helper) {
       var getInputkeyWord = event.currentTarget.value,           
           keyCode = event.getParams ? event.getParams().keyCode : event.keyCode,
           domInputVal = '';
       
       
       component.set("v.searchVal", getInputkeyWord);
       helper.autoCompForceOff(component);
       //On Escape Key Press 
       if (keyCode == 27) {
            //TODO
        } 
        // on press enter
        else if (keyCode == 13) {
            helper.playerAccountSearch(component, event);
        }
    },
    keyDownController: function(component, event, helper) {
        // Making AutoComplete Off forcefully
       helper.autoCompForceOff(component);
    },
    selectPlayerSearchResult: function(component, event, helper) {
         var searchedData = component.get('v.searchDataList'),
             selDom = event.target,
             id = '',
         	 filterType = component.get('v.filterSelection');
        if (!$A.util.hasClass(selDom, 'slds-listbox__item')) {
            selDom = selDom.closest('li');
        }
        id = selDom.getAttribute('data-model');
        //console.log(id);
        component.set("v.searchVal", id);
        
        if(filterType === 'gameId') {
            helper.loadGamerAccout(component, event, searchedData[0].label.split(' ')[1]);
        }
        else {
            component.set('v.filterSelection', 'nucleusId');
            helper.playerAccountSearch(component, event); 
        }        
        var searchResutlsDropDown = component.find('searchResutlsDropDown');
        $A.util.removeClass(searchResutlsDropDown, 'slds-is-open');
    },
    onfocusSearchBox: function(component, event, helper) {
        // Making AutoComplete Off forcefully
       helper.autoCompForceOff(component);
    },
    keyUpFilterController: function(component, event, helper) {
    	var keyCode = event.getParams ? event.getParams().keyCode : event.keyCode,
            searchVal = event.currentTarget.value,
            plsfilterOptions = component.find('plsfilterOptions'),
            traverseIndx = component.get("v.traverseIndx"),
            playerFilterLB = component.find('playerFilterListBox'),
            input = component.find("playerFilter");
            
            console.log('Key:: '+keyCode);
            //$A.util.addClass(playerFilterLB, 'slds-is-open');
        // On Key Up
        if (keyCode == 38 ) {            
            if (traverseIndx > 1) {
                traverseIndx--;
                component.set("v.traverseIndx", traverseIndx);            
                if (plsfilterOptions[traverseIndx - 1]) plsfilterOptions[traverseIndx - 1].getElement().focus();
            }
        } 
        //on press down
        else if (keyCode == 40) {            
            if (plsfilterOptions && traverseIndx < plsfilterOptions.length) {
                traverseIndx++;
                component.set("v.traverseIndx", traverseIndx);
                if (plsfilterOptions[traverseIndx - 1]) plsfilterOptions[traverseIndx - 1].getElement().focus(); 
            }
        }
		else if (keyCode == 13 && traverseIndx && plsfilterOptions[traverseIndx - 1]) {
            plsfilterOptions[traverseIndx - 1].getElement().click();
            $A.util.removeClass(playerFilterLB, 'slds-is-open');
            component.set("v.traverseIndx", 0);            
        } 
        else if(keyCode == 13 && !traverseIndx && event.currentTarget.id == 'playerfilter') {
            var selData = plsfilterOptions.find(function(pData, pindex) {                		
		             if (pData.getElement() && pData.getElement().innerText && searchVal.toLowerCase() == pData.getElement().innerText.toLowerCase()) {		                 
		                 return pData;
		             }
		        });
            if (selData) {
                selData.getElement().click();
            }
        }
    },
    selectGamerSearchResult: function(component, event, helper) {
        var selProdUrl = event.getParam("value");
        component.set('v.gameName',selProdUrl);
        //$A.util.toggleClass(gamerDropdown, 'slds-hide');
    },
})