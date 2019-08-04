({
    pullTranscripts: function(component) {
        //call apex class method
        const action = component.get('c.fetchPhoneRecordsByCaseId');
        
        // for archive case
        if(component.get("v.isArchiveCase")){
            //action = component.get('c.fetchArchivedPhoneRecordsByCaseId');
        }
        
        action.setParams({
            caseId: component.get("v.caseId"),
            caseNumber: component.get("v.caseNumber")
        });
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            //store state of response
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.transcripts', response.getReturnValue().map(this.formatData));
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    formatData: function(transcript) {
        for (let pd of transcript.phoneDetails) {
            if(pd.key=='Call Duration' && !pd._value){
                pd._value = pd.value;
                const time = ((seconds)=>({ d: Math.floor(seconds/86400), h: Math.floor(((seconds/86400)%1)*24), m: Math.floor(((seconds/3600)%1)*60), s: Math.round(((seconds/60)%1)*60) }))(pd.value);
                const duration = (time.m ? time.m + "min " : "") + time.s + "seconds";
                pd.value = duration;
            }
        }
        return transcript;
    }    
})