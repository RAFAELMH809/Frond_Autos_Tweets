import { Component, OnInit } from '@angular/core';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { ReactionService } from '../services/reaction.service';
import { TweetReactionRequest } from '../models/reactions/TweetReactionRequest';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comments/Comment';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    username : string = "";
    tweetText : string ="";
    imageUrl: string = ""; // NUEVO

    selectedFile: File | null = null;
    tweetImageUrl: string = "";

    tweets:Tweet[] = [];
    reactionCounts: { [tweetId: number]: { [reactionId: number]: number } } = {};

    userReactions: { [tweetId: number]: number } = {};
    comments: { [tweetId: number]: Comment[] } = {};
    newComment: { [tweetId: number]: string } = {};


    constructor( private storageService : StorageService,
                 private tweetService: TweetService,
                 private reactionService: ReactionService,
                 private commentService: CommentService
               )
    {
       this.username = this.storageService.getSessionString("user")|| "";
       console.log("Usuario:", this.username);
     //  this.getTweets();

    }
   ngOnInit(): void {
     const token = this.storageService.getSessionString("token");
  if (token) {
    //setTimeout(() => {
      this.getTweets();
   // }, 200);
  }else {
    console.warn("Token aún no disponible al iniciar");
  }
}

    onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    }

    //addTweetTextOnly(): void {
  //if (!this.tweetText.trim()) return;

//  const formData = new FormData();
//  formData.append('tweet', this.tweetText);

//  this.tweetService.postTweetWithImage(formData).subscribe(() => {
  //  this.tweetText = '';
    //this.getTweets();
  //});
//}


postImageTweet() {
  if (!this.imageUrl.trim()) return;

  const tweetData = {
    tweet: "", // o puedes usar un texto fijo como "Imagen publicada"
    imageUrl: this.imageUrl
  };

  this.tweetService.postImageTweet(tweetData).subscribe(() => {
    this.imageUrl = "";
    this.getTweets();
  });
}


addTweetTextOnly() {
  if (!this.tweetText.trim()) return;
  this.tweetService.postTweet(this.tweetText).subscribe(() => {
    this.tweetText = "";
    this.getTweets();
  });
}

addTweetImageUrl() {
  if (!this.tweetImageUrl.trim()) return;
  const tweetPayload = new FormData();
  tweetPayload.append("tweet", this.tweetText || "");
  tweetPayload.append("imageUrl", this.tweetImageUrl);

  this.tweetService.postTweetWithUrl(this.tweetText, this.tweetImageUrl).subscribe(() => {
    this.tweetImageUrl = "";
    this.tweetText = "";
    this.getTweets();
  });
}
uploadImageTweet(): void {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('tweet', this.tweetText); // puede estar vacío
  formData.append('image', this.selectedFile);

  this.tweetService.postTweetWithImage(formData).subscribe(() => {
    this.tweetText = '';
    this.selectedFile = null;
    this.getTweets();
  });
}



  // Obtener tweets y reacciones
  private getTweets() {
    this.tweetService.getTweets().subscribe((response: any) => {
      this.tweets = response?.content ?? [];
      this.loadReactions();
      this.loadComments();
    });
  }

  // Crear nuevo tweet
  public addTweet() {
    this.tweetService.postTweet(this.tweetText).subscribe(() => {
      if (!this.tweetText.trim()) return; 
      this.tweetText = "";
      this.getTweets();
    });
  }

   public reactToTweet(tweetId: number, reactionId: number): void {
    const request: TweetReactionRequest = { tweetId, reactionId };

    this.reactionService.reactToTweet(tweetId, reactionId).subscribe(() => {
      this.loadReactions(); // recargar reacciones
    });
  }

 private loadReactions() {
  this.reactionCounts = {};
  this.userReactions = {};

  const userId = Number(this.storageService.getSession("id"));

  for (let tweet of this.tweets) {
    this.reactionService.getReactionsByTweet(tweet.id).subscribe(reactions => {
      // Inicializar contador
      this.reactionCounts[tweet.id] = { 1: 0, 2: 0 };

      reactions.forEach((r: any) => {
        const reactionId = r.reactionId;

        // Contar LIKE y DISLIKE (ID 1 y 2)
        if (reactionId === 1) this.reactionCounts[tweet.id][1]++;
        if (reactionId === 2) this.reactionCounts[tweet.id][2]++;

        // Marcar reacción del usuario actual
        if (r.userId === userId) {
          this.userReactions[tweet.id] = reactionId;
        }
      });
    });
  }
}
private loadComments() {
    for (let tweet of this.tweets) {
      this.commentService.getCommentsByTweet(tweet.id).subscribe(comments => {
        this.comments[tweet.id] = comments;
      });
    }
  }

  public postComment(tweetId: number) {
  const content = this.newComment[tweetId];
  if (!content || content.trim() === '') return;

  this.commentService.postComment(tweetId, content).subscribe(() => {
    this.newComment[tweetId] = "";

    // Solo recargar comentarios del tweet actualizado
    this.commentService.getCommentsByTweet(tweetId).subscribe(comments => {
      this.comments[tweetId] = comments;
    });
  });
}

public canDelete(tweet: Tweet): boolean {
  return tweet.postedBy?.username === this.username;
}
public deleteTweet(tweetId: number): void {
  if (confirm("¿Estás seguro de eliminar este tweet?")) {
    this.tweetService.deleteTweet(tweetId).subscribe(() => {
    this.tweets = this.tweets.filter(t => t.id !== tweetId);
    delete this.comments[tweetId];
    delete this.reactionCounts[tweetId];
    delete this.userReactions[tweetId];
      this.getTweets(); // recargar tweets actualizados
    });
  }
}

}
