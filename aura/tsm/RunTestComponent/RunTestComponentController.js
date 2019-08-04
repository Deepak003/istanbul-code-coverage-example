({
	openModel: function(component, event, helper) {
      // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.isOpen", true);
      component.set("v.Spinner", false);
   },
 
   closeModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.isOpen", false);
      component.set("v.isDisabledRunTestButton",true);
      var val = '';
      component.set("v.caseNumber",val);
       var caseInfoList = [];
       component.set("v.testRunObject",caseInfoList);
       component.set("v.isRendred",false);
   }, callRunTest : function(component, event, helper) {
		var runTestEvent = component.getEvent("runTestEvent");
        runTestEvent.fire();
   },handleCaseNumberChange: function(component, event) {
    const val = component.get("v.caseNumber");
    var booleanDisabled =  component.get("v.isDisabledRunTestButton");
    const regex = /^[0-9;\b]+$/;
    //only numbers and semicolon
    //if semicolon then calculate len
    if (val == '') {
      component.set("v.isDisabledRunTestButton",true);
      component.set("v.caseNumber",val);
    }
    if( val != '' && regex.test(val)) {
      if(val.indexOf(';') >= 0){
        let caseArr = val.split(';');
        if(caseArr.length <= 100){
           component.set("v.isDisabledRunTestButton",false);
      	   component.set("v.caseNumber",val);
        }
      }else {
        component.set("v.isDisabledRunTestButton",false);
      	component.set("v.caseNumber",val);
      } 
    } else {
        var subVal = val.substring(0, val.length - 1);
      	component.set("v.caseNumber",subVal);
    }
   
  },
    // this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
       // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
   },
    
 // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
     // make Spinner attribute to false for hide loading spinner    
       component.set("v.Spinner", false);
    }
})