
// 汎用的なAPI呼び出し関数
export const apiCall = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> => {
    const apiUrl = 'https://26os9pzfpb.execute-api.ap-northeast-1.amazonaws.com';
    const url = `${apiUrl}${endpoint}`;

    try {
        console.log('url', url);
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined
        });

        console.log('response', response);
        console.log('response status:', response.status);
        console.log('response headers:', response.headers);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // レスポンスの内容を確認
        const responseText = await response.text();
        console.log('response text:', responseText);
        
        // JSONとして解析を試行
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON解析エラー:', parseError);
            console.error('レスポンス内容:', responseText);
            throw new Error('APIがJSON以外のレスポンスを返しました');
        }
    } catch (error) {
        console.error('API呼び出しに失敗しました:', error);
        throw error;
    }
};