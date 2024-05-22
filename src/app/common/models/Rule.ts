export class Rule {
    name: string;
    description: string;
    formula: string;
    creationDate: any;
    ruleObjets: RuleObjet[];
  
    constructor(
      name: string,
      description: string,
      formula: string,
      creationDate: any,
      ruleObjets: RuleObjet[]
    ) {
      this.name = name;
      this.description = description;
      this.formula = formula;
      this.creationDate = creationDate;
      this.ruleObjets = ruleObjets;
    }
  }
  
  export class RuleObjet {
    objet: {
      id: any;
    };
    rank: any;
  
    constructor(objetId: any, rank: any) {
      this.objet = { id: objetId };
      this.rank = rank;
    }
  }