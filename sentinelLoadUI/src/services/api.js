const API_BASE_URL = 'http://localhost:8083/v1/load-engine';

export async function generateTestData(payload) {
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to generate test data');
    return response.json();
}

export async function getRelatedEntities(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/${loadTestId}/entities`);
    if (!response.ok) throw new Error('Failed to fetch related entities');
    return response.json();
}

export async function getLoadTestById(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/${loadTestId}`);
    if (!response.ok) throw new Error('Failed to fetch load test details');
    return response.json();
}

export async function deleteLoadTestOrData(loadTestId) {
    const response = await fetch(`${API_BASE_URL}/${loadTestId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete');
    return response.json(); // Returns boolean as per your controller
}
