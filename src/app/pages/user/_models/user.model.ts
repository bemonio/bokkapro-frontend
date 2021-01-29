export class UserModel {
  id: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  is_active: boolean;
  userprofile: {
    id: number;
    bio: string;
    avatar: string;
    phone: string;
    location: string;
    birth_date: string;
    occupation: string;
    website: string;
  }
  groups: any[];
  employee: any;
  companyName: string;
  // personal information
  first_name: string;
  last_name: string;
  // account information
  language: string;
  timeZone: string;
  communication: {
    email: boolean,
    sms: boolean,
    phone: boolean
  };
  // email settings
  emailSettings: {
    emailNotification: boolean,
    sendCopyToPersonalEmail: boolean,
    activityRelatesEmail: {
      youHaveNewNotifications: boolean,
      youAreSentADirectMessage: boolean,
      someoneAddsYouAsAsAConnection: boolean,
      uponNewOrder: boolean,
      newMembershipApproval: boolean,
      memberRegistration: boolean
    },
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
      tipsOnGettingMoreOutOfKeen: boolean,
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
      tipsOnMetronicBusinessProducts: boolean
    }
  };
  created_at: string;
  updated_at: string;
}
