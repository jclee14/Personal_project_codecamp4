// component's config object.
const components = {
  login: {
    component: 'Login',
    url: '/login',
  },
  signup: {
    component: 'Signup',
    url: '/signup',
  },
  changepassword: {
    component: 'ChangePassword',
    url: '/changepassword',
  },
  friend: {
    component: 'Friend',
    url: '/friends',
  },
  home: {
    component: 'Home',
    url: '/',
  },
  profile: {
    component: 'Profile',
    url: '/my-profile',
  },
  createProject: {
    component: 'CreateProject',
    url: '/createproject'
  },
  project: {
    component: 'Projects',
    url: '/projects'
  },
  projectMember: {
    component: 'ProjectMembers',
    url: '/projectmembers'
  },
  createWorker: {
    component: 'CreateWorker',
    url: '/createworker'
  },
  worker: {
    component: 'Workers',
    url: '/workers'
  },
  workerJob: {
    component: 'WorkerJobs',
    url: '/workerjobs'
  },
  extraCharge: {
    component: 'ExtraCharges',
    url: '/extracharges'
  },
  payback: {
    component: 'Payback',
    url: '/paybackrecords'
  },
  createWork: {
    component: 'CreateWork',
    url: '/create-work-attendance'
  },
  workattendance: {
    component: 'WorkAttendance',
    url: '/work-attendance'
  }
};

export default {
  //role name as a key.
  admin: {
    routes: [...Object.values(components)],
    redirect: ['/']
  },
  user: {
    routes: [
      components.changepassword,
      components.friend,
      components.home,
      components.profile
    ],
    redirect: ['/']
  },
  guest: {
    routes: [
      components.login,
      components.signup,
    ],
    redirect: ['/login']
  }
}