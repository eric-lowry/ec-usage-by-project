import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import NavBar from './components/NavBar';

import {
  useQuery,
  // useMutation,
  // useQueryClient,
} from '@tanstack/react-query';

const mockFetchAPI = () =>
  new Promise(res =>
    setTimeout(
      () =>
        res({
          'orgID': '3217569705',
          'orgName': 'Org-302e4d8',
          'fromDate': '2022-11-01',
          'toDate': '2022-11-30',
          'hourlyRate': 1.48,
          'totalCosts': 533.6544,
          'deployments': [
            {
              'id': '8f39806df82b47618b20b6094316f836',
              'name': 'eric-personal',
              'state': 'healthy',
              'tag': 'training',
              'costs': 322.1917,
              'rate': 0.4384,
            },
            {
              'id': '53e2df71692835d7f5dc19634141040b',
              'name': 'sf-hackathon-test-01',
              'state': 'healthy',
              'tag': 'project-1',
              'costs': 70.0311,
              'rate': 0.3472,
            },
            {
              'id': '0ad4135f6c1dad04fc1f52f01d16aca7',
              'name': 'sf-hackathon-test-02',
              'state': 'healthy',
              'tag': 'project-2',
              'costs': 70.0152,
              'rate': 0.3472,
            },
            {
              'id': '22c47a3b3061d12befd721b0d118eabe',
              'name': 'sf-hackathon-test-03',
              'state': 'healthy',
              'tag': 'project-2',
              'costs': 69.9946,
              'rate': 0.3472,
            },
            {
              'id': '3d5210e06eb1224a62e3eb7ca7e1967b',
              'name': 'tf-test-deployments-1',
              'state': 'hidden',
              'tag': 'not-tagged',
              'costs': 0.4947,
              'rate': 0.3472,
            },
            {
              'id': '8553de8fa858ab74ed8c2f9675230206',
              'name': 'tf-test-deployments-0',
              'state': 'hidden',
              'tag': 'not-tagged',
              'costs': 0.4918,
              'rate': 0.3472,
            },
            {
              'id': '96ec22315ede12c1b666ea25db26f3d6',
              'name': 'TF Test Deployment',
              'state': 'hidden',
              'tag': 'not-tagged',
              'costs': 0.3934,
              'rate': 0.3472,
            },
            {
              'id': 'a4c8b7a3fbecd8d85c5b1ddea98ec379',
              'name': 'TF Test Deployment',
              'state': 'hidden',
              'tag': 'not-tagged',
              'costs': 0.0419,
              'rate': 0.3472,
            },
          ],
        }),
      1000
    )
  );

const periods = [];
const today = new Date();
const date = new Date(today.getFullYear(), today.getMonth(), 1); // first day of month

for (let i = 0; i < 18; i++) {
  const d = new Date(new Date(date).setMonth(date.getMonth() - i));
  const label =
    d.getFullYear() + ' ' + d.toLocaleString('en-US', { month: 'long' });
  const d1 = d.toISOString().split('T')[0];
  if (i) {
    d.setDate(0); // use the last day of the month
  } else {
    d.setDate(today.getDate()); // use today's date
  }
  const d2 = d.toISOString().split('T')[0];
  periods.push([label, d1, d2]);
}

// console.log(periods);

function App() {
  const [period, setPeriod] = useState(0);
  const { isLoading, error, data } = useQuery({
    queryKey: ['period-info', period[1], period[2]],
    queryFn: () => mockFetchAPI(), // fetchAPI('/api/period-info'),
  });

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;

  const tagTotals = {};
  for (let i = 0; i < data.deployments.length; i++) {
    const deployment = data.deployments[i];
    tagTotals[deployment.tag] =
      (tagTotals[deployment.tag] || 0) + deployment.costs;
  }

  const tagOrder = Object.keys(tagTotals).sort(
    (a, b) => tagTotals[b] - tagTotals[a]
  );

  return (
    <div>
      <NavBar />
      <Container>
        <h1 className="mt-3">Billing</h1>
        <Container className="mt-3">
          <Row>
            <Col>
              <div className="p-3 rounded-3 border shadow-sm">
                <h5>Total hourly rate</h5>
                <h1>${data.hourlyRate.toFixed(4)}</h1>
                <p className="text-muted">
                  Hourly rate for all deployment capacity
                </p>
              </div>
            </Col>
            <Col>
              <div className="p-3 rounded-3 border shadow-sm">
                <h5>Month-to-date usage</h5>
                <h1>${data.totalCosts.toFixed(2)}</h1>
                <p className="text-muted">{20} days left in billing cycle</p>
              </div>
            </Col>
          </Row>
        </Container>

        <Container className="mt-3">
          <Row>
            <Col>
              <div>
                <strong>Usage breakdown by period</strong>
                <div className="text-muted">
                  This is not your bill, as it does not include credits,
                  prepaids, or any other discounts.
                </div>

                <Form.Group className="mt-3">
                  <Form.Label>Period</Form.Label>
                  <Form.Select
                    aria-label="Billing period selection"
                    value={period}
                    onChange={ev => setPeriod(ev.target.value)}
                  >
                    {periods.map((p, i) => (
                      <option key={i} value={i} selected={i===period}>
                        {p[0]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col" className="text-end pe-4">
                        Rate
                      </th>
                      <th scope="col" className="text-end pe-4">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  {tagOrder.map(tag => (
                    <tbody key={tag}>
                      <tr>
                        <th colSpan="3">Project: {tag}</th>
                      </tr>
                      {data.deployments.map(deployment => {
                        if (deployment.tag !== tag) return undefined;
                        return (
                          <tr key={deployment.id}>
                            <td>
                              <div className="ms-3">
                                {deployment.name}
                                {deployment.state === 'hidden'
                                  ? ' (deleted)'
                                  : ''}
                              </div>
                            </td>
                            <td className="text-end">
                              ${deployment.rate.toFixed(4)}
                            </td>
                            <td className="text-end">
                              ${deployment.costs.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="table-light">
                        <th></th>
                        <th></th>
                        <th className="text-end">
                          ${tagTotals[tag].toFixed(2)}
                        </th>
                      </tr>
                    </tbody>
                  ))}
                  <tfoot>
                    <tr>
                      <th colSpan="2">Total</th>
                      <th className="text-end">
                        ${data.totalCosts.toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Col>
          </Row>

          <div className="mb-5 d-flex flex-row-reverse">
            <Button>Export to CSV</Button>
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default App;
