import random

griffon_cards = [
    {"house": "griffon", "name": "0", "value": 0, "src": "../static/cards/gryffindor_0_1.png"},
    {"house": "griffon", "name": "0", "value": 0, "src": "../static/cards/gryffindor_0_2.png"},
    {"house": "griffon", "name": "1", "value": 1, "src": "../static/cards/gryffindor_1_1.png"},
    {"house": "griffon", "name": "1", "value": 1, "src": "../static/cards/gryffindor_1_2.png"},
    {"house": "griffon", "name": "2", "value": 2, "src": "../static/cards/gryffindor_2_1.png"},
    {"house": "griffon", "name": "2", "value": 2, "src": "../static/cards/gryffindor_2_2.png"},
    {"house": "griffon", "name": "3", "value": 3, "src": "../static/cards/gryffindor_3_1.png"},
    {"house": "griffon", "name": "3", "value": 3, "src": "../static/cards/gryffindor_3_2.png"},
    {"house": "griffon", "name": "4", "value": 4, "src": "../static/cards/gryffindor_4_1.png"},
    {"house": "griffon", "name": "4", "value": 4, "src": "../static/cards/gryffindor_4_2.png"},
    {"house": "griffon", "name": "5", "value": 5, "src": "../static/cards/gryffindor_5_1.png"},
    {"house": "griffon", "name": "5", "value": 5, "src": "../static/cards/gryffindor_5_2.png"},
    {"house": "griffon", "name": "6", "value": 6, "src": "../static/cards/gryffindor_6_1.png"},
    {"house": "griffon", "name": "6", "value": 6, "src": "../static/cards/gryffindor_6_2.png"},
    {"house": "griffon", "name": "7", "value": 7, "src": "../static/cards/gryffindor_7_1.png"},
    {"house": "griffon", "name": "7", "value": 7, "src": "../static/cards/gryffindor_7_2.png"},
    {"house": "griffon", "name": "8", "value": 8, "src": "../static/cards/gryffindor_8_1.png"},
    {"house": "griffon", "name": "8", "value": 8, "src": "../static/cards/gryffindor_8_2.png"},
    {"house": "griffon", "name": "9", "value": 9, "src": "../static/cards/gryffindor_9_1.png"},
    {"house": "griffon", "name": "9", "value": 9, "src": "../static/cards/gryffindor_9_2.png"},
    {"house": "griffon", "name": "mirror", "value": 0, "src": "../static/cards/gryffindor_mirror.png"},
    {"house": "griffon", "name": "hallows", "value": 0, "src": "../static/cards/gryffindor_hallows.png"},
    {"house": "griffon", "name": "echo", "value": 0, "src": "../static/cards/gryffindor_echo.png"},
    {"house": "griffon", "name": "shield", "value": 0, "src": "../static/cards/gryffindor_shield.png"},
    {"house": "griffon", "name": "swap", "value": 0, "src": "../static/cards/gryffindor_swap.png"},
]

hufflepuff_cards = [
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "../static/cards/hufflepuff_0_1.png"},
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "../static/cards/hufflepuff_0_2.png"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "../static/cards/hufflepuff_1_1.png"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "../static/cards/hufflepuff_1_2.png"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "../static/cards/hufflepuff_2_1.png"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "../static/cards/hufflepuff_2_2.png"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "../static/cards/hufflepuff_3_1.png"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "../static/cards/hufflepuff_3_2.png"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "../static/cards/hufflepuff_4_1.png"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "../static/cards/hufflepuff_4_2.png"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "../static/cards/hufflepuff_5_1.png"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "../static/cards/hufflepuff_5_2.png"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "../static/cards/hufflepuff_6_1.png"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "../static/cards/hufflepuff_6_2.png"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "../static/cards/hufflepuff_7_1.png"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "../static/cards/hufflepuff_7_2.png"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "../static/cards/hufflepuff_8_1.png"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "../static/cards/hufflepuff_8_2.png"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "../static/cards/hufflepuff_9_1.png"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "../static/cards/hufflepuff_9_2.png"},
    {"house": "hufflepuff", "name": "mirror", "value": 0, "src": "../static/cards/hufflepuff_mirror.png"},
    {"house": "hufflepuff", "name": "hallows", "value": 0, "src": "../static/cards/hufflepuff_hallows.png"},
    {"house": "hufflepuff", "name": "echo", "value": 0, "src": "../static/cards/hufflepuff_echo.png"},
    {"house": "hufflepuff", "name": "shield", "value": 0, "src": "../static/cards/hufflepuff_shield.png"},
    {"house": "hufflepuff", "name": "swap", "value": 0, "src": "../static/cards/hufflepuff_swap.png"},
]

