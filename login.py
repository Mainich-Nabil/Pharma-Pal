from flask import Blueprint, render_template, request, jsonify
from app import db
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

loginn = Blueprint('login', __name__)

@loginn.route('/api/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        try:
            sql = text('SELECT * FROM users WHERE email = :email')
            content = db.session.execute(sql, {'email': email})
            user = content.fetchone()
        
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': f'Error: {e}', 'category': 'error'})
        
        if user is None:
            return jsonify({'message': 'This account doesn\'t exist', 'category': 'error'})
        
        elif user[2] != password:
            return jsonify({'message': 'Password incorrect', 'category': 'error'})
        
        else:
            return jsonify({'message': 'Login successful', 'category': 'success'})
