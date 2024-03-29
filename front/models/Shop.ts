import { Chat } from "./Chat";
import { ChatHeader } from "./ChatHeader";
import { Product } from "./Product";

class Shop {
    constructor(
      public id: string = "",
      public name: string = "",
      public slug: string = "",
      public phone: string = "",
      public slogan: string = "",
      public description: string = "",
      public image: string = "",
      public openTime: string = "",
      public closeTime: string = "",
      public isOpen: boolean = false,
      public reputationPoint: number = 0,
      public type: number = 0,
      public city: string = "",
      public postalCode: string = "",
      public address: string = "",
      public products: Product[] = [],
      public chats: ChatHeader[] = [],
    ) {}
  }
  

export { Shop }