ravenclaw_cards = [
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "../static/cards/ravenclaw_0_1.png"},
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "../static/cards/ravenclaw_0_2.png"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "../static/cards/ravenclaw_1_1.png"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "../static/cards/ravenclaw_1_2.png"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "../static/cards/ravenclaw_2_1.png"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "../static/cards/ravenclaw_2_2.png"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "../static/cards/ravenclaw_3_1.png"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "../static/cards/ravenclaw_3_2.png"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "../static/cards/ravenclaw_4_1.png"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "../static/cards/ravenclaw_4_2.png"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "../static/cards/ravenclaw_5_1.png"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "../static/cards/ravenclaw_5_2.png"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "../static/cards/ravenclaw_6_1.png"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "../static/cards/ravenclaw_6_2.png"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "../static/cards/ravenclaw_7_1.png"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "../static/cards/ravenclaw_7_2.png"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "../static/cards/ravenclaw_8_1.png"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "../static/cards/ravenclaw_8_2.png"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "../static/cards/ravenclaw_9_1.png"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "../static/cards/ravenclaw_9_2.png"},
    {"house": "ravenclaw", "name": "mirror", "value": 0, "src": "../static/cards/ravenclaw_mirror.png"},
    {"house": "ravenclaw", "name": "hallows", "value": 0, "src": "../static/cards/ravenclaw_hallows.png"},
    {"house": "ravenclaw", "name": "echo", "value": 0, "src": "../static/cards/ravenclaw_echo.png"},
    {"house": "ravenclaw", "name": "shield", "value": 0, "src": "../static/cards/ravenclaw_shield.png"},
    {"house": "ravenclaw", "name": "swap", "value": 0, "src": "../static/cards/ravenclaw_swap.png"},
]

slytherin_cards = [
    {"house": "slytherin", "name": "0", "value": 0, "src": "../static/cards/slytherin_0_1.png"},
    {"house": "slytherin", "name": "0", "value": 0, "src": "../static/cards/slytherin_0_2.png"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "../static/cards/slytherin_1_1.png"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "../static/cards/slytherin_1_2.png"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "../static/cards/slytherin_2_1.png"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "../static/cards/slytherin_2_2.png"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "../static/cards/slytherin_3_1.png"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "../static/cards/slytherin_3_2.png"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "../static/cards/slytherin_4_1.png"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "../static/cards/slytherin_4_2.png"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "../static/cards/slytherin_5_1.png"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "../static/cards/slytherin_5_2.png"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "../static/cards/slytherin_6_1.png"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "../static/cards/slytherin_6_2.png"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "../static/cards/slytherin_7_1.png"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "../static/cards/slytherin_7_2.png"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "../static/cards/slytherin_8_1.png"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "../static/cards/slytherin_8_2.png"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "../static/cards/slytherin_9_1.png"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "../static/cards/slytherin_9_2.png"},
    {"house": "slytherin", "name": "mirror", "value": 0, "src": "../static/cards/slytherin_mirror.png"},
    {"house": "slytherin", "name": "hallows", "value": 0, "src": "../static/cards/slytherin_hallows.png"},
    {"house": "slytherin", "name": "echo", "value": 0, "src": "../static/cards/slytherin_echo.png"},
    {"house": "slytherin", "name": "shield", "value": 0, "src": "../static/cards/slytherin_shield.png"},
    {"house": "slytherin", "name": "swap", "value": 0, "src": "../static/cards/slytherin_swap.png"},
]


def get_player_deck():
    completeDeck = griffon_cards + hufflepuff_cards + ravenclaw_cards + slytherin_cards
    newDeck = []
    for i in range(0, 11):
        newDeck.append(completeDeck.pop(random.randint(0, len(completeDeck)-1)))
    return newDeck


class House():
    GRYFFINDOR = "gryffindor"
    HUFFLEPUFF = "hufflepuff"
    RAVENCLAW = "ravenclaw"
    SLYTHERIN = "slytherin"


class CardType():
    NUMERICAL = "numerical"
    HALLOWS = "hallows"
    ECHO = "echo"
    MIRROR = "mirror"
    SHIELD = "shield"
    SWAP = "swap"
    

class Player():
    def __init__(self, name):
        self.name = name
        self.personal_deck = get_player_deck()
        self.hand = []
        self.cards_left = len(self.personal_deck) + len(self.hand)