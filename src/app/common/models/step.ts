export class Step {
     id : any;
     name : string;
    description: string;
    result : string ;
    creationDate: any;
    exitRuleIds : [];
    entryRuleIds: [];
    roleId: string;
    workflowId : any;
    step_type : string;
}

export class ConditionalStep extends Step {
    conditionId : any
  }
  
  export class IterativeStep extends Step {
    exitRuleId :any
}
  
  
   
  