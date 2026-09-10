import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data, showToast, sendMessage } = useSchool();
  const { schoolInfo, sectionHeaders } = data;
  const header = sectionHeaders?.kontak;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Umum',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.message.trim()) {
      showToast('Mohon lengkapi nama dan pesan Anda.');
      return;
    }

    setIsSubmitting(true);
    const result = await sendMessage({
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      subject: formState.subject,
      message: formState.message,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      showToast('Pesan Anda telah berhasil dikirimkan ke kotak masuk admin sekolah!');
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          phone: '',
          subject: 'Pertanyaan Umum',
          message: '',
        });
        setSubmitted(false);
      }, 5000);
    } else {
      showToast(result.message || 'Gagal mengirim pesan.');
    }
  };

  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{header?.badge || 'Pusat Layanan & Lokasi'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {header?.title || `Hubungi ${schoolInfo.name}`}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {header?.subtitle || 'Kami siap melayani informasi akademik, pendaftaran siswa baru, maupun kerja sama institusi.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-4">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Alamat Kampus</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                      {schoolInfo.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Telepon Kantor & WhatsApp</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {schoolInfo.phone} / WA: {schoolInfo.whatsapp}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Surat Elektronik (Email)</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {schoolInfo.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Jam Pelayanan Kantor</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {schoolInfo.operatingHours}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps View */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-60 bg-slate-100 relative">
              <iframe
                title="Peta Lokasi Sekolah"
                src={schoolInfo.mapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Kirim Pesan Langsung</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Ada Pertanyaan Seputar Sekolah Kami?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Silakan tulis pesan Anda di bawah. Tim staf humas kami akan menghubungi kembali dalam kurun waktu 1x24 jam kerja.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
                  <CheckCircle className="w-10 h-10 mx-auto text-emerald-600" />
                  <div className="font-bold text-base">Terima Kasih Atas Pesan Anda!</div>
                  <p className="text-xs sm:text-sm text-emerald-700">
                    Pesan telah masuk ke sistem sekretariat sekolah. Kami akan segera menghubungi Anda melalui nomor telepon atau email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Contoh: Rian Hendrawan"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nomor WhatsApp / Telepon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="0812-XXXX-XXXX"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Topik Pesan
                      </label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                        <option value="Konsultasi SPMB">Konsultasi SPMB 2026/2027</option>
                        <option value="Program Beasiswa">Program Beasiswa Prestasi</option>
                        <option value="Kunjungan Kampus">Permohonan Kunjungan Sekolah</option>
                        <option value="Kerjasama Institusi">Kemitraan & Sponsorship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Isi Pesan / Pertanyaan *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda ketahui lebih lanjut..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    <span>{isSubmitting ? 'Mengirim Pesan...' : 'Kirimkan Pesan ke Sekolah'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
