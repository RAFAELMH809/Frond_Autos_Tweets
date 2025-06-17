import { User } from "../user/User";

export class Tweet {
    id: number = 0;
    tweet: string = "";
    imageUrl?: string;
    
   postedBy!: User; // <- Usa el signo de exclamación para evitar el error de inicialización
}