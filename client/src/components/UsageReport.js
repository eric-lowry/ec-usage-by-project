import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import NavBar from './NavBar';
import Loading from './Loading';
import Error from './Error';

import fetchAPI from '../lib/fetchAPI';

import { useQuery } from '@tanstack/react-query';

const API_HOST = process.env.REACT_APP_API_HOST || '';

function daysInMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return d.getDate();
}

const periods = [];
const today = new Date();
const date = new Date(today.getFullYear(), today.getMonth(), 1); // first day of month

for (let i = 0; i < 13; i++) {
  const d = new Date(new Date(date).setMonth(date.getMonth() - i));
  const fromDate = d.toISOString().split('T')[0];
  if (i) {
    d.setDate(daysInMonth(d)); // use the last day of the month
  } else {
    d.setDate(today.getDate()); // use today's date
  }
  const label =
    d.getFullYear() +
    ' ' +
    d.toLocaleString('en-US', { month: 'long' }) +
    ' 1-' +
    d.getDate() +
    (i ? '' : ' (current)');
  const toDate = d.toISOString().split('T')[0];
  periods.push({ label, fromDate, toDate });
}

// console.log(periods);

function UsageReport({ onLogout }) {
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = periods[periodIndex];
  const { isLoading, error, data } = useQuery({
    queryKey: ['period-info', period.fromDate, period.toDate],
    queryFn: () =>
      fetchAPI(`/api/period-info?from=${period.fromDate}&to=${period.toDate}`),
      refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <Error
        message="Unable to load usage breakdown. Please try again later."
        error={error}
      />
    );

  const tagTotals = {};
  let usageTotal = 0;
  for (let i = 0; i < data.deployments.length; i++) {
    const deployment = data.deployments[i];
    tagTotals[deployment.tag] =
      (tagTotals[deployment.tag] || 0) + deployment.costs;
    usageTotal = usageTotal + deployment.costs;
  }

  const tagOrder = Object.keys(tagTotals).sort(
    (a, b) => tagTotals[b] - tagTotals[a]
  );

  const handleLogout = ev => {
    ev.preventDefault();
    onLogout();
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Row>
          <div className="mt-3 d-flex flex-row-reverse">
            <Button size='sm' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Row>
        <Row className="mt-1">
          <h1>Usage by project</h1>
        </Row>
        <Row className="mt-3">
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
              <p className="text-muted">
                {daysInMonth(new Date()) - new Date().getDate()} days left in
                billing cycle
              </p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div>
              <strong>Usage breakdown by period</strong>
              <div className="text-muted">
                This is not your bill, as it does not include credits, prepaids,
                or any other discounts.
              </div>

              <Form.Group className="mt-3">
                <Form.Label className="fw-bold">Period</Form.Label>
                <Form.Select
                  aria-label="Billing period selection"
                  value={periodIndex}
                  onChange={ev => setPeriodIndex(ev.target.value)}
                >
                  {periods.map((p, i) => (
                    <option key={i} value={i}>
                      {p.label}
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
                      <th className="text-end">${tagTotals[tag].toFixed(2)}</th>
                    </tr>
                  </tbody>
                ))}
                <tfoot>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th className="text-end">${usageTotal.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="mb-5 d-flex flex-row-reverse">
            <a
              className="btn btn-primary btn-lg"
              href={`${API_HOST}/api/csv/${period.fromDate}/${period.toDate}/ec-usage-export.csv?authorization=${sessionStorage.getItem('accessToken')}`}
              download
            >
              Export to CSV
            </a>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default UsageReport;
