({
    doInit : function(component, event, helper) {
        const totalPages = Math.ceil(component.get("v.totalPages"));
        component.set('v.pageList', Array.from({length: totalPages}, (v, k) => k+1));
        
        const pageControl = component.get("v.pageControl");     
        component.set('v.lastPageControl', component.get('v.firstPageControl')+pageControl-1);
        
        const activePage = component.get('v.activePage');
        
        if(totalPages < activePage) {
            component.set('v.activePage', 1);
        }
    },        
    onClickPage : function(component, event, helper) {
        const selectedPage = event.getSource().get('v.value');
        component.set('v.activePage', selectedPage);
    },
    onPrevSelect : function(component, event, helper) {
        const activePage = component.get('v.activePage');
        if(activePage != 1)
            component.set('v.activePage', activePage-1 );
    },
    onNextSelect : function(component, event, helper) {
        const activePage = component.get('v.activePage');
        const lastPage = [...component.get('v.pageList')].pop();
        if(activePage != lastPage)
            component.set('v.activePage', activePage+1 );
    },
    onChangeActivePage : function(component, event, helper) {
        const activePage = component.get('v.activePage');
        
        const pageControl = component.get("v.pageControl"); 
        
        let firstPageControl = component.get('v.firstPageControl');
        let lastPageControl = component.get('v.lastPageControl');
        
        if(activePage > lastPageControl) {
            lastPageControl = activePage;
            firstPageControl = lastPageControl - ( pageControl-1 );
        }else if(activePage < firstPageControl) {
            firstPageControl = activePage;
            lastPageControl = firstPageControl + ( pageControl-1 );
        }
        
        component.set('v.firstPageControl', firstPageControl);
        component.set('v.lastPageControl', lastPageControl);        
    }
})