({
    init: function(component, event, helper) {
        helper.createEventLog(component, event);
               
    },
    
    handleUploadFinished : function(component, event, helper) {
        var uploadedFiles = event.getParam("files");  
        var documentId = uploadedFiles[0].documentId;  
        var recordId = component.get("v.recordId", recordId); 
        console.log(JSON.stringify(uploadedFiles));
        
        helper.saveBulkGDPRRequest(component, event, recordId);  
        
    }
})