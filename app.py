from flask import Flask, render_template, request, jsonify, session, redirect
import json
import random
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = '170105245166'

gryffindor_cards = [
    # Numerical Cards
    {"house": "gryffindor", "name": "0", "value": 0, "src": "/static/cards/gryffindor_0_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "0", "value": 0, "src": "/static/cards/gryffindor_0_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "1", "value": 1, "src": "/static/cards/gryffindor_1_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "1", "value": 1, "src": "/static/cards/gryffindor_1_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "2", "value": 2, "src": "/static/cards/gryffindor_2_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "2", "value": 2, "src": "/static/cards/gryffindor_2_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "3", "value": 3, "src": "/static/cards/gryffindor_3_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "3", "value": 3, "src": "/static/cards/gryffindor_3_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "4", "value": 4, "src": "/static/cards/gryffindor_4_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "4", "value": 4, "src": "/static/cards/gryffindor_4_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "5", "value": 5, "src": "/static/cards/gryffindor_5_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "5", "value": 5, "src": "/static/cards/gryffindor_5_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "6", "value": 6, "src": "/static/cards/gryffindor_6_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "6", "value": 6, "src": "/static/cards/gryffindor_6_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "7", "value": 7, "src": "/static/cards/gryffindor_7_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "7", "value": 7, "src": "/static/cards/gryffindor_7_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "8", "value": 8, "src": "/static/cards/gryffindor_8_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "8", "value": 8, "src": "/static/cards/gryffindor_8_2.png", "type": "numerical"},
    {"house": "gryffindor", "name": "9", "value": 9, "src": "/static/cards/gryffindor_9_1.png", "type": "numerical"},
    {"house": "gryffindor", "name": "9", "value": 9, "src": "/static/cards/gryffindor_9_2.png", "type": "numerical"},
    # Special Cards
    {"house": "gryffindor", "name": "mirror", "value": 0, "src": "/static/cards/gryffindor_mirror.png", "type": "special"},
    {"house": "gryffindor", "name": "hallows", "value": 0, "src": "/static/cards/gryffindor_hallows.png", "type": "special"},
    {"house": "gryffindor", "name": "echo", "value": 0, "src": "/static/cards/gryffindor_echo.png", "type": "special"},
    {"house": "gryffindor", "name": "shield", "value": 0, "src": "/static/cards/gryffindor_shield.png", "type": "special"},
    {"house": "gryffindor", "name": "swap", "value": 0, "src": "/static/cards/gryffindor_swap.png", "type": "special"},
]

hufflepuff_cards = [
    # Numerical Cards
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "/static/cards/hufflepuff_0_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "0", "value": 0, "src": "/static/cards/hufflepuff_0_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "/static/cards/hufflepuff_1_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "1", "value": 1, "src": "/static/cards/hufflepuff_1_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "/static/cards/hufflepuff_2_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "2", "value": 2, "src": "/static/cards/hufflepuff_2_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "/static/cards/hufflepuff_3_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "3", "value": 3, "src": "/static/cards/hufflepuff_3_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "/static/cards/hufflepuff_4_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "4", "value": 4, "src": "/static/cards/hufflepuff_4_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "/static/cards/hufflepuff_5_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "5", "value": 5, "src": "/static/cards/hufflepuff_5_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "/static/cards/hufflepuff_6_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "6", "value": 6, "src": "/static/cards/hufflepuff_6_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "/static/cards/hufflepuff_7_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "7", "value": 7, "src": "/static/cards/hufflepuff_7_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "/static/cards/hufflepuff_8_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "8", "value": 8, "src": "/static/cards/hufflepuff_8_2.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "/static/cards/hufflepuff_9_1.png", "type": "numerical"},
    {"house": "hufflepuff", "name": "9", "value": 9, "src": "/static/cards/hufflepuff_9_2.png", "type": "numerical"},
    # Special Cards
    {"house": "hufflepuff", "name": "mirror", "value": 0, "src": "/static/cards/hufflepuff_mirror.png", "type": "special"},
    {"house": "hufflepuff", "name": "hallows", "value": 0, "src": "/static/cards/hufflepuff_hallows.png", "type": "special"},
    {"house": "hufflepuff", "name": "echo", "value": 0, "src": "/static/cards/hufflepuff_echo.png", "type": "special"},
    {"house": "hufflepuff", "name": "shield", "value": 0, "src": "/static/cards/hufflepuff_shield.png", "type": "special"},
    {"house": "hufflepuff", "name": "swap", "value": 0, "src": "/static/cards/hufflepuff_swap.png", "type": "special"},
]

