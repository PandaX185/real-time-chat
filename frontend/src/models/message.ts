export class Message {
    constructor(
        public id: number,
        public content: string,
        public senderId: number,
        public receiverId: number,
    ) { }
}