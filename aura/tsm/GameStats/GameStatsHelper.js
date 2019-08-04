({
    getgameStats : function(component, event, helper){
        component.set("v.isLoading", true);
        var gameStats = component.get("v.gameStatsData");
        var genStat = component.get("v.generalStat");
        var othrStat = component.get("v.otherStat");
        const product = component.get("v.prodname");
        if(!$A.util.isEmpty(gameStats.response)){
            if(typeof product != "undefined" && product.Name.toLowerCase().indexOf('fifa') == 0){
                component.set("v.prodnamrforothergames", false);
                for(var rcd in gameStats.response.stats){
                    if(rcd < 3){
                        genStat.push(gameStats.response.stats[rcd]); 
                    }else{
                        if(gameStats.response.stats[rcd].statId !== "accountResetCount")
                            othrStat.push(gameStats.response.stats[rcd]);
                    }   
                }
                component.set("v.generalStat", genStat);
                component.set("v.otherStat", othrStat);       
                component.set("v.gameStats", gameStats.response.stats); 
                
                component.set("v.isLoading", false);
            }
            else{
                component.set("v.prodnamrforothergames", true);
                for(var rcd in gameStats.response.stats){
                    genStat.push(gameStats.response.stats[rcd]); 
                }
                component.set("v.generalStat", genStat);
                component.set("v.isLoading", false);
            }
        }else{
            component.set("v.gameStats", []);
            component.set("v.isLoading", false);
        } 
    }    
})