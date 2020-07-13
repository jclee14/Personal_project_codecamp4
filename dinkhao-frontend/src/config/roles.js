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
  home: {
    component: 'Home',
    url: '/',
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
  // workerJob: {
  //   component: 'WorkerJobs',
  //   url: '/workerjobs'
  // },
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
  },
  generalAccounting: {
    component: 'GeneralAccounting',
    url: '/general-accounting'
  },
  workerAccounting: {
    component: 'WorkerAccounting',
    url: '/worker-accounting'
  }
};

export default {
  //role name as a key.
  admin: {
    routes: [...Object.values(components)],
    redirect: '/'
  },
  user: {
    routes: [
      components.changepassword,
      components.home,
      components.createProject,
      components.createWork,
      components.createWorker,
      components.extraCharge,
      components.payback,
      components.workattendance,
      components.worker,
      components.generalAccounting,
      components.workerAccounting,
      components.project,
      components.projectMember
    ],
    redirect: '/'
  },
  guest: {
    routes: [
      components.login,
      components.signup,
    ],
    redirect: '/login'
  }
}