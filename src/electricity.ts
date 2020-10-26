import querystring from "querystring";
import axios from "axios";
// @ts-ignore
import onedrive from "onedrive-api";

import { Request, Response } from "express";
import { getAccessToken } from "./lib/auth";
import { months } from "./lib/months";
import { Bill } from "./env";


export default async (_request: Request, response: Response) => {
  const accessToken = await getAccessToken();

  const elecRes = await axios.post(
    "http://www.lesco.gov.pk/Modules/CustomerBill/CustomerMenu.asp",
    querystring.stringify({
      txtCustID: Bill.electricityId,
      btnViewBill: "View/Download Bill",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "stream",
    }
  );

  const date = new Date();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const folderRequest = await onedrive.items.createFolder({
      accessToken,
      name: `${month} ${year}`,
      rootItemId: '786201AF40A3EFCA!108962',
    });

  await onedrive.items.uploadSimple({
    accessToken,
    filename: `Electricity Bill.pdf`,
    parentId: folderRequest.id,
    readableStream: elecRes.data,
  });

  response.status(200).end();
};
