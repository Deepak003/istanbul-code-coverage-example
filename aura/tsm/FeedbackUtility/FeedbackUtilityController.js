({
    //The component is initlizedby getting the feedback/category list
    init : function(component, event, helper) {
        //Funciton to load the list of feedback/categories
        helper.getFeedbackCategoryList(component, event);
        helper.getFeedbacks(component, event);
    },
    //Funciton to open the existing feedback
    openFeedbackDetails : function(component, event, helper) {
        var currentId = event.currentTarget.dataset.value;
        component.set("v.utilityIcon", "utility:add"); //Toggling the utility icon
        helper.getDetails(component, event, currentId);
        component.set("v.currentSelectedId", currentId);//Setting current ID
    },
    //Clicking on back in existign feedback view
    onBack : function(component, event, helper) {
        component.set("v.onExist", false);
        component.set("v.isExist", true);
        component.set("v.currentSelectedId", "");//Reset current ID
    },
    //Funciton to handle the new feedback click
    handleNewFeedbackClick : function(component, event, helper) {
        component.set("v.isNew", true);
        component.set("v.isDuplicated", false);
        component.set("v.isExist", false);
        component.set("v.blockSearch", true);
    },
    //Function used ot handle the cancel click
    handleCancelClick : function(component, event, helper) {
        helper.handleReset(component, event);      
    },
    //Handling the change event for the feedback description text area
    onDescriptionChange: function(component, event, helper) {
        var textLength = component.get('v.newFeedbackDescription').length;
        component.set("v.textCount", textLength);
        if(textLength > 0){
            component.set("v.isSubmit", false);
        }else{
            component.set("v.isSubmit", true);
        }
    },
    //Funciton to handle the up vote click
    handleUpVoteClick: function(component, event, helper) {
        helper.upVote(component, event);
    },
    //Function to handle the create new feedback
    handleSubmitFeedbackClick : function(component, event, helper) {
        helper.createFeedback(component, event);
    },   
    //Funciton to handle the upload file click
    handleUploadFileClick : function(component, event, helper) {
        var uploadedFiles = event.getSource().get("v.files");
        var fileList = component.get("v.fileList"); //getting the existing files
        //Looping to the list of files
        for(var eachFile = 0; eachFile<uploadedFiles.length; eachFile++){
			 if(uploadedFiles[eachFile].size/Math.pow(1024,2)>5){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "error",
                    "message": "File size cannot be greater than 5MB"
                });
                toastEvent.fire();
            }
           //Condition to check duplicates 
            else if((!helper.isFileExist(uploadedFiles[eachFile],fileList)) && (fileList.length < 10)){
                component.set("v.isSubmit",true);
                helper.uploadFileHelper(component, event, uploadedFiles[eachFile]);      
            }
        }
        
    },
    //Funciton to delete an attached file
    deleteAttachedRecord: function(component, event, helper) {
        var selectedId = event.currentTarget.dataset.value;
        helper.deleteAttachment(component, event, selectedId);
    },
    //Funciton to search for the existing feedback
    searchFeedback: function(component, event, helper) {
        var selectedType = component.get("v.selectedType"); //Getting the category type selected
		var changedValue=event.getParam('value');
        if(changedValue!=''){
           
        component.set("v.showTitle",true);
        component.set("v.isDuplicated",true);
        component.set("V.onExist",false);
        }
      console.log('selectedType--'+selectedType);
        var feedbackList = component.get("v.feedbackList"); 
        console.log('feedbackList--'+JSON.stringify(feedbackList));
        var searchString = component.get("v.titleString");
        console.log('searchString--'+searchString);
        var isSearchBlocked = component.get("v.blockSearch");
        console.log('isSearchBlocked--'+isSearchBlocked);
        var timer = component.get('v.keyPressTimer');
        console.log('timer--'+timer);
        var searchResultFeedback = [];
        //Blocking search if the advisor is in new feedback screen
        if(!isSearchBlocked){
           // clearTimeout(timer); //Clearing the timer
            //timer = setTimeout(function() {
                //Looping through products to get the specific result
                if(helper.isValidString(searchString) && searchString != ""){                  
                    //Looping through the list of feedback   
                    for(var eachFeedback in feedbackList){
                        //loading the search based on entered value  for all products
                        if (feedbackList[eachFeedback].categories == selectedType) {
                            //Filtering based on title and search string
                            if(feedbackList[eachFeedback].title.toLowerCase().search(searchString.toLowerCase()) >= 0)
                                searchResultFeedback.push(feedbackList[eachFeedback]); //Adding to the list of both category and title match
                        }
                    }
                }
               // clearTimeout(timer);
                component.set('v.keyPressTimer', 0); //Resetting the timer
                searchResultFeedback = helper.removeDuplicates(searchResultFeedback, "id");//Function to check the duplicates
                component.set("v.searchFeedback", searchResultFeedback); //Setting the search list  
                //Setting the duplicate flag
                if(searchResultFeedback.length > 0){
                    component.set("v.isDuplicated", true);
                }else{
                    component.set("v.isDuplicated", false);
                }
            //}, 5);
            component.set('v.keyPressTimer', timer);
            event.stopPropagation(); //Preventing propogation and default
            event.preventDefault();
            
            //Setting button visibility
            if(searchString.length > 0 && selectedType != ""){
                component.set("v.isExist", true);
            }else{
                component.set("v.isExist", false);
            }
        }
    },
})