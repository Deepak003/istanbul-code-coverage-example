({
	setDate : function(cmp) {
        cmp.set('v.isVisibleDatePicker', false);
   		cmp.set('v.isVisibleDatePicker', true);
        
		const selectedOption = cmp.get('v.selectedOption');
        const today =  new Date().toJSON().split('T')[0];
        cmp.set('v.today', today);
        cmp.set('v.end', today);
        cmp.set('v.start', new Date(new Date().setDate(new Date().getDate()-parseInt(selectedOption))).toJSON().split('T')[0]);
	}
})