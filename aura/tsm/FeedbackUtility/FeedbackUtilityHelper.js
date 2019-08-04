({
    //Funciton to get the list of feedback
    getFeedbackCategoryList : function(component, event) {
        var action = component.get("c.getFeedbackCategories");  
        var self=this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Getting the return category list
                var storeResponse = response.getReturnValue(); 
                console.log('storeResp--',storeResponse,'typeOf--',typeof storeResponse);
                //Converting the list to map
                var reformattedFeedback = storeResponse.map(object =>{ 
                    var retrunObject = {};
                                                            retrunObject["label"] = object; 
                                                            retrunObject["value"] = object;
                                                            return retrunObject;
                                                            });
                console.log('formated map--'+JSON.stringify(reformattedFeedback));
                //Adding the options to the variable
                component.set("v.feedbackOptions", reformattedFeedback);
               
            }else{
                console.log("Error...");
                //stndrd toast
                
                self.showToast('An error occurred getting the feedback category List','error');
                
            }
        });
        $A.enqueueAction(action);
    },
    //Get all the feedbacks
    getFeedbacks: function(component, event) {
        var action = component.get("c.getFeedbacks");  
        var toastEvent = $A.get("e.force:showToast");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Getting the return feedback list
                var storeResponse = response.getReturnValue(); 
                //Adding the options to the variable
                //var feedBackResponse = {"status":"SUCCESS","response":[{"name":null,"id":"0871g000000CeOZAA0","appType":null,"votes":10.0,"votedUsers":null,"value":101.0,"title":"Test 2","status":"New","score":9.999180491333544,"lastModified":"2019-03-22T18:39:34.000Z","lastCommentedJobRole":null,"lastCommented":null,"jobRoleName":"Admin Chat","files":null,"creatorName":"QAUser account","createdDate":"2019-03-22T18:39:34.000Z","createdById":"0051g000001cJFQAA2","comments":null,"commentCount":0,"categories":"Phishing/ Hacking/ Social Engineering","body":null,"author":{"name":"QAUser account","id":"0051g000001cJFQAA2","appType":null,"thumbnailUrl":"https://wwce-eait--QA3PC--c.cs96.content.force.com/profilephoto/005/T","lastName":"account","firstName":"QAUser"}},{"name":null,"id":"0871g000000CeOKAA0","appType":null,"votes":10.0,"votedUsers":null,"value":101.0,"title":"Naveen testing","status":"New","score":7.393542734933578,"lastModified":"2019-03-21T21:45:14.000Z","lastCommentedJobRole":null,"lastCommented":null,"jobRoleName":"Admin Chat","files":null,"creatorName":"QAUser account","createdDate":"2019-03-21T21:45:14.000Z","createdById":"0051g000001cJFQAA2","comments":null,"commentCount":0,"categories":"Category/Issue/VOG","body":null,"author":{"name":"QAUser account","id":"0051g000001cJFQAA2","appType":null,"thumbnailUrl":"https://wwce-eait--QA3PC--c.cs96.content.force.com/profilephoto/005/T","lastName":"account","firstName":"QAUser"}}]};       
                console.log('storeResponse--',storeResponse[0]);
                component.set("v.feedbackList", storeResponse);
                
            }else{
                console.log("Error...");
                //standard toast
                 this.showToast('An error occurred getting the feedback List','error');
            }
        });
        $A.enqueueAction(action);
    },
    //Funciton to get the feedback details
    getDetails: function(component, event, id) {
        var action = component.get("c.getFeedbackById"); 
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            ideaId : id
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Getting the return feedback list
                var storeResponse = response.getReturnValue(); 
                console.log('storeResponseGetDetails---',storeResponse.votedUsers);//var selectedFeedbackDetails = {"status":"SUCCESS","response":[{"name":null,"id":"0871g000000CeOeAAK","appType":null,"votes":10.0,"votedUsers":["0051g000001cJFQAA2"],"value":101.0,"title":"catch me if you can","status":"New","score":9.957151714355055,"lastModified":"2019-03-22T19:49:39.000Z","lastCommentedJobRole":null,"lastCommented":null,"jobRoleName":"Admin Chat","files":[],"creatorName":"QAUser account","createdDate":"2019-03-22T19:49:39.000Z","createdById":"0051g000001cJFQAA2","comments":[],"commentCount":0,"categories":"Category/Issue/VOG","body":"Testing the styles for the new CRM","author":{"name":"QAUser account","id":"0051g000001cJFQAA2","appType":null,"thumbnailUrl":"https://wwce-eait--QA3PC--c.cs96.content.force.com/profilephoto/005/T","lastName":"account","firstName":"QAUser"}}]}
                component.set("v.selectedFeedback", storeResponse);
                component.set("v.onExist", true);
                component.set("v.isExist", false);
                //Checking for votable
                var currentUserId = $A.get("$SObjectType.CurrentUser.Id"); //Getting current user id
                if(storeResponse.votedUsers.indexOf(currentUserId) >= 0){
                    component.set("v.isVotableDisable", true);
                }else{
                    component.set("v.isVotableDisable", false);
                }
               
            }else{
                console.log("Error...");
                //std toast
                this.showToast('An error occurred getting the details of feedback','error');
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to create new feedback
    createFeedback: function(component, event) {
        var action = component.get("c.createFeedback");  
        var toastEvent = $A.get("e.force:showToast");
        console.log('docIDs--'+JSON.stringify(component.get("v.fileList")));
        //adding documentIds to an array to send them to apex 
        //and save the attachments to the Idea(feedback) submittd
        var documentIds =[];
        var fileList = component.get("v.fileList");
        for(var i=0;i<fileList.length;i++){
            console.log('each documentid--'+fileList[i].recordId);
            documentIds.push(fileList[i].recordId);
        }
        console.log('final documentId--'+documentIds);
        action.setParams({
            title : component.get("v.titleString"),
            body : component.get("v.newFeedbackDescription"),
            categoryName : component.get("v.selectedType"),
            documentIds : documentIds
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Getting the return feedback list
                var storeResponse = response.getReturnValue(); 
                console.log('storeResponse--create--',storeResponse);
                component.set("v.blockSearch", false);
                component.set("v.selectedType",'');
                component.set("v.showTitle",false);
                
                component.set("v.searchFeedback",'');
                component.set("v.isDuplicated",false);
                component.set("V.onExist",true);
                //Adding success toast
                toastEvent.setParams({
                    message: storeResponse,
                    type: "success"
                });
                toastEvent.fire();
                this.closeFeedback(component, event);
            }else{
                //Adding fail toast
                toastEvent.setParams({
                    message: "Feedback submission failed. Please try again.",
                    type: "error"
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    //Adding validation to check special characters
    isValidString: function (currentString){
        if (currentString.search(/[\[\]?*+|{}\\()@.\n\r]/) != -1) {
            return false;
        }else{
            return true;
        }
    },
    //Funciton to handle the close feedback on success
    closeFeedback: function (component, event){
        this.getFeedbacks(component, event); //Funciton to get all the feedbacks
        //Making the DOM default
        component.set("v.titleString", "");
        component.set("v.newFeedbackDescription","");
        component.set("v.selectedType","");
        //Getting the details of the utility bar
        var utilityAPI = component.find("utilitybar");
        utilityAPI.getAllUtilityInfo().then(function(response) {
            //Looping through the list of utility
            for(var eachUtility in response){
                if(response[eachUtility].utilityLabel == "Feedback"){
                    var myUtilityInfo = response[eachUtility];
                    //Closing the utility
                    utilityAPI.minimizeUtility  ({
                        utilityId : myUtilityInfo.id
                    });
                }
            }
        })
        .catch(function(error) {
            console.log(error);
        });
        this.handleReset(component, event); //Handling the dom change after close
    },
    //Function to handle reset
    handleReset: function (component, event){
        component.set("v.isNew", false);
        component.set("v.blockSearch", false);
        if(component.get("v.searchFeedback").length > 0 ){
            component.set("v.isDuplicated", true);
        }
        component.set("v.newFeedbackDescription", "");
        component.set("v.isExist", true);  
    },
    //Funciton to handle the up vote
    upVote: function (component, event){
        var action = component.get("c.upVote");  
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            ideaId : component.get("v.currentSelectedId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Getting the return feedback list
                var storeResponse = response.getReturnValue(); 
                console.log('upVote--',storeResponse);
                component.set("v.utilityIcon", "utility:check"); //Toggling the utility icon
            }else{
                console.log("Error...");
                //apex message
                var errorMsg = action.getError()[0].message;
                var errors = response.getError();
                console.log('error from apex--'+errorMsg+'errors Array--'+errors);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        //stdrd toast
                        this.showToast(errors[0].message,'error');
                    }
                }
                
            }
        });
        $A.enqueueAction(action);        
    },
    //Funciton used to upload the file to the server
    uploadFileHelper: function(component, event, file) {
        var MAX_FILE_SIZE = 5000000; //Max file size 5 MB 
        var CHUNK_SIZE = 750000;      //Chunk Max size 750Kb 
        var self = this;   
        // create a FileReader object 
        var objFileReader = new FileReader();       
        if(file.type != undefined){
            objFileReader.readAsDataURL(file); 
        }
        
        objFileReader.onloadend = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
            
            fileContents = fileContents.substring(dataStart);
            // call the uploadProcess method 
            self.uploadProcess(component, file, fileContents);
        });
    },
    uploadProcess: function(component, file, fileContents) {
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + 750000);        
        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        // call the apex method 'saveChunk'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.uploadFileByChunk");
        action.setParams({
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });        
        // set call back 
        action.setCallback(this, function(response) {
            // store the response / Attachment Id   
            attachId = response.getReturnValue();
            var toastEvent = $A.get("e")
            var state = response.getState();
            if (state === "SUCCESS") {
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + 750000);
                // check if the start postion is still less then end postion 
                // then call again 'uploadInChunk' method , 
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId );
                } else {
                    //Appending the file to the master file list
                    file.recordId = attachId; //Adding a record id parameter
                    var fileList = component.get("v.fileList").concat(file);
                    component.set("v.fileList", fileList);
                    component.set("v.showLoadingSpinner", false);
                }
                this.showToast('Attachment(s) succesfully uploaded', 'success');
                // handel the response errors        
            } else if (state === "INCOMPLETE") {
                console.log("From server: " + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        //stdrd toast
                        this.showToast('There was an error uploading the file. Please try again','error');
                    }
                } else {
                    this.showToast('an Unknown error occured','error');
                }
            }
            component.set("v.isSubmit",false);
        });
        // enqueue the action
        $A.enqueueAction(action);
    },
    //Function used to delete an attachment
    deleteAttachment: function (component, event, selectedRecord){
        var action = component.get("c.doDelete");
        action.setParams({
            recordId: selectedRecord
        });
        action.setCallback(this, function(response) {  
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnList = this.removeSelectedFile(component,selectedRecord);
                console.log('returnList--',returnList);
				component.set("v.fileList",returnList);
                //component.set("v.fileList", JSON.stringify(returnList)); -- changed due to bug tsm-3388
                // handle the response errors        
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        //apex messg
                        this.showToast(error[0].message,'error');
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // enqueue the action
        $A.enqueueAction(action);        
    },
    //Funciton used to remove the selected record form the list
    removeSelectedFile: function(component,selectedRecord){
        var masterFileList = component.get("v.fileList");
        for(var eachValue in masterFileList){
            if(masterFileList[eachValue].recordId == selectedRecord){
                masterFileList.splice(eachValue, 1);
            }        
        }       
        return masterFileList;
    },
    //Funciton to check of the file exists in the list to remove duplicates
    isFileExist: function(currentFile, masterFileList){
        var isExist = false;
        for(var eachFile in masterFileList){
            if(masterFileList[eachFile].name == currentFile.name){
                isExist = true;
            }
        }
        return isExist;
    },
    showToast: function(message,type){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
                            
                            "message": message,
                            "type":type
                        });
                        toastEvent.fire();
    },
    //Function to remove duplicates
    removeDuplicates : function (myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    },
    
})