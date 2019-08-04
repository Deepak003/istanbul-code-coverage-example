({
	rerender : function(cmp, helper){
        cmp.find('qtabLabel').get("v.label")[0].set('v.value', cmp.get('v.queuedLabel'));
        cmp.find('ctabLabel').get("v.label")[0].set('v.value', 'Completed - '+cmp.get('v.completedCnt'));
        this.superRerender();
        // do custom rerendering here
    }
})