from mycroft import MycroftSkill, intent_file_handler


class SeratoninIndication(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('indication.seratonin.intent')
    def handle_indication_seratonin(self, message):
        self.speak_dialog('indication.seratonin')


def create_skill():
    return SeratoninIndication()

