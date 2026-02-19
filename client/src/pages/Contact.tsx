import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Banner from '../components/common/Banner';
import { createContact, CreateContactData } from '../services/contact.service';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(t('contact.form.error'));
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info.address'),
      content: language === 'zh-CN' ? '中国上海市浦东新区张江工业园' : 'Zhangjiang Industrial Park, Pudong, Shanghai, China',
    },
    {
      icon: Phone,
      title: t('contact.info.phone'),
      content: '+86 21 5033 8899',
    },
    {
      icon: Mail,
      title: t('contact.info.email'),
      content: 'service@hydra-torque.com',
    },
    {
      icon: Clock,
      title: t('contact.info.hours'),
      content: language === 'zh-CN' ? '周一至周五 9:00-18:00' : 'Mon-Fri 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <div>
      <Banner title={t('contact.title')} size="small" />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('contact.getInTouch')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('contact.getInTouchDesc')}
              </p>

              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {t('contact.form.success')}
                  </h3>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {language === 'zh-CN' ? '发送另一条消息' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">
                        {t('contact.form.name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact.form.namePlaceholder')}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact.form.emailPlaceholder')}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="label">
                        {t('contact.form.phone')} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('contact.form.phonePlaceholder')}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="label">
                        {t('contact.form.company')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={t('contact.form.companyPlaceholder')}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="label">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact.form.subjectPlaceholder')}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={5}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-auto"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-industrial-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'zh-CN' ? '提交中...' : 'Submitting...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        {t('contact.form.submit')}
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{info.title}</h4>
                      <p className="text-gray-600 text-sm">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-400">
                  {language === 'zh-CN' ? '地图位置' : 'Map Location'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
