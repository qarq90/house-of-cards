from flask import Flask, render_template, request, jsonify, session
import json
import random
import uuid

app = Flask(__name__)
app.secret_key = '170105245166'

gryffindor_cards = [
    # Numerical Cards
    {"house": "gryffindor", "name": "0", "value": 0, "src": "/static/cards/gryffindor_0_1.png"},
    {"house": "gryffindor", "name": "0", "value": 0, "src": "/static/cards/gryffindor_0_2.png"},
    {"house": "gryffindor", "name": "1", "value": 1, "src": "/static/cards/gryffindor_1_1.png"},
    {"house": "gryffindor", "name": "1", "value": 1, "src": "/static/cards/gryffindor_1_2.png"},
    {"house": "gryffindor", "name": "2", "value": 2, "src": "/static/cards/gryffindor_2_1.png"},
    {"house": "gryffindor", "name": "2", "value": 2, "src": "/static/cards/gryffindor_2_2.png"},
    {"house": "gryffindor", "name": "3", "value": 3, "src": "/static/cards/gryffindor_3_1.png"},
    {"house": "gryffindor", "name": "3", "value": 3, "src": "/static/cards/gryffindor_3_2.png"},
    {"house": "gryffindor", "name": "4", "value": 4, "src": "/static/cards/gryffindor_4_1.png"},
    {"house": "gryffindor", "name": "4", "value": 4, "src": "/static/cards/gryffindor_4_2.png"},
    {"house": "gryffindor", "name": "5", "value": 5, "src": "/static/cards/gryffindor_5_1.png"},
    {"house": "gryffindor", "name": "5", "value": 5, "src": "/static/cards/gryffindor_5_2.png"},
    {"house": "gryffindor", "name": "6", "value": 6, "src": "/static/cards/gryffindor_6_1.png"},
    {"house": "gryffindor", "name": "6", "value": 6, "src": "/static/cards/gryffindor_6_2.png"},
    {"house": "gryffindor", "name": "7", "value": 7, "src": "/static/cards/gryffindor_7_1.png"},
    {"house": "gryffindor", "name": "7", "value": 7, "src": "/static/cards/gryffindor_7_2.png"},
    {"house": "gryffindor", "name": "8", "value": 8, "src": "/static/cards/gryffindor_8_1.png"},
    {"house": "gryffindor", "name": "8", "value": 8, "src": "/static/cards/gryffindor_8_2.png"},
    {"house": "gryffindor", "name": "9", "value": 9, "src": "/static/cards/gryffindor_9_1.png"},
    {"house": "gryffindor", "name": "9", "value": 9, "src": "/static/cards/gryffindor_9_2.png"},
    # Special Cards
    {"house": "gryffindor", "name": "mirror", "value": 0, "src": "/static/cards/gryffindor_mirror.png"},
    {"house": "gryffindor", "name": "hallows", "value": 0, "src": "/static/cards/gryffindor_hallows.png"},
    {"house": "gryffindor", "name": "echo", "value": 0, "src": "/static/cards/gryffindor_echo.png"},
    {"house": "gryffindor", "name": "shield", "value": 0, "src": "/static/cards/gryffindor_shield.png"},
    {"house": "gryffindor", "name": "swap", "value": 0, "src": "/static/cards/gryffindor_swap.png"},
]

hufflepuff_cards = [
    # Numerical Cards
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "/static/cards/hufflepuff_0_1.png"},
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "/static/cards/hufflepuff_0_2.png"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "/static/cards/hufflepuff_1_1.png"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "/static/cards/hufflepuff_1_2.png"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "/static/cards/hufflepuff_2_1.png"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "/static/cards/hufflepuff_2_2.png"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "/static/cards/hufflepuff_3_1.png"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "/static/cards/hufflepuff_3_2.png"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "/static/cards/hufflepuff_4_1.png"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "/static/cards/hufflepuff_4_2.png"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "/static/cards/hufflepuff_5_1.png"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "/static/cards/hufflepuff_5_2.png"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "/static/cards/hufflepuff_6_1.png"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "/static/cards/hufflepuff_6_2.png"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "/static/cards/hufflepuff_7_1.png"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "/static/cards/hufflepuff_7_2.png"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "/static/cards/hufflepuff_8_1.png"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "/static/cards/hufflepuff_8_2.png"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "/static/cards/hufflepuff_9_1.png"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "/static/cards/hufflepuff_9_2.png"},
    # Special Cards
    {"house": "hufflepuff", "name": "mirror", "value": 0, "src": "/static/cards/hufflepuff_mirror.png"},
    {"house": "hufflepuff", "name": "hallows", "value": 0, "src": "/static/cards/hufflepuff_hallows.png"},
    {"house": "hufflepuff", "name": "echo", "value": 0, "src": "/static/cards/hufflepuff_echo.png"},
    {"house": "hufflepuff", "name": "shield", "value": 0, "src": "/static/cards/hufflepuff_shield.png"},
    {"house": "hufflepuff", "name": "swap", "value": 0, "src": "/static/cards/hufflepuff_swap.png"},
]

