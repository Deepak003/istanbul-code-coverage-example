({
	init: function (component, event, helper) {     
		var cmp = component.find('datagrid'),
            id = 1000,
            data = component.find('data');        
        if (cmp) {
            //component.find('datagrid').setSelection(id);
        }
        if (data && data[0] && data[0].Subject == '') {
            component.set('v.beforeRoleSelect', true);
        }
        else {
            component.set('v.beforeRoleSelect', false);
        }
		return true;
    },
    
    handleMessageClick: function(cmp, event, helper) {
        
        var cmpTarget = cmp.find('begin-message'),
            ackMsg = cmp.get('v.ackMsg'),
            listTarget = cmp.find('queuedList');
        //$A.util.addClass(cmpTarget, 'slds-hide');
        //$A.util.removeClass(listTarget, 'slds-table_bordered');
        ackMsg = !ackMsg;
        //cmp.set('v.ackMsg', ackMsg);     
    	var modalBody = "",
            headerModal = "",
            footerModal = "";
        
        $A.createComponents([
            ["c:ModalContent",{}],
            ["c:ModalHeader",{}],
            ["c:ModalFooter",{}]
        ], function(components, status) {
            if (status === "SUCCESS") {
                modalBody = components[0];
                headerModal = components[1];
                footerModal = components[2];                
                //modalBody.set('v.UGContent', component.get('v.userRoles'));
                modalBody.set('v.contentType', 'RolesNQueues');
                modalBody.set('v.roleOptions', cmp.get('v.roleOptions'));
                modalBody.set('v.queueSelectionPermission', cmp.get('v.queueSelectionPermission'));
                //footerModal.set('v.UGContent', component.get('v.simpleCase'));                                                        
                headerModal.set('v.headerText', 'Choose Your Role');
                footerModal.set('v.roleFlag', true);
                footerModal.set('v.queueSelectionPermission', cmp.get('v.queueSelectionPermission'));
                cmp.find('overlayLib').showCustomModal({
                    header: headerModal,                                       
                    body: modalBody,
                    footer: footerModal,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        //alert('You closed the alert!');
                    }
                });
            }
            else {
                console.log(status);
            }
        });	
    },    
    
    handleRowClick: function(cmp, event, helper) {
        var selectedRows = event.getParam('selectedRows');      
    },
})