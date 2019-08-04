({
	doInit: function(component, event, helper) {
        
        var getList = component.get('v.items'),
         	getElement = component.get('v.element').toLowerCase(),
         	getElementIndex = getList.indexOf(getElement);
       
       // if getElementIndex is not equal to -1 it's means list contains this element. 
        if(getElementIndex != -1){ 
          component.set('v.condition',true);
        }else{
          component.set('v.condition',false);
        }
    }
})