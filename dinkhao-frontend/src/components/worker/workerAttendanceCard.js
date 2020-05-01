import React from 'react'
import { Row, Col, Card, Avatar, Button } from 'antd'
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default class WorkerAttendanceCard extends React.Component {

  profilePic = (url) => {
    const defaultAvatar = <Avatar shape="square" size={204} icon={<UserOutlined />} />;
    const customAvatar = <img className="worker-profile-avatar attendance-avatar-size" alt="profile-image" src={`http://localhost:8080/${url}`} />;
    return (
      <Row style={{ height: '204px' }}>
        {url ? customAvatar : defaultAvatar}
      </Row>
    )
  }

  render() {
    const { memberData, workData } = this.props;
    let t_ot_early = 0;
    let t_normal_morning = 0;
    let t_ot_noon = 0;
    let t_normal_afternoon = 0;
    let t_ot_evening = 0;
    let t_ot_night = 0;
    let t_earn = 0;
    let earn_early = 0;
    let earn_morning = 0;
    let earn_noon = 0;
    let earn_afternoon = 0;
    let earn_evening = 0;
    let earn_night = 0;

    workData.forEach(record => {
      t_ot_early += parseFloat(record.ot_early_hr);
      t_normal_morning += parseFloat(record.normal_morning_hr);
      t_ot_noon += parseFloat(record.ot_noon_hr);
      t_normal_afternoon += parseFloat(record.normal_afternoon_hr);
      t_ot_evening += parseFloat(record.ot_evening_hr);
      t_ot_night += parseFloat(record.ot_night_hr);
      t_earn += parseFloat(record.wage_earning);

      earn_early += (record.current_rate / 8) * record.ot_early_hr;
      earn_morning += (record.current_rate / 9) * record.normal_morning_hr;
      earn_noon += (record.current_rate / 8) * record.ot_noon_hr;
      earn_afternoon += (record.current_rate / 9) * record.normal_afternoon_hr;
      earn_evening += ((record.current_rate / 8) * record.ot_evening_hr) * 1.5;
      earn_night += ((record.current_rate / 8) * record.ot_night_hr) * 1.5;
    })

    earn_early = Math.round(earn_early);
    earn_morning = Math.round(earn_morning);
    earn_noon = Math.round(earn_noon);
    earn_afternoon = Math.round(earn_afternoon);
    earn_evening = Math.round(earn_evening);
    earn_night = Math.round(earn_night);

    return (
      <Card style={{ marginTop: '10px' }} className="worker-earn-card" >
        <Row type="flex">
          <Col span={4}>
            {this.profilePic(memberData.image_url)}
            <Row style={{ marginTop: '15px' }} align-item="bottom">
            <a href="/workers"><Button style={{ width: '204px' }}>Edit Bio</Button></a>
            </Row>
          </Col>
          <Col span={8}>
            <Row style={{ padding: "0 10px"}}>
              <p>Name: {'\u00A0'}<span className="card-bio-content">{`${memberData.fname} ${memberData.lname}`}</span></p>
              <p>Wage: {'\u00A0'}<span className="card-bio-content">{memberData.wage_rate}</span></p>
              <p>Race: {'\u00A0'}<span className="card-bio-content">{memberData.race}</span></p>
              <p>Bank ID: {'\u00A0'}<span className="card-bio-content">{memberData.bank_account_id}</span></p>
              <p>Phone: {'\u00A0'}<span className="card-bio-content">{memberData.phone}</span></p>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={10} >
                <Row className="blue-bg time-topic">
                  <h3>ก่อน 7.30 น.</h3>
                </Row>
                <Row className="time-topic">
                  <h3>7.30 - 12.00 น.</h3>
                </Row>
                <Row className="blue-bg time-topic">
                  <h3>ผ่าเที่ยง</h3>
                </Row>
                <Row className="time-topic">
                  <h3>13.00 - 17.30 น.</h3>
                </Row>
                <Row className="blue-bg time-topic">
                  <h3>ผ่าเย็น</h3>
                </Row>
                <Row className="time-topic">
                  <h3>18.30 - 23.30 น.</h3>
                </Row>
              </Col>
              <Col span={3}>
                <Row className="blue-bg">
                  <h3>{t_ot_early}</h3>
                </Row>
                <Row>
                  <h3>{t_normal_morning}</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>{t_ot_noon}</h3>
                </Row>
                <Row>
                  <h3>{t_normal_afternoon}</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>{t_ot_evening}</h3>
                </Row>
                <Row>
                  <h3>{t_ot_night}</h3>
                </Row>
              </Col>
              <Col span={4}>
                <Row className="blue-bg">
                  <h3>ชม.</h3>
                </Row>
                <Row>
                  <h3>ชม.</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>ชม.</h3>
                </Row>
                <Row>
                  <h3>ชม.</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>ชม.</h3>
                </Row>
                <Row>
                  <h3>ชม.</h3>
                </Row>
              </Col>
              <Col span={4}>
                <Row className="blue-bg">
                  <h3>{earn_early}</h3>
                </Row>
                <Row>
                  <h3>{earn_morning}</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>{earn_noon}</h3>
                </Row>
                <Row>
                  <h3>{earn_afternoon}</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>{earn_evening}</h3>
                </Row>
                <Row>
                  <h3>{earn_night}</h3>
                </Row>
              </Col>
              <Col span={3}>
                <Row className="blue-bg">
                  <h3>บาท</h3>
                </Row>
                <Row>
                  <h3>บาท</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>บาท</h3>
                </Row>
                <Row>
                  <h3>บาท</h3>
                </Row>
                <Row className="blue-bg">
                  <h3>บาท</h3>
                </Row>
                <Row>
                  <h3>บาท</h3>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
              <Col span={13}>
                <Button onClick={() => {this.props.handleShowEdit(memberData)}} style={{ width: "200px" }}>Edit Work Record</Button>
              </Col>
              <Col span={4}>
                <h2>รวม</h2>
              </Col>
              <Col span={4}>
                <h2>{t_earn}</h2>
              </Col>
              <Col span={3}>
                <h2>บาท</h2>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }
}
