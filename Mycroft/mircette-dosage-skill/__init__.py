from mycroft import MycroftSkill, intent_file_handler


class MircetteDosage(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('dosage.mircette.intent')
    def handle_dosage_mircette(self, message):
        self.speak_dialog('dosage.mircette')


def create_skill():
    return MircetteDosage()

