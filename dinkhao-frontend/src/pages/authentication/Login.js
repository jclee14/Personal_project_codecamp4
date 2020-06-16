import React from 'react';
import { Row, Col, Form, Icon, Input, Button, Modal } from 'antd';
import logo from '../../images/dk_logo1.jpg';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/actions';
import jwtDecode from 'jwt-decode';
import Axios from '../../config/api.service';
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
            this.error({title: 'Login Incompleted!', content: 'Your username or password is wrong.'})
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
      <div>
        <Row type="flex" justify="center" align="middle" style={{ marginTop: '30vh', height: '100%' }}>
            <img src={logo} alt="Dinkhao Logo" style={{ width: '100%', paddingLeft: '24px', paddingRight: '24px', maxWidth: '300px' }}></img>
            <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your username!'
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