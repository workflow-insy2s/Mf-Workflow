import { Role } from "./role";
import { Step } from "./step";
import { StepDto } from "./step-dto";

export class WorkflowDto {
      id :any;
      name: string = '';
      description: string = '';
      creationDate: Date = new Date();
      role: string = '';
      //roles: Role[];
      steps: Step[];   
 }

    
    
    
     
    