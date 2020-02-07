const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-b1bde-firebase-adminsdk-plxiu-03f3a6f57a.json')
const databaseURL = 'https://fcm-b1bde.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-b1bde/messages:send'
const deviceToken =
'cXBGB4nVNUQpvKEZ_2Ff6d:APA91bH0AVbr5eJpFdXLUICNDtyaCzAUwIwzivAGgEjI85EwQAL5ouzHPsWmMIK_WvGiPW5Sz4GUZotpph0z2opbTo9cqPZNbEleDEChynDZLFg-6x7V5fazefwU8pdLf8o73HaE_Ab2'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()