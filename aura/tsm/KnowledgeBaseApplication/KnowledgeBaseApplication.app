<aura:application implements="force:appHostable" extends="force:slds" >  

    <aura:handler name="init" value="{!this}" action="{!c.doInit}" /> 
    <!-- Application variables -->
    <aura:attribute name="selectedArticle" type="Object" default="{}"/>
    <aura:attribute name="caseList" type="Object" default="[]"/>
    <!-- Handle the URL event from View -->
    <aura:handler name="sendUrlEvent" event="c:KnowledgeComponentEvent" action="{!c.handleArticleSelect}"/>
    
    <c:KnowledgeBaseArticlesParent selectedArticle="{!v.selectedArticle}"/>
</aura:application>