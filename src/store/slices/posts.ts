import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from '../../types/post';
import { PostService } from '../../services/post';

interface PostsState {
  posts: IPost[];
  // isLoading: boolean;
  totalPosts: number;
}

const initialState: PostsState = {
  posts: [],
  // isLoading: false,
  totalPosts: 0,
};

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (page: number) => {
    try {
      const { data, headers } = await PostService.getPosts({
        _page: page,
        _limit: 5,
      });

      const totalPosts = Number(headers['x-total-count']);

      return { data, totalPosts };
    } catch (error: any) {
      return error.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, post }: { postId: string; post: IPost }) => {
    try {
      const { data } = await PostService.updatePost(postId, post);

      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      }) */
      .addCase(
        getPosts.fulfilled,
        (
          state,
          { payload }: PayloadAction<{ data: IPost[]; totalPosts: number }>
        ) => {
          // state.isLoading = false;
          state.posts = [...state.posts, ...payload.data];
          state.totalPosts = payload.totalPosts;
        }
      )
      /* .addCase(getPosts.rejected, (state) => {
        state.isLoading = false;
      }); */

      /* .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      }) */
      .addCase(
        updatePost.fulfilled,
        (state, { payload }: PayloadAction<IPost>) => {
          const foundPostIndex = state.posts.findIndex(
            (post) => post.id === payload.id
          );

          if (foundPostIndex !== -1) {
            state.posts[foundPostIndex] = payload;
          }
        }
      );
    /* .addCase(updatePost.rejected, (state) => {
        state.isLoading = false;
      }); */
  },
});

export default postsSlice.reducer;
