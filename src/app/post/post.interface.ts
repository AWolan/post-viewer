export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  selected?: boolean;
}
export interface UserPosts {
  [userId: string]: Post[];
}
export interface PostState {
  userPosts: UserPosts;
  selectedId: string;
  loading: boolean;
  updating: boolean;
  showPostEdit: boolean;
}
