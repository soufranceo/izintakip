import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  password: string;
  personelId: number;
  isAdmin: boolean;
}

interface AuthStore {
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  getUserByPersonelId: (personelId: number) => User | undefined;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [{
        id: 1,
        username: 'admin',
        password: 'Zaq123...',
        personelId: 0,
        isAdmin: true
      }],
      currentUser: null,

      addUser: (user) => {
        const newUser = { ...user, id: Date.now() };
        set((state) => ({
          users: [...state.users, newUser]
        }));
      },

      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === id ? { ...user, ...userData } : user
          )
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter(user => user.id !== id)
        }));
      },

      login: (username, password) => {
        const user = get().users.find(
          u => u.username === username && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      getUserByPersonelId: (personelId) => {
        return get().users.find(u => u.personelId === personelId);
      }
    }),
    {
      name: 'auth-store',
      version: 1
    }
  )
);