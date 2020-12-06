import { IBlog } from '../interfaces/blog.interface';

export class Blog implements IBlog {
    constructor(
        public id: number | string,
        public title: string,
        public text: string,
        public date: Date,
        public author: string,
        public image: string,
    ){}
}