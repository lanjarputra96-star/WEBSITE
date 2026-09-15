export interface SocialMedia {
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;
}

export interface SchoolInfo {
  name: string;
  tagline: string;
  npsn: string;
  akreditasi: string;
  tahunBerdiri: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapsEmbedUrl: string;
  operatingHours: string;
  socialMedia: SocialMedia;
  logoUrl: string;
  website?: string;
  domain?: string;
}

export interface HeroBadge {
  label: string;
  value: string;
  icon: string;
}

export interface HeroSection {
  badgeText: string;
  badgeActive: boolean;
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  bgImageUrl: string;
  statsBadges: HeroBadge[];
}

export interface KepalaSekolah {
  name: string;
  title: string;
  photoUrl: string;
  greeting: string;
  quote: string;
}

export interface NilaiUtama {
  title: string;
  desc: string;
  icon: string;
}

export interface VisiMisi {
  visi: string;
  misi: string[];
  tujuan: string[];
  nilaiUtama: NilaiUtama[];
  showTujuan?: boolean;
  showNilaiUtama?: boolean;
}

export interface StatistikItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface ProgramSekolah {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  badge?: string;
}

export interface BeritaItem {
  id: string;
  title: string;
  category: 'Berita' | 'Pengumuman' | 'Prestasi' | 'Kegiatan';
  date: string;
  author: string;
  summary: string;
  content: string;
  imageUrl: string;
  isPinned: boolean;
}

export interface PrestasiItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Non-Akademik' | 'Seni & Budaya' | 'Olahraga';
  recipient: string;
  level: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kota/Kab';
  year: string;
  imageUrl: string;
  description: string;
}

export interface FasilitasItem {
  id: string;
  name: string;
  category: 'Akademik' | 'Laboratorium' | 'Olahraga' | 'Fasilitas Umum' | 'Ibadah & Seni';
  description: string;
  imageUrl: string;
}

export interface GuruItem {
  id: string;
  name: string;
  role: string;
  subject: string;
  education: string;
  photoUrl: string;
  bio?: string;
}

export interface PpdbStep {
  step: number;
  title: string;
  desc: string;
}

export interface PpdbInfo {
  isOpen: boolean;
  academicYear: string;
  registrationPeriod: string;
  description: string;
  steps: PpdbStep[];
  requirements: string[];
  brochureUrl: string;
  registrationUrl: string;
  registrationButtonText?: string;
  registrationOpenNewTab?: boolean;
  contactPerson: string;
}

export interface PusatInformasiItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  badge?: string;
  buttonText: string;
  buttonUrl: string;
  openInNewTab?: boolean;
}

export interface SectionHeaderItem {
  badge: string;
  title: string;
  subtitle: string;
}

export interface SectionHeaders {
  statistik: SectionHeaderItem;
  sambutan: SectionHeaderItem;
  visiMisi: SectionHeaderItem;
  program: SectionHeaderItem;
  prestasi: SectionHeaderItem;
  berita: SectionHeaderItem;
  fasilitas: SectionHeaderItem;
  guru: SectionHeaderItem;
  ppdb: SectionHeaderItem;
  pusatInformasi: SectionHeaderItem;
  kontak: SectionHeaderItem;
}

export interface SectionVisibility {
  hero: boolean;
  statistik: boolean;
  sambutan: boolean;
  visiMisi: boolean;
  program: boolean;
  prestasi: boolean;
  berita: boolean;
  fasilitas: boolean;
  guru: boolean;
  ppdb: boolean;
  pusatInformasi: boolean;
  kontak: boolean;
}

export interface SchoolData {
  schoolInfo: SchoolInfo;
  hero: HeroSection;
  kepalaSekolah: KepalaSekolah;
  visiMisi: VisiMisi;
  statistik: StatistikItem[];
  program: ProgramSekolah[];
  berita: BeritaItem[];
  prestasi: PrestasiItem[];
  fasilitas: FasilitasItem[];
  guru: GuruItem[];
  ppdb: PpdbInfo;
  pusatInformasi: PusatInformasiItem[];
  sectionHeaders: SectionHeaders;
  sectionVisibility: SectionVisibility;
  lastUpdated?: string;
}

export interface AdminUser {
  username: string;
  email: string;
  passwordHash: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface CloudflareSyncInfo {
  kvNamespaceId: string;
  lastSyncedAt?: string;
  status: 'connected' | 'syncing' | 'error' | 'idle';
  message?: string;
  multiDeviceEnabled: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}
