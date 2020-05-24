from mycroft import MycroftSkill, intent_file_handler


class TylenolDosage(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('dosage.tylenol.intent')
    def handle_dosage_tylenol(self, message):
        self.speak_dialog('dosage.tylenol')


def create_skill():
    return TylenolDosage()

