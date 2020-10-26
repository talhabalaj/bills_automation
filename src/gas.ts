import querystring from "querystring";
import puppeteer from "puppeteer";
// @ts-ignore
import onedrive from "onedrive-api";

import { Readable } from "stream";
import { Request, Response } from "express";

import { getAccessToken } from "./lib/auth";
import { months } from "./lib/months";
import { Bill } from "./env";

export default async (_request: Request, response: Response) => {
  const accessToken = await getAccessToken();

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.once("request", async (interceptedRequest: any) => {
    interceptedRequest.continue({
      method: "POST",
      postData: querystring.stringify({
        proc: "viewbill",
        consumer: Bill.gasId,
        contype: "NewCon",
      }),
      headers: {
        ...interceptedRequest.headers(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    await page.setRequestInterception(false);
  });

  await page.goto("https://www.sngpl.com.pk/web/viewbill");
  const pdf = await page.pdf({ format: "A4" });

  const readableStream = Readable.from(pdf);

  const date = new Date();
  const month = months[date.getMonth() - 1];
  const year = date.getFullYear();

  const folderRequest = await onedrive.items.createFolder({
    accessToken,
    name: `${month} ${year}`,
    rootItemId: "786201AF40A3EFCA!108657",
  });

  await onedrive.items.uploadSimple({
    accessToken,
    filename: `Gas Bill.pdf`,
    parentId: folderRequest.id,
    readableStream: readableStream,
  });

  response.status(200).end({ worked: true });
};
