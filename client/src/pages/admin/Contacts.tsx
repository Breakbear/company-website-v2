import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getContacts, updateContactStatus, deleteContact, Contact } from '../../services/contact.service';

const AdminContacts: React.FC = () => {
  const { language } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await getContacts(params);
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateContactStatus(id, { status });
      fetchContacts();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status: status as Contact['status'] });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'zh-CN' ? '确定要删除此留言吗？' : 'Are you sure you want to delete this message?')) {
      return;
    }
    try {
      await deleteContact(id);
      fetchContacts();
      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      unread: 'bg-red-100 text-red-700',
      read: 'bg-yellow-100 text-yellow-700',
      replied: 'bg-green-100 text-green-700',
    };
    const labels: Record<string, Record<string, string>> = {
      unread: { zh: '未读', en: 'Unread' },
      read: { zh: '已读', en: 'Read' },
      replied: { zh: '已回复', en: 'Replied' },
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status][language === 'zh-CN' ? 'zh' : 'en']}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {language === 'zh-CN' ? '留言管理' : 'Message Management'}
      </h1>

      <div className="flex gap-2 mb-6">
        {['all', 'unread', 'read', 'replied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all'
              ? language === 'zh-CN' ? '全部' : 'All'
              : status === 'unread'
              ? language === 'zh-CN' ? '未读' : 'Unread'
              : status === 'read'
              ? language === 'zh-CN' ? '已读' : 'Read'
              : language === 'zh-CN' ? '已回复' : 'Replied'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium text-gray-900">
              {language === 'zh-CN' ? '留言列表' : 'Message List'}
            </h3>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'zh-CN' ? '暂无留言' : 'No messages'}
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'unread') {
                      handleStatusUpdate(contact._id, 'read');
                    }
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedContact?._id === contact._id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    {getStatusBadge(contact.status)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{contact.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(contact.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {selectedContact ? (
            <div>
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {language === 'zh-CN' ? '留言详情' : 'Message Details'}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedContact.status)}
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">{language === 'zh-CN' ? '姓名' : 'Name'}</p>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'zh-CN' ? '邮箱' : 'Email'}</p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'zh-CN' ? '电话' : 'Phone'}</p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'zh-CN' ? '公司' : 'Company'}</p>
                    <p className="font-medium">{selectedContact.company || '-'}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">{language === 'zh-CN' ? '主题' : 'Subject'}</p>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">{language === 'zh-CN' ? '留言内容' : 'Message'}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedContact._id, 'replied')}
                    className="btn-primary inline-flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'zh-CN' ? '标记为已回复' : 'Mark as Replied'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Mail className="w-12 h-12 mb-4 text-gray-300" />
              <p>{language === 'zh-CN' ? '选择一条留言查看详情' : 'Select a message to view details'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
