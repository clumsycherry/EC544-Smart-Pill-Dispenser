from mycroft import MycroftSkill, intent_file_handler


class Tylenolindication(MycroftSkill):
    def __init__(self):
        MycroftSkill.__init__(self)

    @intent_file_handler('tylenolindication.intent')
    def handle_tylenolindication(self, message):
        self.speak_dialog('tylenolindication')


def create_skill():
    return Tylenolindication()

