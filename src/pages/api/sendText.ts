import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { config } from "dotenv";
import { isValidPhoneNumber } from "libphonenumber-js";
import fs from "fs";
import path from "path";
import configData from "../../config/server.json"


// Load environment variables from .env file
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const template = configData.template;

/**
 * Handles the API request to send a text message.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    console.log("Request recieved to api/sendText");
    // Check if any required environment variables are missing
    console.log("Are Twilio credentials present?");
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.log("Twilio credentials are not present");
      res.status(500).json({
        error: "Unable to send, please speak an Elder Bros representative",
      });
      return;
    }
    console.log("Twilio credentials are present");
    let client: twilio.Twilio;

    try {
      client = twilio(accountSid, authToken);
    } catch {
      console.log("Unable to create twilio client");
      res.status(500).json({
        error: "Unable to send, please speak an Elder Bros representative",
      });
      return;
    }

    const { phoneNumber } = req.body;
    console.log(`Recieved phone number ${phoneNumber}`);

    console.log(
      `Is phone number ${phoneNumber} a valid Canadian or US phone number`
    );
    try {
      if (
        !isValidPhoneNumber(phoneNumber, "CA") &&
        !isValidPhoneNumber(phoneNumber, "US")
      ) {
        console.log(
          `Phone number ${phoneNumber} is not a valid Canadian or US phone number`
        );
        res.status(500).json({
          error: "Unable to send, please speak an Elder Bros representative",
        });
        return;
      }
    } catch (error) {
      console.log(`isValidPhoneNumber encountered an error`);
      res.status(500).json({
        error: "Unable to send, please speak an Elder Bros representative",
      });
      return;
    }
    console.log(
      `Phone number ${phoneNumber} is a valid Canadian or US phone number`
    );

    // Send the text message
    try {
      // await client.messages.create({
      //     body: template,
      //     from: twilioPhoneNumber,
      //     to: phoneNumber,
      //   });
      console.log({
        body: template,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
    } catch (error) {
      console.error(
        `An error occurred when sending message to ${phoneNumber}`,
        error
      );
      res.status(500).json({
        error: "Unable to send, please speak an Elder Bros representative",
      });
    }

    res
      .status(200)
      .json({ message: `Text message sent successfully to ${phoneNumber}` });
  } catch (error) {
    console.error("An unhandled error occurred", error);
    res.status(500).json({
      error: "Unable to send, please speak an Elder Bros representative",
    });
  }
}
