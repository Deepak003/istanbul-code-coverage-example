({
    doInit: function(component, event, helper) {  
        helper.getAllProduct(component);
        //Create empty string
        var simpleCase = {};
        simpleCase.product = "";
        simpleCase.platform = "";
        simpleCase.category = "";
        simpleCase.subCategory = "";
        component.set("v.case",simpleCase);
        
    },
    getAllTabInfo: function(component, event, helper) {
        // Getting all opened tab information
        const workspaceAPI = component.find("workspace");
        workspaceAPI.getAllTabInfo().then((response)=>component.set("v.allTabInfo", response));
    },
    changeCase: function(component, event, helper) {
        //Setting the working case
        helper.getCaseDetails(component);                
    },
    handleChangeAllTabInfo: function(component, event, helper) {
        const activeCases = (component.get("v.allTabInfo") || []).map((t)=>[].concat(t.subtabs, t)).reduce((a,b)=>[].concat(a,b)).filter((r)=>!isNaN(r.title));
        const comboboxOptions = activeCases.map((ac)=>({ label: 'Case #'+ (ac.url.includes('LiveChatTranscript') ? ac.customTitle : ac.title), value: (ac.url.includes('LiveChatTranscript') ? ac.customTitle : ac.title) })); //Id is set as value
        component.set("v.activeCasesComboboxOptions", comboboxOptions);
    },
    goBack: function(component, event, helper) {
        component.set("v.currentCase", undefined);
    },
    createCase : function(component, event, help) {
        help.createCase(component);        
    },
    handleCancel : function(component, event, help) {
        var simpleCase = component.get("v.case");
        //Closing platform
        simpleCase.productId = "";
        simpleCase.product = "";
        
        simpleCase.platform = "";
        component.set("v.platformDisable",true);
        component.set("v.platformData",[]);
        
        simpleCase.category = "";
        component.set("v.categoryData",[]);
        component.set("v.categoryDisable",true);
        
        simpleCase.subCategory = "";
        component.set("v.issueData",[]);
        component.set("v.issueDisable",true);
        
        //Clearing subject
        component.set("v.subject","");
        //Clearing the case object
        component.set("v.case", simpleCase);
    },
    handlePropertyChange : function(component, event, help) {
        var simpleCase = component.get("v.case");
        // Validation for submit button
        const productName = simpleCase.product.trim(),            
            platformName = simpleCase.platform.trim(),
            subCategory = simpleCase.category.trim(),
            categoryName = simpleCase.subCategory.trim();
        
        const canSubmit = categoryName !='' && productName !='' && platformName !='' && subCategory !='' && component.get("v.subject").trim() !='' ;
        component.set('v.canSubmit', canSubmit);    
        
    },
    handleBubbling : function(component, event, helper) {
        var firedLookupType = event.getParam('type');
        var simpleCase = component.get("v.case");
        if(firedLookupType == "Product"){
            //Closing platform
            simpleCase.productId = event.getParam('Id');
            
            simpleCase.platform = "";
            component.set("v.platformDisable",true);
            component.set("v.platformData",[]);
            
            simpleCase.category = "";
            component.set("v.categoryData",[]);
            component.set("v.categoryDisable",true);
            
            simpleCase.subCategory = "";
            component.set("v.issueData",[]);
            component.set("v.issueDisable",true);
            
            component.set("v.case", simpleCase);
            if(!event.getParam('isEmpty')){  
                helper.getPlatformsByProduct(component);
                helper.getCategoriesForProduct(component); 
            }
        }else if(firedLookupType == "Platform"){
            simpleCase.platformId = event.getParam('Id');
            component.set("v.case", simpleCase);
        }else if(firedLookupType == "Category"){
            simpleCase.subCategory = "";
            component.set("v.issueData",[]);
            component.set("v.issueDisable",true);
            
            simpleCase.categoryId = event.getParam('Id');
            component.set("v.case", simpleCase);
            if(!event.getParam('isEmpty')){
                helper.getSubCategoriesForCategory(component);
            }
        }else if(firedLookupType == "Issue"){            
            simpleCase.issueId = event.getParam('Id');
            component.set("v.case", simpleCase);
        }
        
    } 
})