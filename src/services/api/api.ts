
// 環境変数からAPIベースURLを取得
const getApiUrl = (): string => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
        throw new Error('REACT_APP_API_URL is not defined in environment variables');
    }
    return apiUrl;
};

// 汎用的なAPI呼び出し関数
export const apiCall = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> => {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API呼び出しに失敗しました:', error);
        throw error;
    }
};