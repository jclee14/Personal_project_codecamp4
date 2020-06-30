import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Modal, Select, Divider, Avatar, Card } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { isMoment } from 'moment';

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
      monthList: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      selectProjectData: [],
      selectProjectId: undefined,
      selectWorkerId: undefined,
      selectWorkerData: [],
      selectDateRange: undefined,
      selectMonth: undefined,
      extraDate: '',
      hrValue: {},
      rowFocus: '',
      rowHighlight: '',
      colFocus: '',
      rowHighlight: '',
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
      let targetProject = this.state.projectList.filter(project => project.id === value);
      this.setState({
        selectProjectData: targetProject[0],
        selectProjectId: value,
        selectWorkerId: undefined,
        selectWorkerData: [],
        selectDateRange: undefined,
        selectMonth: undefined,
      },
        () => this.getMember(this.state.selectProjectId)
      );
    } else {
      this.setState({
        selectProjectData: [],
        selectProjectId: undefined,
        displayMember: [],
        memberList: [],
        selectDateRange: undefined,
        selectMonth: undefined,
        rowFocus: '',
        rowHighlight: '',
        colFocus: '',
        rowHighlight: ''
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
    });
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
    });
  }

  disabledDate = (current) => {
    // Can not select days before today and today
    //let targetProject = this.state.projectList.filter(project => project.id === this.state.selectProjectId);
    let { selectProjectData } = this.state;
    return current && current < moment(selectProjectData['start_date'], 'YYYY-MM-DD') || current > moment(selectProjectData['end_date'], 'YYYY-MM-DD');
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

  profilePic = () => {
    const defaultAvatar = <Avatar shape="square" size={200} icon={<UserOutlined />} />;
    const customAvatar = <img className="worker-profile-avatar workerList-avatar-size" alt="profile-image" src={`http://localhost:8080/${this.state.selectWorkerData.image_url}`} />;
    return (
      <Row type="flex" justify="end">
        {this.state.selectWorkerData.image_url ? customAvatar : defaultAvatar}
      </Row>
    )
  }

  handleHrInput = (e) => {
    const { value, name } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    let hrValue;
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      if(name[name.length-1] === '1' && parseFloat(value) <= 8 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      } else if(name[name.length-1] === '2' && parseFloat(value) <= 4.5 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      } else if(name[name.length-1] === '3' && parseFloat(value) <= 1 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      } else if(name[name.length-1] === '4' && parseFloat(value) <= 4.5 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      } else if(name[name.length-1] === '5' && parseFloat(value) <= 1 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      } else if(name[name.length-1] === '6' && parseFloat(value) <= 5 || value === '') {
        this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
          () => this.sumHr()
        )
      }
      // this.setState({ hrValue: { ...this.state.hrValue, [name]: value } },
      //   () => this.sumHr()
      // )
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

  genInputCell = () => {
    let totalForm = [];
    let upperR = [];
    let belowR = [];
    let topic = [];
    let cell = [];
    let result = [];
    let resultChild = [];
    let day = [];
    let { extraDate, rowFocus, rowHighlight, colFocus, colHighlight } = this.state;
    let startD;

    this.state.selectDateRange ? this.state.selectDateRange === 'firstHalf' ? startD = 0 : startD = 15 : startD = 0;

    for (let d = startD; d < startD + 15 + extraDate; d++) {
      let colP = d + 1;
      day.push(<Col span={1}><Row type="flex" justify="center" className={` ${colHighlight === colP.toString() ? 'timeTag-highlight-bg' : null} ${colFocus === colP.toString() ? 'timeTag-focus-bg' : null} `}><h3>{d + 1}</h3></Row></Col>)
    }

    upperR.push(
      <Row type="flex" gutter={16} style={{ marginBottom: '5px' }}>
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
        <Row className={` ${rowFocus === '1' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '1' ? 'timeTag-highlight-bg' : null} `}><h2>ก่อน 7.30 น.</h2></Row>
        <Row className={` ${rowFocus === '2' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '2' ? 'timeTag-highlight-bg' : null} `}><h2>7.30 - 12.00 น.</h2></Row>
        <Row className={` ${rowFocus === '3' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '3' ? 'timeTag-highlight-bg' : null} `}><h2>ผ่าเที่ยง</h2></Row>
        <Row className={` ${rowFocus === '4' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '4' ? 'timeTag-highlight-bg' : null} `}><h2>13.00 - 17.30 น.</h2></Row>
        <Row className={` ${rowFocus === '5' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '5' ? 'timeTag-highlight-bg' : null} `}><h2>ผ่าเย็น</h2></Row>
        <Row className={` ${rowFocus === '6' ? 'timeTag-focus-bg timeTag-name' : 'timeTag-name'} ${rowHighlight === '6' ? 'timeTag-highlight-bg' : null} `}><h2>18.30 - 23.30 น.</h2></Row>
      </Col>
    )

    for (let c = startD; c < startD + 15 + extraDate; c++) {
      let children = [];
      for (let i = 0; i < 6; i++) {
        children.push(<Row><Input name={`${c + 1}${i + 1}`} onChange={this.handleHrInput} onFocus={this.handleFocusBG} onBlur={this.handleBlurBG} onPointerOver={this.handleHighlightBG} onPointerLeave={this.handleHighlightBGOff} value={this.state.hrValue[`${c + 1}${i + 1}`]} className="attendance-edit-input" /></Row>)
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

  handleHighlightBG = (e) => {
    const { name } = e.target;
    let colPosition = name.slice(0, name.length-1);
    this.setState({ rowHighlight: name[name.length-1], colHighlight: colPosition });
  }
  
  handleHighlightBGOff = () => {
    this.setState({ rowHighlight: '', colHighlight: '' });
  }

  handleFocusBG = (e) => {
    const { name } = e.target;
    let colPosition = name.slice(0, name.length-1);
    this.setState({ rowFocus: name[name.length-1], colFocus: colPosition });
  }

  handleBlurBG = (e) => {
    this.setState({ rowFocus: '', colFocus: '' });
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
      this.successModal();
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

  successModal = () => {
    Modal.success({
      content: 'Record Created!',
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
                  
                  value={this.state.selectDateRange ? this.state.selectDateRange : undefined}
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder={this.state.selectMonth ? "Select date range" : "Select month first"}
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                  disabled={this.state.selectMonth ? false : true}
                >
                  <Option value={'firstHalf'}>1st - 15th</Option>
                  <Option value={'secondHalf'}>16th - 30th/31st</Option>
                </Select>

                <MonthPicker
                  value={this.state.selectMonth ? moment(this.state.selectMonth) : undefined}
                  placeholder={this.state.selectProjectId ? "Select month" : "Select project first"}
                  onChange={this.handleMonthPick}
                  disabledDate={this.disabledDate}
                  disabled={this.state.selectProjectId ? false : true}
                />
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
                    {this.profilePic()}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          <Row>
            <Col>
              <Row style={{ backgroundColor: 'white', padding: '15px 0' }}>
                {this.state.selectDateRange ? this.genInputCell() : null}
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
