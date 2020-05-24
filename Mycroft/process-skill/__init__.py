# Copyright 2016 Mycroft AI, Inc.
#
# This file is part of Mycroft Core.
#
# Mycroft Core is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Mycroft Core is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Mycroft Core.  If not, see <http://www.gnu.org/licenses/>.


from adapt.intent import IntentBuilder
from mycroft import MycroftSkill, intent_handler
import requests
url = "http://ec544.hopto.org:7786/progress_update"

class ProcessSkill(MycroftSkill):
    def __init__(self):
        """ The __init__ method is called when the Skill is first constructed.
        It is often used to declare variables or perform setup actions, however
        it cannot utilise MycroftSkill methods as the class does not yet exist.
        """
        super().__init__()
        self.learning = True
    def initialize(self):
        """ Perform any final setup needed for the skill here.
        This function is invoked after the skill is fully constructed and
        registered with the system. Intents will be registered and Skill
        settings will be available."""
        my_setting = self.settings.get('my_setting')
    

    


     @intent_handler(IntentBuilder('DizzinessIntent').require('DizzinessKeyword'))
     def handle_dizziness_intent(self, message,mid,progid,progdate,url):
        """ This is an Adapt intent handler, it is triggered by a keyword."""
         url = "http://ec544.hopto.org:7786/progress_update"
         payload = {
                  'mid':'M1',
                  'progid':'2,4',
                  'progdate':'2020-3-1'
                 }  
         response = requests.post(url, data = payload)
         self.speak_dialog("sendmessage")
         return response
"""
     @intent_handler(IntentBuilder('NauseaIntent').require('NauseaKeyword'))
     def handle_nausea_intent(self, message):
       
       It is triggered using a list of sample phrases.
         self.speak_dialog("sendmessage")

     @intent_handler(IntentBuilder('SadnessIntent').require('SadnessKeyword'))
     def handle_sadness_intent(self, message):
       
         self.speak_dialog("sendmessage")
"""
     def stop(self):
        pass


def create_skill():
    return ProcessSkill()
