from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

signin = Blueprint('signin', __name__)
CORS(signin)

@signin.route('/api/sign-up', methods=['POST'])
def sign_in():
    try:
        data = request.get_json()
        print("Received data:", data)  # Log received data
        
        if not data:
            return jsonify({"message": "No data received", "category": "error"})
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        number = data.get('number')
        
        if not all([username, email, password, number]):
            return jsonify({"message": "Missing required fields", "category": "error"})

        if "." not in email or "@" not in email:
            return jsonify({"message": "Email must contain both '.' and '@'.", "category": "error"})
        
        if email.rfind(".") <= email.rfind("@"):
            return jsonify({"message": "@ needs to be before . in the email address.", "category": "error"})
        
        if len(password) < 8:
            return jsonify({"message": "Password needs to be at least 8 characters.", "category": "error"})

        sql = text("INSERT INTO users (name, email, password, phone) VALUES (:name, :email, :password, :number)")
        db.session.execute(sql, {'name': username, 'email': email, 'password': password, 'number': number})
        db.session.commit()
        return jsonify({"message": "Sign up successful!", "category": "success"})
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print("Database error:", str(e))  
        return jsonify({"message": f"Database error: {str(e)}", "category": "error"})
    except Exception as e:
        print("Unexpected error:", str(e))  # Log unexpected errors
        return jsonify({"message": f"An unexpected error occurred: {str(e)}", "category": "error"})
    finally:
        db.session.close()