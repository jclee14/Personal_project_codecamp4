import React from 'react';
import { Switch } from 'react-router-dom'
import './app.css';
import { Layout } from 'antd';
import NavBar from './components/navbar/NavBar'
import SideBar from './components/navbar/SideBar'
import PrivateRoute from './components/routes/PrivateRoute';
import { connect } from 'react-redux'

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     activeMenu: ['1']
  //   }
  // }

  // handleMenuSelect = (key) => {
  //   this.setState({ activeMenu: [key] });
  // }

  render() {
    const role = this.props.user.role
    console.log(role)
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          {role === 'guest' ? null : <SideBar role={role} />}
          <Layout className="site-layout" style={{ marginLeft: role === 'guest' ? 0 : 200 }}>
            {
              role === 'guest' ?
              null :
              <Header className="site-layout-background" style={{ padding: 0 }} >
                  <NavBar />
              </Header>
              
            }
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
              <Switch>
                <PrivateRoute role={role} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>DINKHAO GROUP ©2020 Created by J.C. LEE | Educated by Codecamp Thailand #4</Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(App)
