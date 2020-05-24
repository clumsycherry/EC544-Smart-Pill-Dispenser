from mycroft import MycroftSkill, intent_file_handler


class SeratoninDosage(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('dosage.seratonin.intent')
    def handle_dosage_seratonin(self, message):
        self.speak_dialog('dosage.seratonin')


def create_skill():
    return SeratoninDosage()

