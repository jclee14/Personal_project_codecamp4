import React from 'react'
import { Row, Col, Form, Icon, Input, Button } from 'antd';
import logo from '../../images/logo.png'
import { connect } from 'react-redux'
import { login } from '../../redux/actions/actions'
import jwtDecode from 'jwt-decode'
import Axios from '../../config/api.service'
import { Link } from 'react-router-dom';

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.post('/loginUser', {
          username: values.username,
          password: values.password
        })
          .then(result => {
            const user = jwtDecode(result.data.token)
            this.props.login(user, result.data.token)
            this.props.history.push('/')
            window.location.reload(true);
          })
          .catch(err => {
            console.error(err);
            this.props.form.resetFields()
          })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Row type="flex" justify="center" align="middle" style={{ height: '100vh' }}>
          <Col md={8} sm={12} xs={24}>
            <img src={logo} alt="Logo Fakebook" style={{ width: '100%', paddingLeft: '24px', paddingRight: '24px', maxWidth: '400px' }}></img>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your nickname!'
                    }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!',
                    }
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item>
                    <Link to='/signup'>
                      <Button block type="link" >
                        Signup
                      </Button>
                    </Link>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Button block type="primary" htmlType="submit" className="login-form-button">
                      Log in
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row >
      </div >
    )
  }
}

const mapDispatchToProps = {
  login: login
}

const LoginForm = Form.create({ name: 'login' })(Login);
export default connect(null, mapDispatchToProps)(LoginForm)