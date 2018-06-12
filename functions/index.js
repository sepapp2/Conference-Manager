/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const sendgridEmail = functions.config().sendgrid.username;
const sendgridPassword = functions.config().sendgrid.api;
const mailTransport = nodemailer.createTransport({
  pool: true,
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true, // use TLS
  auth: {
      user: sendgridEmail,
      pass: sendgridPassword
  }
});

const APP_NAME = 'UK Conference Manager';

exports.newRegistration = functions.firestore
    .document('Registrations/{userId}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      console.log(snap.data())
          const email = newValue.email;
          const displayName = newValue.displayName;

          const mailOptions = {
            from: `${APP_NAME} <donoreply@uky.edu>`,
            to: email,
          };
        
          // The user unsubscribed to the newsletter.
          mailOptions.subject = `Welcome to ` + newValue.conference.title;
          mailOptions.text = `Hey ${displayName || ''} you have successfully signed up for ` + newValue.conference.title;
          return mailTransport.sendMail(mailOptions).then(() => {
            return console.log('Conference registration email sent to:', email);
          });
        
    });


