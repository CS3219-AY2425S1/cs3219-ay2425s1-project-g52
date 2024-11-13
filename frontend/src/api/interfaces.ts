interface Question {
    qId: number;
    readonly _id?: string;
    qTitle: string;
    qDescription: string;
    qCategory: string[];
    qComplexity: string;
}

interface Room {
  roomId: string;
  participants: string[];
  question: Question;
}

  export type {
    Question, Room
  };