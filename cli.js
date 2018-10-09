#!/usr/local/bin/node

const axios 		= require('axios');
const jsdom 		= require('jsdom');
const { JSDOM } = jsdom;
let url 				= "https://www.bbc.co.uk/news";
let parts = url.split('/');
parts.pop();
let domain 			= parts.join('/');

axios.get(url, {timeout : 5000 }).then((response) => {

	let { document } = (new JSDOM(response.data)).window;
	let stories =  document.querySelectorAll(".nw-c-most-read__items > ol > li > span > div > a");
	console.log(`\nBBC News ${stories.length} most read stories\n`);

	stories.forEach((story) => {
		let link = domain + story.href;
		axios.get(link, {timeout : 5000 }).then((response) => {

		  let { document } = (new JSDOM(response.data)).window;
		  document.addEventListener("DOMContentLoaded", function() {
		    let story = document.querySelectorAll(".story-body__inner > p");
		    let title = document.querySelector(".story-body > h1");
		    if (story && title){
		      console.log(`\n${title.textContent}\n\n`);
		      story.forEach(function(para){
		        console.log(`${para.textContent}\n`);
		      });
		    } else {
		      console.log(`\nUnable to scrape ${link}\n`); 
		    }
		  });
			console.log(`---`);	
		})
	})

}).catch((e) => {
	if (e.code === 'ECONNABORTED')
	console.log(`unable to scrape to ${url}.`);
});