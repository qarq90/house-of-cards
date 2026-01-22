from flask import Flask, render_template, request, jsonify, session
import json
from game_logic import HouseOfCardsGame
import uuid

app = Flask(__name__)
app.secret_key = 'house_of_cards_secret_key'

# Store active games
active_games = {}

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
    return render_template('pages/play/pve/1-bot/game/page.html')

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

# Game API Routes
@app.route('/api/game/start', methods=['POST'])
def start_game():
    """Start a new game with 1 bot."""
    data = request.json
    player_name = data.get('player_name', 'Player')
    
    # Create new game
    game = HouseOfCardsGame(player_name)
    game_state = game.initialize_game()
    
    # Store game
    game_id = game.game_id
    active_games[game_id] = game
    
    # Store game ID in session
    session['game_id'] = game_id
    
    return jsonify({
        'success': True,
        'game_id': game_id,
        'game_state': game_state
    })

@app.route('/api/game/state')
def get_game_state():
    """Get current game state."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = active_games[game_id]
    return jsonify({
        'success': True,
        'game_state': game.get_game_state()
    })

@app.route('/api/game/play', methods=['POST'])
def play_card():
    """Play a card for the human player."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    card_index = data.get('card_index')
    
    if card_index is None:
        return jsonify({'error': 'No card index provided'}), 400
    
    game = active_games[game_id]
    
    # Check if it's human player's turn
    current_player = game.players[game.current_player_index]
    if current_player.is_bot:
        return jsonify({'error': 'Not your turn'}), 400
    
    result = game.play_human_turn(card_index)
    
    # If game continues and next player is bot, play bot turn
    if result.get('success') and not game.game_over:
        if game.players[game.current_player_index].is_bot:
            bot_result = game.play_bot_turn()
    
    return jsonify(result)

@app.route('/api/game/bot-turn')
def play_bot_turn():
    """Force play bot turn (for testing)."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = active_games[game_id]
    result = game.play_bot_turn()
    return jsonify(result)

@app.route('/api/game/use-house-effect', methods=['POST'])
def use_house_effect():
    """Use house effect for current player."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    player_id = data.get('player_id', 0)
    
    game = active_games[game_id]
    result = game.use_house_effect(player_id)
    return jsonify(result)

@app.route('/api/game/reshuffle', methods=['POST'])
def reshuffle_deck():
    """Reshuffle a player's deck."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    player_id = data.get('player_id', 0)
    
    game = active_games[game_id]
    result = game.reshuffle_deck(player_id)
    return jsonify(result)

@app.route('/api/game/restart', methods=['POST'])
def restart_game():
    """Restart the current game."""
    game_id = session.get('game_id')
    if not game_id or game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = active_games[game_id]
    player_name = game.player_name
    new_game = HouseOfCardsGame(player_name)
    game_state = new_game.initialize_game()
    
    active_games[game_id] = new_game
    
    return jsonify({
        'success': True,
        'game_state': game_state
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)