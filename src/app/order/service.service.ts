import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkflowDto } from '../common/models/workflow-dto';
import { RuleDto } from '../common/models/rule-dto';
import { Rule } from '../common/models/Rule';
import { RuleObjetDto } from '../common/models/RuleObjet-dto';
import { ObjectDto } from '../common/models/object-dto';
import { ParamDto } from '../common/models/param-dto';
import { StepDto } from '../common/models/step-dto';
import { Observable } from 'rxjs';
import { ConditionalStep, IterativeStep, Step } from '../common/models/step';
import { Role } from '../common/models/role';
import { User } from '../common/models/user';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http : HttpClient) { }
  url='http://localhost:7080/api/workflow'
  
// Service Workflow

  addWorkflow (workflow:WorkflowDto): Observable<any>{
    return this.http.post(this.url,workflow) 
   }


  getWorkflows(){
    return this.http.get(this.url)
  
   }

   removeWorkflow (id: any ){
    return this.http.delete(this.url+'/'+id)
  }



  editworkflow(workflow:WorkflowDto , workflowId:any ){
    return this.http.put(this.url+'/'+workflowId,workflow) 
   }


   getWorkflowById(workflowId:any){
    return this.http.get(this.url+'/'+workflowId)
  }

  addStepsToWorkflow(steps: StepDto) {
    return this.http.post(this.url+'/steps', steps)
  }

  addStepIterToWorkflow(steps: IterativeStep): Observable<IterativeStep> {
    
    return this.http.post<IterativeStep>(this.url+'/steps/iterative/workflow', steps)
  }

  addStepCondiToWorkflow(steps: ConditionalStep): Observable<ConditionalStep> {
    return this.http.post<ConditionalStep>(this.url+'/steps/conditional/workflow', steps)
  }



  editStepOfWorkflow(stepId: any, steps: StepDto) {
    return this.http.put(this.url +'/steps/' + stepId, steps);
  }
  

  deleteStepFromWorkflow(stepId: number): Observable<any> {
    return this.http.delete(this.url+'/steps/'+ stepId);
  }

  getStepById(stepId:any): Observable<Step>{
    return this.http.get<Step>(this.url+'/steps/'+stepId)
  }
  



  //service Rule 
  url1='http://localhost:7081/api/rule/rules'

  getRulesByStepId(stepId:any): Observable<any>{
    return this.http.get<Step>(this.url1+'/step/'+stepId)
  }

  addRule (rule:RuleDto){
    return this.http.post(this.url1,rule) 
   }

  getRuls(stepEntry: any){
    return this.http.get(this.url1+'stepEntry/'+stepEntry)
  
   }

   removeRule (ruleId: any ){
    return this.http.delete(this.url1+ruleId)
  }



  editRule(rule:RuleDto , ruleId:any ){
    return this.http.put(this.url1+'/'+ruleId,rule) 
   }


   getRuleById(ruleId:any){
    return this.http.get(this.url1+'/'+ruleId)
  }

  //pour l'objet
  addObjet (object:ObjectDto){
    return this.http.post(this.url1+'/objets',object) 
   }

/*    addParam (param:ParamDto){
    return this.http.post(this.url1+'/parameters',param) 
   } */

   addRuleObjet (relation:RuleObjetDto){
    return this.http.post(this.url1+'/relations',relation) 
   }

   //Parameter
   addParameter (param:ParamDto){
    return this.http.post(this.url1+'/parameters',param) 
   }
   
   //Add Rule With Objects 
   
   addRuleWithObjects (rule:Rule){
    return this.http.post(this.url1+'/rules/addWithObjects',rule) 
   }

   deleteObjet (ObjetId: any ){
    return this.http.delete(this.url1+'/objets/'+ObjetId)
  }

  //EDit Object
  editObject(object:ObjectDto , objtId:any ){
    return this.http.put(this.url1+'/objets/'+objtId,object) 
   }


   //APIRole
url2='http://localhost:8082/api/keycloak'

addRole (role:Role){
  return this.http.post(this.url2+'/roles/',role) 
 }

 getAllRoles(){
  return this.http.get(this.url2+'/roles/')

 }

 deleteRole (roleId: any ){
  return this.http.delete(this.url2+'/roles/'+roleId)
}

editRole(role:Role , roleId:any ){
  return this.http.post(this.url2+'/roles/'+roleId+'/update',role) 
 }


//APIs User


addUser (user:User){
  return this.http.post(this.url+'/users/create',user) 
 }

 getAllUsers(){
  return this.http.get(this.url+'/users/')

 }

 deleteUser (userId: any ){
  return this.http.delete(this.url+'/users/'+userId)
}

editUser(user:User){
  return this.http.post(this.url+'/users/update',user) 
 }


 getRoleById(userId:any){
  return this.http.get(this.url+'/'+userId)
}
}

