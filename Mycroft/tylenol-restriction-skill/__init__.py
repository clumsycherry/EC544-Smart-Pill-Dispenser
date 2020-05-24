from mycroft import MycroftSkill, intent_file_handler


class TylenolRestriction(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('restriction.tylenol.intent')
    def handle_restriction_tylenol(self, message):
        self.speak_dialog('restriction.tylenol')


def create_skill():
    return TylenolRestriction()

