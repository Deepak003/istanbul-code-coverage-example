({
    doInit: function(component, event, helper) {
       var customerProduct =  JSON.parse(component.get("v.customerProduct")).response;
       var topProduct = JSON.parse(component.get("v.featuredProduct")).response;
       var allProducts = JSON.parse(component.get("v.products")).response;
       component.set("v.allProducts", topProduct);  
       component.set("v.userProducts",customerProduct);
       //Adding customer error
       if(customerProduct.length == 0){
          component.set('v.displayInitialCustomerError', true);
            }else{
          component.set('v.displayInitialCustomerError', false);
            } 
    },
    closeProductChange : function(component, event, helper) {
        component.set("v.openProductChange", false);
    },
    productSearchKeyUp: function (component, event, helper) {
        //Getting all the products information based on the search string
        var searchRecords=[];
        var searchCustomerResult = [];
        var searchString = component.get("v.searchString");
        var allProducts = JSON.parse(component.get("v.products")).response;
        var customerProduct =  JSON.parse(component.get("v.customerProduct")).response;
        var timer = component.get('v.keyPressTimer');
        var specialCharacter = 
        clearTimeout(timer);
        timer = setTimeout(function() {
        //Looping through products to get the specific result
        if(helper.isValidString(searchString)){  
            
            if(searchString == ""){
                   searchRecords = JSON.parse(component.get("v.featuredProduct")).response;
                   searchCustomerResult = JSON.parse(component.get("v.customerProduct")).response;
                   //Adding the load functionality
                   component.set("v.initialLoad",true);
            }else{
              //Adding the load functionality  
              component.set("v.initialLoad",false);  
              for(var eachProduct in allProducts){
                //loading the search based on entered value  for all products
                if (allProducts[eachProduct].name.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                    searchRecords.push(allProducts[eachProduct]);
                }else if(allProducts[eachProduct].altNames != null){
                    if(allProducts[eachProduct].altNames.toLowerCase().search(searchString.toLowerCase()) >= 0){
                        searchRecords.push(allProducts[eachProduct]);
                    }
                }
            }
                
            //Looping for customer products    
            for(var eachCustomerProduct in customerProduct){
                //loading the search based on entered value  for all products
                var gameName = customerProduct[eachCustomerProduct].name;
                if ((gameName.replace(/-/g, ' ')).search(searchString.toLowerCase()) >= 0) {
                    searchCustomerResult.push(customerProduct[eachCustomerProduct]);
                }else if(customerProduct[eachCustomerProduct].altNames != null){
                    if(customerProduct[eachCustomerProduct].altNames.toLowerCase().search(searchString.toLowerCase()) >= 0){
                        searchCustomerResult.push(customerProduct[eachCustomerProduct]);
                    }
                }
            }
          }
        }
        clearTimeout(timer);
        component.set('v.keyPressTimer', 0);
        component.set("v.allProducts", searchRecords); 
        component.set("v.userProducts", searchCustomerResult);                
        //Adding the error message    
        if(searchRecords.length == 0){
            component.set('v.displayError', true);
          }else{
            component.set('v.displayError', false);   
            }    
        //Adding customer error
            if(searchCustomerResult.length == 0){
                if(searchString == ""){
                    component.set('v.displayInitialCustomerError', true);
                    component.set('v.displayCustomerError', false);
                }else{
                    component.set('v.displayCustomerError', true);
                    component.set('v.displayInitialCustomerError', false);
                }
                
            }else{
                component.set('v.displayInitialCustomerError', false);
                component.set('v.displayCustomerError', false);
            } 
        }, 5);
        component.set('v.keyPressTimer', timer);
        event.stopPropagation();
        event.preventDefault();
    },
    changeFilterValue: function(component, event, helper) {
        component.set("v.selectionFlag", event.getParam("value"));
    },
    toggleProductChange: function(component, event, helper) {
        //Check for the product if equal
        if(event.target.value !=component.get("v.selectedProduct")){
            component.set("v.currentSelection", event.target.id);
            //Handling condition to enable and disable button
            var selectProductButton = component.find('selectProductButton');
            selectProductButton.set('v.disabled', false);
        }
    },
    selectProductChange: function(component, event, helper) {
      //Closing the component  
      helper.getProductInfomation(component, event, helper);
    },
    handleSearchCode: function(component, event, helper) {
        component.set("v.openProductChange", false);
        component.set("v.searchCodes", true);
    }
})