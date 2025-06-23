import { useState } from 'react';
import { Box, Button } from '@mui/material';
import Dialog from '../../components/Dialog/Dialog';
import CreatePostForm from './components/CreatePostForm';
import { useGetPostsQuery } from '../../services/posts.service';
// import useGetPostsQuery from '../../hooks/redux/posts/useGetPostsQuery';

function Posts() {
   const [createPostDialogOpen, setCreatePostsDialogOpen] = useState(false);

   // const { data: posts, isLoading, error } = useGetPostsQuery();
   const { data: posts, isLoading, error } = useGetPostsQuery();

   if (isLoading) return <p>Loading...</p>;

   if (error) return <p>Error</p>;

   if (!posts) return <></>;

   return (
      <div>
         <h1>Posts</h1>

         <Button variant="contained" onClick={() => setCreatePostsDialogOpen(true)}>
            Create post
         </Button>

         <ul>
            {posts.slice(0, 5).map((post) => (
               <li key={post.id}>{post.title}</li>
            ))}
         </ul>

         <Dialog
            open={createPostDialogOpen}
            onClose={() => setCreatePostsDialogOpen(false)}
            title="Create Post"
            fullWidth
            maxWidth="md"
         >
            <Box p={2}>
               <CreatePostForm onSuccess={() => setCreatePostsDialogOpen(false)} />
            </Box>
         </Dialog>
      </div>
   );
}

export default Posts;
