# Replicloud

Replicloud is a tool for downloading and updating free and opensource audio tools.

![screenshot](https://github.com/replicat-audio/Replicloud/blob/master/demogif1.gif?raw=true)

Features:
* Downloads come directly from the Replicloud server and are verified for integrity.
* No 3rd party installers or DRM. Replicloud downloads ready to go copies of your tools.
* Allows for all of your tools to be installed to custom locations which are fully portable.

Currently Included Tools:
* GreenWave (Standalone and VST)
* TerminalVelocity (VST)
* Helm (Standalone and VST)
* BlackBird (Standalone and VST)
* More tools to come

![screenshot](https://github.com/replicat-audio/Replicloud/blob/master/demogif2.gif?raw=true)

## Front-end
### Run in dev mode
```
cd electron
npm start
```
### Build EXE
```
cd electron
npm run release
```

## Back-end
### Run back-end
```
cd server
node server
```