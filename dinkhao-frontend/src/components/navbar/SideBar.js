import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const { Sider } = Layout;
const { SubMenu } = Menu;

class SideBar extends Component {
  render() {
    // let { handleMenuSelect, activeMenu } = this.props;
    return (
      <Sider
        width={200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          backgroundColor: '#294694'
        }}
      >
        <div className="logo"><a href="/"><span>DINKHAO GROUP</span></a></div>
        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#294694', color: 'white' }} >
          <Menu.Item key="1">
            <a href="/"><span className="nav-text">Homepage</span></a>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <span>บัญชี</span>
              </span>
            }
          >
            <Menu.Item key="2">
              <a href="/general-accounting"><span className="nav-text">บัญชีรวม</span></a>
            </Menu.Item>
            <Menu.Item key="3">
              <a href="/worker-accounting"><span className="nav-text">สรุปค่าแรงคนงาน</span></a>
            </Menu.Item>
            {/* <Menu.Item key="4">ธนาคาร</Menu.Item> */}
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <span>การเข้างาน</span>
              </span>
            }
          >
            <Menu.Item key="4">
              <a href="/work-attendance"><span className="nav-text">ประวัติการเข้างาน</span></a>
            </Menu.Item>
            <Menu.Item key="5">
              <a href="/create-work-attendance"><span className="nav-text">บันทึกการเข้างาน</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <span>รายการหัก</span>
              </span>
            }
          >
            <Menu.Item key="6">
              <a href="/extracharges"><span className="nav-text">จัดการรายการหัก</span></a>
            </Menu.Item>
            <Menu.Item key="7">
              <a href="/paybackrecords"><span className="nav-text">บันทึกรายการหักคนงาน</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <span>โปรเจค</span>
              </span>
            }
          >
            <Menu.Item key="8">
              <a href="/projects"><span className="nav-text">โปรเจคทั้งหมด</span></a>
            </Menu.Item>
            <Menu.Item key="9">
              <a href="/createproject"><span className="nav-text">เพิ่มโปรเจคใหม่</span></a>
            </Menu.Item>
            <Menu.Item key="10">
              <a href="/projectmembers"><span className="nav-text">คนงานประจำโปรเจค</span></a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <span>คนงาน</span>
              </span>
            }
          >
            <Menu.Item key="11">
              <a href="/workers"><span className="nav-text">ข้อมูลคนงาน</span></a>
            </Menu.Item>
            <Menu.Item key="12">
              <a href="/createworker"><span className="nav-text">เพิ่มคนงานใหม่</span></a>
            </Menu.Item>
            {/* <Menu.Item key="13">
              <a href="/workerjobs"><span className="nav-text">จัดการตำแหน่งงาน</span></a>
            </Menu.Item> */}
          </SubMenu>
          <SubMenu
            key="sub6"
            title={
              <span>
                <span>Users</span>
              </span>
            }
          >
            <Menu.Item key="13" style={ this.props.role === 'admin' ? null : { display: 'none'}}>
              <a href="/signup"><span className="nav-text">เพิ่มผู้ดูแลใหม่</span></a>
            </Menu.Item>
            <Menu.Item key="14">
              <a href="/changepassword"><span className="nav-text">เปลี่ยนรหัสผ่านใหม่</span></a>
            </Menu.Item>
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