import React from 'react'
import WorkerAttendance from '../components/worker/workerAttendanceCard';
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


class WorkAttendanceComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      projectList: [],
      memberList: [],
      displayMember: [],
      workerList: [],
      workList: [],
      monthList: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      selectProjectId: undefined,
      selectWorkerId: undefined,
      selectWorkerData: [],
      selectDateRange: undefined,
      selectMonth: undefined,
      extraDate: '',
      hrValue: {},
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' },
      editVisible: false
    }
    this.editModal = this.editModal.bind(this);
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

  genMemberCard = () => {
    let data = this.state.displayMember.map(member => (
      <WorkerAttendance handleShowEdit={this.editModal} memberData={member} workData={this.state.workList.filter(record => record.workerId === member.id)} />
    ));
    return data;
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

  // getWorkByProject = async () => {
  //   let response = await Axios.get(`/worksbyproject/${this.state.selectProjectId}`);
  //   this.setState({
  //     workList: response.data
  //   })
  // }

  genWorkMonthly = async () => {
    let { selectProjectId, selectMonth, selectDateRange } = this.state;
    if (selectProjectId && selectMonth && selectDateRange) {
      try {
        let time = selectMonth.split("-");
        let response = await Axios.get(`/worksbyproject/${selectProjectId}`);
        let monthFilter = response.data.filter(record => record.date.split("-")[0] === time[0] && record.date.split("-")[1] === time[1]);
        let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
        this.setState({
          workList: dateFilter
        })
      }
      catch (err) {
        console.log(err)
      }
    } else {
      console.log('data incompleted!')
    }
  }

  handleProjectSelect = async (value) => {
    const myMethod = () => {
      this.getMember(this.state.selectProjectId);
      this.genWorkMonthly();
    }
    if (value) {
      this.setState({
        selectProjectId: value,
        selectWorkerId: undefined,
        selectWorkerData: []
      },
        myMethod
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
    let month = this.state.selectMonth.split("-");
    let extraD = 0;

    if (value === 'secondHalf') {
      if (month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
        extraD = 1;
      } else if (month[1] === '02') {
        extraD = -1;
      } else {
        extraD = 0;
      }
    } else {
      extraD = 0;
    }

    this.setState({
      selectDateRange: value,
      hrValue: {},
      extraDate: extraD,
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    },
      () => this.genWorkMonthly()
    );
  }

  handleMonthPick = (date, dateString) => {
    let extraD = 0;
    let month;

    if (dateString) {
      month = dateString.split("-");
    }

    if (this.state.selectDateRange === 'secondHalf') {
      if (month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
        extraD = 1;
      } else if (month[1] === '02') {
        extraD = -1;
      } else {
        extraD = 0;
      }
    } else {
      extraD = 0;
    }

    this.setState({
      selectMonth: dateString,
      hrValue: {},
      extraDate: extraD,
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    },
      () => this.genWorkMonthly()
    );
  }

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
    let startD;
    let { extraDate } = this.state;
    let totalArr = { total_ot_early: 0, total_normal_morning: 0, total_ot_noon: 0, total_normal_afternoon: 0, total_ot_evening: 0, total_ot_night: 0 };
    let r = 1;

    this.state.selectDateRange ? this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15 : startD = 0;

    for (let key in totalArr) {
      for (let c = startD; c <= startD + 15 + extraDate; c++) {
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

  editModal = (member) => {
    let targetData = this.state.workList.filter(record => record.workerId === member.id);
    console.log(targetData);
    this.setState({ 
      hrValue: targetData,
      editVisible: true 
    });
    // this.setState({
    //   projectId: record.id,
    //   projectName: record.name,
    //   projectLocation: record.location,
    //   projectStartDate: record.start_date,
    //   projectEndDate: record.end_date
    // },
    //   () => {
    //     this.props.form.setFieldsValue({
    //       projectName: this.state.projectName,
    //       projectLocation: this.state.projectLocation,
    //       projectStartDate: moment(this.state.projectStartDate),
    //       projectEndDate: moment(this.state.projectEndDate)
    //     },
    //       () => { this.setState({ editVisible: true }) }
    //     )
    //   });
  }

  editModelExit = () => {
    this.setState({
      // projectId: undefined,
      // projectName: '',
      // projectLocation: '',
      // projectStartDate: undefined,
      // projectEndDate: undefined,
      editVisible: false
    });
  };

  genInputCell = () => {
    let totalForm = [];
    let upperR = [];
    let belowR = [];
    let topic = [];
    let cell = [];
    let result = [];
    let resultChild = [];
    let day = [];
    let { extraDate } = this.state;
    let startD;

    this.state.selectDateRange ? this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15 : startD = 0;

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
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h3>ก่อน 7.30 น.</h3></Row>
        <Row style={{ paddingLeft: '10%' }}><h3>7.30 - 12.00 น.</h3></Row>
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h3>ผ่าเที่ยง</h3></Row>
        <Row style={{ paddingLeft: '10%' }}><h3>13.00 - 17.30 น.</h3></Row>
        <Row style={{ backgroundColor: '#BFC7DF', paddingLeft: '10%' }}><h3>ผ่าเย็น</h3></Row>
        <Row style={{ paddingLeft: '10%' }}><h3>18.30 - 23.30 น.</h3></Row>
      </Col>
    )

    for (let c = startD; c < startD + 15 + extraDate; c++) {
      let children = [];
      for (let i = 0; i < 6; i++) {
        children.push(<Row><Input name={`${c + 1}${i + 1}`} onChange={this.handleHrInput} value={this.state.hrValue[`${c + 1}${i + 1}`]} className="attendance-edit-input" /></Row>)
      }
      cell.push(<Col span={1}>{children}</Col>)
    }

    for (let key in this.state.totalHr) {
      resultChild.push(<Input name={key} value={this.state.totalHr[key]} disabled />);
    }
    result.push(<Col span={2} ><Row type="flex" justify="center">{resultChild}</Row></Col>)

    belowR.push(<Row type="flex" gutter={8}>{topic}{cell}{result}<Col span={1}></Col></Row>);

    totalForm.push(<Col>{upperR}{belowR}</Col>)

    return totalForm;

  }

  handleValidation = () => {
    if (!this.state.selectProjectId || !this.state.selectWorkerId || !this.state.selectDateRange || !this.state.selectMonth) {
      this.showErrorModal({ title: 'Form Incompleted', content: 'Please select every form field!' });
    } else {
      this.showConfirm();
    }
  }

  showErrorModal(message) {
    Modal.error({
      title: message.title,
      content: message.content,
    });
  }

  showConfirm = () => {
    let month = this.state.selectMonth.split("-");
    let { extraDate } = this.state;

    confirm({
      title: 'Do you want to create these record?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Project: {this.state.selectProjectId}</p>
          <p>Worker: {this.state.selectWorkerData['fname']} {this.state.selectWorkerData['lname']}</p>
          <p>Date: {this.state.selectDateRange === 'firstHalf' ? '1-15' : `16-${30 + extraDate}`} {this.state.monthList[parseInt(month[1]) - 1]} {month[0]}</p>
        </div>
      ),
      onOk: () => {
        this.handleCreateWork()
      },
      onCancel: () => { },
    });
  }

  handleCreateWork = async () => {
    let month = this.state.selectMonth.split("-");
    try {
      let startD;
      let { extraDate } = this.state;

      this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15;
      for (let c = startD; c < startD + 15 + extraDate; c++) {
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

        let createResult = await Axios.post('/create-work', payload);
        console.log(createResult);
      }
    }
    catch (err) {
      console.log(err)
      this.showErrorModal({ title: 'Create Record Incompleted', content: `Your record in ${this.state.monthList[parseInt(month[1]) - 1]} is already created!` });
    }

    this.setState({
      hrValue: {},
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    });
  }

  handleResetCells = () => {
    this.setState({
      hrValue: {},
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    });
  }

  render() {
    let { selectWorkerData } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Row style={{ margin: "0 5%" }}>
        <Col>
          <Row>
            <Col>
              <Row>
                <h1 className="page-header">Worker Attendance</h1>
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
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder={this.state.selectMonth ? "Select date range" : "Select month first"}
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                  disabled={this.state.selectMonth ? false : true}
                >
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
            <Select
              showSearch
              style={{ width: 300, marginBottom: "20px" }}
              placeholder="Please Select Worker Name"
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
          <Row>
            <Col>
              {this.genMemberCard()}
            </Col>
            <Modal
              title="Edit Worker Attencance"
              visible={this.state.editVisible}
              onOk={this.handleUpdate}
              onCancel={this.editModelExit}
              width={960}
            >
              {this.state.selectDateRange ? this.genInputCell() : null}
            </Modal>
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

const WorkAttendance = Form.create()(WorkAttendanceComp)

export default connect(mapStateToProps, null)(WorkAttendance)
