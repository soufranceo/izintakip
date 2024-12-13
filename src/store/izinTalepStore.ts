import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IzinTalep {
  id: number;
  personelId: number;
  baslangicTarihi: Date;
  bitisTarihi: Date;
  izinTuru: 'yillik' | 'haftalik';
  gun: number;
  durum: 'beklemede' | 'onaylandi' | 'reddedildi';
  aciklama: string;
}

interface IzinTalepStore {
  talepler: IzinTalep[];
  addTalep: (talep: Omit<IzinTalep, 'id' | 'durum'>) => void;
  updateTalepDurum: (id: number, durum: IzinTalep['durum']) => void;
  getPersonelTalepleri: (personelId: number) => IzinTalep[];
}

export const useIzinTalepStore = create<IzinTalepStore>()(
  persist(
    (set, get) => ({
      talepler: [],

      addTalep: (talep) => {
        set((state) => ({
          talepler: [...state.talepler, { ...talep, id: Date.now(), durum: 'beklemede' }]
        }));
      },

      updateTalepDurum: (id, durum) => {
        set((state) => ({
          talepler: state.talepler.map(talep =>
            talep.id === id ? { ...talep, durum } : talep
          )
        }));
      },

      getPersonelTalepleri: (personelId) => {
        return get().talepler.filter(t => t.personelId === personelId);
      }
    }),
    {
      name: 'izin-talep-store'
    }
  )
);