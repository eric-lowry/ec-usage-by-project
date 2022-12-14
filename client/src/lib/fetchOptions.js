//
// fetchOptions()
//
export default function fetchOptions(opts = {}) {
    const { method = 'GET', body, accessToken } = opts;
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    };
  
    if (accessToken) {
      options.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  
    return options;
  }
  