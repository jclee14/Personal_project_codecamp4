import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const { Sider } = Layout;
const { SubMenu } = Menu;

class SideBar extends Component {
  render() {
    return (
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo"><span>DINKHAO GROUP</span></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1">
            <a href="/"><span className="nav-text">Homepage</span></a>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <span>Account</span>
              </span>
            }
          >
            <Menu.Item key="2">บัญชีรวม</Menu.Item>
            <Menu.Item key="3">สรุปค่าแรงคนงาน</Menu.Item>
            <Menu.Item key="4">ธนาคาร</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <span>การเข้างาน</span>
              </span>
            }
          >
            <Menu.Item key="5">ประวัติการเข้างาน</Menu.Item>
            <Menu.Item key="6">บันทึกการเข้างาน</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <span>รายการหัก</span>
              </span>
            }
          >
            <Menu.Item key="7">
              <a href="/extracharges"><span className="nav-text">จัดการรายการหัก</span></a>
            </Menu.Item>
            <Menu.Item key="8">
              <a href="/paybackrecords"><span className="nav-text">บันทึกรายการหักคนงาน</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <span>Project Sites</span>
              </span>
            }
          >
            <Menu.Item key="9">
              <a href="/projects"><span className="nav-text">โปรเจคทั้งหมด</span></a>
            </Menu.Item>
            <Menu.Item key="10">
              <a href="/createproject"><span className="nav-text">เพิ่่มโปรเจคใหม่</span></a>
            </Menu.Item>
            <Menu.Item key="11">
              <a href="/projectmembers"><span className="nav-text">คนงานประจำโปรเจค</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <span>Employees</span>
              </span>
            }
          >
            <Menu.Item key="12">
              <a href="/workers"><span className="nav-text">ข้อมูลคนงาน</span></a>
            </Menu.Item>
            <Menu.Item key="13">
              <a href="/createworker"><span className="nav-text">เพิ่มคนงานใหม่</span></a>
            </Menu.Item>
            <Menu.Item key="14">
              <a href="/workerjobs"><span className="nav-text">จัดการตำแหน่งงาน</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub6"
            title={
              <span>
                <span>Users</span>
              </span>
            }
          >
            <Menu.Item key="15">All users</Menu.Item>
            <Menu.Item key="16">Add new user</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, null)(SideBar));