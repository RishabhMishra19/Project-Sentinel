import React, { useState } from 'react';
import { generateTestData } from '../services/api';

export default function TestDataPage() {
    const [form, setForm] = useState({
        prefix: 'load-test-01',
        tenantCount: 5,
        productsPerTenant: 5,
        servicesPerProduct: 4,
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await generateTestData(form);
            setResult(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h2>Test Data Generation</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>
                    Prefix:
                    <input
                        type="text"
                        value={form.prefix}
                        onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </label>
                <label>
                    Tenant Count:
                    <input
                        type="number"
                        value={form.tenantCount}
                        onChange={(e) => setForm({ ...form, tenantCount: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </label>
                <label>
                    Products / Tenant:
                    <input
                        type="number"
                        value={form.productsPerTenant}
                        onChange={(e) => setForm({ ...form, productsPerTenant: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </label>
                <label>
                    Services / Product:
                    <input
                        type="number"
                        value={form.servicesPerProduct}
                        onChange={(e) => setForm({ ...form, servicesPerProduct: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </label>
                <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Generating...' : 'Generate Test Hierarchy'}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', border: '1px solid #ddd' }}>
                    <h3>Generation Successful</h3>
                    <p><strong>Test Data ID:</strong> {result.testDataId}</p>
                    <p><strong>Prefix:</strong> {result.prefix}</p>
                    <p>Tenants Created: {result.tenantsCreated}</p>
                    <p>Products Created: {result.productsCreated}</p>
                    <p>Services Created: {result.servicesCreated}</p>
                </div>
            )}
        </div>
    );
}
