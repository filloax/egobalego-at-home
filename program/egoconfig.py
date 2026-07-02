"""App constants and configuration"""

import os

class Mode:
    """Protocol the server speaks to the mod"""
    NEW = "new"
    LEGACY = "legacy"

class ApiType:
    """Item type identifiers used in the new Apibalego API"""
    TOAST = "apibalego:toast"
    COMMAND = "apibalego:command"
    STRUCTURE = "apibalego:structure"
    DATAPACK = "apibalego:datapack"

class AppData:
    """Application data storage"""
    translations = {}
    lang = "unset"
    mode = Mode.NEW
    server_data = []
    last_id = 0
    color_theme = "unset"
    local_version = "0"
    github_version = "0"
    update_available = False
    websocket_connected = False

class Consts:
    """Application constants"""
    DEFAULT_PORT = 5000
    DEFAULT_LANG = "en_us"
    FOLDER_PROGRAM = os.path.dirname(__file__)
    FOLDER_TRANSLATIONS = os.path.join(FOLDER_PROGRAM, "translations")
    FOLDER_DATA = os.path.abspath(os.path.join(FOLDER_PROGRAM, os.pardir, "data"))
    FILE_APP_VERSION = os.path.join(FOLDER_DATA, "app_version")
    FILE_SERVER_DATA = os.path.join(FOLDER_DATA, "server_data.json")
    FILE_LAST_ID = os.path.join(FOLDER_DATA, "last_id.txt")
    FILE_SERVER_DATA_NEW = os.path.join(FOLDER_DATA, "server_data_new.json")
    FILE_LAST_ID_NEW = os.path.join(FOLDER_DATA, "last_id_new.txt")
    FILE_COLOR_THEME = os.path.join(FOLDER_DATA, "color_theme")
    UPDATE_CHECK_URL = "https://raw.githubusercontent.com/costantin0/egobalego-at-home/refs/heads/main/data/app_version"
    THEME_LIGHT = "light"
    THEME_DARK = "dark"
    COLOR_INFO = '\033[96m'
    COLOR_WARNING = '\033[93m'
    COLOR_ERROR = '\033[91m'
    COLOR_ENDC = '\033[0m'

class Templates:
    """Page names used across the application"""
    HOME = "home"
    COMMANDS = "commands"
    TRADES = "trades"
    COMMUNICATIONS = "communications"
    QUEST_STEPS = "quest-steps"
    STRUCTURES = "structures"
    DATAPACKS = "datapacks"
    WEBSOCKET = "websocket"

class Routes:
    """API endpoints for the Flask application"""
    DATA_RECEIVER = "/data_receiver"
    SERVER_DATA = "/server_data"
    SERVER_DATA_RAW = "/server_data/raw"
    LAST_ID = "/last_id"
    SWITCH_THEME = "/switch_theme"

class SocketEvents:
    """WebSocket event names for SocketIO"""
    MOD_CONNECT = "mod_connect"
    MOD_DISCONNECT = "mod_disconnect"
    IS_MOD_CONNECTED = "is_mod_connected"
    RELOAD = "reload"
    RESEARCHER_DIALOGUE = "rdialogue"
    TOAST = "toast"
    COMMAND = "cmd"
    MOD_RESPONSE = "mod_response"