ravenclaw_cards = [
    # Numerical Cards  
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "/static/cards/ravenclaw_0_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "0", "value": 0, "src": "/static/cards/ravenclaw_0_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "/static/cards/ravenclaw_1_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "1", "value": 1, "src": "/static/cards/ravenclaw_1_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "/static/cards/ravenclaw_2_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "2", "value": 2, "src": "/static/cards/ravenclaw_2_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "/static/cards/ravenclaw_3_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "3", "value": 3, "src": "/static/cards/ravenclaw_3_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "/static/cards/ravenclaw_4_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "4", "value": 4, "src": "/static/cards/ravenclaw_4_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "/static/cards/ravenclaw_5_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "5", "value": 5, "src": "/static/cards/ravenclaw_5_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "/static/cards/ravenclaw_6_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "6", "value": 6, "src": "/static/cards/ravenclaw_6_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "/static/cards/ravenclaw_7_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "7", "value": 7, "src": "/static/cards/ravenclaw_7_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "/static/cards/ravenclaw_8_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "8", "value": 8, "src": "/static/cards/ravenclaw_8_2.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "/static/cards/ravenclaw_9_1.png", "type": "numerical"},
    {"house": "ravenclaw", "name": "9", "value": 9, "src": "/static/cards/ravenclaw_9_2.png", "type": "numerical"},
    # Special Cards
    {"house": "ravenclaw", "name": "mirror", "value": 0, "src": "/static/cards/ravenclaw_mirror.png", "type": "special"},
    {"house": "ravenclaw", "name": "hallows", "value": 0, "src": "/static/cards/ravenclaw_hallows.png", "type": "special"},
    {"house": "ravenclaw", "name": "echo", "value": 0, "src": "/static/cards/ravenclaw_echo.png", "type": "special"},
    {"house": "ravenclaw", "name": "shield", "value": 0, "src": "/static/cards/ravenclaw_shield.png", "type": "special"},
    {"house": "ravenclaw", "name": "swap", "value": 0, "src": "/static/cards/ravenclaw_swap.png", "type": "special"},
]

slytherin_cards = [
    # Numerical Cards 
    {"house": "slytherin", "name": "0", "value": 0, "src": "/static/cards/slytherin_0_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "0", "value": 0, "src": "/static/cards/slytherin_0_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "/static/cards/slytherin_1_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "1", "value": 1, "src": "/static/cards/slytherin_1_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "/static/cards/slytherin_2_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "2", "value": 2, "src": "/static/cards/slytherin_2_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "/static/cards/slytherin_3_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "3", "value": 3, "src": "/static/cards/slytherin_3_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "/static/cards/slytherin_4_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "4", "value": 4, "src": "/static/cards/slytherin_4_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "/static/cards/slytherin_5_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "5", "value": 5, "src": "/static/cards/slytherin_5_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "/static/cards/slytherin_6_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "6", "value": 6, "src": "/static/cards/slytherin_6_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "/static/cards/slytherin_7_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "7", "value": 7, "src": "/static/cards/slytherin_7_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "/static/cards/slytherin_8_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "8", "value": 8, "src": "/static/cards/slytherin_8_2.png", "type": "numerical"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "/static/cards/slytherin_9_1.png", "type": "numerical"},
    {"house": "slytherin", "name": "9", "value": 9, "src": "/static/cards/slytherin_9_2.png", "type": "numerical"},
    # Special Cards
    {"house": "slytherin", "name": "mirror", "value": 0, "src": "/static/cards/slytherin_mirror.png", "type": "special"},
    {"house": "slytherin", "name": "hallows", "value": 0, "src": "/static/cards/slytherin_hallows.png", "type": "special"},
    {"house": "slytherin", "name": "echo", "value": 0, "src": "/static/cards/slytherin_echo.png", "type": "special"},
    {"house": "slytherin", "name": "shield", "value": 0, "src": "/static/cards/slytherin_shield.png", "type": "special"},
    {"house": "slytherin", "name": "swap", "value": 0, "src": "/static/cards/slytherin_swap.png", "type": "special"},
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
        "name": "trevor", 
        "color_icon": "/static/icons/x_color_trevor.png",
        "base_icon": "/static/icons/x_bot_trevor.png"
    },
    # {
    #     "name": "scabbers",
    #     "color_icon": "/static/icons/x_color_scabbers.png",
    #     "base_icon": "/static/icons/x_bot_scabbers.png"
    # }
]

