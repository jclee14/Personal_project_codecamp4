import React from 'react';
import { Row, Form, Icon, Input, Col, Button, Modal, Select } from 'antd';
import logo from '../../images/dk_logo1.jpg';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Axios from '../../config/api.service';
import { Link } from 'react-router-dom';

const { Option } = Select;

class SignupForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.password !== values.repassword) {
        this.error({ title: 'Sign-up Incompleted!', content: 'Your password and confirmed password is different.' });
        this.props.form.resetFields('password');
        this.props.form.resetFields('repassword');
      } else if (!err) {
        Axios.post('/registerUser', {
          username: values.username,
          password: values.password,
          name: values.name,
          role: values.role
        })
          .then(result => {
            console.log(result);
            this.showSuccess();
            this.props.form.resetFields();
            // this.props.history.push('/login')
            // window.location.reload(true);
          })
          .catch(err => {
            console.error(err);
            this.error({ title: 'Sign-up Incompleted!', content: 'Your username is unavailable.' });
            this.props.form.resetFields()
          })
      }
    });
  }

  showSuccess = () => {
    Modal.success({
      content: 'Account has been registered successfully.',
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
          {/* <Row type="flex" justify="center" align="middle">
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <img src={logo} alt="Logo Fakebook" style={{ height: '100%', maxHeight: '300px' }}></img>
            </Col>
          </Row> */}
          <Row type="flex" justify="center" align="middle">
            <h1 className="page-header">เพิ่มผู้ดูแลใหม่</h1>
          </Row>
          <Row type="flex" justify="center" align="middle" style={{ marginTop: '10px' }}>
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
                <Row>
                  <Form.Item>
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
                  <Form.Item>
                    {getFieldDecorator('role', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select user role!'
                        }
                      ],
                      
                    })(
                      <Select
                        prefix={<Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Account Role"
                        // onChange={onRoleChange}
                      >
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Row>
                <Row type="flex" justify="center">
                  {/* <Col span={12}>
                    <Form.Item>
                      <Link to='/login'>
                        <Button block type="link" >
                          Back
                        </Button>
                      </Link>
                    </Form.Item>
                  </Col> */}
                  <Col span={12}>
                    <Form.Item>
                      <Button block type="primary" htmlType="submit" className="login-form-button">
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                  {/*                   <Col md={8} sm={12} xs={24}>
                    <Form.Item>
                      <Button block type="primary" htmlType="submit" className="login-form-button">
                        Submit
                      </Button>
                      <Button block type="danger" className="login-form-button">
                        Back
                      </Button>
                    </Form.Item>
                  </Col> */}
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const Signup = Form.create({ name: 'login' })(SignupForm);
export default connect(null, null)(Signup)