from enum import Enum
from typing import List, Optional, Dict, Any, Tuple
from dataclasses import dataclass
import random
import json

class House(Enum):
    """The four houses in the game."""
    gryffindor = "gryffindor"
    RAVEN = "ravenclaw"  # Note: Your card list uses "ravenclaw"
    HUFFLEPUFF = "hufflepuff"
    SLYTHERIN = "slytherin"

class CardType(Enum):
    """Types of cards in the game."""
    NUMERICAL = "numerical"
    HALLOWS = "hallows"
    SHIELD = "shield"
    ECHO = "echo"
    MIRROR = "mirror"
    SWAP = "swap"

@dataclass
class Card:
    """Represents a single card in the game."""
    house: House
    name: str
    value: int
    src: str
    card_type: CardType = None
    card_id: str = ""
    
    def __post_init__(self):
        if self.card_type is None:
            if self.name.isdigit():
                self.card_type = CardType.NUMERICAL
                self.value = int(self.name)
            else:
                try:
                    self.card_type = CardType(self.name.lower())
                    self.value = 0
                except ValueError:
                    raise ValueError(f"Unknown card name: {self.name}")
        if not self.card_id:
            self.card_id = f"{self.house.value}_{self.name}_{random.randint(1000,9999)}"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert card to dictionary for JSON serialization."""
        return {
            "house": self.house.value,
            "name": self.name,
            "value": self.value,
            "src": self.src,
            "type": self.card_type.value,
            "card_id": self.card_id,
            "display_name": f"{self.house.value.capitalize()} {self.name.capitalize() if self.name != 'swap' else 'Swap'}"
        }

class Player:
    """Represents a player in the game."""
    def __init__(self, name: str, player_id: int, is_bot: bool = False):
        self.name = name
        self.player_id = player_id
        self.is_bot = is_bot
        self.personal_deck: List[Card] = []
        self.hand: List[Card] = []
        self.discard_pile: List[Card] = []
        self.house_tracker: List[House] = []
        self.is_active = True
        
    def draw_from_personal_deck(self) -> Optional[Card]:
        """Draw the top card from personal deck into hand."""
        if self.personal_deck:
            card = self.personal_deck.pop(0)
            self.hand.append(card)
            return card
        return None
    
    def play_card(self, card_index: int) -> Optional[Card]:
        """Play a card from hand by index."""
        if 0 <= card_index < len(self.hand):
            card = self.hand.pop(card_index)
            self.discard_pile.append(card)
            # Track house for consecutive plays
            self.house_tracker.append(card.house)
            if len(self.house_tracker) > 3:
                self.house_tracker.pop(0)
            return card
        return None
    
    def has_three_consecutive_houses(self) -> bool:
        """Check if player has played the same house 3 consecutive times."""
        if len(self.house_tracker) < 3:
            return False
        return all(h == self.house_tracker[-1] for h in self.house_tracker[-3:])
    
    def use_house_effect(self, leftover_deck: List[Card]) -> Optional[Card]:
        """Use house effect to discard a card back to leftover deck."""
        if self.has_three_consecutive_houses() and len(self.hand) >= 2:
            # Bot logic: discard highest value card
            if self.is_bot:
                card_to_discard = max(self.hand, key=lambda c: c.value)
                self.hand.remove(card_to_discard)
            else:
                # For human, we'll discard first card (frontend will handle choice)
                card_to_discard = self.hand.pop(0)
            
            leftover_deck.append(card_to_discard)
            self.house_tracker.clear()
            return card_to_discard
        return None
    
    def reshuffle_personal_deck(self):
        """Reshuffle personal deck with discard pile."""
        self.personal_deck.extend(self.discard_pile)
        random.shuffle(self.personal_deck)
        self.discard_pile = []
        # Redraw 2 cards from reshuffled deck
        for _ in range(2):
            self.draw_from_personal_deck()
    
    def has_won(self) -> bool:
        """Check if player has won (no cards in personal deck or hand)."""
        return len(self.personal_deck) == 0 and len(self.hand) == 0
    
    def get_state_dict(self) -> Dict[str, Any]:
        """Get player state as dictionary."""
        return {
            "name": self.name,
            "id": self.player_id,
            "is_bot": self.is_bot,
            "cards_in_deck": len(self.personal_deck),
            "cards_in_hand": len(self.hand),
            "hand": [card.to_dict() for card in self.hand],
            "can_use_house_effect": self.has_three_consecutive_houses() and len(self.hand) >= 2
        }

class HouseOfCardsGame:
    """Main game controller for House of Cards."""
    
    def __init__(self, player_name: str = "Player"):
        self.player_name = player_name
        self.players: List[Player] = []
        self.leftover_deck: List[Card] = []
        self.round_discard_pile: List[Card] = []
        self.current_sum = 0
        self.limit = 0
        self.current_player_index = 0
        self.game_over = False
        self.winner: Optional[Player] = None
        self.round_count = 0
        self.echo_active = False
        self.echo_target: Optional[str] = None
        self.last_played_number: Optional[int] = None
        self.shield_active = False
        self.game_id = f"game_{random.randint(10000, 99999)}"
        
    def initialize_game(self):
        """Initialize a new game with 1 bot."""
        # Create players (1 human, 1 bot)
        human_player = Player(self.player_name, 0, is_bot=False)
        bot_player = Player("Bot", 1, is_bot=True)
        self.players = [human_player, bot_player]
        
        # Set game parameters for 2 players
        self.limit = 15
        starting_cards_per_player = 15
        
        # Load and distribute cards
        all_cards = self._load_all_cards()
        random.shuffle(all_cards)
        
        # Distribute cards to players
        for i, player in enumerate(self.players):
            start_idx = i * starting_cards_per_player
            end_idx = start_idx + starting_cards_per_player
            player.personal_deck = all_cards[start_idx:end_idx]
            # Draw initial 2 cards
            for _ in range(2):
                player.draw_from_personal_deck()
        
        # Remaining cards become leftover deck
        leftover_start = len(self.players) * starting_cards_per_player
        self.leftover_deck = all_cards[leftover_start:]
        
        # Start first round
        self.start_new_round()
        
        return self.get_game_state()
    
    def _load_all_cards(self) -> List[Card]:
        """Load all 100 cards from the card lists."""
        # Import card data from your existing lists
        from card_lists import gryffindor_cards, hufflepuff_cards, ravenclaw_cards, slytherin_cards
        
        house_map = {
            "gryffindor": House.gryffindor,
            "hufflepuff": House.HUFFLEPUFF,
            "ravenclaw": House.RAVEN,
            "slytherin": House.SLYTHERIN
        }
        
        all_cards = []
        all_cards_dicts = gryffindor_cards + hufflepuff_cards + ravenclaw_cards + slytherin_cards
        
        for card_dict in all_cards_dicts:
            house = house_map[card_dict["house"]]
            name = card_dict["name"]
            value = card_dict["value"]
            src = card_dict["src"]
            
            # Create Card object
            card = Card(house=house, name=name, value=value, src=src)
            all_cards.append(card)
        
        if len(all_cards) != 100:
            raise ValueError(f"Expected 100 cards, got {len(all_cards)}")
        
        return all_cards
    
    def start_new_round(self):
        """Start a new round."""
        # Move round discard pile to bottom of leftover deck
        self.leftover_deck.extend(self.round_discard_pile)
        self.round_discard_pile = []
        
        # Reset round-specific state
        self.current_sum = 0
        self.echo_active = False
        self.echo_target = None
        self.last_played_number = None
        self.shield_active = False
        
        # Reset house trackers for all players
        for player in self.players:
            player.house_tracker = []
        
        # Draw starting card from leftover deck
        if self.leftover_deck:
            starting_card = self.leftover_deck.pop(0)
            self.round_discard_pile.append(starting_card)
            self.current_sum = self._get_card_value(starting_card)
            # Apply starting card effects
            self._apply_card_effect(starting_card, None)
        
        self.round_count += 1
    
    def _get_card_value(self, card: Card) -> int:
        """Get the effective numerical value of a card."""
        if card.card_type == CardType.NUMERICAL:
            if self.echo_active and self.echo_target == card.card_id:
                return card.value * 2
            return card.value
        elif card.card_type == CardType.MIRROR and self.last_played_number is not None:
            if not self.shield_active:
                return self.last_played_number
        return 0
    
    def _apply_card_effect(self, card: Card, player: Optional[Player]):
        """Apply special card effects."""
        if card.card_type == CardType.HALLOWS:
            # Instantly hit the limit
            self.current_sum = self.limit
        elif card.card_type == CardType.ECHO:
            if not self.shield_active:
                self.echo_active = True
        elif card.card_type == CardType.SHIELD:
            self.shield_active = True
        elif card.card_type == CardType.MIRROR and self.last_played_number is not None:
            if not self.shield_active:
                self.current_sum += self.last_played_number
        elif card.card_type == CardType.SWAP and player:
            # Swap one hand card with top card of personal deck
            if player.hand and player.personal_deck:
                # For bot: swap lowest value card
                if player.is_bot:
                    hand_card = min(player.hand, key=lambda c: c.value)
                    player.hand.remove(hand_card)
                else:
                    # For human, frontend will handle choice
                    hand_card = player.hand.pop(0)
                
                deck_card = player.personal_deck.pop(0)
                player.hand.append(deck_card)
                player.personal_deck.append(hand_card)
        
        # Update last played number for Mirror effect
        if card.card_type == CardType.NUMERICAL:
            self.last_played_number = card.value
            if self.echo_active:
                self.echo_target = card.card_id
                self.echo_active = False
        
        # Reset shield after it's used
        if card.card_type in [CardType.ECHO, CardType.MIRROR]:
            self.shield_active = False
    
    def play_human_turn(self, card_index: int) -> Dict[str, Any]:
        """Play a turn for the human player."""
        if self.game_over:
            return {"error": "Game is already over"}
        
        current_player = self.players[self.current_player_index]
        if current_player.is_bot:
            return {"error": "Not human player's turn"}
        
        # Play the selected card
        played_card = current_player.play_card(card_index)
        if not played_card:
            return {"error": "Invalid card selection"}
        
        # Apply card effect and update sum
        card_value = self._get_card_value(played_card)
        self.current_sum += card_value
        self._apply_card_effect(played_card, current_player)
        
        # Draw new card from personal deck
        current_player.draw_from_personal_deck()
        
        # Check for house effect
        house_effect_used = False
        if current_player.has_three_consecutive_houses() and len(current_player.hand) >= 2:
            # Player can choose to use house effect (frontend will prompt)
            pass
        
        # Check sum condition
        result = self._check_sum_condition(played_card, current_player)
        
        # Move to next player if game continues
        if result["status"] == "continue":
            self.current_player_index = (self.current_player_index + 1) % len(self.players)
        
        return {
            "success": True,
            "played_card": played_card.to_dict(),
            "current_sum": self.current_sum,
            "result": result,
            "house_effect_available": current_player.has_three_consecutive_houses() and len(current_player.hand) >= 2,
            "game_state": self.get_game_state()
        }
    
    def play_bot_turn(self) -> Dict[str, Any]:
        """Play a turn for the bot player."""
        if self.game_over:
            return {"error": "Game is already over"}
        
        current_player = self.players[self.current_player_index]
        if not current_player.is_bot:
            return {"error": "Not bot player's turn"}
        
        # Bot AI: Choose best card to play
        card_index = self._choose_bot_card(current_player)
        played_card = current_player.play_card(card_index)
        
        if not played_card:
            return {"error": "Bot has no cards to play"}
        
        # Apply card effect and update sum
        card_value = self._get_card_value(played_card)
        self.current_sum += card_value
        self._apply_card_effect(played_card, current_player)
        
        # Draw new card from personal deck
        current_player.draw_from_personal_deck()
        
        # Check for house effect (bot always uses it if available)
        house_effect_used = False
        if current_player.has_three_consecutive_houses() and len(current_player.hand) >= 2:
            current_player.use_house_effect(self.leftover_deck)
            house_effect_used = True
        
        # Check sum condition
        result = self._check_sum_condition(played_card, current_player)
        
        # Move to next player if game continues
        if result["status"] == "continue":
            self.current_player_index = (self.current_player_index + 1) % len(self.players)
        
        return {
            "success": True,
            "played_card": played_card.to_dict(),
            "current_sum": self.current_sum,
            "result": result,
            "house_effect_used": house_effect_used,
            "game_state": self.get_game_state()
        }
    
    def _choose_bot_card(self, bot_player: Player) -> int:
        """Simple bot AI to choose a card to play."""
        hand = bot_player.hand
        
        # Try to exactly hit the limit
        for i, card in enumerate(hand):
            potential_sum = self.current_sum + self._get_card_value(card)
            if potential_sum == self.limit:
                return i
        
        # Avoid exceeding the limit
        safe_cards = []
        for i, card in enumerate(hand):
            potential_sum = self.current_sum + self._get_card_value(card)
            if potential_sum < self.limit:
                safe_cards.append((i, card))
        
        if safe_cards:
            # Choose the highest value safe card
            safe_cards.sort(key=lambda x: self._get_card_value(x[1]), reverse=True)
            return safe_cards[0][0]
        
        # If all cards exceed, choose the smallest one
        return min(range(len(hand)), key=lambda i: self._get_card_value(hand[i]))
    
    def _check_sum_condition(self, played_card: Card, player: Player) -> Dict[str, Any]:
        """Check the sum condition and handle round end."""
        if self.current_sum < self.limit:
            return {"status": "continue"}
        
        elif self.current_sum == self.limit:
            # Player exactly hit the limit
            # Other players draw 2 cards each
            for other_player in self.players:
                if other_player != player:
                    for _ in range(2):
                        if self.leftover_deck:
                            card = self.leftover_deck.pop(0)
                            other_player.personal_deck.append(card)
            
            # Current player can reshuffle (choice made by frontend for human)
            can_reshuffle = True
            
            self.start_new_round()
            return {
                "status": "exact_hit",
                "can_reshuffle": can_reshuffle,
                "message": f"{player.name} exactly hit the limit! Others draw 2 cards."
            }
        
        else:  # current_sum > limit
            # Player exceeded the limit
            # Player draws cards equal to the value they played
            draw_count = self._get_card_value(played_card)
            for _ in range(draw_count):
                if self.leftover_deck:
                    card = self.leftover_deck.pop(0)
                    player.personal_deck.append(card)
            
            # Player can reshuffle
            can_reshuffle = True
            
            self.start_new_round()
            return {
                "status": "exceed",
                "draw_count": draw_count,
                "can_reshuffle": can_reshuffle,
                "message": f"{player.name} exceeded the limit! Draws {draw_count} cards."
            }
    
    def use_house_effect(self, player_id: int) -> Dict[str, Any]:
        """Allow a player to use their house effect."""
        player = self.players[player_id]
        if player.has_three_consecutive_houses() and len(player.hand) >= 2:
            discarded_card = player.use_house_effect(self.leftover_deck)
            if discarded_card:
                return {
                    "success": True,
                    "discarded_card": discarded_card.to_dict(),
                    "message": f"{player.name} used house effect to discard a card."
                }
        return {"success": False, "message": "Cannot use house effect"}
    
    def reshuffle_deck(self, player_id: int) -> Dict[str, Any]:
        """Allow a player to reshuffle their personal deck."""
        player = self.players[player_id]
        player.reshuffle_personal_deck()
        return {
            "success": True,
            "message": f"{player.name} reshuffled their deck."
        }
    
    def check_win_condition(self) -> bool:
        """Check if any player has won."""
        for player in self.players:
            if player.has_won():
                self.winner = player
                self.game_over = True
                return True
        return False
    
    def get_game_state(self) -> Dict[str, Any]:
        """Get complete game state for frontend."""
        self.check_win_condition()
        
        current_player = self.players[self.current_player_index]
        
        return {
            "game_id": self.game_id,
            "current_sum": self.current_sum,
            "limit": self.limit,
            "current_player": self.current_player_index,
            "current_player_name": current_player.name,
            "current_player_is_bot": current_player.is_bot,
            "round_count": self.round_count,
            "game_over": self.game_over,
            "winner": self.winner.name if self.winner else None,
            "echo_active": self.echo_active,
            "shield_active": self.shield_active,
            "last_played_number": self.last_played_number,
            "cards_in_leftover": len(self.leftover_deck),
            "cards_in_discard": len(self.round_discard_pile),
            "players": [player.get_state_dict() for player in self.players],
            "top_discard": self.round_discard_pile[-1].to_dict() if self.round_discard_pile else None
        }