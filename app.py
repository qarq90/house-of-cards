from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/rules')
def rules():
    return render_template('pages/rules/page.html')

@app.route('/play/pve')
def play_pve():
    return render_template('pages/play/pve/page.html')

@app.route('/play/pvp')
def play_pvp():
    return render_template('pages/play/pvp/page.html')

if __name__ == '__main__':
    app.run(debug=True)