
#Angular 2 Examples

This repo is a playground for building reusable Components for Angular 2, now with support for Angular CLI.

##UI Sliders

These custom input sliders are configurable to display vertical, horizontal, or have a bi-directional mode like a joystick. The sliders output an EventEmitter with their current position.

![](/public/assets/screenshot/ui-sliders.png)


##WebRTC DataChannel @Injectable

This service currently relies on Firebase for signaling, so bring your own server (free). If there is interest in other signaling servers, drop me a line in the issues or submit a pull request.

If you include a `conf.ts` in `app/src` that looks like the following:

```
var config = {
  room: 'my-room',
  username:  'any-unique-string',
  server: 'https://my-server-name-here.firebaseio.com/'
};

export default config;
```

you can then test out the DataChannel @Injectable at `/webrtc/client`.


##Audio Player Visualization

This example uses WebAudio API and d3 to visualize the levels of audio provided by web compliant audio files. It represents a culmination of most of the topics I learned at ng-conf 2016 including how to make xhr requests and transform responses with Observables, create Injectables, use EventEmitters, take advantage of Inputs and Outputs, and style Components the Angular 2 way using Shadow DOM Emulation.

![](/public/assets/screenshot/audio.png)

Bring your own audio files. Put web compliant mp3 or m4a in the /app/assets folder.

Configure the player with a JSON file stored in /src/models/media.json. An example is provided.

```
{
  "media": [{
      "artist": "Beach House",
      "title": "Myth",
      "url": "/assets/music/01-myth.m4a",
      "imageUrl": "/assets/music/album-artwork.png",
      "index": 1
    }, {

      "artist": "Beach House",
      "title": "Wild",
      "url": "/assets/music/02-wild.m4a",
      "imageUrl": "/assets/music/album-artwork.png",
      "index": 2
    }, {
      "artist": "Beach House",
      "title": "Lazuli",
      "url": "/assets/music/03-lazuli.m4a",
      "imageUrl": "/assets/music/album-artwork.png",
      "index": 3
    }
  ]
}
```



This project was created using Angular-CLI. https://github.com/angular/angular-cli

## Dependencies ##

You should install these frameworks at a system level before cloning the repo. Homebrew is helpful for installing node.js on a Mac, otherwise all other packages should be handled through npm. Note: if you have previously installed SASS via the gem, uninstall SASS and run the node-sass compiler instead, node-sass is a port of libsass.

* [node.js] (http://www.nodejs.org)
* [angular-cli] (https://cli.angular.io)
* [typescript] (https://www.typescriptlang.org)
* [sass] (http://www.sass-lang.com)


Here are the shell commands so you don't have to look them up: 

```
brew install node
npm install -g node-sass
npm install -g typescript
npm install -g angular-cli
```

## Typescript ##

The Angular 2 team has chosen to support Typescript and several tutorial authors also prefer writing Typescript for Angular 2 apps. The project is written in Typescript.

## CSS ##

I am really starting to like the way Web Components are styled. Each component has it's own CSS which gives us access to the parent with the `:host` selector.


## Installation ##

Instructions are available on the angilar cli README. https://github.com/angular/angular-cli

If the cli is installed globally, just run `npm install` then possibly `typings install`. If on OS X and you run into EACCESS issues with typings install, you must `chown` the project folder and possibly files in `~/.config`.

After dependencies are installed, run `ng serve`.
