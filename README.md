### Pathy
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A simple routing tool for Node-Webkit (http://nwjs.io) that allows folders and html files to act like URLs and CGI scripts.

### Usage

#### DOM Setup
Include the JavaScript file in your index HTML.
```html
<html>
	<head>
		<script type="text/javascript" src="pathy.js"></script>
	</head>
	<body>
	</body>
</html>
```
Pathy will inject pages into the `body` tag by default. This can be changed by `Pathy.container = '#id, or tag, or .class, etc.'`.

#### Naviagtion
```javascript
	window.location.hash = "users/load";
	//or
	Pathy.navigate("users/load");
```
The code above would look for `users/load.html` within the specified routes folder (the default is `./app/routes/`); it would have a final path of `./app/routes/users/load.html`. This file's contents would then be injected into the specified Pathy container (the default is `body`).

It's important to note that there's no need to include the ".html" file extension in the path.

#### Naviagtion + Arguments
```javascript
	var args = {id:12345};
	window.location.hash = "users/load+"+JSON.stringify(args);
	//or
	Pathy.navigate("users/load", args);
```
The code above send the argument `{id:12345}` to the page `./app/routes/users/load.html`.  The code below shows the contents of the page, as well as how to recieve the argument.

#### Recieving Arguments
The following are the contents of the `./app/routes/users/load.html` file.
```html
<h1 id="greeter"></h1>
<script>
	(function($arguments){
		var greeter = document.getElementById("greeter");
		greeter.textContent = "User id:"+$arguments.id+" loaded";
	})($arguments);
</script>
```
Once navigation has occurred and all scripts have been run, the following would be the result:
```html
<html>
	<head>
		<script type="text/javascript" src="pathy.js"></script>
	</head>
	<body>
		<h1 id="greeter">User id:12345 loaded</h1>
	</body>
</html>
```
The contents of `./app/routes/users/load.html` were processed and added into the contents of the `index.html` from the DOM Setup example. If another path is called, the Pathy container (`body`) will be cleared and replaced with the processed contents of the new path.

#### Changing Settings
To change the default route path:
Set `Pathy.routes = './somewhere/anywhere/'`
The default path is `./app/routes/`.

To change the default container where content is set:
Set `Pathy.container = '#id, or tag, or .class, etc.'`
The default container is `body`. 

#### Live Reload
Pathy has a live reload feature! Yay! If you've navigated to a page and it is modified, it will automatically reload without disrupting your JavaScript state.
This feature can be turned on and off by: `Pathy.liveReload = true/false`.
