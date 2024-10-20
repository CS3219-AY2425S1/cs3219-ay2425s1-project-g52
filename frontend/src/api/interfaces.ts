interface Question {
    qId: number;
    readonly _id?: string;
    qTitle: string;
    qDescription: string;
    qCategory: string[];
    qComplexity: string;
  }

  export type {
    Question
  };