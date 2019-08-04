({
	doInit : function(cmp, event, helper) {
		cmp.set('v.columns', [
            { label: 'SOCIAL MEDIA', fieldName: 'source', type: 'text', initialWidth: 150, cellAttributes: {  
                class: 'table-row'
            }},            
            { label: 'STREAM ID', fieldName: 'streamId', type: 'text', initialWidth: 120 },
            { label: 'CONTENT LENGTH VIEWED', fieldName: 'contentLengthViewed', type: 'text' },
            { label: 'DATE VIEWED', fieldName: 'dateViewed', type: 'text' }
        ]);
        helper.fetchData(cmp);
	}
})