import React from 'react'
import { Row, Col, Divider, Table, Modal, Form, Input, Button, Select } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

var moment = require('moment');
moment().format();

class ProjectMembersComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      projectList: [],
      workerList: [],
      memberList: [],
      displayMember: [],
      displaySelect: [],
      selectProjectId: undefined,
      selectWorkerId: undefined,
      editVisible: false
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getProject();
    this.getWorker();
    this.getMember();
  }

  getProject = () => {
    Axios.get('/projects').then((response) => {
      this.setState({
        projectList: response.data
      })
    })
  }

  getWorker = () => {
    Axios.get('/workers').then((response) => {
      this.setState({
        workerList: response.data
      })
    })
  }

  getMember = () => {
    Axios.get('/project-members').then((response) => {
      this.setState({
        memberList: response.data
      },
        () => this.displayMember()
      )
    })
  }

  handleProjectSelect = async (value) => {
    this.setState({ selectProjectId: value },
      () => (this.displayMember().then((value) => {this.displaySelect(value)}))
    );
  }

  handleSearch(val) {
    console.log('search:', val);
  }

  displayMember = async () => {
    let filteredMember = this.state.memberList.filter((member) => {
      return member.projectId == this.state.selectProjectId
    });
    let displayMember = filteredMember.map(member => {
      for (let i = 0; i < this.state.workerList.length; i++) {
        if (member.workerId === this.state.workerList[i].id) {
          return this.state.workerList[i];
        }
      }
    });
    this.setState({ displayMember: displayMember },
        () => this.displaySelect()
    );
  }

  displaySelect = () => {
    let onlyInA = this.state.workerList.filter(this.objComparer(this.state.displayMember));
    let onlyInB = this.state.displayMember.filter(this.objComparer(this.state.workerList));
    console.log(onlyInA);
    let result = onlyInA.concat(onlyInB);
    this.setState({ displaySelect: result, selectWorkerId: undefined });
  }

  objComparer = (otherArray) => {
    return function(current){
      return otherArray.filter(function(other){
        return other.id == current.id
      }).length == 0;
    }
  }

  handleWorkerSelect = (value) => {
    this.setState({ selectWorkerId: value });
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  validationAdd = () => {
    if (!this.state.selectProjectId || !this.state.selectWorkerId) {
      this.error();
    } else {
      this.showAddConfirm();
    }
  }

  showAddConfirm = async () => {
    let result = await Axios.get(`/worker/${this.state.selectWorkerId}`);
    confirm({
      title: 'Do you want to ADD this member?',
      icon: <ExclamationCircleOutlined />,
      content: `${result.data.fname} ${result.data.lname}`,
      onOk: () => {
        this.handleAdd();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  error = () => {
    Modal.error({
      title: 'Adding Incompleted!',
      content: 'Please select your project and worker',
    });
  }

  handleAdd = async () => {
    try {
      let payload = new FormData();

      payload.append('projectId', this.state.selectProjectId);
      payload.append('workerId', this.state.selectWorkerId);
  
      let result = await Axios.post('/create-projectmember', payload);
      console.log(result);
  
    }
    catch(err) {
      console.log(err)
    }
    this.setState({
      selectWorkerId: undefined
    },
      this.getMember(),
    );
  }

  handleDelete = async (id) => {
    let result = await Axios.delete(`/delete-projectmember/${this.state.selectProjectId}/${id}`);
    console.log(result);
    this.getMember();
  }

  deleteConfirm = (record) => {
    console.log(record);
    confirm({
      title: 'Do you want to DELETE this member?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Name:{'\u00A0'} <span className="project-confirm-data">{record.fname} {record.lname}</span></p>
        </div>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.handleDelete(record.id);
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  render() {

    const columns = [
      {
        title: 'Worker ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'fname',
        key: 'fname',
      },
      {
        title: 'Wage',
        dataIndex: 'wage_rate',
        key: 'wage_rate',
      },
      {
        title: 'Option',
        dataIndex: 'option',
        render: (_, record) => (
          <span>
            <button onClick={() => this.deleteConfirm(record)}>Delete</button>
          </span>
        )
      }
    ];

    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col>
          <Row style={{ margin: "0 5%" }}>
            <h1 className="page-header">Project's Members Database</h1>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select project first"
              optionFilterProp="children"
              onChange={this.handleProjectSelect}
              onSearch={this.handleSearch}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.projectList.map((project) => (
                <Option value={project.id}>{project.name}</Option>
              ))}
            </Select>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          </Row>
          <Row style={{ margin: "0 10%" }}>
            <Col>
              <Row type="flex" align-items="left" align="middle">
                <h3 style={{ marginRight: "10px" }}>Add new member:</h3>
                <Select
                  showSearch
                  style={{ width: 200, marginRight: "10px" }}
                  placeholder="Select worker name here"
                  optionFilterProp="children"
                  onChange={this.handleWorkerSelect}
                  onSearch={this.handleSearch}
                  value={this.state.selectWorkerId}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={undefined}>Select worker name here</Option>
                  {this.state.displaySelect.map((worker) => (
                    <Option value={worker.id}>{`${worker.fname} ${worker.lname}`}</Option>
                  ))}
                </Select>
                <Button onClick={this.validationAdd}>
                  Add
                </Button>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Table dataSource={this.state.displayMember} columns={columns} />
              </Row>
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

const ProjectMembers = Form.create()(ProjectMembersComp)

export default connect(mapStateToProps, null)(ProjectMembers)