def get_fresh_deck():
    fresh_deck = []

    for card in gryffindor_cards + hufflepuff_cards + ravenclaw_cards + slytherin_cards:
        new_card = card.copy()
        new_card["id"] = str(uuid.uuid4())
        fresh_deck.append(new_card)

    random.shuffle(fresh_deck)
    return fresh_deck


def deal_cards(num_players, cards_per_player):
    all_cards = get_fresh_deck()
    
    total_cards_needed = num_players * cards_per_player
    
    if total_cards_needed > len(all_cards):
        raise ValueError(f"Not enough cards. Need {total_cards_needed}, have {len(all_cards)}")
    
    player_decks = []
    for i in range(num_players):
        start_idx = i * cards_per_player
        end_idx = start_idx + cards_per_player
        player_decks.append(all_cards[start_idx:end_idx])
    
    leftover_deck = all_cards[total_cards_needed:]
    
    return player_decks, leftover_deck


@app.route('/')
def home():
    session.clear()
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


@app.route('/play/pve/1-bot/game', methods=['POST'])
def play_pve_1_bot_game():
    player_name = request.form.get('playerName')
    avatar_data = request.form.get('avatar')

    if avatar_data and avatar_data.startswith("data:image"):
        player_avatar = avatar_data
    else:
        player_avatar = "/static/icons/default_avatar.png"

    bot_name = "Hedwig"
    bot_image_src = "/static/icons/x_color_hedwig.png"

    player_decks, leftover_deck = deal_cards(
        num_players=2,
        cards_per_player=10
    )

    player_cards = player_decks[0]
    player_hand = player_cards[:2]
    player_deck = player_cards[2:]

    bot_cards = player_decks[1]
    bot_hand = bot_cards[:2]
    bot_deck = bot_cards[2:]

    print("===== GAME STARTED =====")
    print("Player:", player_name)
    print("Bot:", bot_name)
    print("Player Hand:", len(player_hand))
    print("Bot Hand:", len(bot_hand))
    print("Leftover Deck:", len(leftover_deck))
    print("========================")

    return render_template(
        'pages/play/pve/1-bot/game/page.html',

        player_name=player_name,
        player_avatar=player_avatar,
        player_cards=player_cards,
        player_hand=player_hand,
        player_deck=player_deck,

        bot_name=bot_name,
        bot_image=bot_image_src,
        bot_cards=bot_cards,
        bot_hand=bot_hand,
        bot_deck=bot_deck,

        leftover_deck=leftover_deck
    )


@app.route('/play/pve/2-bot')
def play_pve_2_bot():
    return render_template('pages/play/pve/2-bot/page.html')


@app.route('/play/pve/2-bot/game', methods=['POST'])
def play_pve_2_bot_game():
    player_name = request.form.get('playerName', '').strip()
    player_avatar = request.form.get('playerAvatar', '')
    
    if not player_name:
        player_name = "Player"
    
    if not player_avatar:
        player_avatar = "/static/icons/default_avatar.png"
    
    # Deal cards for 3 players total (Player + 2 bots)
    player_decks, leftover_deck = deal_cards(num_players=3, cards_per_player=10)
    
    # Player gets first deck
    player_cards = player_decks[0]
    player_hand = player_cards[:2]
    player_deck = player_cards[2:]
    
    # Bots get the remaining decks
    bots_data = {
        'hedwig': {
            'cards': player_decks[1],
            'hand': player_decks[1][:2],
            'deck': player_decks[1][2:]
        },
        'crookshanks': {
            'cards': player_decks[2],
            'hand': player_decks[2][:2],
            'deck': player_decks[2][2:]
        }
    }
    
    return render_template(
        'pages/play/pve/2-bot/game/page.html',
        player_name=player_name,
        player_avatar=player_avatar,
        player_cards=player_cards,
        player_hand=player_hand,
        player_deck=player_deck,
        bots_data=bots_data,
        leftover_deck=leftover_deck,
        target_limit=27
    )



@app.route('/play/pve/3-bot')
def play_pve_3_bot():
    return render_template('pages/play/pve/3-bot/page.html')


