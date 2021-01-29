import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  userprofile: {
    id: number;
    bio: string;
    avatar: string;
    phone: string;
    address?: AddressModel;
    location: string;
    birth_date: string;
    occupation: string;
    socialNetworks?: SocialNetworksModel;
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

  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.firstname || '';
    this.email = user.email || '';
    this.userprofile.avatar = user.pic || './assets/media/users/default.jpg';
    this.groups = user.roles || [];
    this.userprofile.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.userprofile.phone = user.phone || '';
    this.userprofile.address = user.address;
    this.userprofile.socialNetworks = user.socialNetworks;
  }
}
