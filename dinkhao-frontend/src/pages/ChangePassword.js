import React from 'react'
import HeadFakebook from '../components/author/HeadFakebook'
import { Row, Col, Divider, Input, Icon, Button, Form } from 'antd'

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageSrc: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-9/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_eui2=AeGGEac45Y7P61v-juKLihSuqQvzyZAUvy9dz3sSynbKiBRLT6lgXhjtX5jjtNAY9MSDoejoGIsDoajvZuQbEsl64swyCN-293Zo2K_d4tRtLw&_nc_oc=AQnKNnIYBPW5aLIzcAhWJ2OrZZN-2HCc5yDfjONO_xau-OVSNZ2MiGhybKrEeToeLgw&_nc_ht=scontent.fbkk22-3.fna&oh=ba6de0084eebf847928c72be1a7551dd&oe=5E4F2B50",
      name: "Nuttachai Kulthammanit"
    }
  }
  render() {
    return (
      <Row>
        <Col>
          <Row type="flex" justify="center">
            <HeadFakebook
              imageSrc={this.state.imageSrc}
              name={this.state.name}
            />
          </Row>
          <Row type="flex" justify="center">
            <Col md={18} sm={20} xs={22}>
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" style={{ marginTop: '40px' }}>
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
                <Row>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Old Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="New Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Confirm New password"
                    />
                  </Form.Item>
                </Row>
                <Row type="flex" justify="center">
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item>
                      <Button block type="primary" htmlType="submit" className="login-form-button">
                        Change password
                    </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}