import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Modal, Select, Divider, Avatar, Card } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

var moment = require('moment');
moment().format();

const { Option } = Select;
const { confirm } = Modal;
//const { RangePicker } = DatePicker;
const { RangePicker, MonthPicker } = DatePicker;


class CreateWorkForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      projectList: [],
      memberList: [],
      displayMember: [],
      workerList: [],
      workList: [],
      selectProjectId: undefined,
      selectWorkerId: undefined,
      selectWorkerData: [],
      selectDateRange: 'firstHalf',
      selectMonth: undefined,
      hrValue: {},
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    }
  }

  componentDidMount() {
    this.setState({
      user: {
        id: this.props.user.id,
        name: this.props.user.name
      }
    });
    this.getProject();
    this.getWorker();
  }

  getProject = () => {
    Axios.get('/projects').then((response) => {
      this.setState({
        projectList: response.data
      })
    })
  }

  getMember = (projectId) => {
    if (projectId) {
      Axios.get(`/project-members/${projectId}`).then((response) => {
        this.setState({
          memberList: response.data
        },
          () => this.displayMember()
        )
      })
    }
  }

  displayMember = async () => {
    let displayMember = this.state.memberList.map(member => {
      for (let i = 0; i < this.state.workerList.length; i++) {
        if (member.workerId === this.state.workerList[i].id) {
          return this.state.workerList[i];
        }
      }
    });
    this.setState({ displayMember: displayMember });
  }

  getWorker = () => {
    Axios.get('/workers').then((response) => {
      this.setState({
        workerList: response.data
      })
    })
  }

  // getWorkerById = (workerId) => {
  //   Axios.get(`/worker/${workerId}`).then((response) => {
  //     this.setState({
  //       selectWorkerData: response.data
  //     })
  //   })
  // }

  // getWork = (projectId = 18) => {
  //   Axios.get(`/works/${projectId}`).then((response) => {
  //     this.setState({
  //       workList: response.data
  //     })
  //   })
  // }

  handleProjectSelect = async (value) => {
    if (value) {
      this.setState({
        selectProjectId: value,
        selectWorkerId: undefined,
        selectWorkerData: []
      },
        () => this.getMember(this.state.selectProjectId)
      );
    } else {
      this.setState({
        selectProjectId: undefined,
        displayMember: [],
        memberList: []
      })
    }
  }

  handleDateRangeSelect = (value) => {
    this.setState({
      selectDateRange: value
    })
  }

  handleMonthPick = (date, dateString) => {
    this.setState({ selectMonth: dateString, hrValue: {} });
  }

  // handleDatePick = (value) => {
  //   this.setState({ selectDate: [value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD')] });
  // }

  handleWorkerSelect = (value) => {
    if (value) {
      let targetMember = this.state.displayMember.filter(member => member.id === value);
      this.setState({
        selectWorkerId: value,
        selectWorkerData: targetMember[0]
      })
    } else {
      this.setState({
        selectWorkerId: undefined,
        selectWorkerData: []
      })
    }

  }

  profilePic = () => {
    const defaultAvatar = <Avatar shape="square" size={200} icon={<UserOutlined />} />;
    const customAvatar = <img className="worker-profile-avatar" alt="profile-image" src={`http://localhost:8080/${this.state.selectWorkerData.image_url}`} />;
    return (
      <Row type="flex" justify="end">
        {this.state.selectWorkerData.image_url ? customAvatar : defaultAvatar}
      </Row>
    )
  }

  handleHrInput = (e) => {
    const { value, name } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
        () => this.sumHr()
      )
    }
  };

  sumHr = () => {
    let totalArr = { total_ot_early: 0, total_normal_morning: 0, total_ot_noon: 0, total_normal_afternoon: 0, total_ot_evening: 0, total_ot_night: 0 };
    let r = 1;
    for (let key in totalArr) {
      for (let c = 1; c <= 15; c++) {
        if (this.state.hrValue[`${c}${r}`]) {
          totalArr[key] += parseFloat(this.state.hrValue[`${c}${r}`]);
        }
      }
      r++;
    }
    this.setState({
      totalHr: {
        ot_early: totalArr.total_ot_early,
        normal_morning: totalArr.total_normal_morning,
        ot_noon: totalArr.total_ot_noon,
        normal_afternoon: totalArr.total_normal_afternoon,
        ot_evening: totalArr.total_ot_evening,
        ot_night: totalArr.total_ot_night
      }
    })
  }

  genInputCell = () => {
    let totalForm = [];
    let upperR = [];
    let belowR = [];
    let topic = [];
    let cell = [];
    let result = [];
    let resultChild = [];
    let day = [];

    let month = this.state.selectMonth.split("-");
    let startD, extraDate;
    this.state.selectDateRange ? this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15 : startD = 0;
    // this.state.selectDateRange === 'secondHalf' ? month[1] === '01' || '03' || '05' || '07' || '08' || '10' || '12' ? extraDate = 1 : extraDate = 0 : extraDate = 0;

    if(this.state.selectDateRange === 'secondHalf') {
      if(month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
        extraDate = 1;
      } else if(month[1] === '02') {
        extraDate = -1;
      } else {
        extraDate = 0;
      }
    } else {
      extraDate = 0;
    }

    for (let d = startD; d < startD + 15 + extraDate; d++) {
      day.push(<Col span={1}><Row type="flex" justify="center"><h3>{d + 1}</h3></Row></Col>)
    }

    upperR.push(
      <Row type="flex" gutter={16}>
        <Col span={5}>
          <Row type="flex" justify="end">
            <h3>Date</h3>
          </Row>
        </Col>
        {day}
        <Col span={2}><h3>Total</h3></Col>
        <Col span={1}></Col>
      </Row>
    );

    topic.push(
      <Col span={5} className="timeTag">
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h2>ก่อน 7.30 น.</h2></Row>
        <Row style={{ paddingLeft: '10%' }}><h2>7.30 - 12.00 น.</h2></Row>
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h2>ผ่าเที่ยง</h2></Row>
        <Row style={{ paddingLeft: '10%' }}><h2>13.00 - 17.30 น.</h2></Row>
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h2>ผ่าเย็น</h2></Row>
        <Row style={{ paddingLeft: '10%' }}><h2>18.30 - 23.30 น.</h2></Row>
      </Col>
    )

    for (let c = startD; c < startD + 15 + extraDate; c++) {
      let children = [];
      for (let i = 0; i < 6; i++) {
        children.push(<Row><Input name={`${c + 1}${i + 1}`} onChange={this.handleHrInput} value={this.state.hrValue[`${c + 1}${i + 1}`]} /></Row>)
      }
      cell.push(<Col span={1}>{children}</Col>)
    }

    for (let key in this.state.totalHr) {
      resultChild.push(<Input name={key} value={this.state.totalHr[key]} disabled />);
    }
    result.push(<Col span={2} ><Row type="flex" justify="center">{resultChild}</Row></Col>)

    belowR.push(<Row type="flex" gutter={16}>{topic}{cell}{result}<Col span={1}></Col></Row>);

    totalForm.push(<Col>{upperR}{belowR}</Col>)

    return totalForm;

  }

  handleValidation = () => {
    if (!this.state.selectProjectId || !this.state.selectWorkerId || !this.state.selectDateRange || !this.state.selectMonth) {
      this.showErrorModal();
    } else {
      this.showConfirm();
    }
  }

  showErrorModal() {
    Modal.error({
      title: 'Form Incompleted',
      content: 'Please select every form field!',
    });
  }

  showConfirm = () => {
    confirm({
      title: 'Do you want to create these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk: () => {
        this.handleCreateWork()
      },
      onCancel: () => { },
    });
  }

  handleCreateWork = async () => {
    try {
      let startD;
      this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15;
      for (let c = startD; c < startD + 15; c++) {
        let payload = new FormData();

        payload.append('projectId', this.state.selectProjectId);
        payload.append('workerId', this.state.selectWorkerId);
        payload.append('date', `${this.state.selectMonth}-${c + 1}`);

        payload.append('ot_early_hr', this.state.hrValue[`${c + 1}1`] ? this.state.hrValue[`${c + 1}1`] : 0);
        payload.append('normal_morning_hr', this.state.hrValue[`${c + 1}2`] ? this.state.hrValue[`${c + 1}2`] : 0);
        payload.append('ot_noon_hr', this.state.hrValue[`${c + 1}3`] ? this.state.hrValue[`${c + 1}3`] : 0);
        payload.append('normal_afternoon_hr', this.state.hrValue[`${c + 1}4`] ? this.state.hrValue[`${c + 1}4`] : 0);
        payload.append('ot_evening_hr', this.state.hrValue[`${c + 1}5`] ? this.state.hrValue[`${c + 1}5`] : 0);
        payload.append('ot_night_hr', this.state.hrValue[`${c + 1}6`] ? this.state.hrValue[`${c + 1}6`] : 0);

        //console.log(payload);

        let createResult = await Axios.post('/create-work', payload);
        console.log(createResult);
      }
    }
    catch (err) {
      console.log(err)
    }

    // this.setState({
    //   projectName: '',
    //   projectLocation: '',
    //   projectStartDate: undefined,
    //   projectEndDate: undefined,
    //   modelVisible: false,
    // });

    // this.props.form.resetFields();
  }

  handleResetCells = () => {
    this.setState({ hrValue: {} });
  }

  render() {
    let { selectWorkerData } = this.state;

    return (
      <Row style={{ margin: "0 5%" }}>
        <Col>
          <Row>
            <Col>
              <Row>
                <h1 className="page-header">Create Worker Attendance</h1>
              </Row>
              <Row type="flex" align-items="left" align="middle" >
                <Select
                  showSearch
                  style={{ width: 300, marginRight: '20px' }}
                  placeholder="Select project here"
                  optionFilterProp="children"
                  onChange={this.handleProjectSelect}
                  onSearch={this.handleSearch}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={undefined}>Select project here</Option>
                  {this.state.projectList.map((project) => (
                    <Option value={project.id}>{project.name}</Option>
                  ))}
                </Select>

                <Select
                  showSearch
                  style={{ width: 150, marginRight: '10px' }}
                  placeholder="Select date range"
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                >
                  <Option value={'firstHalf'}>Select date range</Option>
                  <Option value={'firstHalf'}>1st - 15th</Option>
                  <Option value={'secondHalf'}>16th - 30th/31st</Option>
                </Select>

                <MonthPicker placeholder="Select month" onChange={this.handleMonthPick} />
                {/* <RangePicker onChange={(value) => this.handleDatePick(value)} /> */}
              </Row>
            </Col>
          </Row>
          <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          <Row>
            <Col span={6}>
              <Row>
                <Select
                  showSearch
                  style={{ width: 200, marginRight: '20px' }}
                  placeholder="Select worker here"
                  optionFilterProp="children"
                  onChange={this.handleWorkerSelect}
                  onSearch={this.handleSearch}
                  value={this.state.selectWorkerId}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={undefined}>Select worker here</Option>
                  {this.state.displayMember.map((worker) => (
                    <Option value={worker.id}>{`${worker.fname} ${worker.lname}`}</Option>
                  ))}
                </Select>
              </Row>
            </Col>
            <Col span={18}>
              <Card bodyStyle={{ padding: '10px 30px' }} justify="space-around" className="worker-detail-card" >
                <Row>
                  <Col span={12}>
                    <Row>
                      <p className="brief-worker-info">Name: <span>{`${selectWorkerData.fname ? selectWorkerData.fname : ''} ${selectWorkerData.lname ? selectWorkerData.lname : ''}`}</span></p>
                    </Row>
                    <Row>
                      <p className="brief-worker-info">Wage: <span>{selectWorkerData.wage_rate}</span></p>
                    </Row>
                    <Row>
                      <p className="brief-worker-info">Race: <span>{selectWorkerData.race}</span></p>
                    </Row>
                  </Col>
                  <Col span={12}>
                    {this.profilePic(selectWorkerData.id)}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          <Row>
            <Col>
              <Row style={{ backgroundColor: 'white', padding: '15px 0' }}>
                {this.state.selectMonth ? this.genInputCell() : null}
              </Row>
              <Row type='flex' justify='center' style={{ marginTop: '30px' }}>
                <Button onClick={this.handleResetCells} type="danger" size="large" style={{ width: '20%', marginRight: '10px' }}>Reset</Button>
                <Button onClick={this.handleValidation} type="primary" size="large" style={{ width: '20%', marginLeft: '10px' }}>Submit</Button>
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

const CreateWork = Form.create()(CreateWorkForm)

export default connect(mapStateToProps, null)(CreateWork)
