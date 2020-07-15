import React from 'react';
import { Row, Col, Divider, Input, Icon, Button, Form, Modal } from 'antd';
import { connect } from 'react-redux';
import Axios from '../config/api.service';
import { withRouter } from 'react-router-dom';
import { logout } from '../redux/actions/actions'

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.setState({
      user: {
        id: this.props.user.id,
        name: this.props.user.name
      }
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (values.newPassword !== values.repassword) {
        this.error({ title: 'Password Changing Incompleted!', content: 'Your new password and confirmed password is different.' });
        this.props.form.resetFields();
      } else if (!err) {
        try {
          let result = await Axios.put('/change-password', {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          });
          console.log(result);
          this.props.logout()
          this.props.history.push('/login')
          window.location.reload(true);
        } catch (err) {
          console.error(err.message);
          this.error({ title: 'Password Changing Incompleted!', content: err.response.data.message })
          this.props.form.resetFields()
        }
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
      <Row>
        <Col>
          <Row style={{ margin: "0 5%" }}>
            <h1 className="page-header">Change Password</h1>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          </Row>
          {/* <Row type="flex" justify="center">
            <Col md={18} sm={20} xs={22}>
              <Divider />
            </Col>
          </Row> */}
          <Row type="flex" justify="center" align="middle" style={{ marginTop: '40px' }}>
            <Col md={8} sm={12} xs={24} type="flex" justify="center" align="middle">
              <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '400px', width: '100%' }}>
                <Row>
                  <Form.Item>
                    {getFieldDecorator('oldPassword', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your old password!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Old Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('newPassword', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your new password!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="New Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('repassword', {
                      rules: [
                        {
                          required: true,
                          message: 'Please confirm your password!'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Confirm New password"
                      />
                    )}
                  </Form.Item>
                </Row>
                <Row type="flex" justify="center">
                  <Col span={24}>
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

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  logout: logout
}

const ChangePassword = Form.create({ name: 'login' })(ChangePasswordForm);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChangePassword))