({
    matcher: function(str) {
        const strLowerCase = str.toString().toLowerCase();
        return function (obj) {
            const values = [obj.action, obj.content, obj.status, obj.value];
            
            // Adding details to search
            if(Array.isArray(obj.details) && obj.details.length) {
                const data = obj.details.map((obj)=> obj.value).filter(Boolean);
                values.push(...data);
            }
            
            // Adding rewards to search
            if(Array.isArray(obj.rewards) && obj.rewards.length) {
                const data = obj.rewards.map((o)=> Object.values(o)).reduce((a,b)=>a.concat(b),[]).filter(Boolean);
                values.push(...data);
            }
            
            return values.some(function(value, index){
                return value && value.toString().toLowerCase().includes(strLowerCase);    
            });
        }
    },
    setPaginatedData: function(component){
        const perPage = component.get('v.perPage');
        const pageNumber = component.get('v.pageNumber');
        const searchTerm = component.get('v.searchTerm');
        const start = (pageNumber-1)*perPage;
        
        let rows = component.get('v.data').filter(Boolean);
        
        // default set array if undefined/not an array
        if(!Array.isArray(rows)) {
            rows = [];
        }

        // adding random id to rows if not exist (id is mandatory for DataGrid)
        rows.forEach(function(r){
          if(!r.id) 
            r.id = Date.now();
        });
        
        // if searchTerm available
        if(searchTerm) {
            rows = rows.filter(this.matcher(searchTerm));
        }
        
        component.set('v.totalPageNumber', rows.length);
        component.set('v.paginatedRows', rows.slice(start, start+perPage));
    }    
})