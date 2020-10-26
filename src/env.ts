import { config } from 'dotenv';

config();

export const Onedrive = {
  refreshToken: process.env.ONEDRIVE_REFRESH_TOKEN,
  clientId: process.env.ONEDRIVE_CLIENT_ID,
  clientSecret: process.env.ONEDRIVE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/callback'
}

export const Bill = {
  electricityId: process.env.ELECTRICITY_BILL_ID,
  gasId: process.env.GAS_BILL_ID,
}

export const ServerPort = process.env.PORT || 3000;