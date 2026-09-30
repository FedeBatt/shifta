import { create } from 'zustand';
import type { User, UserOverview } from '@/types/user';

type UsersState = {
  users: User[];
  selectedUser: User | null;
  overview: UserOverview | null;
  loading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  setOverview: (overview: UserOverview | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addUser: (user: User) => void;
  replaceUser: (user: User) => void;
  removeUser: (id: number) => void;
};

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  overview: null,
  loading: false,
  error: null,
  setUsers: (users) => set({ users }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setOverview: (overview) => set({ overview }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users],
    })),
  replaceUser: (user) =>
    set((state) => ({
      users: state.users.map((item) => (item.id === user.id ? user : item)),
      selectedUser:
        state.selectedUser?.id === user.id ? user : state.selectedUser,
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      selectedUser:
        state.selectedUser?.id === id ? null : state.selectedUser,
    })),
}));
