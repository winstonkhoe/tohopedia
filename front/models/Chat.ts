import { Product } from "./Product";

class Chat {
    constructor(
      public id: string = "",
      public sender: string = "",
      public receiver: string = "",
      public content: string = "",
      public createdAt: string = "",
    ) {}
  }
  

export { Chat }