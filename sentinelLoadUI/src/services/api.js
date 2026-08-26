const API_BASE_URL = 'http://localhost:8083/v1/load-engine';

export async function generateTestData(payload) {
    const response = await fetch(`${API_BASE_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to generate test data');
    return response.json();
}


export async function getLoadTestById(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/data/${loadTestId}`);
    if (!response.ok) throw new Error('Failed to fetch load test details');
    return response.json();
}

export async function startLoadTestById(loadTestId, testRunConfig) {
    const response = await fetch(`${API_BASE_URL}/data/${loadTestId}/start`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testRunConfig) });
    if (!response.ok) throw new Error('Failed to fetch load test details');
    return response.json();
}

export async function stopLoadTestById(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/data/${loadTestId}/start`, { method: 'post' });
    if (!response.ok) throw new Error('Failed to fetch load test details');
    return response.json();
}

export async function deleteLoadTestOrData(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/data/${loadTestId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete');
    return response.json(); // Returns boolean as per your controller
}
