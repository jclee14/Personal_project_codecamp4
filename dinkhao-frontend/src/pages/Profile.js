import React from 'react'
import HeadFakebook from '../components/author/HeadFakebook'
import { Row, Col, Divider } from 'antd'
import PostList from '../components/post/PostList'

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postList:
        [
          {
            id: 1,
            author: {
              name: "Nuttachai Kulthammanit",
              profilePic: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531"
            },
            message: "สวัสดีครับพี่น้องค้าบ ถึงแม้ผมจะฉลาดแต่ผมก็นิสัยดีนะค้าบ",
            imgSrc: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-9/73246481_2435477546715547_5247929318172000256_n.jpg?_nc_cat=111&_nc_oc=AQlFl6roOYPcuycI02WeHzC7xdXsvrqHB3baMb3gyXqrv5_mMLhTMeUxA6cGGbKmY3E&_nc_ht=scontent.fbkk22-3.fna&oh=f88eadb873e0211e94a2ba31f32e69f3&oe=5E53FD9C",
            date: "15 ชมที่แล้ว",
            commentList:
              [
                {
                  id: 1,
                  author: "Nuttachai Kulthammanit",
                  avatar: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531",
                  content: "I met the singer at the Brayan Star Tour and he was so nice and cuter in person! :)",
                  datetime: "2 Days ago",
                },
                {
                  id: 2,
                  author: "Kittinun Postinun",
                  avatar: "https://frontlinecloud.zendesk.com/system/photos/3600/0268/6511/shiro.jpg",
                  content: "Your Frontline workspace features a Mock Phone which you can use to test the functionality in your workspace without needing to connect and send real SMS messages.",
                  datetime: "2 Days ago",
                },
                {
                  id: 3,
                  author: "London English",
                  avatar: "https://1.bp.blogspot.com/-ecxQPOn9U8s/XPaNhsTr2ZI/AAAAAAAABcc/O6H9aHK4ImYoSxJq7Gc-nCu5lLufFIC-QCLcBGAs/s1600/Hidden-Face-Girl-Profile-Pictures-for-Whatsapp.jpg",
                  content: "No real SMS messages are actually created, however, which means you do not need to spend money on SMS",
                  datetime: "1 Days ago",
                }
              ],
            owner: {
              name: "Nuttachai Kulthammanit",
              profilePic: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531"
            },
          },
          {
            id: 2,
            author: {
              name: "Apiwut Kittiparkun",
              profilePic: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-9/72331485_3500832969926684_3328255275332272128_n.jpg?_nc_cat=102&_nc_eui2=AeGPg3waOA9Kh0BJOAJ_CLfuY37V7K59m3avbKM5eyx9eFDYJxJDFYhuR1Lbq6kmxSdO3_rgYk0dBJfxKiW1KRQ3lUUnqi3VP_M0_TqdSOib-Q&_nc_oc=AQkD1hjKc-w9eeWYDLGq8Si6esQlwzS_l-XB76MDvdGtyFzHA0kVA6DMQFOIDbwKbVI&_nc_ht=scontent.fbkk22-3.fna&oh=2786b485e2e7f634b96ec9ac451acbee&oe=5E4228CB"
            },
            message: "img elements must have an alt prop, either with meaningful text, or an empty string for decorative images",
            imgSrc: "",
            date: "15 ชมที่แล้ว",
            commentList:
              [
                {
                  id: 4,
                  author: "Nuttachai Kulthammanit",
                  avatar: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531",
                  content: "I met the singer at the Brayan Star Tour and he was so nice and cuter in person! :)",
                  datetime: "2 Days ago",
                },
                {
                  id: 5,
                  author: "Nuttachai Kulthammanit",
                  avatar: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531",
                  content: "Hold on just a little while longer.",
                  datetime: "1 Days ago",
                },
                {
                  id: 6,
                  author: "Nuttachai Kulthammanit",
                  avatar: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531",
                  content: "อาหารทำให้เรามาชีวิต แต่ความฝันจะทำให้เราอยากมีชีวิต",
                  datetime: "15 Hours ago",
                }
              ],
            owner: {
              name: "Nuttachai Kulthammanit",
              profilePic: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-1/c0.0.24.24a/p24x24/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_oc=AQlLEzSt2ysLGxaBJ27i9_wKJe4xw4p1nN3uZZa5bLkBfO1CTt_LIUeILv_o_d7fDqQ&_nc_ht=scontent.fbkk22-3.fna&oh=c0125b6725de188bb0f9e5ff94ce72f8&oe=5E4A5531"
            },
          }
        ],
    }
  }

  render() {
    return (
      <Col>
        <Row type="flex" justify="center">
          <HeadFakebook
            imageSrc="https://scontent.fbkk22-3.fna.fbcdn.net/v/t1.0-9/71561886_1609849782479256_2419419055669641216_n.jpg?_nc_cat=111&_nc_eui2=AeGGEac45Y7P61v-juKLihSuqQvzyZAUvy9dz3sSynbKiBRLT6lgXhjtX5jjtNAY9MSDoejoGIsDoajvZuQbEsl64swyCN-293Zo2K_d4tRtLw&_nc_oc=AQnKNnIYBPW5aLIzcAhWJ2OrZZN-2HCc5yDfjONO_xau-OVSNZ2MiGhybKrEeToeLgw&_nc_ht=scontent.fbkk22-3.fna&oh=ba6de0084eebf847928c72be1a7551dd&oe=5E4F2B50"
            name="Nuttachai Kulthammanit"
          />
        </Row>
        <Row type="flex" justify="center">
          <Col md={18} sm={20} xs={22}>
            <Divider />
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col md={12} sm={16} xs={24}>
            <PostList postList={this.state.postList} />
          </Col>
        </Row>
      </Col>
    )
  }
}