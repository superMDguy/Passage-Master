export class Passage {
 
    constructor(public id: number,
                public title: string,
                public text: string,
                public mastered: boolean,
                public currentPassage: boolean,
                public reviewed: number
                        ){}
}