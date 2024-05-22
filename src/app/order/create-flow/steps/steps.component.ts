import { CdkDragDrop, moveItemInArray, copyArrayItem, CdkDrag, CdkDropList, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, 
  ComponentFactoryResolver, ViewContainerRef , ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RuleDto } from '../../../common/models/rule-dto';
import { ServiceService } from '../../service.service';
import { WorkflowDto } from 'src/app/common/models/workflow-dto';
import { StepDto, StepDto1 } from 'src/app/common/models/step-dto';
import { MatDialog } from '@angular/material/dialog';
import { ConditionalStep, IterativeStep, Step } from 'src/app/common/models/step';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class StepsComponent  implements OnInit{

  cols: any[] = [];
  constructor(private srv: ServiceService , private srvStep: ServiceService,
    private router: Router ,private dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}
  @Input()
  set date(date: Date) {
    

    for (let i = 0; i < 4; ++i) {
      this.cols.push([{}, {}, {}, {}, {}, {}, {}]);
    }

    this.dataService.getSchedulesFor(2024, 3).subscribe((schedules) => {
      console.log(schedules);
      this.fillDaysWithSchedules(7, schedules);
    });
  }



  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;




  stepType :string = '';

  drop(event: CdkDragDrop<any>) {

    this.stepType = event.item.data ;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
         console.log(this.create);

  }

  private getSchedulesForDay(schedules: any[], currentDate: Date): any[] {
    return schedules
      .filter((x) => this.isSameDate(x.date, currentDate))
      .map((x) => {
        const tmp = { ...x };
        delete tmp.date;
        return tmp;
      });
  }

  private fillDaysWithSchedules(firstDayOfTheMonth: number, schedules: any[]) {
    
    let day = 1;

    for (let col = 0; col < 4; ++col) {
      let weekDay = col === 0 ? firstDayOfTheMonth : 0;
      for (; weekDay < 7; ++weekDay) {
        const currentDate = new Date(Date.UTC(2024, 1, day));
        this.cols[col][weekDay] = {
          schedules: this.getSchedulesForDay(schedules, currentDate),
        };

        ++day;
        
      }
    }
  }

  private isSameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  workflowId: '';
  workflow :WorkflowDto = {
    id: '',
    name: '',
    description: '',
    creationDate: new Date(),
    // responsible: '',
    role: '',
    steps: [],
  };

  
  idStep: number | null;
  // StepDto: StepDto = new StepDto();

  stepdto: StepDto1 = { 
        id : '',
      name : '',
      description: '',
      workflowId : 1,
      result : '' ,
      step_type: '',
      creationDate: '',
      exitRuleIds : [],
      entryRuleIds: [],
      roleId: '',
  };

  steps: StepDto1[] = [];

  ngOnInit(): void {

    this.loadPosition();

    this.route.params.subscribe(params => {
      this.workflowId = params['workflowId']; 

     this.getWorkflowDetail();
  });
}

 positions: { [key: string]: { x: number, y: number } } = {};



onDragEnded(event: CdkDragEnd, item: any) {
  console.log("item : ", item);
  this.positions[item.id] = event.source.getFreeDragPosition();
  this.savePosition();
  }

  savePosition() {
    localStorage.setItem('dragPosition', JSON.stringify(this.positions));
    console.log("position", this.positions);
  }

  loadPosition() {
    const savedPositions = localStorage.getItem('dragPosition');
    if (savedPositions) {
      this.positions = JSON.parse(savedPositions);
    } else {
      this.positions = {};
    }
  }
  

  
  getWorkflowDetail(){
    this.srv.getWorkflowById(this.workflowId).subscribe((res: any) => {
      this.workflow = res;
      this.create=res.steps;
  });
}
  
  addStepsToWorkflow(): void {
    let newStep: StepDto1 = { ...this.stepdto }; 
    // let newStep= this.stepdto;
    console.log( "new step", newStep);
    newStep.workflowId= parseInt(this.workflow.id, 10);
    newStep.step_type= this.stepType;
    console.log(this.stepType);
    console.log("nouvelle step simple", newStep);
    if (this.stepType == "Step"){

      this.srvStep.addStepsToWorkflow(newStep)
      .subscribe(
        (result) => { 
          console.log(result);
          Swal.fire('Valider', '', 'success');  
          console.log('Data saved');
          newStep.id = result;
          this.steps.push(newStep);
          this.getWorkflowDetail();
          this.showStepInfo = false;
          console.log(this.create);
        },
        (error) => { 
          console.log('Error:', error);
          Swal.fire('Erreur', '', 'error');
        }
      );
    }else if (this.stepType == "Iterative") {
      console.log("new step in iterative:" ,newStep);
      this.srvStep.addStepIterToWorkflow(newStep as IterativeStep)
      .subscribe(
        (result) => { 
          console.log(result);
          Swal.fire('Valider', '', 'success');  
          console.log('Data saved');
          newStep.id = result;
          this.steps.push(newStep);
          this.getWorkflowDetail();
          this.showStepInfo = false;
        },
        (error) => { 
          console.log('Error:', error);
          Swal.fire('Erreur', '', 'error');
        }
      );

    } else if (this.stepType == "Conditionelle"){
      
      this.srvStep.addStepCondiToWorkflow(newStep as ConditionalStep)
      .subscribe(
        (result) => { 
          console.log(result);
          Swal.fire('Valider', '', 'success');  
          console.log('Data saved');
          newStep.id = result;
          this.steps.push(newStep);
          this.getWorkflowDetail();
          this.showStepInfo = false;
        },
        (error) => { 
          console.log('Error:', error);
          Swal.fire('Erreur', '', 'error');
        }
      );
    }
    
  }
  
  deleteStep() {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible et supprimera l\'etape.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.idStep){
          this.srvStep.deleteStepFromWorkflow(this.idStep)
          .subscribe(
            (result) => { 
              console.log(result);
              Swal.fire('Step supprimé avec succès', '', 'success');
              window.location.reload();
            },
            (err) => {
              console.log(err);
              Swal.fire('Step supprimé avec succès', '', 'success');
              window.location.reload();
            }
          );
      }
        }
         else {
        Swal.fire('Suppression annulée', '', 'info');
      }
    });
  }

  Rules: RuleDto[] = [];
  
    deleteWorkflow(ruleId: any) {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action est irréversible et supprimera la régle.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.srv.removeRule(ruleId)
            .subscribe(
              (result) => {
                console.log(result);
                Swal.fire('Workflow supprimé avec succès', '', 'success');
                window.location.reload();
              },
              (err) => {
                console.log(err);
                Swal.fire('Workflow supprimé avec succès', '', 'success');
                window.location.reload();
              }
            );
        } else {
          Swal.fire('Suppression annulée', '', 'info');
        }
      });
    }
    
    editWorkflow(id: number): void {
      console.log(`Modification du workflow avec l'ID ${id}`);
    }
  
    
  stepst = ['Step','Iterative', 'Conditionelle', 'Exit'];

  create :any = [];
  iter :any = [];
  c2 :any = [];
  

  showStepInfo: boolean = false;

  createRule() :void {
    this.router.navigate(['/mfe-rule'], { queryParams: { idStep: this.idStep }});
  }

  isStepInfoVisible() {
  return this.showStepInfo;
  }

  ShowStepInfo():void {
  this.stepdto.name='';
  this.stepdto.description='';
  this.showStepInfo = true;
  }

  ShowStepInfoClick(StepId:any): void {
  this.idStep=StepId;
    this.showStepInfo = true;

        this.srvStep.getStepById(StepId).subscribe(
        (result:Step) => { 
          console.log("step:",result);
          this.stepdto.name = result.name;
          this.stepdto.description = result.description
          this.srvStep.getRulesByStepId(StepId).subscribe(
            resp => {
              this.Rules=resp;
            }
          )
        },
        (err) => {
          console.log(err);
        }
        );
    // this.dialog.open(StepInfoComponent, {
    //   width: '400px',
    //   // Add any other configuration options here
    // });
  }

  getSteps(): StepDto1[]{
    let steps= this.workflow.steps;
    return steps;
  }

  testStep(element: any): Boolean {
    if (element instanceof Step || element === "Step") {
      return true;
    } 
    return false;
  }

  condiStep(element: any):Boolean{
    if (element instanceof Step || element === "Conditionelle") {
      return true;
    } 
    return false;
  }

  // condiStep(step: Step): boolean {
  //   return step.step_type === "Conditionelle";
  // }
  

  iterStep(element: any):Boolean{
    if (element instanceof Step || element === "Itération") {
      return true;
    } 
    return false;
  }

  // iterStep(step: Step): boolean {
  //   return step.step_type === 'Iterative';
  // }
  


  editStepOfWorkflow(): void {
    this.srvStep.editStepOfWorkflow(this.idStep, this.stepdto)
    .subscribe(
      (result) => { 
      this.ngOnInit()
      Swal.fire('Valider', '', 'success')
     },
    (err) => {
      console.log(err)
      Swal.fire('Invalid ', '', 'error')
    }
    )
  }

  showRuleDetails(): void{
    
  }

}



