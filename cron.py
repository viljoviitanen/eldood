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
import logging
import os
import string
from datetime import datetime
import time

def debug(self,s):
  if self.app.debug:
    print s

class Event(ndb.Model):
  content = ndb.StringProperty()
  #stamp is used to remove old inactive entries
  stamp = ndb.DateTimeProperty(auto_now=True)

# the scheduled task to clean up idle events from the database
# to keep it from growing too big.
# note: parameter 0 deletes ALL entries.
class CronHandler(webapp2.RequestHandler):
  def get(self,days):
    if int(days)<0 or int(days)>3650:
      logging.debug("invalid parameter. Valid range is 0 - 3650 days (10 years)")
      self.abort(400,"invalid parameter. Valid range is 0 - 3650 days (10 years)")
      
    self.response.headers['Content-Type'] = 'text/plain'
    limit=datetime.fromtimestamp(time.time()-86400*int(days))
    qry = Event.query(Event.stamp < limit)
    n=0
    for key in qry.iter(keys_only=True):
      n=n+1
      key.delete()
    logging.debug("done, "+str(n)+" events purged")
    self.response.write("done, "+str(n)+" events purged")
      

debugstate = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

app = webapp2.WSGIApplication([
    ('/cron/(\d+)', CronHandler),
], debug=debugstate)
