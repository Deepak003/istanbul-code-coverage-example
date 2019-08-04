({
	init: function(component, event, helper) {
        /*setTimeout(function() { 
            component.set('v.filteredRows', component.get('v.rows'));
        }, 100);*/
        var filterRows = component.get('v.filteredRows'),
            filterFlag = component.get('v.filterFlag'),
            dataRows = component.get('v.rows'),
            pageNumber = component.get('v.pageNumber'),
            mpermsList = [],
            allRows = '';
        $A.util.removeClass(component.find('caseHistoryLoader'), 'slds-hide');
        //allRows = dataRows.slice(0);;  
        //component.set('v.totalCases', allRows.length);
        //var displayCaseNo = allRows.length < 20*pageNumber ? allRows.length : 20*pageNumber;
        ////component.set('v.casesOfPage', displayCaseNo);
        
        //First 20 records
        //allRows = allRows.splice(0, pageNumber*20);
        component.set('v.filteredRows', dataRows);
        // Check permissions , v.massCasePerms)        
        //ScrollBar
        var target = window.document.getElementsByClassName('viewport');
        if (target && target.length) {
            target = target[0];
        }
        //window.addEventListener("scroll", function(){helper.scrollDiv(component,event, target)});
        
    },
    setSelection: function(component,event,helper) {
        var rows = component.get('v.rows'),
            filRecords = component.get('v.filteredRows');
        if (rows.length) {
            component.set('v.filteredRows', rows);
        }
        
        var params = event.getParam('arguments');
        var pk = params.Id;
        if (window.recordId) {
            pk = window.recordId;
        }
        var targets = component.find("datarow");
        for (var i=0; i<targets.length; i++) {
            if (targets[i].getElement().getAttribute('data-pk') == pk) {
                helper.setSelectedRow(component,targets[i]);
                break;
            }
        }     
    },
    sortAsc: function(component, event, helper) {
        helper.sortRows(component, event, 'asc');
    },
    
    sortDesc: function(component, event, helper) {
        helper.sortRows(component, event, 'desc');
    },
    
    expandClick: function(component, event, helper) {
        var rowData = event.currentTarget,
            caseObject = component.get('v.caseObj');//Get the caseList from localStorage        
        
        if (!$A.util.hasClass(rowData, 'subject')) {
            rowData = rowData.closest('.subject');
        }
        var openTabDom = rowData.closest('.caseHistoryData');
            
        if (openTabDom) {
            var caseNoteCmp = component.find('case-notes'),
                rowId = rowData.getAttribute('data-row'),
                caseId = rowData.getAttribute('data-pk');               
            
            if (caseNoteCmp.length) {
                caseNoteCmp = caseNoteCmp[rowId];
            }
            if (!$A.util.hasClass(openTabDom,'slds-is-open')) {
                //Sets the simpleCase
                var caseType = component.find('caseType'),
                	recordType = '',
                    dataModelId = 0,
                    categoryName = component.find('categoryName'),
                    productName = component.find('productName'),
                    platformName = component.find('platformName');
                
                var caseNumber = component.find('caseNumber');
                if (caseNumber.length) {
                    caseNumber = caseNumber[rowId];
                }
                caseNumber = caseNumber.getElement().getAttribute('data-model');
                if (caseType.length) {
                    caseType = caseType[rowId];
                }
                if (categoryName.length) {
                    categoryName = categoryName[rowId];
                }
                if (productName.length) {
                    productName = productName[rowId];
                }
                if (platformName.length) {
                    platformName = platformName[rowId];
                }
                recordType = caseType.getElement().getAttribute('data-model').trim();
                rowId = parseInt(rowId);               
                if (rowId > 0) {
                    dataModelId = (rowId * 10);
                }
                
                var hiddenDataFld = component.find('hiddenData');
                var strCategory = hiddenDataFld[dataModelId].getElement().getAttribute('data-model');
                var strProduct = hiddenDataFld[dataModelId+1].getElement().getAttribute('data-model');
                var strPlatform = hiddenDataFld[dataModelId+2].getElement().getAttribute('data-model');
                var strViewUrl = hiddenDataFld[dataModelId+3].getElement().getAttribute('data-model');
                var strProductUrl = hiddenDataFld[dataModelId+4].getElement().getAttribute('data-model');
                var strPlatformUrl = hiddenDataFld[dataModelId+5].getElement().getAttribute('data-model');
                var strPetitionUUID = hiddenDataFld[dataModelId+6].getElement().getAttribute('data-model');
                var strSynergyId = hiddenDataFld[dataModelId+7].getElement().getAttribute('data-model');
                var strContentId = hiddenDataFld[dataModelId+8].getElement().getAttribute('data-model');
                //
                categoryName.set('v.value', strCategory);
                productName.set('v.value', strProduct);
                platformName.set('v.value', strPlatform);
                caseObject.Id = caseId;
                caseObject.Case_Category__r = {'Name': strCategory};
                caseObject.ProductLR__r = {'Name': strProduct, 'Url_Name__c': strProductUrl};
                caseObject.PlatformLR__r = {'Name': strPlatform, 'InternalName__c': strPlatformUrl};
                caseObject.Petition_Details__r = {'View_Url__c': strViewUrl, 'PetitionUUID__c': strPetitionUUID, 'ContentID__c': strContentId};                
                caseObject.Petition_Details__r.Target_Account__r = {'Synergy_ID__c': strSynergyId};                
                caseObject.sobjectType='Case';
                component.set('v.caseObj', caseObject);
                //Get user content
                var ugcContent = component.find('userGeneratedContentHistoryCmp');
                if (ugcContent.length) {
                    ugcContent = ugcContent[rowId];
                }
                if (recordType && recordType.toLowerCase() == 'petition') {
                    ugcContent.getContentViewDetails();
                }
                //Get events
                caseNoteCmp.getCaseAllEventsData();
                
                caseNoteCmp.set('v.caseId', caseId);
                
            }else {
                caseNoteCmp.set('v.viewAllFlag', false);
            }
            $A.util.toggleClass(openTabDom,'slds-is-open');
        }        
    },
    expandAll: function(component, event, helper) {
        var caseHDom = component.find('caseHistoryData'),
            cDom = '';
        for(cDom of caseHDom) {
            $A.util.toggleClass(cDom,'slds-is-open');
        }
    },
    fullDetailsClick: function(component, event, helper) {
        var rowData = event.currentTarget,
            caseObject = {};
        if (!$A.util.hasClass(rowData, 'slds-col')) {
            rowData = rowData.closest('.slds-col');
        }
        var rowId = rowData.getAttribute('data-row'),
            caseId = rowData.getAttribute('data-pk'),
            archiveType = component.find('archiveType'),
            recordType = '';
        
        if (archiveType.length) {
            archiveType = archiveType[rowId];
        }
        var caseNumber = component.find('caseNumber');
        if (caseNumber.length) {
            caseNumber = caseNumber[rowId];
        }
        caseNumber = caseNumber.getElement().getAttribute('data-model');
        recordType = archiveType.getElement().getAttribute('data-model').trim();
        if (recordType === 'true') {
            helper.getCaseDetailArchive(component, caseNumber);
        }
        else {
            helper.getCaseDetail(component, caseId);
        }        
    },
})