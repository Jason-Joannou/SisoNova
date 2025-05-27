from enum import Enum

class Languages(str, Enum):
    english = "English"
    afrikaans = "Afrikaans"
    zulu = "Zulu"

class YesOrNo(str, Enum):
    yes = "yes"
    no = "no"