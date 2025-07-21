import React from 'react';
import { useApp } from '../context/AppContext';
import { Building, Users, DollarSign, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { properties, tenants, payments, loading, error } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalProperties = properties.length;
  const totalTenants = tenants.filter(t => t.status === 'active').length;
  const monthlyIncome = tenants.reduce((sum, tenant) => sum + tenant.rentAmount, 0);
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const totalOverdue = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Building,
      color: 'blue'
    },
    {
      title: 'Active Tenants',
      value: totalTenants,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Overdue Amount',
      value: `$${totalOverdue.toLocaleString()}`,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <ErrorMessage message={error} />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your rental overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Properties</h2>
          <div className="space-y-4">
            {properties.slice(0, 3).map((property) => (
              <div key={property._id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.address}</p>
                </div>
                <span className="text-sm font-medium text-gray-500">{property.units} units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overdue Payments</h2>
          <div className="space-y-4">
            {overduePayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No overdue payments! 🎉</p>
            ) : (
              overduePayments.map((payment) => {
                const tenant = tenants.find(t => t.id === payment.tenantId);
                const property = properties.find(p => p.id === tenant?.propertyId);
                return (
                  <div key={payment._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{tenant?.name}</h3>
                      <p className="text-sm text-gray-600">{property?.name} - Unit {tenant?.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">${payment.amount}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;