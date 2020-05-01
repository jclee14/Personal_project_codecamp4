import React, { Component } from 'react'
import { Row, Col, Dropdown, Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout } from '../../redux/actions/actions'

import { UnlockOutlined, LockOutlined } from '@ant-design/icons';

class NavBar extends Component {
  handleLogout = () => {
    this.props.logout()
    this.props.history.push('/login')
    window.location.reload(true);
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link onClick={() => this.handleLogout()} to='#'>
            {this.props.user.role === 'guest' ? 'เข้าสู่ระบบ' : 'ออกจากระบบ'}
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Row style={{ height: '100%', marginRight: '5%' }} type="flex" align="middle" justify="end">
        <Dropdown overlay={menu}>
          <Col xs={20} sm={16} md={12} lg={8} xl={6} type="flex" align="end">
            <span id="user-name" >{this.props.user.role}: {this.props.user.name}</span>
            {this.props.user.role === 'guest' ? <LockOutlined className="lock-icon" /> : <UnlockOutlined className="lock-icon" />}
          </Col>
        </Dropdown>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))