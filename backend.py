# -*- coding: utf-8 -*-
###############################################################################
##
## Copyright (C) 2014 Tavendo GmbH
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at
##
## http://www.apache.org/licenses/LICENSE-2.0
##
## Unless required by applicable law or agreed to in writing, software
## distributed under the License is distributed on an "AS IS" BASIS,
## WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
## See the License for the specific language governing permissions and
## limitations under the License.
##
###############################################################################

import os
import datetime
import psycopg2

from twisted.python import log
from twisted.enterprise import adbapi
from twisted.internet.defer import inlineCallbacks

from autobahn import wamp
from autobahn.twisted.wamp import ApplicationSession
from autobahn.wamp.exception import ApplicationError
from autobahn.wamp.types import PublishOptions


## WAMP application component with our app code.
##
class Copycat(ApplicationSession):

   def __init__(self, config):
      ApplicationSession.__init__(self)
      self.config = config
      self.init_db()


   def init_db(self):

##Platzhalter
      
      db.runOperation('''DROP TABLE  IF EXISTS gezeichnet   CASCADE;
                      DROP TABLE  IF EXISTS d_begriff    CASCADE;
                      DROP TABLE  IF EXISTS d_teilnehmer CASCADE;
                      DROP TABLE  IF EXISTS spielgruppe  CASCADE;
                      DROP TABLE  IF EXISTS spielrunde   CASCADE;
                      DROP TABLE  IF EXISTS spieler      CASCADE;
                      
                      DROP DOMAIN IF EXISTS D_LEVEL      CASCADE;
                      DROP DOMAIN IF EXISTS D_FUNKTION   CASCADE;
                      
                      CREATE DOMAIN D_FUNKTION
                      AS
                      VARCHAR(10) CHECK (VALUE IN ('Zeichner', 'Mitspieler'));

                      CREATE DOMAIN D_LEVEL
                      AS
                      VARCHAR(6) CHECK (VALUE IN ('leicht', 'mittel', 'schwer'));
                      
                      CREATE TABLE spieler
                      (s_id       SERIAL      NOT NULL,
                      nickname    VARCHAR(30) NOT NULL,
                      passwort    VARCHAR(12) NOT NULL,
                      email       VARCHAR(30) NOT NULL,
                      punktestand INTEGER     NOT NULL DEFAULT 0,

           		      PRIMARY KEY (s_id),
           		      UNIQUE (nickname),
           		      UNIQUE (email)
           		      );
        
        		      CREATE TABLE spielrunde
        		      (sr_id INTEGER   NOT NULL,
        		      start TIMESTAMP NOT NULL,
        
           	              PRIMARY KEY (sr_id)
           	              );
        
        		      CREATE TABLE spielgruppe
        		      (g_id        INTEGER     NOT NULL,
        		      gruppenname VARCHAR(30) NOT NULL,
        
           		      PRIMARY KEY (g_id)
           		      );
        
        		      CREATE TABLE d_teilnehmer
        		      (t_id     INTEGER    NOT NULL,
        		      s_id     INTEGER    NOT NULL,
        		      sr_id    INTEGER    NOT NULL,
        		      g_id     INTEGER    NOT NULL,
        		      funktion D_FUNKTION NOT NULL, 
        
           		      PRIMARY KEY (t_id),
           		      FOREIGN KEY (s_id)  REFERENCES spieler,
           		      FOREIGN KEY (sr_id) REFERENCES spielrunde,
           		      FOREIGN KEY (g_id)  REFERENCES spielgruppe
           		      );
        
        		      CREATE TABLE d_begriff
        		      (b_id  SERIAL     NOT NULL,
        		      wort  VARCHAR(50) NOT NULL,
        		      level D_LEVEL     NOT NULL,
        
           		      PRIMARY KEY (b_id),
           		      UNIQUE (wort)
           		      );
        
        		      CREATE TABLE gezeichnet
        		      (sr_id      INTEGER NOT NULL,
        		      b_id       INTEGER NOT NULL,
        		      erraten    BOOLEAN NOT NULL DEFAULT FALSE,
        		      zeit       INTERVAL,
        		      aufgegeben BOOLEAN NOT NULL DEFAULT FALSE,
        		      verwarnt   INTEGER NOT NULL DEFAULT 0,
        
           		      FOREIGN KEY (sr_id) REFERENCES spielrunde,
           		      FOREIGN KEY (b_id)  REFERENCES d_begriff
           		      );
           		      
           		      INSERT INTO spieler(s_id, nickname, passwort, email)
           		      VALUES
           		      (1, 'admin', 'copycat', 'test@hs-augsburg.de')
           		      ;
           		      
           		      INSERT INTO d_begriff(wort, level)
           		      VALUES
           		      ('schuhkarton', 'leicht'),
           		      ('hosenanzug', 'leicht'),
           		      ('tafelschwamm', 'leicht'),
           		      ('erdbeerkuchen', 'leicht'),
           		      ('schweinebraten', 'leicht'),
           		      ('regenschirm', 'leicht'),
           		      ('laptoptasche', 'leicht'),
           		      ('halskette', 'leicht'),
           		      ('gürtelschnalle', 'leicht'),
           		      ('buchstabensalat', 'leicht'),
           		      ('schlüsselanhänger', 'leicht'),
           		      ('badehose', 'leicht'),
           		      ('springen', 'leicht'),
           		      ('laufen', 'mittel'),
           		      ('schlafen', 'mittel'),
           		      ('lachen', 'mittel'),
           		      ('schluckauf', 'mittel'),
           		      ('trinken', 'mittel'),
           		      ('fallen', 'mittel'),
           		      ('rollen', 'mittel'),
           		      ('schwimmen', 'mittel'),
           		      ('zittern', 'mittel'),
           		      ('pinkeln', 'mittel'),
           		      ('heulen', 'mittel'),
           		      ('trauer', 'schwer'),
           		      ('mitleid', 'schwer'),
           		      ('freude', 'schwer'),
           		      ('angst', 'schwer'),
           		      ('wut', 'schwer'),
           		      ('beziehung', 'schwer'),
           		      ('neid', 'schwer'),
           		      ('hass', 'schwer'),
           		      ('liebe', 'schwer'),
           		      ('lust', 'schwer'),
           		      ('sterben', 'schwer')
           		      
           		      
           		      ;
           		      ''')
      
      print "Table created successfully"


   @wamp.procedure("de.copycat.check_login")
   def login(self, user, password):
      def run(txn):
         txn.execute("SELECT nickname, passwort FROM spieler WHERE nickname=? AND passwort=?", user, password)
         success = False
         for row in txn.fetchall():
             success = True
         
         #self.publish("de.copycat.login", success,
          #  options = PublishOptions(excludeMe = False))

         return success
       
      return self.db.runInteraction(run)
      
   #print "Operation done successfully"
   #db.close()
   
   ##@wamp.procedure("com.copycat.get_votes")
   ##def get_votes(self):
      ##def run(txn):
        ## txn.execute("SELECT item, count FROM votes")
         ##res = {}
         ##for row in txn.fetchall():
          ##  res[row[0]] = row[1]
         ##return res
      ##return self.db.runInteraction(run)


   ##@wamp.procedure("com.copycat.vote")
   ##def vote(self, item):
     ## if not item in self.config.extra['items']:
         ##raise ApplicationError("com.votegame.error.no_such_item", "no item '{}' to vote on".format(item))

     ## def run(txn):
         ## FIXME: make the following into 1 (atomic) SQL statement
         ## => does SQLite feature "UPDATE .. RETURNING"?
       ##  txn.execute("UPDATE votes SET count = count + 1 WHERE item = ?", [item])
       ##  txn.execute("SELECT count FROM votes WHERE item = ?", [item])
       ##  count = int(txn.fetchone()[0])

       ##  self.publish("com.votegame.onvote", item, count,
       ##     options = PublishOptions(excludeMe = False))

       ##  return count

     ## return self.db.runInteraction(run)



  ## @inlineCallbacks
  ## def onJoin(self, details):

    ##  def onvote(item, count):
      ##   print("New vote on '{}': {}".format(item, count))

     ## yield self.subscribe(onvote, 'com.votegame.onvote')

     ## try:
       ##  regs = yield self.register(self)
       ##  print("Ok, registered {} procedures.".format(len(regs)))
     ## except Exception as e:
       ##  print("Failed to register procedures: {}".format(e))

     ## print("VoteGame Backend ready!")



  ## def onDisconnect(self):
    ##  reactor.stop()



def make(config):
   ##
   ## This component factory creates instances of the
   ## application component to run.
   ##
   ## The function will get called either during development
   ## using the ApplicationRunner below, or as a plugin running
   ## hosted in a WAMPlet container such as a Crossbar.io worker.
   ##
   if config:
      return Copycat(config)
   else:
      ## if no config given, return a description of this WAMPlet ..
      return {'label': 'Copycat Service WAMPlet',
              'description': 'This is the backend WAMP application component of Copycat.'}

if __name__ == '__main__':
   from autobahn.twisted.wamp import ApplicationRunner

   ## test drive the component during development ..
   runner = ApplicationRunner(
      url = "ws://localhost:8080/ws",
      realm = "realm1",
      debug = False, ## low-level WebSocket debugging
      debug_wamp = True, ## WAMP protocol-level debugging
      debug_app = True) ## app-level debugging

   runner.run(make)