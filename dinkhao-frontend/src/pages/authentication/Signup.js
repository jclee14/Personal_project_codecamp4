import React from 'react'
import { Row, Form, Icon, Input, Col, Button } from 'antd'
import logo from '../../images/logo.png'

export default class Signup extends React.Component {
  render() {
    return (
      <Row type="flex" style={{ height: '100vh' }} align="middle">
        <Col span={24} >
          <Row type="flex" justify="center" align="middle">
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <img src={logo} alt="Logo Fakebook" style={{ height: '100%', maxHeight: '300px' }}></img>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" style={{ marginTop: '40px' }}>
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
                <Row>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Username"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Confirm password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Name"
                    />
                  </Form.Item>
                </Row>
                <Row type="flex" justify="center">
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item>
                      <Button block type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row >
    )
  }
}