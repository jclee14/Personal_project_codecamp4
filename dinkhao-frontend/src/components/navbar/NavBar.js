import React, { Component } from 'react'
import { Row, Col, Dropdown, Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout } from '../../redux/actions/actions'

import { UnlockOutlined } from '@ant-design/icons';

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
            ออกจากระบบ
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Row style={{ height: '100%' }} type="flex" align="middle" justify="end">
        <Dropdown overlay={menu}>
          <Col span={4} type="flex" align="start">
            <span id="user-name" >{this.props.user.role}: {this.props.user.name}</span>
            <UnlockOutlined id="lock-icon" />
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