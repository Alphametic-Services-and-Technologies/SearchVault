export interface Post {
   id: number;
   title: string;
}

export interface CreatePostBody {
   title: string;
   body: string;
   userId: number;
}
