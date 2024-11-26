# Worldsensing Challenge

## Assumptions

The Challenge was very open regarding how data was stored, adquired, the periodicity of it, etc. Some assumptions and decisions were made to scope the challenge.

- no need for user registration
- no need for student registration
- no need for device registration within the student
- no need for real time data coming to the browser
- the test set is relatively small and with one call it can be processed and fetched from the server to the frontend
- the biometric data has been already stored in the student object in the database
- fraud detection must be done in the server to avoid frontend tampering
- fraud detection students must be stored somewhere
- we must secure the endpoints

### Server

I decided to create a NodeJs app with Express to serve the APIs that the frontend needed.
For storage I decided to use a simple JSONDB database because of the nature of the diverse reading structures and for human readibility for dev purposes. It could also have been a mongodb for example. I used db.json for the input data and evidence.json to store fraud evidence.

### **API**

- **POST /login** : An API to login with a pre created user (demo:demo) that retrieves a JWT token to be used in the ther APIs
- **GET /students**: Returns a list of Students. For each Student it returns a data related to the student, to his devices, to the base biometrics and fraud results. It also returns a normalized set of all the biometric readings.

### Client

For the client we created a SPA using ReactJs w/Typescript support. For styling we added Tailwind CSS to speed up the mock development. for the charts we used Highcharts and the react library. We added some e2e tests using Playwright.

The Client SPA is very simple with a very basic login to ensure that we get the jwt token and can use the backend secured API and the corresponding logout to clean u the localStorage session.

When the user logs in, a list of students is presented and by clicking on a particular student, a detail is shown to the end user.

The Student detail component shows the chart with the heart rate and systolic blood pressuser readings for that subject, but also a table with information about the student, his devices and other biometric information that has been used to detect possible fraud.

In the list of readings, when a reading has surpassed the treshold readings, we highlight the cell to have a good understanding of what is happening at a glance.

Whn fraud is detected, we show the status in the corresponding line because is where the fraud was detected.

## Possible future improvements or iterations

- Use mongodb to store the data
- Refactor the API so the list of students can be filtered an only retrieve the basic info without fraud detection results
- Separate the retrievel from the frau detection and allow the user to trigger the fraud detection on demand.
- Allow the user to play with the algorithm by sending different % for th HR and SBP and for th time that need to overlap.
- For huge data sets, make th detail biometric table scrollable
- Styling, styling and more styling
- Use redux or another store to store the api calls and login status

## Installation instructions

To run the project, the two parts must be started:

### Server

```bash
cd server
npm i
npm run dev
```

### Client

```bash
cd frontend
npm i
npm run dev
```

To run the tests

### Server

```bash
cd server
npm i
npm run test // some unit tests
```

### Client

```bash
cd frontend
npm i
npm run test // some e2e tests with Playwright
```

## Evidence Database

The evidence database is stored in server/data/evidence.json.
