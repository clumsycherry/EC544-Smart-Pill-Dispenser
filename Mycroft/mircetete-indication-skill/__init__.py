from mycroft import MycroftSkill, intent_file_handler


class MirceteteIndication(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('indication.mircetete.intent')
    def handle_indication_mircetete(self, message):
        self.speak_dialog('indication.mircetete')


def create_skill():
    return MirceteteIndication()

