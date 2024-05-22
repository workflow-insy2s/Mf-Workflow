export class StepDto {
     id : any;
     name : string;
    description: String;
    workflowId : Number;
   result : string ;
   step_type: String;
   creationDate: any;
   exitRuleIds : [];
   entryRuleIds: [];
   roleId: string;

}

export interface StepDto1 {
   id : any;
   name : string;
  description: String;
  workflowId : Number;
 result : string ;
 step_type: string;
 creationDate: any;
 exitRuleIds : [];
 entryRuleIds: [];
 roleId: string;
}

export interface Branch {
   id: string;
   branch_Type: string;
   position: { x: number, y: number };
 }




  
  
   
  