ravenclaw_cards = [
    # Numerical Cards  
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "/static/cards/ravenclaw_0_1.png"},
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "/static/cards/ravenclaw_0_2.png"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "/static/cards/ravenclaw_1_1.png"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "/static/cards/ravenclaw_1_2.png"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "/static/cards/ravenclaw_2_1.png"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "/static/cards/ravenclaw_2_2.png"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "/static/cards/ravenclaw_3_1.png"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "/static/cards/ravenclaw_3_2.png"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "/static/cards/ravenclaw_4_1.png"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "/static/cards/ravenclaw_4_2.png"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "/static/cards/ravenclaw_5_1.png"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "/static/cards/ravenclaw_5_2.png"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "/static/cards/ravenclaw_6_1.png"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "/static/cards/ravenclaw_6_2.png"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "/static/cards/ravenclaw_7_1.png"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "/static/cards/ravenclaw_7_2.png"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "/static/cards/ravenclaw_8_1.png"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "/static/cards/ravenclaw_8_2.png"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "/static/cards/ravenclaw_9_1.png"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "/static/cards/ravenclaw_9_2.png"},
    # Special Cards
    {"house": "ravenclaw", "name": "mirror", "value": 0, "src": "/static/cards/ravenclaw_mirror.png"},
    {"house": "ravenclaw", "name": "hallows", "value": 0, "src": "/static/cards/ravenclaw_hallows.png"},
    {"house": "ravenclaw", "name": "echo", "value": 0, "src": "/static/cards/ravenclaw_echo.png"},
    {"house": "ravenclaw", "name": "shield", "value": 0, "src": "/static/cards/ravenclaw_shield.png"},
    {"house": "ravenclaw", "name": "swap", "value": 0, "src": "/static/cards/ravenclaw_swap.png"},
]

slytherin_cards = [
    # Numerical Cards 
    {"house": "slytherin", "name": "0", "value": 0, "src": "/static/cards/slytherin_0_1.png"},
    {"house": "slytherin", "name": "0", "value": 0, "src": "/static/cards/slytherin_0_2.png"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "/static/cards/slytherin_1_1.png"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "/static/cards/slytherin_1_2.png"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "/static/cards/slytherin_2_1.png"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "/static/cards/slytherin_2_2.png"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "/static/cards/slytherin_3_1.png"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "/static/cards/slytherin_3_2.png"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "/static/cards/slytherin_4_1.png"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "/static/cards/slytherin_4_2.png"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "/static/cards/slytherin_5_1.png"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "/static/cards/slytherin_5_2.png"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "/static/cards/slytherin_6_1.png"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "/static/cards/slytherin_6_2.png"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "/static/cards/slytherin_7_1.png"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "/static/cards/slytherin_7_2.png"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "/static/cards/slytherin_8_1.png"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "/static/cards/slytherin_8_2.png"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "/static/cards/slytherin_9_1.png"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "/static/cards/slytherin_9_2.png"},
    # Special Cards
    {"house": "slytherin", "name": "mirror", "value": 0, "src": "/static/cards/slytherin_mirror.png"},
    {"house": "slytherin", "name": "hallows", "value": 0, "src": "/static/cards/slytherin_hallows.png"},
    {"house": "slytherin", "name": "echo", "value": 0, "src": "/static/cards/slytherin_echo.png"},
    {"house": "slytherin", "name": "shield", "value": 0, "src": "/static/cards/slytherin_shield.png"},
    {"house": "slytherin", "name": "swap", "value": 0, "src": "/static/cards/slytherin_swap.png"},
]

all_cards = gryffindor_cards + hufflepuff_cards + ravenclaw_cards + slytherin_cards

bots = [
    {
        "name": "dobby", 
        "color_icon": "/static/icons/x_color_dobby.png",
        "base_icon": "/static/icons/x_bot_dobby.png"
    },
    {
        "name": "crookshanks", 
        "color_icon": "/static/icons/x_color_crookshanks.png",
        "base_icon": "/static/icons/x_bot_crookshanks.png"
    },
    {
        "name": "hedwig", 
        "color_icon": "/static/icons/x_color_hedwig.png",
        "base_icon": "/static/icons/x_bot_hedwig.png"
    },
    {
        "name": "scabbers", 
        "color_icon": "/static/icons/x_color_scabbers.png",
        "base_icon": "/static/icons/x_bot_scabbers.png"
    },
]

def get_personal_deck(number_of_cards):
    import random
    all_cards = gryffindor_cards + hufflepuff_cards + ravenclaw_cards + slytherin_cards
    newDeck = []
    for i in range(0, number_of_cards):
        newDeck.append(all_cards.pop(random.randint(0, len(all_cards) -1)))
    return newDeck

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/how-to-play')
def rules():
    return render_template('pages/how-to-play/page.html')


@app.route('/play/pve')
def play_pve():
    return render_template('pages/play/pve/page.html')


@app.route('/play/pve/1-bot')
def play_pve_1_bot():
    return render_template('pages/play/pve/1-bot/page.html')

@app.route('/play/pve/1-bot/game')
def play_pve_1_bot_game():
    player_cards = get_personal_deck(10)
    bot_1_cards = get_personal_deck(10)
    bot = bots[0]

    leftover_cards = []

    for card in all_cards:
        if card not in player_cards and card not in bot_1_cards:
            leftover_cards.append(card)

    return render_template('pages/play/pve/1-bot/game/page.html', player_cards = player_cards, bot = bot, bot_1_cards = bot_1_cards, leftover_cards = leftover_cards)


@app.route('/play/pve/2-bot')
def play_pve_2_bot():
    return render_template('pages/play/pve/2-bot/page.html')


@app.route('/play/pve/2-bot/game')
def play_pve_2_bot_game():
    return render_template('pages/play/pve/2-bot/game/page.html')


@app.route('/play/pve/3-bot')
def play_pve_3_bot():
    return render_template('pages/play/pve/3-bot/page.html')


@app.route('/play/pve/3-bot/game')
def play_pve_3_bot_game():
    return render_template('pages/play/pve/3-bot/game/page.html')


@app.route('/play/pvp')
def play_pvp():
    return render_template('pages/play/pvp/page.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)