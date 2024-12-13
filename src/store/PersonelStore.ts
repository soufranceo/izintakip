import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Personel {
  id: number;
  ad: string;
  soyad: string;
  tcNo: string;
  telefon: string;
  bolum: string;
  isGirisTarihi: Date;
  isCikisTarihi: Date | null;
  yillikIzin: number;
  haftalikIzin: number;
}

export interface IzinKayit {
  id: number;
  personelId: number;
  baslangicTarihi: Date;
  bitisTarihi: Date;
  izinTuru: 'yillik' | 'haftalik' | 'aylik';
  gun: number;
}

interface PersonelStore {
  personeller: Personel[];
  izinKayitlari: IzinKayit[];
  addPersonel: (personel: Omit<Personel, 'id'>) => void;
  addIzinKayit: (izin: Omit<IzinKayit, 'id'>) => void;
  getPersonelById: (id: number) => Personel | undefined;
  getPersonelByAdSoyad: (adSoyad: string) => Personel | undefined;
}

export const usePersonelStore = create<PersonelStore>()(
  persist(
    (set, get) => ({
      personeller: [],
      izinKayitlari: [],
      addPersonel: (personel) => {
        set((state) => ({
          personeller: [...state.personeller, { ...personel, id: Date.now() }],
        }));
      },
      addIzinKayit: (izin) => {
        set((state) => ({
          izinKayitlari: [...state.izinKayitlari, { ...izin, id: Date.now() }],
        }));
      },
      getPersonelById: (id) => {
        return get().personeller.find((p) => p.id === id);
      },
      getPersonelByAdSoyad: (adSoyad) => {
        const [ad, soyad] = adSoyad.split(' ');
        return get().personeller.find(
          (p) => p.ad === ad && p.soyad === soyad
        );
      },
    }),
    {
      name: 'personel-store',
    }
  )
);