eldood
======

a simple doodle.com inspired tool

In a nutshell: find a best "option" for an "event" for all participants. The option could be scheduling time for a meeting - list all times as choices, then let everyone mark which times suit them. Or, it could be about choosing the restaurant you're going have dinner.

Some design goals:

- No authentication/registration. Just create an event, and share the url with the people you want to.
- Optionally later google authenticated events with access controls could be implemented if there's interest.
- No email notifications.
- Scalability with appengine storage (hopefully).
- Simple to set up, so that anyone can run an own private or public instance.
- Inactive events are deleted from the datastore periodically.
