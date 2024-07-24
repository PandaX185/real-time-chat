export class Message {
    constructor(
        public content: string,
        public sender: string,
        public receiver: string,
        public id?: number,
    ) { }
}