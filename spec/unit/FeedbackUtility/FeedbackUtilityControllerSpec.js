var vm = require('vm');var fs = require('fs');var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};

//var FeedbackUtilityController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/FeedbackUtility/FeedbackUtilityController.js')), {$A: $A});

var FeedbackUtilityController = require('../../../aura/tsm/FeedbackUtility/FeedbackUtilityController.js');

var FeedbackUtilityController = require('../../../aura/tsm/FeedbackUtility/FeedbackUtilityController.js');

describe('FeedbackUtilityController', function() {
var component, event, helper, module,onExist,isExist,currentSelectedId,isNew,isSubmit,fileList,newFeedbackDescription,isDuplicated,blockSearch,utilityIcon,textCount,files,selectedType,feedbackList,titleString,keyPressTimer,searchFeedback,isDuplicated;
beforeEach(function() {
component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);

event = jasmine.createSpyObj('event', ['getSource', 'getParam', 'currentTarget','dataset','value', 'stopPropagation', 'preventDefault']);
event.currentTarget.dataset= '0871b0000008T6NAAU'; 

helper = jasmine.createSpyObj('helper', ['getFeedbackCategoryList','getFeedbacks','getDetails','createFeedback','isValidString','handleReset','upVote','uploadFileHelper','uploadProcess','uploadInChunk','deleteAttachment','']);
component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');


Object.assign(component, {
	find: jasmine.createSpy('find').and.returnValue({
		get: ()=> {}
	}),
	get: jasmine.createSpy('get').and.callFake((arg)=> {
		if(arg == 'v.onExist') {
			return onExist;
		}
		if(arg == 'v.isExist') {
			return isExist;
		}
		if(arg == 'v.isNew') {
			return isNew;
		}
		if(arg == 'v.currentSelectedId') {
			return currentSelectedId;
		}
		if(arg == 'v.isDuplicated') {
			return isDuplicated;
		}
		if(arg == 'v.blockSearch') {
			return blockSearch;
		}
		if(arg == 'v.utilityIcon') {
			return "utility:add";
		}
		if(arg == 'v.textCount') {
			return textCount;
		}
		if(arg == 'v.selectedType') {
			return selectedType;
		}
		if(arg == 'v.files') {
			return ['1','2'];
		}
		if(arg == 'v.titleString') {
			return titleString;
		}
		if(arg == 'v.keyPressTimer') {
			return keyPressTimer;
		}
		if(arg == 'v.searchFeedback') {
			return searchFeedback;
		}
		if(arg == 'v.isDuplicated') {
			return isDuplicated;
		}
		if(arg=='v.newFeedbackDescription'){
			return 'sample';
		}
		if(arg=='v.isSubmit'){
			return true;
		}
		if(arg=='v.fileList'){
			return ['1','2'];
		}
		
	}),
	getEvent: jasmine.createSpy('getEvent').and.returnValue(component),
	setParams: jasmine.createSpy('setParams').and.returnValue(component),
	fire: jasmine.createSpy('fire').and.returnValue(component),
});

Object.assign(event, {
	getParam : jasmine.createSpy('getParam').and.returnValue(0),
	
});
});

describe('init', function() {
beforeEach(function() {
FeedbackUtilityController.init(component, event, helper);
});
it('will call the helper method searchCustomerData', function() {

expect(helper.getFeedbackCategoryList).toHaveBeenCalled();    
expect(helper.getFeedbacks).toHaveBeenCalled();          
});
});

describe('openFeedbackDetails', function() {
beforeEach(function() {
FeedbackUtilityController.openFeedbackDetails(component, event, helper);
});
it('will call the helper method accordianToggle', function() {     
	event.currentTarget.dataset.value='0871b0000008T6NAAU'
	expect(component.set).toHaveBeenCalledWith("v.utilityIcon", 'utility:add');
expect(helper.getDetails).toHaveBeenCalledWith(component,event,event.currentTarget.dataset.value);  
expect(component.set).toHaveBeenCalledWith("v.currentSelectedId",	event.currentTarget.dataset.value);   
});


});

describe('onBack', function() {
beforeEach(function() {
FeedbackUtilityController.onBack(component, event, helper);
});
it('will toggle the social events', function() {     
onExist=false;
isExist=true;
currentSelectedId='';
expect(component.set).toHaveBeenCalledWith("v.onExist",	onExist);
expect(component.set).toHaveBeenCalledWith("v.isExist",	isExist);
expect(component.set).toHaveBeenCalledWith("v.currentSelectedId",currentSelectedId);
//expect(component.set.calls.count()).toEqual(3);                   
});
});
describe('handleNewFeedbackClick', function() {
beforeEach(function() {
FeedbackUtilityController.handleNewFeedbackClick(component, event, helper);
});
it('will toggle the social events', function() { 
isNew=true;
isDuplicated=false;
isExist=false;
blockSearch=true;    
expect(component.set).toHaveBeenCalledWith("v.isNew",	isNew);
expect(component.set).toHaveBeenCalledWith("v.isDuplicated",isDuplicated);
expect(component.set).toHaveBeenCalledWith("v.isExist",isExist);
expect(component.set).toHaveBeenCalledWith("v.blockSearch",blockSearch);
//expect(component.set.calls.count()).toEqual(4);                   
});
});

describe('handleCancelClick', function() {
beforeEach(function() {
	FeedbackUtilityController.handleCancelClick(component, event, helper);
});
it('will toggle the social events', function() {     
   expect(helper.handleReset).toHaveBeenCalledWith(component,event);                   
});
});
describe('onDescriptionChange', function() {
beforeEach(function() {
	FeedbackUtilityController.onDescriptionChange(component, event, helper);
});
it('will toggle the social events', function() {  
	newFeedbackDescription='sample';
	textCount=6
	expect(component.set).toHaveBeenCalledWith("v.textCount",textCount);
	isSubmit=false;
	expect(component.set).toHaveBeenCalledWith("v.isSubmit",false);     
});
});
describe('handleUpVoteClick', function() {
beforeEach(function() {
	FeedbackUtilityController.handleUpVoteClick(component, event, helper);
});
it('will toggle the social events', function() {     
   expect(helper.upVote).toHaveBeenCalledWith(component,event);                   
});
});

describe('handleSubmitFeedbackClick', function() {
beforeEach(function() {
	FeedbackUtilityController.handleSubmitFeedbackClick(component, event, helper);
});
it('will toggle the social events', function() {     
   expect(helper.createFeedback).toHaveBeenCalled();                   
});
});
/*describe('handleUploadFileClick', function() {
beforeEach(function() {
	FeedbackUtilityController.handleUploadFileClick(component, event, helper);
});
it('will toggle the social events', function() {    
	event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function(arg) {if(arg=='v.files'){return files;}}, set: function(){return '';}});
   
   expect(helper.isFileExist).toHaveBeenCalledWith(files[0],fileList);                   
});
});
*/
describe('deleteAttachedRecord', function() {
beforeEach(function() {
	FeedbackUtilityController.deleteAttachedRecord(component, event, helper);
});
it('will toggle the social events', function() {    
event.currentTarget.dataset.value='0871b0000008T6NAAU';	
   expect(helper.deleteAttachment).toHaveBeenCalledWith(component,event,event.currentTarget.dataset.value);                   
});
});

describe('searchFeedback', function() {
beforeEach(function() {
});
it('will toggle the social events', function() {    
selectedType='System Issues';
feedbackList=[{"author":{"firstName":"Soujanya","lastName":"Kota","thumbnailUrl":"https://wwce-eait--TSMDP--c.cs25.content.force.com/profilephoto/005/T","id":"0051b000001MEF4AAO","name":"Soujanya Kota"},"categories":"New Feature Request","commentCount":0,"createdById":"0051b000001MEF4AAO","createdDate":"2019-04-05T06:34:53.000Z","creatorName":"Soujanya Kota","jobRoleName":"Admin Email","lastModified":"2019-04-05T06:34:53.000Z","score":2.373349542683377,"status":"New","title":"test4","value":101,"votes":10,"id":"0871b0000008T8iAAE"}];
titleString='k';
blockSearch=false;
keyPressTimer=10;
//event.currentTarget.dataset.value='0871b0000008T6NAAU';	
   //expect(helper.deleteAttachment).toHaveBeenCalledWith(component,event,event.currentTarget.dataset.value);  


	FeedbackUtilityController.searchFeedback(component, event, helper);   
   expect(helper.isValidString).toHaveBeenCalledWith(titleString);
   
});
});

});


