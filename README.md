### Pathy
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A simple routing tool for Node-Webkit (http://nwjs.io) that allows folders and html files to act like URLs and CGI scripts.

### Usage
Include the JavaScript file in your HTML.
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
