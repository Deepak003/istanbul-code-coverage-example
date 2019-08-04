({
	getContentViewDetails : function(component) {
		var viewContentAction = component.get("c.performViewContent"),
            caseObj = component.get('v.simpleCase');
        if (caseObj.RecordType && caseObj.RecordType.Name && caseObj.RecordType.Name.toLowerCase() != 'petition'){
            return;
        }
        if (!caseObj.ProductLR__r) {
            return;
        }
        var synergyId = caseObj.Petition_Details__r && caseObj.Petition_Details__r.Target_Account__r ? caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c : '';
        var id; var idType; var contentId;
        if(synergyId){
            synergyId = caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c.split(';'),
            id = synergyId[0]; 
            idType = synergyId[1]; 
            contentId = caseObj.Petition_Details__r.ContentID__c;
        } 
        var	prodName = caseObj.ProductLR__r.Url_Name__c,
        	platform = caseObj.PlatformLR__r.InternalName__c,
            ugcSpin = component.find('ugcSpinner'),
            petitionUUID = caseObj.Petition_Details__r.PetitionUUID__c ? caseObj.Petition_Details__r.PetitionUUID__c : caseObj.Petition_Details__r.Id;
        var	strContentVO = {
                //"url": "https://bytevault.test.gameservices.ea.com:8084/1.0/contexts/nfs-2018-pc/categories/Screenshots/records/0005?ownerType=NUCLEUS_PERSONA&ownerId=378202534",
                "url": caseObj.Petition_Details__r.View_Url__c,
            	"id" : id,
                "idType": idType,
                "contentId": contentId,
                "action": "view",
                "platform": platform,
                "crmProductName": prodName
            };
        
        
        viewContentAction.setParams({"strContentVO": JSON.stringify(strContentVO) , "strPetitionUUID" : petitionUUID});
        viewContentAction.setStorable();
        viewContentAction.setCallback(this, function(response) {
         	var state = response.getState();
            $A.util.addClass(ugcSpin, 'slds-hide');
            if (state === "SUCCESS") {
                try {
                    var data = JSON.parse(response.getReturnValue());
                    var responseType = data.response.responseType,
                        responseValue = data.response.responseValue,
                        ugcContent = component.find('ugcContent'),
                        imageCont = component.find('imageCont'),
                        responseRendering = data.response.responseRendering;
                	if (responseType) {
                    	responseType = responseType.toLowerCase();
                    }
                    if (responseRendering) {
                        responseRendering = responseRendering.toLowerCase();
                    }
                    // Image
                    if(responseType.includes('image/jpeg')){
                        component.set('v.contentType', 'image');
                        imageCont = component.find('imageCont');                        
                        if (imageCont.length) {
                            for (var i=0; imageCont.length > i; i++) {
                                $A.util.removeClass(imageCont[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(imageCont, 'slds-hide');
                        }
                        component.set('v.imageBaseData', 'data:image/png;base64,'+responseValue);
                        
                    }
                    if(responseType.includes('image/png') && responseRendering.includes('image')){
                        component.set('v.contentType', 'image');
                        imageCont = component.find('imageCont');                        
                        if (imageCont.length) {
                            for (var i=0; imageCont.length > i; i++) {
                                $A.util.removeClass(imageCont[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(imageCont, 'slds-hide');
                        }
                        component.set('v.imageBaseData', 'data:image/png;base64,'+responseValue);
                        
                    }/// Text
                    if (responseType.includes('text/html') && (responseRendering.includes('text') || responseRendering.includes('TEXT') )) {
                        //responseValue = JSON.parse(responseValue);
                        if (responseValue.indexOf('<body>') >=0) {
                            component.set('v.contentType', 'text/html');
                            var startPoint = responseValue.indexOf('<body>')+6,
                                endPoint = responseValue.indexOf('</body>');
                            responseValue = responseValue.substring(startPoint, endPoint);
                        }
                        else {
                            component.set('v.contentType', 'text');
                        }                        
                        ugcContent = component.find('ugcContent');
                        if (ugcContent.length) {
                            for (var i=0; ugcContent.length > i; i++) {
                                $A.util.removeClass(ugcContent[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(ugcContent, 'slds-hide');
                        }
                        component.set('v.urlRedirect', false);
                        component.set('v.contentData', responseValue);
                        //ugcContent.getElement().outerText=responseValue.result;
                    }
                    if(responseType.includes('text') && responseRendering.includes('url_redirect')){
                        component.set('v.contentType', 'text');
                        ugcContent = component.find('ugcContent');
                        if (ugcContent.length) {
                            for (var i=0; ugcContent.length > i; i++) {
                                $A.util.removeClass(ugcContent[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(ugcContent, 'slds-hide');
                        }
                        // Adding a Anchor tag
                        //responseValue = '<a href="' + responseValue + '" target="_blank">' + responseValue + '</a>';
                        component.set('v.urlRedirect', true);
                        component.set('v.contentData', responseValue);
                        
                    }
                    // THOR- 1400 
                    if(responseType.includes('text/html') && (responseRendering.includes('redirect')|| responseRendering.includes('REDIRECT'))){
                        component.set('v.contentType', 'text');
                        ugcContent = component.find('ugcContent');
                        if (ugcContent.length) {
                            for (var i=0; ugcContent.length > i; i++) {
                                $A.util.removeClass(ugcContent[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(ugcContent, 'slds-hide');
                        }                       
                        component.set('v.urlRedirect', true);
                        component.set('v.contentData', responseValue);
                        
                    }
                    //IN_PLACE
                    if(responseType.includes('text/html') && (responseRendering.includes('in_place') || responseRendering.includes('IN_PLACE'))){
                        component.set('v.contentType', 'text'); 
                        ugcContent = component.find('ugcContent');
                        if (ugcContent.length) {
                            for (var i=0; ugcContent.length > i; i++) {
                                $A.util.removeClass(ugcContent[i], 'slds-hide');
                            }
                        }
                        else {
                            $A.util.removeClass(ugcContent, 'slds-hide');
                        }
                        component.set('v.contentData', responseValue);
                        
                    }
                    //URL 
                    if (responseType.includes('text/html') &&  responseRendering.includes('url')) {
                        if (responseValue.includes('ea') || responseValue.includes('origin')) {
                            component.set('v.contentType', 'image');
                            imageCont = component.find('imageCont');
                            if (imageCont.length) {
                                for (var i=0; imageCont.length > i; i++) {
                                    $A.util.removeClass(imageCont[i], 'slds-hide');
                                }
                            }
                            else {
                                $A.util.removeClass(imageCont, 'slds-hide');
                            }
                        	component.set('v.imageBaseData', responseValue);
                        }
                        else {
                            component.set('v.contentType', 'text');
                            ugcContent = component.find('ugcContent');
							if (ugcContent.length) {
                                for (var i=0; ugcContent.length > i; i++) {
                                    $A.util.removeClass(ugcContent[i], 'slds-hide');
                                }
                            }
                            else {
                                $A.util.removeClass(ugcContent, 'slds-hide');
                            }
                        	component.set('v.contentData', responseValue);                            
                        }
                    }
                    
                      if (responseType.includes('application/json'))
                      {                       
                         
                        var contentData = [];
                        var imageContentPresent = false;

                        var response = JSON.parse(responseValue).response;
                        console.log(response['contentType']); 
                          
                        if(response['contentType'] == 'Image')
                        {
                            for ( var key in response )
                            {
                                if(key != 'content')
                                {
                                    if(key == 'clickHereToViewThumbs')
                                    {
                                        var ss = response[key];
                                        ss = ss.substring(ss.indexOf('http'), ss.indexOf('">'));
                                        contentData.push({value:ss, key:key});
                                    }
                                     else
                                        contentData.push({value:response[key], key:key});
                                }
    
                                if( key == 'contentType' && response[key] == 'Image' )
                                    imageContentPresent = true;
    
                                if( imageContentPresent && key == 'content') 
                                {
                                        
                            
                                        component.set('v.contentType', 'image');
                                        imageCont = component.find('imageCont');
                                        if (imageCont.length) {
                                            for (var i=0; imageCont.length > i; i++) {
                                                $A.util.removeClass(imageCont[i], 'slds-hide');
                                            }
                                        }
                                        else {
                                            $A.util.removeClass(imageCont, 'slds-hide');
                                        }
                                        component.set('v.imageBaseData', response['content']);
                                    
                                }
                                    
                            }
                        }
                        else if(response['contentType'] == 'Post')
                        {
                            for ( var key in response )
                            {
                                if(key != 'content')
                                	contentData.push({value:response[key], key:key});	
                                else
                                    component.set('v.chatData', response[key]);
                            }
                            
                            component.set('v.contentType', 'application/json');
                            
                            ugcContent = component.find('ugcContent');
                            if (ugcContent.length) {
                                for (var i=0; ugcContent.length > i; i++) {
                                    $A.util.removeClass(ugcContent[i], 'slds-hide');
                                }
                            }
                            else {
                                $A.util.removeClass(ugcContent, 'slds-hide');
                            }
                            
                        }
                         

                        component.set('v.contentData', contentData );  
                    }                	
                
                }                
                catch(err) {}
            }
            else if(state == 'ERROR')
            {
                var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                            "message": response.getError()[0].message,
                            "type": 'error'
                            });                
                //toastEvent.fire();
            }
        });
        $A.enqueueAction(viewContentAction);
    },
    /***** Thor -1400*****/
    getCaseDecription : function(component,matchingStr){
        var startPoint = caseObj.Description.toLowerCase().indexOf(matchingStr),
                                endPoint = caseObj.Description.length ;
                component.set('v.caseDescData', caseObj.Description.substring(startPoint, endPoint));
            	component.set('v.displayCaseDesc', true);
            	return;
    }
})