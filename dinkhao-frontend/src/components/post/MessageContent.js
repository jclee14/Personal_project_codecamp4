import React from 'react'
import { Row, Col } from 'antd'

export default class MessageContent extends React.Component {
  render() {
    return (
      <Col style={{ paddingTop: '8px' }}>
        <Row style={{ paddingBottom: '8px', paddingLeft: '15px' }}>
          {this.props.message}
        </Row>
        {(this.props.picture) ?
          (
            <Row>
              <img src={this.props.picture} style={{ width: '100%' }} />
            </Row>
          )
          : null}
      </Col>

    )
  }
}