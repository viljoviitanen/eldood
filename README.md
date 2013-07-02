eldood
======

a simple doodle.com inspired tool

In a nutshell: find a best "option" for an "event" for all participants. The option could be scheduling time for a meeting - list all times as choices, then let everyone mark which times suit them. Or, it could be about choosing the restaurant you're going have dinner.

NOT YET WORKING
===============

Some design goals
-----------------
- No authentication/registration. Just create an event, and share the url with the people you want to.
- Not much security. 
- No email notifications.
- Scalability with appengine storage (hopefully).
- Simple to set up, so that anyone can run an own private or public instance.
- Inactive events are deleted from the datastore periodically.

Future ideas
-------------
- Optionally later google authenticated events with access controls could be implemented if there's interest.
- *make the tool prettier*. This really is still in a "proof of concept" stage. I wish I'd get some help with this.

How to install locally
----------------------
Download and install the google appengine development server, when writing this it's available from https://developers.google.com/appengine/docs/python/tools/devserver .

cd into the appengine development server main directory, where devappserver2.py etc are located

put this directory there as a subdirectory (i.e. unzip the downloaded repo zip or git clone directly in there or whatever)

then you can 'make run' to run the application with default settings.

to make your own eldood instance in appengine, see google docs about creating applications. After you have created your app, edit app.yaml first line to match your application. Note, you'll need to invent your own unique "application name". I run my public instance of eldood with application name eldood-tool, so the url is http://eldood-tool.appspot.com

License
-------
GPLv2. See LICENSE.txt
