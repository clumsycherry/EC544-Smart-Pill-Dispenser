# Copyright 2018 Pranav Lal.
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
from mycroft.skills.core import MycroftSkill
from mycroft.util.log import getLogger
from os.path import dirname, join
LOGGER = getLogger(__name__)
class EchoUtteranceSkill(MycroftSkill):
    def __init__(self):
        super(EchoUtteranceSkill, self).__init__("EchoUtteranceSkill")
        self.should_echo=False
        self.stop_words = []
        # load stop words from .voc file
        path = join(dirname(__file__), "vocab", self.lang, "EchoUtteranceSkillStopKeyword.voc")
        with open(path, 'r') as voc_file:
            for line in voc_file.readlines():
                parts = line.strip().split("|")
                entity = parts[0]
                self.stop_words.append(entity)
                for alias in parts[1:]:
                    self.stop_words.append(alias)

    def initialize(self):
        intent = IntentBuilder("EchoUtteranceSkillStartIntent").require(
            "EchoUtteranceSkillKeyword").build()
        self.register_intent(intent, self.handle_echo_utterance)
        intent = IntentBuilder("EchoUtteranceSkillStopIntent").require(
            "EchoUtteranceSkillStopKeyword").build()
        self.register_intent(intent, self.handle_echo_stop_utterance)
        LOGGER.info("echo skill initialized")

    def handle_echo_utterance(self,message):
        LOGGER.info("echo back on")
        self.should_echo=True
        self.speak_dialog("echo.on",expect_response=True)

    def handle_echo_stop_utterance(self):
        if self.should_echo==True:
            self.should_echo=False
            self.speak_dialog("echo.off",expect_response=False)
            LOGGER.info("stop routine called")

    def sendUtterance(self, msg):
        import requests
        url= "http://ec544.hopto.org:7786/progress_update"
        dt={}
        dt['spoken']=msg
        try:
            r = requests.post(url, data=dt)
            LOGGER.info("sending to client "+r.url)

        except:
            LOGGER.info("data sending error. ")
    def send_signer_text(self, msg):
        import rpyc
        c = rpyc.connect("localhost", 20000)
        c.root.update_speech(msg)
    def converse(self, utterances, lang="en-us"):
        should_speak=False
        if utterances is not None:
            for stop in self.stop_words:
                if stop in utterances[0]:
                    should_speak=False
                    self.should_echo=False
                else:
                    should_speak=True
        else:
            should_speak=False
        if self.should_echo==True and should_speak==True:
            LOGGER.info("about to speak")
            self.speak(utterances[0], expect_response=True)
            self.sendUtterance(utterances[0])
#            self.send_signer_text(utterances[0])
        else:
            pass
        return self.should_echo
def create_skill():
    return EchoUtteranceSkill()
