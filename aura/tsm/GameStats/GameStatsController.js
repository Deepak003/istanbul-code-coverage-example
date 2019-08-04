({
    doInit : function(component, event, helper) {
        const product = component.get("v.prodname");
        if(typeof product != "undefined" && product.Name.toLowerCase().indexOf('fifa') != 0){
            component.set("v.prodnamrforothergames",true);
        }
        helper.getgameStats(component, event, helper);
    },
     onChangeOfGameStats: function(component, event, helper) {
        component.set("v.generalStat" , []);
        component.set("v.otherStat",[]);
        helper.getgameStats(component, event, helper);
    },
    handleChange : function(component, event, helper) {
        component.set("v.generalStatsList",
                      Object.entries(component.get("v.generalStats")));
        component.set("v.otherStatsList",
                      Object.entries(component.get("v.otherStats")));
    },
    getgameid : function(component, event, helper) {
        
        
    }
    
})