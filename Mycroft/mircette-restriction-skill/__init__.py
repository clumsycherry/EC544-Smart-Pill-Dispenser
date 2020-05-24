from mycroft import MycroftSkill, intent_file_handler


class MircetteRestriction(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('restriction.mircette.intent')
    def handle_restriction_mircette(self, message):
        self.speak_dialog('restriction.mircette')


def create_skill():
    return MircetteRestriction()

