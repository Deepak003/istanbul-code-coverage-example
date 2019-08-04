({
	doInit : function(component, event, helper) {
		helper.doInit(component,event,helper,'English');	
	},
    
    changeRiskTypeForSliderHandler:function(component,event,helper){
        var slider = component.find('slider').getElement();
        slider.noUiSlider.set([0, component.get('v.minValue'), component.get('v.maxValue'),100]);
    }    
})