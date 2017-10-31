/**
 *
 * Instagram RSS Feed generator
 * 
 */


const express = require('express');
const app = express();
const ejs = require('ejs');

(function() {

	// Test object, replace with parsed IG feed object
	var items = [
		{
			title: 'Bloody Mary',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum vero, quae. Ea unde harum debitis optio animi similique hic ratione quasi doloribus perspiciatis fugiat quo aliquam ullam accusantium reiciendis, aliquid!',
			link: 'http://localhost/test1',
			author: 'Paul',
			pubDate: '10-10-1972',
			guid: 'xo1'
		},
		{
			title: 'Swooty Patooty',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum vero, quae. Ea unde harum debitis optio animi similique hic ratione quasi doloribus perspiciatis fugiat quo aliquam ullam accusantium reiciendis, aliquid!',
			link: 'http://localhost/test2',
			author: 'Paul',
			pubDate: '10-10-1972',
			guid: 'xo2'
		}
	];

	app.set('view engine', 'ejs');

	app.get('/', function (req, res) {
		res.render('feed',  {
			instagram_username: 'test_name',
			xml_self_link: 'test_self_link',
			instagram_link: 'test_ig_link',
			instagram_description: 'test desc',
			xml_items: items
		});
	});

	app.listen(9615, function () {
		console.log('Listening on port 9615!')
	})

})();