@app.route('/play/pve/3-bot/game', methods=['POST'])
def play_pve_3_bot_game():
    player_name = request.form.get('playerName', '').strip()
    player_avatar = request.form.get('playerAvatar', '')
    
    if not player_name:
        player_name = "Player"
    
    if not player_avatar:
        player_avatar = "/static/icons/default_avatar.png"
    
    # Deal cards for 4 players total (Player + 3 bots)
    player_decks, leftover_deck = deal_cards(num_players=4, cards_per_player=10)
    
    # Player gets first deck
    player_cards = player_decks[0]
    player_hand = player_cards[:2]
    player_deck = player_cards[2:]
    
    # Bots get the remaining decks
    bots_data = {
        'hedwig': {
            'cards': player_decks[1],
            'hand': player_decks[1][:2],
            'deck': player_decks[1][2:]
        },
        'crookshanks': {
            'cards': player_decks[2],
            'hand': player_decks[2][:2],
            'deck': player_decks[2][2:]
        },
        'dobby': {
            'cards': player_decks[3],
            'hand': player_decks[3][:2],
            'deck': player_decks[3][2:]
        }
    }
    
    return render_template(
        'pages/play/pve/3-bot/game/page.html',
        player_name=player_name,
        player_avatar=player_avatar,
        player_cards=player_cards,
        player_hand=player_hand,
        player_deck=player_deck,
        bots_data=bots_data,
        leftover_deck=leftover_deck,
        target_limit=27
    )



@app.route('/play/pvp')
def play_pvp():
    return render_template('pages/play/pvp/page.html')


@app.route('/simulate/configure')
def play_simulate_configure():
    return render_template('pages/simulate/configure/page.html')


@app.route("/simulate/simulation", methods=["POST"])
def simulate_game():
    selected_bot_count = request.form.get("botCount")
    selected_bots_json = request.form.get("selectedBots", "[]")
    limit = request.form.get("targetLimit")
    speed = request.form.get("simulationSpeed")
    
    try:
        selected_bot_count = int(selected_bot_count) if selected_bot_count else 0
    except ValueError:
        selected_bot_count = 0
    
    try:
        import json
        selected_bots = json.loads(selected_bots_json)
    except json.JSONDecodeError:
        selected_bots = []
    
    try:
        limit = int(limit) if limit else 37
    except ValueError:
        limit = 37
    
    try:
        speed = int(speed) if speed else 100
    except ValueError:
        speed = 100

    if len(selected_bots) != selected_bot_count:
        return redirect("/simulate")

    cards_per_player = 10
    player_decks, leftover_deck = deal_cards(
        num_players=selected_bot_count,
        cards_per_player=cards_per_player
    )

    bots_data = {}
    for i, bot_name in enumerate(selected_bots):
        bot_info = next((b for b in bots if b["name"] == bot_name), None)
        bots_data[bot_name] = {
            "name": bot_name.capitalize(),
            "image_src": bot_info["color_icon"],
            "cards": player_decks[i]
        }

    return render_template(
        "pages/simulate/simulation/page.html",
        bots=bots_data,
        leftover_deck=leftover_deck,
        target_limit=limit, 
        simulation_speed=speed
    )


@app.route('/testing')
def testing():
    player_decks, leftover_deck = deal_cards(num_players=4, cards_per_player=10)
    
    all_dealt_cards = []
    for deck in player_decks:
        all_dealt_cards.extend(deck)
    
    card_srcs = [card['src'] for card in all_dealt_cards]
    if len(card_srcs) != len(set(card_srcs)):
        print("WARNING: Duplicate cards found!")
    
    print(f"Total cards in game: {len(get_fresh_deck())}")
    print(f"Cards dealt to bots: {len(all_dealt_cards)}")
    print(f"Leftover deck size: {len(leftover_deck)}")
    print(f"Sum: {len(all_dealt_cards) + len(leftover_deck)}")
    
    bots = {
        'dobby': {
            'name': "Dobby",
            'image_src': "/static/icons/x_color_dobby.png",
            'cards': player_decks[0],
            'personal_deck': player_decks[0][2:], 
            'hand': player_decks[0][:2]
        },
        'trevor': {
            'name': "Trevor",
            'image_src': "/static/icons/x_color_trevor.png",
            'cards': player_decks[1],
            'personal_deck': player_decks[1][2:],
            'hand': player_decks[1][:2]
        },
        'hedwig': {
            'name': "Hedwig",
            'image_src': "/static/icons/x_color_hedwig.png",
            'cards': player_decks[2],
            'personal_deck': player_decks[2][2:],
            'hand': player_decks[2][:2]
        },
        'crookshanks': {
            'name': "Crookshanks",
            'image_src': "/static/icons/x_color_crookshanks.png",
            'cards': player_decks[3],
            'personal_deck': player_decks[3][2:],
            'hand': player_decks[3][:2]
        },
        'leftover_deck': leftover_deck
    }
    
    return render_template('pages/testing/page.html', bots=bots, leftover_deck=leftover_deck)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)