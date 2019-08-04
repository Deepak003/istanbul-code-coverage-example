({
	populateWWCEObjects : function(component,event, helper){
        var WWCE={
                "States": {
                'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California', 'CO':'Colorado','CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska', 'NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania', 'RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont', 'VA':'Virginia','WA':'Washington', 'WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'
            },
            "Countries": {
                'US':'United States','AF':'Afghanistan','AL':'Albania','AX':'Aland Island','DZ':'Algeria','AS':'American Samoa','AD':'Andorra','AO':'Angola','AI':'Anguilla','AQ':'Antarctica', 'AG':'Antigua and Barbuda','AR':'Argentina','AM':'Armenia', 'AW':'Aruba','AU':'Australia', 'AT':'Austria','AZ':'Azerbaijan','BS':'Bahamas','BH':'Bahrain','BD':'Bangladesh','BB':'Barbados','BY':'Belarus','BE':'Belgium','BZ':'Belize','BJ':'Benin','BM':'Bermuda','BT':'Bhutan','BO':'Bolivia','BA':'Bosnia and Herzegovina','BW':'Botswana','BV':'Bouvet Island','BR':'Brazil','IO':'British Indian Ocean Territory (Chagos Archipelago)','VG':'British Virgin Islands','BN':'Brunei','BG':'Bulgaria','BF':'Burkina Faso','BI':'Burundi','KH':'Cambodia','CM':'Cameroon','CA':'Canada','CV':'Cape Verde','KY':'Cayman Islands','CF':'Central African Republic','TD':'Chad','CL':'Chile','CN':'China', 'CX':'Christmas Island','CC':'Cocos Islands', 'CO':'Colombia','KM':'Comoros','CG':'Congo,People\'s Republic of','CK':'Cook Islands','CR':'Costa Rica','HR':'Croatia','CY':'Cyprus', 'CZ':'Czech Republic','DK':'Denmark', 'DJ':'Djibouti','DM':'Dominica','DO':'Dominican Republic','TL':'East Timor','EC':'Ecuador','EG':'Egypt','SV':'El Salvador','GQ':'Equatorial Guinea','ER':'Eritrea', 'EE':'Estonia','ET':'Ethiopia','FO':'Faeroe Islands','FK':'Falkland Islands (Malvinas)','FJ':'Fiji','FI':'Finland','FR':'France','GF':'French Guiana','PF':'French Polynesia', 'TF':'French Southern Territories','GA':'Gabon','GM':'Gambia','GE':'Georgia','DE':'Germany','GH':'Ghana','GI':'Gibraltar','GR':'Greece','GL':'Greenland', 'GD':'Grenada','GP':'Guadaloupe', 'GU':'Guam','GT':'Guatemala','GN':'Guinea','GW':'Guinea-Bissau','GY':'Guyana,Republic of','HT':'Haiti','HM':'Heard and McDonald Islands', 'HN':'Honduras','HK':'Hong Kong', 'HU':'Hungary','IS':'Iceland','IN':'India','ID':'Indonesia','IQ':'Iraq','IE':'Ireland','IL':'Israel','IT':'Italy','CI':'Ivory Coast','JM':'Jamaica','JP':'Japan','JO':'Jordan','KZ':'Kazakhstan','KE':'Kenya', 'KI':'Kiribati','KW':'Kuwait', 'KG':'Kyrgyz Republic','LA':'Lao People\'s Democratic Republic','LV':'Latvia', 'LB':'Lebanon','LS':'Lesotho','LR':'Liberia','LI':'Liechtenstein','LT':'Lithuania','LU':'Luxembourg','MK':'Macedonia','MG':'Madagascar','MW':'Malawi', 'MY':'Malaysia','MV':'Maldives', 'ML':'Mali','MT':'Malta','MH':'Marshall Islands','MQ':'Martinique','MR':'Mauritania','MU':'Mauritius','YT':'Mayotte','MX':'Mexico','FM':'Micronesia', 'MD':'Moldova','MC':'Monaco', 'MN':'Mongolia','ME':'Montenegro', 'MS':'Montserrat','MA':'Morocco','MZ':'Mozambique','NA':'Namibia','NR':'Nauru', 'NP':'Nepal','NL':'Netherlands', 'AN':'Netherlands Antilles','NC':'New Caledonia','NZ':'New Zealand','NI':'Nicaragua','NE':'Niger','NG':'Nigeria','NU':'Niue','NF':'Norfolk Island','MP':'Northern Mariana Islands', 'NO':'Norway','OM':'Oman','PK':'Pakistan','PW':'Palau','PA':'Panama','PG':'Papua New Guinea','PY':'Paraguay','PE':'Peru','PH':'Philippines','PN':'Pitcairn Island','PL':'Poland', 'PT':'Portugal','PR':'Puerto Rico', 'QA':'Qatar','RE':'Reunion','RO':'Romania','RU':'Russian Federation','RW':'Rwanda', 'WS':'Samoa','SM':'San Marino', 'ST':'Sao Tome and Principe','SA':'Saudi Arabia','SN':'Senegal','RS':'Serbia','SC':'Seychelles','SL':'Sierra Leone','SG':'Singapore', 'SK':'Slovakia (Slovak Republic)','SI':'Slovenia','SB':'Solomon Islands','SO':'Somalia','ZA':'South Africa', 'KR':'South Korea','ES':'Spain', 'LK':'Sri Lanka','SH':'St. Helena','KN':'St. Kitts and Nevis','LC':'St. Lucia','PM':'St. Pierre and Miquelon','VC':'St. Vincent and the Grenadines','SR':'Suriname', 'SJ':'Svalbard &amp; Jan Mayen Islands','SZ':'Swaziland','SE':'Sweden','CH':'Switzerland','TW':'Taiwan','TJ':'Tajikistan','TZ':'Tanzania', 'TH':'Thailand','TG':'Togo', 'TK':'Tokelau','TO':'Tonga','TT':'Trinidad and Tobago','TN':'Tunisia','TR':'Turkey','TM':'Turkmenistan','TC':'Turks and Caicos Islands', 'TV':'Tuvalu','VI':'US Virgin Islands', 'UG':'Uganda','UA':'Ukraine','AE':'United Arab Emirates','GB':'United Kingdom','UM':'United States Minor Outlying Islands','UY':'Uruguay','UZ':'Uzbekistan', 'VU':'Vanuatu','VA':'Vatican City', 'VE':'Venezuela','VN':'Viet Nam','WF':'Wallis and Futuna Islands','EH':'Western Sahara','YE':'Yemen','ZM':'Zambia','ZW':'Zimbabwe'
            }
        }
        component.set("v.WWCE", WWCE);
        //Consructing option and lables from the list for countries
        var countryArray=[]
        for(var eachKey in Object.keys(WWCE["Countries"])){
            var countryMap={};
            countryMap["value"]=Object.keys(WWCE["Countries"])[eachKey];
            countryMap["label"]=WWCE["Countries"][countryMap["value"]];
            countryArray.push(countryMap);
        }
        //Construction of map for state from the list of state
        var stateArray=[]
        for(var eachKey in Object.keys(WWCE["States"])){
            var stateMap={};
            stateMap["value"]=Object.keys(WWCE["States"])[eachKey];
            stateMap["label"]=WWCE["States"][stateMap["value"]];
            stateArray.push(stateMap);
        }
        component.set("v.countryList", countryArray); 
        component.set("v.stateList", stateArray);  
     },
     setupData : function(component,event, helper){
		var accountData = component.get('v.accountDetailModel');
        var personas=[];
        if(accountData.hasOwnProperty('personas')) {
            for(var key in accountData.personas){
                personas.push(accountData.personas[key].displayName);
            }
        }
        component.set("v.personas", personas.join()); 
         if(accountData.hasOwnProperty('accountUpdaterSupported') && (accountData.accountUpdaterSupported == "true") ) {
             this.updateAccountUpdaterStatus(component, true);
         } else {
             this.updateAccountUpdaterStatus(component, false);
         }
         
         if(accountData.billingAccountType == 'paypal') {
             
         } else {
             
         }

        this.createMonthDropList(component);
        this.createYearDropList(component);
        this.createPersonaDropList(component, accountData);
        this.createStatusDropList(component);
     },
     createStatusDropList: function(component){
        var statusArray=[{"value":"ACTIVE","label":"ACTIVE"},{"value":"COMPLETED","label":"COMPLETED"}];
        component.set("v.statusList", statusArray);
    },
     createMonthDropList: function(component){
        var monthArray=[];
        for(var i = 1; i<=12; i++){
            var xMap={};
            xMap["value"]= ('0'+i).slice(-2).toString();
            xMap["label"]= ('0'+i).slice(-2).toString();
            monthArray.push(xMap);
        }
        component.set("v.monthList", monthArray);
    },
    createYearDropList: function(component){
        var yearArray=[];
        var min = new Date().getFullYear(),
        max = min + 9;
        for(var i = min; i<=max; i++){
            var xMap={};
            xMap["value"]=i.toString();
            xMap["label"]=i.toString();
            yearArray.push(xMap);
        }
        component.set("v.yearList", yearArray);
    },
    createPersonaDropList: function(component, accountData){
         if(accountData.hasOwnProperty('personas')) {
            var personaArray=[];
            var allPersonas = [];
            for(var key in accountData.personas){
                var xMap={};
            	xMap["value"]=accountData.personas[key].personaId.toString();
            	xMap["label"]=accountData.personas[key].displayName.toString();
            	personaArray.push(xMap);
            }
        }
        component.set("v.selectedPersonaList", personaArray);
        //var clonePersonaArray = JSON.parse( JSON.stringify( personaArray ) );
        component.set("v.personaList", personaArray);
    },
    removePersona :function(component, event) {
        var rmvId = event.target.getAttribute('data-id'),
            selectedRecords = component.get("v.selectedPersonaList"),
            rmIndex = '',
            smRecValue = selectedRecords[rmvId].value;
        event.preventDefault();
        event.stopPropagation();
        selectedRecords.splice(rmvId, 1);
        component.set("v.selectedPersonaList", selectedRecords);
    },
    applyPersona:function(component, event){
    	// This will contain the string of the "value" attribute of the selected option
    	var selectedRecords = component.get("v.selectedPersonaList");
    	
        var personaArray  = component.get('v.personaList');
        var selectedOptionValue = event.getParam("value");
        var selectedPersona = {};

        for(var i=0; i<personaArray.length; i++) {
            if (personaArray[i].value == selectedOptionValue) {
            	selectedPersona["value"]=personaArray[i].value.toString();
            	selectedPersona["label"]=personaArray[i].label.toString();
                selectedRecords.push(selectedPersona);
                break;
            }
    	}
        component.set("v.selectedPersonaList", selectedRecords);
	},
    handleCountryChange:function(component, event){
        var selectedOptionValue = event.getParam("value");
        if (selectedOptionValue == 'US'){
            component.set("v.showStateList", true);
        } else {
            component.set("v.showStateList", false);
        }
        
	},
    handleAutomaticAccountUpdateStatus:function(component, event){
        var toggleVal = component.find('automaticAccountUpdateStatus').get('v.value');
      	var isChecked = component.find('automaticAccountUpdateStatus').get('v.checked');
        this.updateAccountUpdaterStatus(component, isChecked);
        var action = component.get("c.toggleAutoUpdateStatus"); 
        var accountDetailModel = component.get("v.accountDetailModel");
        accountDetailModel.accountUpdaterSupported = isChecked;
		action.setParams({
            accountStatusStr : isChecked.toString(),
			accountIdStr : accountDetailModel.accountId
		});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
				Util.handleSuccess(component, 'Payment account details updated');
            }
            component.set("v.isSpinner", false);
        });
        component.set("v.isSpinner", true);
        $A.enqueueAction(action);
	},
    handleSaveData:function(component, event){
        var oldAccountDetails = component.get("v.oldAccountDetailModel");
        var newAccountDetailsObject = component.get("v.accountDetailModel");
        var newAccountDetails = JSON.stringify(newAccountDetailsObject);
        var nucleusId = component.get("v.nucleusId");
        var action = component.get("c.updateBillingAccountDetails"); 
		action.setParams({
            oldAccountDetails : oldAccountDetails,
			newAccountDetails : newAccountDetails,
            customerId : nucleusId
		});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                Util.handleSuccess(component, 'Payment account details updated');
                var cmpEvent = component.getEvent("cmpEvent"); 
                cmpEvent.setParams({"updatePaymentAccount" : newAccountDetails}); 
                cmpEvent.fire(); 
                component.set("v.isOpen", false);
            } else {
                Util.handleErrors(component, response);
            }
            component.set("v.isLoading", false);
        });
        component.set("v.isLoading", true);
        $A.enqueueAction(action);
	},
    updateAccountUpdaterStatus:function(component, accountUpdaterSupported){
         if(accountUpdaterSupported) {
             component.set("v.accountUpdaterSupported", true);
             component.set("v.accountUpdaterLabel", 'Enabled');
         } else {
             component.set("v.accountUpdaterSupported", false);
             component.set("v.accountUpdaterLabel", 'Disabled');
         }
    },
    handleCancelSaveData:function(component, event){
        //var oldModal = component.get("v.oldAccountDetailModel");
        //var accountData = JSON.parse(oldModal);
        //component.set("v.accountDetails", accountData);
    }
})