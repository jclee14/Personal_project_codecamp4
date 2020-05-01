import React from 'react';
import { Row, Form, Icon, Input, Col, Button, Modal } from 'antd';
import logo from '../../images/dk_logo1.jpg';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Axios from '../../config/api.service';

class SignupForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.password !== values.repassword) {
        this.error({title: 'Sign-up Incompleted!', content: 'Your password and confirmed password is different.'});
        this.props.form.resetFields('password');
        this.props.form.resetFields('repassword');
      } else if (!err) {
        Axios.post('/registerUser', {
          username: values.username,
          password: values.password,
          name: values.name
        })
          .then(result => {
            console.log(result);
            this.props.history.push('/login')
            window.location.reload(true);
          })
          .catch(err => {
            console.error(err);
            this.error({title: 'Sign-up Incompleted!', content: 'Your username is unavailable.'});
            this.props.form.resetFields()
          })
      }
    });
  }

  error = (message) => {
    Modal.error({
      title: message.title,
      content: message.content
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row type="flex" style={{ marginTop: '5vh' }} align="middle">
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
                  <Form.Item label="Username">
                    {getFieldDecorator('username', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your username!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your password!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('repassword', {
                      rules: [
                        {
                          required: true,
                          message: 'Please re-enter your password!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Confirm password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your name!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Name"
                      />
                    )}
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

const Signup = Form.create({ name: 'login' })(SignupForm);
export default connect(null, null)(Signup)