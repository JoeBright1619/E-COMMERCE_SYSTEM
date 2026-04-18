import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { UserX, Mail } from 'lucide-react';
import api from '../../services/api';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

const ManageCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/admin/customers');
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = (name: string) => {
    toast.success(`${name} account suspended (Mock)`);
  };

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Customers</h2>
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>#{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} className="text-secondary" /> {customer.email}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${customer.role === 'Admin' ? 'delivered' : 'processing'}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td>{customer.joinDate}</td>
                  <td>
                    {customer.role !== 'Admin' && (
                      <button 
                        className="btn-danger" 
                        onClick={() => handleBanUser(customer.name)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <UserX size={14} /> Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
