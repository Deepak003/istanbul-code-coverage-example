const vm = require('vm');const fs = require('fs');const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction'],'get');
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

//var FeedbackUtilityHelper =  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/FeedbackUtility/FeedbackUtilityHelper.js')), {$A: $A});

var FeedbackUtilityHelper = require('../../../aura/tsm/FeedbackUtility/FeedbackUtilityHelper.js');

var FeedbackUtilityHelper = require('../../../aura/tsm/FeedbackUtility/FeedbackUtilityHelper.js');

describe('FeedbackUtilityHelper', ()=> {

	let component, event, helper, action,id, response,message,type,responseError, responseState,feedbackOptions, responseData,fileList,titleString,selectedType,newFeedbackDescription;
beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        
        helper = jasmine.createSpyObj('helper', ['']);
        action = jasmine.createSpyObj('action', ['setParams','setCallback']);
        response = jasmine.createSpyObj('response', ['getState', 'getReturnValue']);
	
	Object.assign(component, {
        	find: jasmine.createSpy('find').and.returnValue({
	            get: ()=> {}
	        }),
	 get: jasmine.createSpy('get').and.callFake((arg)=> {
	        	if(arg=='c.getFeedbackCategories'||'c.getFeedbacks'||'c.getFeedbackById'||'c.createFeedback'||'c.upVote'||'c.doDelete'){
					return action;
				}
				if(arg=='v.feedbackOptions'){
					return feedbackOptions;
				}
				if(arg=='v.fileList'){
					return fileList;
				}
				if(arg=='v.titleString'){
					return 'Sample';
				}
				if(arg=='v.newFeedbackDescription'){
					return newFeedbackDescription;
					
				}
				if(arg=='v.selectedType'){
					return selectedType
				}
				if(arg=='v.currentSelectedId'){
					return currentSelectedId;
				}
	        }),
	        //getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	        setParams: jasmine.createSpy('setParams').and.returnValue(component),
	        //fire: jasmine.createSpy('fire').and.returnValue(component),
            //setCallback: jasmine.createSpy('setCallback').and.returnValue(component),
        });
		Object.assign(event, {
        	getParam : jasmine.createSpy('getParam').and.returnValue(0),
        });

        // syp helper methods
        Object.assign(helper, {});

		Object.assign(action, {
            setCallback: jasmine.createSpy('setCallback').and.callFake((arg, arg1)=> {
                if(typeof arg1 == 'function'){
                    arg1.call(FeedbackUtilityHelper, response);
                }
            }),
			setParams:jasmine.createSpy('setParams')
        });
		Object.assign(response, {
            getState: ()=> responseState,
            getReturnValue: ()=> responseData,
			getError:()=> responseError
        });

        // spy $A methods
        Object.assign($A, {
            get: jasmine.createSpy('get').and.returnValue($A),
            fire: jasmine.createSpy('fire').and.returnValue($A),
			setParams: jasmine.createSpy('setParams').and.returnValue($A)
			
        });
});
	
	describe('getFeedbackCategoryList', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.getFeedbackCategoryList(component,event);
            expect(component.get).toHaveBeenCalledWith('c.getFeedbackCategories');
            //expect(action.setParams).toHaveBeenCalledWith({ userId: "12345" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = ['System Issues', 'System Issues - 2' ];

            FeedbackUtilityHelper.getFeedbackCategoryList(component,event);
            expect(component.set).toHaveBeenCalledWith("v.feedbackOptions", 
				[{label: "System Issues", value: "System Issues"},{label: "System Issues - 2", value: "System Issues - 2"}]
			);
			
            /*expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);*/
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getFeedbackCategoryList(component,event);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the feedback category List','error');
        });
		
    });
	describe('getFeedbacks', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.getFeedbacks(component,event);
            expect(component.get).toHaveBeenCalledWith('c.getFeedbacks');
            //expect(action.setParams).toHaveBeenCalledWith({ userId: "12345" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = 
				{firstame:"Soujanya",lastName:"Kota"};

            FeedbackUtilityHelper.getFeedbacks(component,event);
            expect(component.set).toHaveBeenCalledWith("v.feedbackList", 
				{firstame:"Soujanya",lastName:"Kota"}
			);
			
            /*expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);*/
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getFeedbacks(component,event);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the feedback List','error');
        });
		
    });
	describe('getDetails', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.getDetails(component,event,'12345');
            expect(component.get).toHaveBeenCalledWith('c.getFeedbackById');
            expect(action.setParams).toHaveBeenCalledWith({ ideaId: "12345" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = 
				{votedUsers:["0051b000001MEF4AAO"]};

            FeedbackUtilityHelper.getDetails(component,event,id);
            
			expect(component.set).toHaveBeenCalledWith("v.onExist", true);
                expect(component.set).toHaveBeenCalledWith("v.isExist", false);
            /*expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);*/
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getDetails(component,event,id);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the details of feedback','error');
        });
		
    });
	
	describe('handleReset', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.handleReset(component,event);
            expect(component.set).toHaveBeenCalledWith("v.isNew", false);
			expect(component.set).toHaveBeenCalledWith("v.blockSearch", false);
			expect(component.set).toHaveBeenCalledWith("v.newFeedbackDescription", "");
			expect(component.set).toHaveBeenCalledWith("v.isExist", true);
			
        });
		
		
    });
	
	
	describe('isValidString', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.isValidString('string');
            //expect(component.get).toHaveBeenCalledWith('c.getFeedbackById');
           //expect(action.setParams).toHaveBeenCalledWith({ ideaId: "12345" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		
		
    });
	
	/*describe('upVote', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.upVote(component,event);
            expect(component.get).toHaveBeenCalledWith('c.upVote');
			currentSelectedId="001"
            expect(action.setParams).toHaveBeenCalledWith({ ideaId: "001" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
            responseData = 'SUCCESS';
				

            FeedbackUtilityHelper.upVote(component,event);
            
			
            
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getDetails(component,event,id);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the details of feedback','error');
        });
		
    });
	*/
		describe('deleteAttachment', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.deleteAttachment(component,event,"01");
            expect(component.get).toHaveBeenCalledWith('c.doDelete');
            expect(action.setParams).toHaveBeenCalledWith({ recordId: "01" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
			var sp = spyOn(FeedbackUtilityHelper, "removeSelectedFile");
            //responseData = 
				//{firstame:"Soujanya",lastName:"Kota"};

            FeedbackUtilityHelper.deleteAttachment(component,event,"010");
            expect(component.set).toHaveBeenCalledWith("v.fileList", undefined
				
			);
			
            /*expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);*/
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getFeedbacks(component,event);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the feedback List','error');
        });
		
    });
	describe('showToast', ()=> {        
        it('should call correct apex method', function() {
            FeedbackUtilityHelper.showToast(message,type);
            //expect(component.get).toHaveBeenCalledWith('c.doDelete');
            //expect(action.setParams).toHaveBeenCalledWith({ recordId: "01" });
            //expect(component.set).toHaveBeenCalledWith("v.isLoading", true);
        });
		it('should set options on success by hiding loading', function() {
            responseState = "SUCCESS";
			var sp = spyOn(FeedbackUtilityHelper, "removeSelectedFile");
            //responseData = 
				//{firstame:"Soujanya",lastName:"Kota"};

            FeedbackUtilityHelper.deleteAttachment(component,event,"010");
            expect(component.set).toHaveBeenCalledWith("v.fileList", undefined
				
			);
			
            /*expect(component.set).toHaveBeenCalledWith("v.options", [
                {label: "Prorated Refund - $100", value: "1"},
                {label: "Full Refund - $500", value: "2"}
            ]);*/
        });
		it('should set options on failure by hiding loading', function() {
            responseState = "FAILED";
			spyOn(FeedbackUtilityHelper, "showToast");
            FeedbackUtilityHelper.getFeedbacks(component,event);            
            
            expect(FeedbackUtilityHelper.showToast).toHaveBeenCalledWith('An error occurred getting the feedback List','error');
        });
		
    });
	
});

