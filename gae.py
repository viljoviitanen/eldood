#!/usr/bin/env python
# Eldood, a doodle.com inspired tool
# google appengine backend
#
# Copyright (C) 2013 Viljo Viitanen
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


import webapp2
from google.appengine.ext import ndb
import json
import urllib
import logging
import os
import random
import string

def debug(self,s):
  if self.app.debug:
    print s

class Event(ndb.Model):
  content = ndb.StringProperty()
  #stamp is used to remove old inactive entries
  stamp = ndb.DateTimeProperty(auto_now=True)

def create(self):
  return number

@ndb.transactional
def update(self,number,what):
  debug(self,what)
  if number=='new':
    obj=True
    #loop until we get an unique key
    while obj:
      number=''.join(random.choice(string.ascii_letters+string.digits) for i in range(5))
      debug(self,number)
      key=ndb.Key('Event', number)
      obj=key.get()
    obj=Event(id=number)
    stored={}
  else:
    key=ndb.Key('Event', number)
    obj=key.get()
    if not obj:
      #non-existing event number
      return '{}'
    #loop through the entries and add/update them in a dict deserialized from the stored json
    stored=json.loads(obj.content)
  new=json.loads(urllib.unquote(what))
  for key in new.keys():
    stored[key]=new[key]
  obj.content=json.dumps(stored)
  obj.put()
  #always return the "full" json
  return '{"update":%s,"number":"%s"}'%(obj.content,number)

class UpdateHandler(webapp2.RequestHandler):
  #XXX change to post
  def get(self,number,what):
    self.response.headers['Content-Type'] = 'application/json'
    self.response.write(update(self,number,what))

class GetHandler(webapp2.RequestHandler):
  def get(self,number):
    self.response.headers['Content-Type'] = 'application/json'
    key=ndb.Key('Event', number)
    obj=key.get()
    if not obj:
      self.response.write('{}')
    else:
      self.response.write('{"get":%s}'%obj.content)

debugstate = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

app = webapp2.WSGIApplication([
    ('/get/([^/]+)', GetHandler),
    ('/update/([^/]+)/([^/]+)', UpdateHandler),
], debug=debugstate)
