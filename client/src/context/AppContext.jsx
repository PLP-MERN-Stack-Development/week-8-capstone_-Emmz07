import React, { createContext, useContext, useState, useEffect } from 'react';
import { propertiesAPI, tenantsAPI, paymentsAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [propertiesData, tenantsData, paymentsData] = await Promise.all([
        propertiesAPI.getAll(),
        tenantsAPI.getAll(),
        paymentsAPI.getAll()
      ]);
      
      setProperties(propertiesData.map(p => ({ ...p, id: p._id })));
      setTenants(tenantsData.map(t => ({ 
        ...t, 
        id: t._id,
        propertyId: t.propertyId._id || t.propertyId
      })));
      setPayments(paymentsData.map(p => ({ 
        ...p, 
        id: p._id,
        tenantId: p.tenantId._id || p.tenantId
      })));
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = (property) => {
    propertiesAPI.create(property)
      .then(newProperty => {
        setProperties(prev => [...prev, { ...newProperty, id: newProperty._id }]);
      })
      .catch(err => setError(err.message));
  };

  const updateProperty = (id, updates) => {
    propertiesAPI.update(id, updates)
      .then(updatedProperty => {
        setProperties(prev => prev.map(property => 
          property.id === id ? { ...updatedProperty, id: updatedProperty._id } : property
        ));
      })
      .catch(err => setError(err.message));
  };

  const deleteProperty = (id) => {
    propertiesAPI.delete(id)
      .then(() => {
        setProperties(prev => prev.filter(property => property.id !== id));
        setTenants(prev => prev.filter(tenant => tenant.propertyId !== id));
      })
      .catch(err => setError(err.message));
  };

  const addTenant = (tenant) => {
    tenantsAPI.create(tenant)
      .then(newTenant => {
        setTenants(prev => [...prev, { 
          ...newTenant, 
          id: newTenant._id,
          propertyId: newTenant.propertyId._id || newTenant.propertyId
        }]);
      })
      .catch(err => setError(err.message));
  };

  const updateTenant = (id, updates) => {
    tenantsAPI.update(id, updates)
      .then(updatedTenant => {
        setTenants(prev => prev.map(tenant => 
          tenant.id === id ? { 
            ...updatedTenant, 
            id: updatedTenant._id,
            propertyId: updatedTenant.propertyId._id || updatedTenant.propertyId
          } : tenant
        ));
      })
      .catch(err => setError(err.message));
  };

  const deleteTenant = (id) => {
    tenantsAPI.delete(id)
      .then(() => {
        setTenants(prev => prev.filter(tenant => tenant.id !== id));
        setPayments(prev => prev.filter(payment => payment.tenantId !== id));
      })
      .catch(err => setError(err.message));
  };

  const addPayment = (payment) => {
    paymentsAPI.create(payment)
      .then(newPayment => {
        setPayments(prev => [...prev, { 
          ...newPayment, 
          id: newPayment._id,
          tenantId: newPayment.tenantId._id || newPayment.tenantId
        }]);
      })
      .catch(err => setError(err.message));
  };

  const updatePayment = (id, updates) => {
    paymentsAPI.update(id, updates)
      .then(updatedPayment => {
        setPayments(prev => prev.map(payment => 
          payment.id === id ? { 
            ...updatedPayment, 
            id: updatedPayment._id,
            tenantId: updatedPayment.tenantId._id || updatedPayment.tenantId
          } : payment
        ));
      })
      .catch(err => setError(err.message));
  };

  const deletePayment = (id) => {
    paymentsAPI.delete(id)
      .then(() => {
        setPayments(prev => prev.filter(payment => payment.id !== id));
      })
      .catch(err => setError(err.message));
  };

  const value = {
    properties,
    tenants,
    payments,
    loading,
    error,
    loadData,
    addProperty,
    updateProperty,
    deleteProperty,
    addTenant,
    updateTenant,
    deleteTenant,
    addPayment,
    updatePayment,
    deletePayment
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};