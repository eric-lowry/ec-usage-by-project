import { handleHttpErrors } from 'fetch-http-errors';

import {
  useQuery,
  // useMutation,
  // useQueryClient,
} from '@tanstack/react-query';

// const EC_API_URL = 'https://api.elastic-cloud.com';
const EC_API_KEY =
  'SmhzT200UUJRaE0yX2F5SWE1bEk6aHhwZmhZa1BTRmFZRkFZV3ZtZzdLUQ==';

const fetchAPI = (uri, opts = {}) =>
  fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${EC_API_KEY}`,
    },
    ...opts,
  })
    .then(handleHttpErrors)
    .then(res => {
      return res.json();
    });

function App() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['orgInfo'],
    queryFn: () => fetchAPI('/api/v1/organizations'),
  });
  if (isLoading) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <div>
      <h1>Hello Elastic!</h1>
    </div>
  );
}

export default App;
