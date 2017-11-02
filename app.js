const https = require("https");
const express = require('express');
const app = express();
const ejs = require('ejs');
const Promise = require('bluebird');
const moment = require('moment');

app.set('view engine', 'ejs');

app.listen(9615, () => {
	console.log('Listening on http://localhost:9615');
});

app.get('/feed/:username', (req, res, next) => {
	let instagram_user = req.params.username;
	let instagram_url = "https://www.instagram.com/" + instagram_user;
	let instagram_media_url = instagram_url + "/media/";
	let xml_feed_url = 'http://' + req.header('host') + '/' + instagram_user;

	let instagram_users_items = [];

	get_instagram_items(instagram_media_url)
		.then(data => {

			let profile_picture = data.items[0].user.profile_picture;

			for (var i = 0; i < data.items.length; i++) {
				let item = data.items[i];

				instagram_users_items.push({
					title: item.caption.text,
					description: item.caption.text,
					link: 'https://www.instagram.com/p/' + item.code + '?taken-by=' + item.user.username,
					author: item.user.full_name,
					pubDate: moment.unix(item.created_time).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
					guid: item.code,
					image: item.images.standard_resolution.url,
					like_count: item.likes.count
				});
			}

			res.type('application/rss+xml');
			res.render('feed',  {
				instagram_username: instagram_user,
				xml_self_link: 'http://' + req.header('host') + '/feed/' + instagram_user,
				instagram_link: instagram_url,
				instagram_description: 'Instagram feed for ' + instagram_user,
				xml_items: instagram_users_items,
				instagram_profile_picture: profile_picture
			});
			res.end();
		}).catch((error) => {
			res.status(500).send('Error: ' + error);
		});
});


function get_instagram_items(instagram_url) {
	return new Promise((resolve, reject) => {
		var get_instagram_data = https
			.get(instagram_url, response => {
				response.setEncoding("utf8");
				let body = '';
				console.log(instagram_url + ' [' + response.statusCode + ']');

				if (response.statusCode !== 200) {
					reject('The feed returned an unexpected HTTP code: ' + response.statusCode);
				} else {
					response.on('data', data => {
						body += data;
					});

					response.on('error', error => {
						console.log('Feed Data error: ' + error);
						reject(error);
					});

					response.on('end', () => {
						try {
							body = JSON.parse(body);
						} catch (error) {
							reject(error);
						}
						resolve(body);
					});
				}
			})
		});

		get_instagram_data.on('error', error => {
			console.log('There was an error fetching the feed: ' + error);
			reject(error);
		});

		get_instagram_data.end();
}

process.on('uncaughtException', function(error) {
	console.log('process.on handler');
	console.log(error);
});
