# EchoUtteranceSkill
#What this skill does
This skill speaks back what ever you have said. It outputs this data via speech and a HTTP post request on port 15000. There is a parameter called spoken which  has the utterances. You can grab this request using a do_POST method in a server. The POST URL is http://localhost:15000. I got the idea for this skill from a  friend who runs a travel company catering to the disabled. She wanted me to create a speech to sign language converter. I then subsequently thought that it would be easier to create a mechanism to output spoken text. I expect this skill to be used in conferences etc. However, it has not been tested in the field. 
## Usage:
say the following to start the skill
"echo on"
"signer start"
There is a bug in the skill therefore it does not stop when speaking the stop words. These words are
"signer stop"
The only way to stop this skill now is to let it time out.
##Acknowledgements
My thanks to the Mycroft community, especially to jarbas.