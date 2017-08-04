## WebRTC Audio Visualizer

### Background

Web Real-Time Communication (WebRTC) is a set of protocols & APIs that allows the creation of a peer-to-peer connection between two browsers and allows for the transmission of information between those peers. WebRTC is the technology responsible for some of the most widely used apps today, including Google Hangouts, Facebook Messenger, and Snapchat.

The goal of this project is to make a visualizer that converts the audio from both peers to visual outputs, allowing for a visualized interplay between them, and as such providing a more interactive experience for WebRTC voice communication.

### Functionality & MVP  

Using this WebRTC Audio Visualizer, users will be able to:

- [ ] Connect to a peer through the Chrome web browser using WebRTC
- [ ] Engage in peer-to-peer voice chat
- [ ] Observe visual output from both single audio as well as the interplay of both audio
- [ ] Adjust the volume, visual output, and other misc settings

In addition, this project will include:

- [ ] An About modal describing the purpose and a brief overview of the application
- [ ] A production Readme

### Wireframes

The main meat of the app will consist of a screen with the visualizer, visual controls, volume controls, and a footer that contains nav links to my Github and Linkedin. Visual controls will allow for some malleability regarding what visuals are displayed per the audio input from both users. In addition, there must be some avenue by which the users find each other; this may be implemented with a screen shown before where users have to input the same room name in order to find each other.

![wireframes](images/entry.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for the overall structure of the app,
- `HTML5 Canvas` for DOM manipulation and rendering of the visualizer,
- Vanilla `WebRTC API` in order to create the peer-to-peer connection,
- Webpack to bundle and serve up the various scripts.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Easel.js` and `SimplePeer` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file. Learn how to utilize `SimplePeer` and `Easel.js`. Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element
- Familiarize myself with the essentials of WebRTC and how to utilize `SimplePeer`

**Day 2**: This day should be completely dedicated to setting up an audio WebRTC connection between two web browsers through the `SimplePeer` library. This will require the use of a server that will allow for the browsers to find each other.

- Understand how `SimplePeer` works to allow for a peer-to-peer connection to be made through WebRTC
- Get a running app up of a barebones WebRTC connection made through the library
- Set up a lobby system to find peers (or through a designated room)

**Day 3**: Figure out how to utilize `Easel.js` and the `HTML5 Canvas` to render to the DOM a visualization of the audio input from the WebRTC connection

- Have a functional visual on the `Canvas` frontend that correctly handles translation of the audio input from the WebRTC connection to a visual output through the data of the sound itself

**Day 4**: Add the settings, volume controls, visual controls, etc. Polish the front end and make sure everything is working well.

- Create controls for altering the visual output of the application
- Have a styled `Canvas`, polished UX

### Bonus features

This rudimentary visualizer sets the stage for bigger and more interesting apps to be built on top of it.

- [ ] Add more options for interactions between peers
- [ ] Add a text chatroom to communicate between peers
- [ ] Add user profiles to more easily communicate and find other users