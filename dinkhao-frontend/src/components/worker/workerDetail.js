import React from 'react'
import { Row, Col, Card, Divider } from 'antd'

export default class WorkerDetail extends React.Component {
  render() {
    const { workerData } = this.props;
    return (
      <Card bodyStyle={{ padding: '10px 30px' }} justify="space-around" className="worker-detail-card" >
        <Row>
          <Col span={12}>
            <Row>
              <p>Wage: <span>{workerData.wage_rate}</span></p>
            </Row>
            <Row>
              <p>Gender: <span>{workerData.gender}</span></p>
            </Row>
            <Row>
              <p>Race: <span>{workerData.race}</span></p>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <p>Phone: <span>{workerData.phone}</span></p>
            </Row>
            <Row>
              <p>Bank Account: <span>{workerData.bank_account_id}</span></p>
            </Row>
            <Row>
              <p>Work Status: <span>{workerData.isEmployed ? 'Employed' : 'Unemployed'}</span></p>
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }
}
