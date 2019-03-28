export interface User {
  id: string;
  name: string;
  username: string;
  selected?: boolean;
}
export interface UserState {
  list: User[];
  selectedId: string;
  loading: boolean;
}
