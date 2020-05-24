from mycroft import MycroftSkill, intent_file_handler


class RestrictionOfSeratonin(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('seratonin.of.restriction.intent')
    def handle_seratonin_of_restriction(self, message):
        self.speak_dialog('seratonin.of.restriction')


def create_skill():
    return RestrictionOfSeratonin()

