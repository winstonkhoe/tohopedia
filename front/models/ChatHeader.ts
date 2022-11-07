import { Chat } from "./Chat";
import { Product } from "./Product";
import { Shop } from "./Shop";
import { User } from "./User";

class ChatHeader {
    constructor(
      public id: string = "",
      public details: Chat[] = [],
      public customer: User,
      public shop: Shop,
    ) {}
  }
  

export { ChatHeader }